import { auth } from "@/auth";
import sql from "@/app/api/utils/sql";

export async function POST(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    // Check if user is a volunteer
    const userProfile = await sql`
      SELECT user_type FROM user_profiles WHERE user_id = ${session.user.id}
    `;

    if (userProfile.length === 0 || userProfile[0].user_type !== "volunteer") {
      return Response.json(
        { error: "Only volunteers can join chat sessions" },
        { status: 403 },
      );
    }

    // Get session details and current participant count
    const sessionDetails = await sql`
      SELECT cs.*, COUNT(sp.user_id) as current_participants
      FROM chat_sessions cs
      LEFT JOIN session_participants sp ON cs.id = sp.session_id AND sp.is_active = true
      WHERE cs.id = ${id}
      GROUP BY cs.id
    `;

    if (sessionDetails.length === 0) {
      return Response.json({ error: "Session not found" }, { status: 404 });
    }

    const chatSession = sessionDetails[0];

    if (chatSession.status !== "waiting") {
      return Response.json(
        { error: "Session is not available to join" },
        { status: 400 },
      );
    }

    // Check if session is full
    if (chatSession.current_participants >= chatSession.max_participants) {
      return Response.json({ error: "Session is full" }, { status: 400 });
    }

    // Check if volunteer is already in this session
    const existingParticipant = await sql`
      SELECT id FROM session_participants
      WHERE session_id = ${id} AND user_id = ${session.user.id} AND is_active = true
    `;

    if (existingParticipant.length > 0) {
      return Response.json(
        { error: "You are already in this session" },
        { status: 400 },
      );
    }

    // Check if volunteer already has an active session
    const volunteerActiveSession = await sql`
      SELECT cs.id FROM chat_sessions cs
      JOIN session_participants sp ON cs.id = sp.session_id
      WHERE sp.user_id = ${session.user.id} 
      AND sp.role = 'volunteer' 
      AND sp.is_active = true
      AND cs.status = 'active'
    `;

    if (volunteerActiveSession.length > 0) {
      return Response.json(
        { error: "You already have an active session" },
        { status: 400 },
      );
    }

    // Add volunteer as participant
    await sql`
      INSERT INTO session_participants (session_id, user_id, role)
      VALUES (${id}, ${session.user.id}, 'volunteer')
    `;

    // Update session to active and set volunteer_id (for backward compatibility with one-on-one)
    const updatedSession = await sql`
      UPDATE chat_sessions 
      SET volunteer_id = ${session.user.id}, status = 'active'
      WHERE id = ${id}
      RETURNING *
    `;

    // Get updated participant count
    const updatedCount = await sql`
      SELECT COUNT(*) as count FROM session_participants
      WHERE session_id = ${id} AND is_active = true
    `;

    return Response.json({
      session: {
        ...updatedSession[0],
        current_participants: parseInt(updatedCount[0].count),
      },
    });
  } catch (error) {
    console.error("Error joining chat session:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
