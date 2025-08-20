import { auth } from "@/auth";
import sql from "@/app/api/utils/sql";

export async function POST(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    // Check if session exists and user is part of it, get user role
    const chatSession = await sql`
      SELECT cs.*, sp.role
      FROM chat_sessions cs
      LEFT JOIN session_participants sp ON cs.id = sp.session_id AND sp.user_id = ${session.user.id}
      WHERE cs.id = ${id} 
      AND (cs.seeker_id = ${session.user.id} OR cs.volunteer_id = ${session.user.id})
      AND cs.status IN ('waiting', 'active')
    `;

    if (chatSession.length === 0) {
      return Response.json(
        { error: "Session not found or you don't have permission" },
        { status: 404 },
      );
    }

    const sessionInfo = chatSession[0];
    const userRole = sessionInfo.role;

    // End the session
    const updatedSession = await sql`
      UPDATE chat_sessions 
      SET status = 'ended', ended_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;

    // Mark all participants as inactive
    await sql`
      UPDATE session_participants 
      SET is_active = false, left_at = NOW()
      WHERE session_id = ${id}
    `;

    // If this was ended by a volunteer, calculate and finalize rewards
    if (userRole === "volunteer" && sessionInfo.volunteer_id) {
      try {
        // Get reward settings
        const rewardSettings = await sql`
          SELECT * FROM volunteer_reward_settings WHERE is_active = true LIMIT 1
        `;

        if (rewardSettings.length > 0 && sessionInfo.started_at) {
          const settings = rewardSettings[0];
          const now = new Date();
          const startTime = new Date(sessionInfo.started_at);
          const timeSpentMs = now - startTime;
          const timeSpentMinutes = timeSpentMs / (1000 * 60);

          let totalPoints = 0;
          let totalAmount = 0;

          // Calculate rewards if session was at least 1 minute
          if (timeSpentMinutes >= 1) {
            const pointsPerMinute = parseFloat(
              settings.points_per_minute || 40,
            );
            const pointsToDollarRate = parseFloat(
              settings.points_to_dollar_rate || 0.1,
            );

            // Apply continuation multiplier if session was continued
            const multiplier = sessionInfo.continued_after_limit
              ? parseFloat(settings.continuation_rate_multiplier || 1.5)
              : 1;

            totalPoints = Math.floor(
              timeSpentMinutes * pointsPerMinute * multiplier,
            );
            totalAmount = totalPoints * pointsToDollarRate;

            // Create earnings record
            await sql`
              INSERT INTO volunteer_earnings (
                volunteer_id, 
                session_id, 
                time_spent, 
                points_earned, 
                amount_earned
              )
              VALUES (
                ${sessionInfo.volunteer_id},
                ${id},
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

            // Update session with reward info
            await sql`
              UPDATE chat_sessions
              SET reward_points = ${totalPoints},
                  reward_amount = ${totalAmount},
                  session_duration = INTERVAL '${Math.floor(timeSpentMs / 1000)} seconds'
              WHERE id = ${id}
            `;
          }
        }
      } catch (rewardError) {
        console.error("Error calculating volunteer rewards:", rewardError);
        // Don't fail the session ending if reward calculation fails
      }
    }

    // Update volunteer availability - decrease active session count
    if (sessionInfo.volunteer_id) {
      await sql`
        UPDATE volunteer_availability_status 
        SET current_active_sessions = GREATEST(current_active_sessions - 1, 0)
        WHERE volunteer_id = ${sessionInfo.volunteer_id}
      `;
    }

    return Response.json({
      session: updatedSession[0],
      message: "Session ended successfully",
      reward_calculated: userRole === "volunteer",
    });
  } catch (error) {
    console.error("Error ending chat session:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
