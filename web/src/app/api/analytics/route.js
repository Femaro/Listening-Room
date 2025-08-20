import { auth } from "@/auth";
import sql from "@/app/api/utils/sql";

export async function GET(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    const userProfile = await sql`
      SELECT user_type FROM user_profiles WHERE user_id = ${session.user.id}
    `;

    if (userProfile.length === 0 || userProfile[0].user_type !== 'admin') {
      return Response.json({ error: "Admin access required" }, { status: 403 });
    }

    const url = new URL(request.url);
    const period = url.searchParams.get('period') || '30'; // days
    const type = url.searchParams.get('type') || 'overview';

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(period));

    if (type === 'overview') {
      // Get overview statistics
      const [
        totalSessions,
        completedSessions,
        totalUsers,
        activeVolunteers,
        waitingSessions,
        totalDonations
      ] = await sql.transaction([
        sql`SELECT COUNT(*) as count FROM chat_sessions WHERE started_at >= ${startDate.toISOString()}`,
        sql`SELECT COUNT(*) as count FROM chat_sessions WHERE status = 'ended' AND started_at >= ${startDate.toISOString()}`,
        sql`SELECT COUNT(*) as count FROM auth_users WHERE id IN (
          SELECT user_id FROM user_profiles WHERE created_at >= ${startDate.toISOString()}
        )`,
        sql`SELECT COUNT(DISTINCT volunteer_id) as count FROM chat_sessions WHERE status = 'active'`,
        sql`SELECT COUNT(*) as count FROM chat_sessions WHERE status = 'waiting'`,
        sql`SELECT COALESCE(SUM(amount), 0) as total, COUNT(*) as count FROM donations WHERE status = 'completed' AND completed_at >= ${startDate.toISOString()}`
      ]);

      // Get daily session counts for chart
      const dailyStats = await sql`
        SELECT 
          DATE(started_at) as date,
          COUNT(*) as sessions,
          COUNT(CASE WHEN status = 'ended' THEN 1 END) as completed,
          COUNT(CASE WHEN session_type = 'group' THEN 1 END) as group_sessions
        FROM chat_sessions 
        WHERE started_at >= ${startDate.toISOString()}
        GROUP BY DATE(started_at)
        ORDER BY date DESC
      `;

      // Get session duration stats
      const durationStats = await sql`
        SELECT 
          AVG(EXTRACT(EPOCH FROM (ended_at - started_at))/60) as avg_duration_minutes,
          MIN(EXTRACT(EPOCH FROM (ended_at - started_at))/60) as min_duration_minutes,
          MAX(EXTRACT(EPOCH FROM (ended_at - started_at))/60) as max_duration_minutes
        FROM chat_sessions 
        WHERE status = 'ended' AND started_at >= ${startDate.toISOString()}
      `;

      // Get language preferences
      const languageStats = await sql`
        SELECT 
          language,
          COUNT(*) as count
        FROM chat_sessions 
        WHERE started_at >= ${startDate.toISOString()}
        GROUP BY language
        ORDER BY count DESC
      `;

      // Get user type distribution
      const userTypeStats = await sql`
        SELECT 
          user_type,
          COUNT(*) as count
        FROM user_profiles
        WHERE created_at >= ${startDate.toISOString()}
        GROUP BY user_type
      `;

      return Response.json({
        overview: {
          total_sessions: parseInt(totalSessions[0].count),
          completed_sessions: parseInt(completedSessions[0].count),
          new_users: parseInt(totalUsers[0].count),
          active_volunteers: parseInt(activeVolunteers[0].count),
          waiting_sessions: parseInt(waitingSessions[0].count),
          total_donations: parseInt(totalDonations[0].total),
          donation_count: parseInt(totalDonations[0].count),
          completion_rate: completedSessions[0].count > 0 ? 
            ((completedSessions[0].count / totalSessions[0].count) * 100).toFixed(1) : 0,
          avg_duration_minutes: durationStats[0]?.avg_duration_minutes ? 
            parseFloat(durationStats[0].avg_duration_minutes).toFixed(1) : 0
        },
        daily_stats: dailyStats,
        duration_stats: durationStats[0],
        language_stats: languageStats,
        user_type_stats: userTypeStats
      });
    } else if (type === 'sessions') {
      // Get detailed session analytics
      const sessions = await sql`
        SELECT 
          cs.*,
          seeker.username as seeker_username,
          volunteer.username as volunteer_username,
          COUNT(sp.user_id) as participant_count
        FROM chat_sessions cs
        LEFT JOIN user_profiles seeker ON cs.seeker_id = seeker.user_id
        LEFT JOIN user_profiles volunteer ON cs.volunteer_id = volunteer.user_id
        LEFT JOIN session_participants sp ON cs.id = sp.session_id AND sp.is_active = true
        WHERE cs.started_at >= ${startDate.toISOString()}
        GROUP BY cs.id, seeker.username, volunteer.username
        ORDER BY cs.started_at DESC
        LIMIT 100
      `;

      return Response.json({ sessions });
    } else if (type === 'feedback') {
      // Get feedback analytics
      const feedbackStats = await sql`
        SELECT 
          AVG(rating) as avg_rating,
          COUNT(*) as total_feedback,
          COUNT(CASE WHEN was_helpful = true THEN 1 END) as helpful_count,
          COUNT(CASE WHEN rating = 5 THEN 1 END) as five_star_count,
          COUNT(CASE WHEN rating = 1 THEN 1 END) as one_star_count
        FROM session_feedback sf
        JOIN chat_sessions cs ON sf.session_id = cs.id
        WHERE cs.started_at >= ${startDate.toISOString()}
      `;

      const recentFeedback = await sql`
        SELECT 
          sf.*,
          cs.started_at as session_date,
          seeker.username as seeker_username
        FROM session_feedback sf
        JOIN chat_sessions cs ON sf.session_id = cs.id
        JOIN user_profiles seeker ON sf.seeker_id = seeker.user_id
        WHERE cs.started_at >= ${startDate.toISOString()}
        ORDER BY sf.created_at DESC
        LIMIT 50
      `;

      return Response.json({
        stats: feedbackStats[0],
        recent_feedback: recentFeedback
      });
    }

    return Response.json({ error: "Invalid analytics type" }, { status: 400 });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    // This endpoint is for updating daily analytics (can be called by a cron job)
    const body = await request.json();
    const { date = new Date().toISOString().split('T')[0] } = body;

    // Calculate stats for the given date
    const [sessionStats, userStats] = await sql.transaction([
      sql`
        SELECT 
          COUNT(*) as total_sessions,
          COUNT(CASE WHEN status = 'ended' THEN 1 END) as completed_sessions,
          AVG(CASE WHEN status = 'ended' AND ended_at IS NOT NULL 
            THEN EXTRACT(EPOCH FROM (ended_at - started_at)) 
            END) as avg_duration_seconds
        FROM chat_sessions 
        WHERE DATE(started_at) = ${date}
      `,
      sql`
        SELECT COUNT(*) as new_users
        FROM auth_users au
        JOIN user_profiles up ON au.id = up.user_id
        WHERE DATE(up.created_at) = ${date}
      `
    ]);

    const avgDurationInterval = sessionStats[0].avg_duration_seconds ? 
      `${Math.round(sessionStats[0].avg_duration_seconds)} seconds` : null;

    // Upsert daily analytics
    await sql`
      INSERT INTO daily_analytics (
        date, 
        total_sessions, 
        completed_sessions, 
        new_users,
        average_session_duration
      )
      VALUES (
        ${date}, 
        ${sessionStats[0].total_sessions}, 
        ${sessionStats[0].completed_sessions}, 
        ${userStats[0].new_users},
        ${avgDurationInterval}
      )
      ON CONFLICT (date) 
      DO UPDATE SET 
        total_sessions = EXCLUDED.total_sessions,
        completed_sessions = EXCLUDED.completed_sessions,
        new_users = EXCLUDED.new_users,
        average_session_duration = EXCLUDED.average_session_duration
    `;

    return Response.json({ success: true, date });
  } catch (error) {
    console.error('Error updating analytics:', error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}