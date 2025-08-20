// app/api/scheduled-sessions/route.js
import { auth } from "@/auth";
import sql from "@/app/api/utils/sql";

// GET all sessions
export async function GET() {
  try {
    const sessions = await sql`
      SELECT 
        ss.*,
        au.name as volunteer_name,
        (SELECT COUNT(*) FROM session_bookings sb WHERE sb.scheduled_session_id = ss.id AND sb.booking_status = 'booked') as current_participants
      FROM scheduled_sessions ss
      LEFT JOIN auth_users au ON ss.volunteer_id = au.id
      WHERE ss.session_date >= CURRENT_DATE
      ORDER BY ss.session_date ASC, ss.start_time ASC
    `;
    return Response.json({ sessions });
  } catch (error) {
    console.error("GET sessions error:", error);
    return Response.json(
      { error: "Failed to fetch sessions" },
      { status: 500 },
    );
  }
}

// CREATE a session
export async function POST(req) {
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
        { error: "Only volunteers can create sessions" },
        { status: 403 },
      );
    }

    const body = await req.json();

    // Generate unique session code
    const generateSessionCode = () => {
      return Math.random().toString(36).substring(2, 8).toUpperCase();
    };

    let sessionCode = generateSessionCode();

    // Ensure code is unique
    let codeExists = true;
    while (codeExists) {
      const existing = await sql`
        SELECT id FROM scheduled_sessions WHERE session_code = ${sessionCode}
      `;
      if (existing.length === 0) {
        codeExists = false;
      } else {
        sessionCode = generateSessionCode();
      }
    }

    const newSession = await sql`
      INSERT INTO scheduled_sessions (
        volunteer_id, title, description, session_date, start_time, 
        duration_minutes, max_participants, session_code
      ) VALUES (
        ${session.user.id},
        ${body.title},
        ${body.description || ""},
        ${body.session_date},
        ${body.start_time},
        ${Number(body.duration_minutes) || 60},
        ${Number(body.max_participants) || 1},
        ${sessionCode}
      ) RETURNING *
    `;

    return Response.json({ session: newSession[0] }, { status: 201 });
  } catch (error) {
    console.error("POST session error:", error);
    return Response.json(
      { error: "Failed to create session" },
      { status: 500 },
    );
  }
}
