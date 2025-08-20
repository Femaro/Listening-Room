import { auth } from "@/auth";
import sql from "@/app/api/utils/sql";

export async function GET(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is a volunteer
    const userProfile = await sql`
      SELECT user_type FROM user_profiles WHERE user_id = ${session.user.id}
    `;

    if (userProfile.length === 0 || userProfile[0].user_type !== "volunteer") {
      return Response.json(
        { error: "Only volunteers can access stats" },
        { status: 403 },
      );
    }

    // Get volunteer earnings and session statistics
    const earningsStats = await sql`
      SELECT 
        COUNT(ve.session_id) as total_sessions,
        COALESCE(SUM(ve.points_earned), 0) as total_points,
        COALESCE(SUM(ve.amount_earned), 0) as total_earnings,
        COALESCE(SUM(EXTRACT(EPOCH FROM ve.time_spent) / 3600), 0) as total_hours
      FROM volunteer_earnings ve
      WHERE ve.volunteer_id = ${session.user.id}
      AND ve.payment_status != 'cancelled'
    `;

    // Get session statistics (including sessions without earnings yet)
    const sessionStats = await sql`
      SELECT 
        COUNT(cs.id) as completed_sessions,
        COALESCE(AVG(EXTRACT(EPOCH FROM cs.session_duration) / 60), 0) as avg_session_minutes
      FROM chat_sessions cs
      WHERE cs.volunteer_id = ${session.user.id}
      AND cs.status = 'ended'
    `;

    // Get feedback rating
    const feedbackStats = await sql`
      SELECT 
        COALESCE(AVG(sf.rating), 5.0) as average_rating,
        COUNT(sf.id) as total_feedback
      FROM session_feedback sf
      JOIN chat_sessions cs ON sf.session_id = cs.id
      WHERE cs.volunteer_id = ${session.user.id}
      AND sf.rating IS NOT NULL
    `;

    // Get recent activity (last 30 days)
    const recentActivity = await sql`
      SELECT 
        COUNT(cs.id) as sessions_last_30_days,
        COALESCE(SUM(ve.amount_earned), 0) as earnings_last_30_days
      FROM chat_sessions cs
      LEFT JOIN volunteer_earnings ve ON cs.id = ve.session_id
      WHERE cs.volunteer_id = ${session.user.id}
      AND cs.started_at >= NOW() - INTERVAL '30 days'
      AND cs.status = 'ended'
    `;

    // Get current month earnings for payout tracking
    const currentMonthEarnings = await sql`
      SELECT 
        COALESCE(SUM(ve.amount_earned), 0) as current_month_earnings,
        COUNT(ve.session_id) as current_month_sessions
      FROM volunteer_earnings ve
      WHERE ve.volunteer_id = ${session.user.id}
      AND ve.payment_status = 'pending'
      AND EXTRACT(MONTH FROM ve.created_at) = EXTRACT(MONTH FROM NOW())
      AND EXTRACT(YEAR FROM ve.created_at) = EXTRACT(YEAR FROM NOW())
    `;

    const stats = {
      // Session statistics
      totalSessions: parseInt(sessionStats[0]?.completed_sessions || 0),
      totalHours: Math.round(parseFloat(earningsStats[0]?.total_hours || 0) * 10) / 10,
      avgSessionMinutes: Math.round(parseFloat(sessionStats[0]?.avg_session_minutes || 0)),
      
      // Earnings
      totalPoints: parseInt(earningsStats[0]?.total_points || 0),
      totalEarnings: parseFloat(earningsStats[0]?.total_earnings || 0).toFixed(2),
      
      // Rating and feedback
      rating: Math.round(parseFloat(feedbackStats[0]?.average_rating || 5.0) * 10) / 10,
      totalFeedback: parseInt(feedbackStats[0]?.total_feedback || 0),
      
      // Recent activity
      sessionsLast30Days: parseInt(recentActivity[0]?.sessions_last_30_days || 0),
      earningsLast30Days: parseFloat(recentActivity[0]?.earnings_last_30_days || 0).toFixed(2),
      
      // Current month
      currentMonthEarnings: parseFloat(currentMonthEarnings[0]?.current_month_earnings || 0).toFixed(2),
      currentMonthSessions: parseInt(currentMonthEarnings[0]?.current_month_sessions || 0),
      
      // Calculated metrics
      averageEarningsPerSession: earningsStats[0]?.total_sessions > 0 ? 
        (parseFloat(earningsStats[0]?.total_earnings || 0) / parseInt(earningsStats[0]?.total_sessions)).toFixed(2) : 
        '0.00',
      
      // Status indicators
      isTopPerformer: parseFloat(feedbackStats[0]?.average_rating || 0) >= 4.8 && 
                      parseInt(feedbackStats[0]?.total_feedback || 0) >= 10,
      
      isPendingPayout: parseFloat(currentMonthEarnings[0]?.current_month_earnings || 0) >= 10.00
    };

    return Response.json({ stats });
  } catch (error) {
    console.error("Error fetching volunteer stats:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is a volunteer
    const userProfile = await sql`
      SELECT user_type FROM user_profiles WHERE user_id = ${session.user.id}
    `;

    if (userProfile.length === 0 || userProfile[0].user_type !== "volunteer") {
      return Response.json(
        { error: "Only volunteers can request payouts" },
        { status: 403 },
      );
    }

    const body = await request.json();
    const { action } = body;

    if (action === 'request_payout') {
      // Get pending earnings
      const pendingEarnings = await sql`
        SELECT 
          COALESCE(SUM(ve.amount_earned), 0) as total_pending,
          COUNT(ve.session_id) as sessions_count
        FROM volunteer_earnings ve
        WHERE ve.volunteer_id = ${session.user.id}
        AND ve.payment_status = 'pending'
      `;

      const totalPending = parseFloat(pendingEarnings[0]?.total_pending || 0);
      
      if (totalPending < 10.00) {
        return Response.json(
          { error: "Minimum payout amount is $10.00" },
          { status: 400 }
        );
      }

      // Create payout request notification
      try {
        await fetch(
          `${request.headers.get("origin") || process.env.NEXTAUTH_URL}/api/admin/notifications`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              type: "payout_request",
              data: {
                volunteerId: session.user.id,
                amount: totalPending,
                sessions: pendingEarnings[0]?.sessions_count || 0,
              },
            }),
          },
        );
      } catch (notificationError) {
        console.error("Failed to send payout notification:", notificationError);
        // Don't fail the request if notification fails
      }

      return Response.json({
        success: true,
        message: "Payout request submitted",
        amount: totalPending.toFixed(2)
      });
    }

    return Response.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Error processing volunteer stats action:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}