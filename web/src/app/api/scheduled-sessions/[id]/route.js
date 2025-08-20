// app/api/scheduled-sessions/[id]/route.js
import { auth } from "@/auth";
import sql from "@/app/api/utils/sql";

// UPDATE session
export async function PUT(req, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const sessionId = params.id;

    // Check if session exists and user owns it
    const existingSession = await sql`
      SELECT volunteer_id FROM scheduled_sessions WHERE id = ${sessionId}
    `;

    if (existingSession.length === 0) {
      return Response.json({ error: "Session not found" }, { status: 404 });
    }

    if (existingSession[0].volunteer_id !== session.user.id) {
      return Response.json(
        { error: "Unauthorized to edit this session" },
        { status: 403 },
      );
    }

    const body = await req.json();

    const updated = await sql`
      UPDATE scheduled_sessions 
      SET 
        title = ${body.title},
        description = ${body.description},
        session_date = ${body.session_date},
        start_time = ${body.start_time},
        duration_minutes = ${Number(body.duration_minutes)},
        max_participants = ${Number(body.max_participants)},
        updated_at = NOW()
      WHERE id = ${sessionId}
      RETURNING *
    `;

    return Response.json({ session: updated[0] });
  } catch (error) {
    console.error("PUT session error:", error);
    return Response.json(
      { error: "Failed to update session" },
      { status: 500 },
    );
  }
}

// DELETE session
export async function DELETE(req, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const sessionId = params.id;

    // Check if session exists and user owns it
    const existingSession = await sql`
      SELECT volunteer_id FROM scheduled_sessions WHERE id = ${sessionId}
    `;

    if (existingSession.length === 0) {
      return Response.json({ error: "Session not found" }, { status: 404 });
    }

    if (existingSession[0].volunteer_id !== session.user.id) {
      return Response.json(
        { error: "Unauthorized to delete this session" },
        { status: 403 },
      );
    }

    await sql`
      DELETE FROM scheduled_sessions WHERE id = ${sessionId}
    `;

    return Response.json({ success: true });
  } catch (error) {
    console.error("DELETE session error:", error);
    return Response.json(
      { error: "Failed to delete session" },
      { status: 500 },
    );
  }
}

// GET single session
export async function GET(req, { params }) {
  try {
    const sessionId = params.id;

    const sessionData = await sql`
      SELECT 
        ss.*,
        au.name as volunteer_name,
        (SELECT COUNT(*) FROM session_bookings sb WHERE sb.scheduled_session_id = ss.id AND sb.booking_status = 'booked') as current_participants
      FROM scheduled_sessions ss
      LEFT JOIN auth_users au ON ss.volunteer_id = au.id
      WHERE ss.id = ${sessionId}
    `;

    if (sessionData.length === 0) {
      return Response.json({ error: "Session not found" }, { status: 404 });
    }

    return Response.json({ session: sessionData[0] });
  } catch (error) {
    console.error("GET session error:", error);
    return Response.json({ error: "Failed to fetch session" }, { status: 500 });
  }
}
