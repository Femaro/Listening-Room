import { auth } from "@/auth";
import sql from "@/app/api/utils/sql";

export async function POST(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { session_id, rating, was_helpful, feedback_text } = body;

    if (!session_id) {
      return Response.json(
        { error: "Session ID is required" },
        { status: 400 },
      );
    }

    // Check if session exists and user is the seeker
    const chatSession = await sql`
      SELECT * FROM chat_sessions 
      WHERE id = ${session_id} AND seeker_id = ${session.user.id} AND status = 'ended'
    `;

    if (chatSession.length === 0) {
      return Response.json(
        { error: "Session not found or you don't have permission" },
        { status: 404 },
      );
    }

    // Check if feedback already exists
    const existingFeedback = await sql`
      SELECT id FROM session_feedback WHERE session_id = ${session_id}
    `;

    if (existingFeedback.length > 0) {
      return Response.json(
        { error: "Feedback already submitted for this session" },
        { status: 400 },
      );
    }

    // Create feedback
    const feedback = await sql`
      INSERT INTO session_feedback (session_id, seeker_id, rating, was_helpful, feedback_text)
      VALUES (${session_id}, ${session.user.id}, ${rating || null}, ${was_helpful || null}, ${feedback_text || null})
      RETURNING *
    `;

    // Send notification for new session feedback
    try {
      await fetch(
        `${request.headers.get("origin") || process.env.NEXTAUTH_URL}/api/admin/notifications`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type: "session_feedback",
            data: {
              rating: rating || 0,
              wasHelpful: was_helpful || false,
              feedbackText: feedback_text || "",
            },
          }),
        },
      );
    } catch (notificationError) {
      console.error("Failed to send feedback notification:", notificationError);
      // Don't fail the feedback creation if notification fails
    }

    return Response.json({ feedback: feedback[0] });
  } catch (error) {
    console.error("Error creating feedback:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

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

    if (userProfile.length === 0 || userProfile[0].user_type !== "admin") {
      return Response.json({ error: "Admin access required" }, { status: 403 });
    }

    // Get all feedback with session details
    const feedback = await sql`
      SELECT sf.*, cs.started_at, cs.ended_at, cs.language,
             seeker.username as seeker_username,
             volunteer.username as volunteer_username
      FROM session_feedback sf
      JOIN chat_sessions cs ON sf.session_id = cs.id
      LEFT JOIN user_profiles seeker ON cs.seeker_id = seeker.user_id
      LEFT JOIN user_profiles volunteer ON cs.volunteer_id = volunteer.user_id
      ORDER BY sf.created_at DESC
    `;

    return Response.json({ feedback });
  } catch (error) {
    console.error("Error fetching feedback:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
