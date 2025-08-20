import { auth } from "@/auth";
import sql from "@/app/api/utils/sql";

export async function GET(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: sessionId } = params;

    // Get session with reward info
    const sessionData = await sql`
      SELECT cs.*, ve.points_earned, ve.amount_earned, ve.time_spent,
             vrs.points_per_minute, vrs.points_to_dollar_rate, vrs.max_free_minutes,
             vrs.continuation_rate_multiplier
      FROM chat_sessions cs
      LEFT JOIN volunteer_earnings ve ON cs.id = ve.session_id
      LEFT JOIN volunteer_reward_settings vrs ON vrs.is_active = true
      WHERE cs.id = ${sessionId}
      AND (cs.volunteer_id = ${session.user.id} OR cs.seeker_id = ${session.user.id})
    `;

    if (sessionData.length === 0) {
      return Response.json({ error: "Session not found" }, { status: 404 });
    }

    const sessionInfo = sessionData[0];
    
    // Calculate current rewards based on session duration
    let currentPoints = 0;
    let currentAmount = 0;
    let timeSpentMinutes = 0;

    if (sessionInfo.started_at && sessionInfo.status === 'active') {
      const now = new Date();
      const startTime = new Date(sessionInfo.started_at);
      const timeSpentMs = now - startTime;
      timeSpentMinutes = timeSpentMs / (1000 * 60); // Convert to minutes
      
      // Calculate points based on time (minimum 1 minute for rewards)
      if (timeSpentMinutes >= 1) {
        const pointsPerMinute = parseFloat(sessionInfo.points_per_minute || 40);
        const pointsToDollarRate = parseFloat(sessionInfo.points_to_dollar_rate || 0.1);
        
        // Apply continuation multiplier if session was continued
        const multiplier = sessionInfo.continued_after_limit ? 
          parseFloat(sessionInfo.continuation_rate_multiplier || 1.5) : 1;
        
        currentPoints = Math.floor(timeSpentMinutes * pointsPerMinute * multiplier);
        currentAmount = currentPoints * pointsToDollarRate;
      }
    }

    // Check if session should auto-terminate (5 minutes default)
    const maxFreeMinutes = parseInt(sessionInfo.max_free_minutes || 5);
    const shouldAutoTerminate = timeSpentMinutes >= maxFreeMinutes && 
                               !sessionInfo.continued_after_limit &&
                               sessionInfo.status === 'active';

    return Response.json({
      session: {
        id: sessionInfo.id,
        status: sessionInfo.status,
        started_at: sessionInfo.started_at,
        ended_at: sessionInfo.ended_at,
        time_spent_minutes: timeSpentMinutes,
        current_points: currentPoints,
        current_amount: currentAmount,
        total_earned_points: sessionInfo.points_earned || 0,
        total_earned_amount: sessionInfo.amount_earned || 0,
        should_auto_terminate: shouldAutoTerminate,
        continued_after_limit: sessionInfo.continued_after_limit,
        max_free_minutes: maxFreeMinutes,
        points_per_minute: sessionInfo.points_per_minute,
        continuation_rate_multiplier: sessionInfo.continuation_rate_multiplier
      }
    });
  } catch (error) {
    console.error("Error fetching session rewards:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: sessionId } = params;
    const body = await request.json();
    const { action } = body;

    // Get session info
    const sessionData = await sql`
      SELECT cs.*, vrs.points_per_minute, vrs.points_to_dollar_rate, 
             vrs.max_free_minutes, vrs.continuation_rate_multiplier
      FROM chat_sessions cs
      LEFT JOIN volunteer_reward_settings vrs ON vrs.is_active = true
      WHERE cs.id = ${sessionId}
      AND cs.volunteer_id = ${session.user.id}
    `;

    if (sessionData.length === 0) {
      return Response.json({ error: "Session not found or unauthorized" }, { status: 404 });
    }

    const sessionInfo = sessionData[0];

    if (action === 'continue') {
      // Mark session as continued after limit
      await sql`
        UPDATE chat_sessions 
        SET continued_after_limit = true,
            auto_terminated = false
        WHERE id = ${sessionId}
      `;

      return Response.json({ 
        success: true, 
        message: "Session continued with premium rate",
        new_rate_multiplier: sessionInfo.continuation_rate_multiplier || 1.5
      });
    }

    if (action === 'finalize') {
      // Calculate final rewards
      if (sessionInfo.started_at) {
        const now = new Date();
        const startTime = new Date(sessionInfo.started_at);
        const timeSpentMs = now - startTime;
        const timeSpentMinutes = timeSpentMs / (1000 * 60);

        let totalPoints = 0;
        let totalAmount = 0;

        if (timeSpentMinutes >= 1) {
          const pointsPerMinute = parseFloat(sessionInfo.points_per_minute || 40);
          const pointsToDollarRate = parseFloat(sessionInfo.points_to_dollar_rate || 0.1);
          
          // Apply continuation multiplier if session was continued
          const multiplier = sessionInfo.continued_after_limit ? 
            parseFloat(sessionInfo.continuation_rate_multiplier || 1.5) : 1;
          
          totalPoints = Math.floor(timeSpentMinutes * pointsPerMinute * multiplier);
          totalAmount = totalPoints * pointsToDollarRate;
        }

        // Create or update earnings record
        await sql`
          INSERT INTO volunteer_earnings (
            volunteer_id, 
            session_id, 
            time_spent, 
            points_earned, 
            amount_earned
          )
          VALUES (
            ${session.user.id},
            ${sessionId},
            INTERVAL '${Math.floor(timeSpentMs / 1000)} seconds',
            ${totalPoints},
            ${totalAmount}
          )
          ON CONFLICT (session_id)
          DO UPDATE SET
            time_spent = EXCLUDED.time_spent,
            points_earned = EXCLUDED.points_earned,
            amount_earned = EXCLUDED.amount_earned
        `;

        // Update session with final reward info
        await sql`
          UPDATE chat_sessions
          SET reward_points = ${totalPoints},
              reward_amount = ${totalAmount},
              session_duration = INTERVAL '${Math.floor(timeSpentMs / 1000)} seconds'
          WHERE id = ${sessionId}
        `;

        return Response.json({
          success: true,
          total_points: totalPoints,
          total_amount: totalAmount,
          time_spent_minutes: timeSpentMinutes
        });
      }
    }

    return Response.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Error managing session rewards:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}