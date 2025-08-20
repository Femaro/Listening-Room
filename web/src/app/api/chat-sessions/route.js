import { auth } from "@/auth";
import sql from "@/app/api/utils/sql";

export async function POST(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      language = "en",
      session_type = "one_on_one",
      topic,
      max_participants = 2,
    } = body;

    // Validate session type
    if (!["one_on_one", "group"].includes(session_type)) {
      return Response.json({ error: "Invalid session type" }, { status: 400 });
    }

    // Check if user is a seeker
    const userProfile = await sql`
      SELECT user_type FROM user_profiles WHERE user_id = ${session.user.id}
    `;

    if (userProfile.length === 0 || userProfile[0].user_type !== "seeker") {
      return Response.json(
        { error: "Only seekers can start chat sessions" },
        { status: 403 },
      );
    }

    // Check if user already has an active session
    const activeSession = await sql`
      SELECT id FROM chat_sessions 
      WHERE seeker_id = ${session.user.id} 
      AND status IN ('waiting', 'active')
    `;

    if (activeSession.length > 0) {
      return Response.json(
        { error: "You already have an active session" },
        { status: 400 },
      );
    }

    // Find available volunteer if one_on_one session
    let volunteerId = null;
    if (session_type === "one_on_one") {
      const availableVolunteers = await sql`
        SELECT vas.volunteer_id, vas.current_active_sessions, vas.max_concurrent_sessions,
               up.general_topic
        FROM volunteer_availability_status vas
        JOIN user_profiles up ON vas.volunteer_id = up.user_id
        WHERE vas.is_online = true 
        AND vas.is_available = true
        AND vas.current_active_sessions < vas.max_concurrent_sessions
        AND up.user_type = 'volunteer'
        ORDER BY vas.last_active DESC, vas.current_active_sessions ASC
        LIMIT 1
      `;

      if (availableVolunteers.length > 0) {
        volunteerId = availableVolunteers[0].volunteer_id;
      }
    }

    // Create new session
    const chatSession = await sql`
      INSERT INTO chat_sessions (
        seeker_id, 
        volunteer_id,
        language, 
        status, 
        session_type, 
        topic, 
        max_participants
      )
      VALUES (
        ${session.user.id}, 
        ${volunteerId},
        ${language}, 
        ${volunteerId ? "active" : "waiting"},
        ${session_type},
        ${topic || null},
        ${max_participants}
      )
      RETURNING *
    `;

    // Add seeker as participant
    await sql`
      INSERT INTO session_participants (session_id, user_id, role)
      VALUES (${chatSession[0].id}, ${session.user.id}, 'seeker')
    `;

    // If volunteer assigned, add them as participant and update their session count
    if (volunteerId) {
      await sql`
        INSERT INTO session_participants (session_id, user_id, role)
        VALUES (${chatSession[0].id}, ${volunteerId}, 'volunteer')
      `;

      // Update volunteer's active session count
      await sql`
        UPDATE volunteer_availability_status 
        SET current_active_sessions = current_active_sessions + 1
        WHERE volunteer_id = ${volunteerId}
      `;
    }

    // Send notification for new session
    try {
      await fetch(
        `${request.headers.get("origin") || process.env.NEXTAUTH_URL}/api/admin/notifications`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type: "new_session",
            data: {
              sessionType: session_type,
              language: language,
              topic: topic || "General support",
              maxParticipants: max_participants,
              hasVolunteer: !!volunteerId,
            },
          }),
        },
      );
    } catch (notificationError) {
      console.error("Failed to send session notification:", notificationError);
      // Don't fail the session creation if notification fails
    }

    return Response.json({
      session: {
        ...chatSession[0],
        current_participants: volunteerId ? 2 : 1,
        volunteer_assigned: !!volunteerId,
      },
    });
  } catch (error) {
    console.error("Error creating chat session:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(request.url);
    const status = url.searchParams.get("status");
    const sessionType = url.searchParams.get("session_type");

    // Get user profile to determine access level
    const userProfile = await sql`
      SELECT user_type FROM user_profiles WHERE user_id = ${session.user.id}
    `;

    if (userProfile.length === 0) {
      return Response.json({ error: "Profile not found" }, { status: 404 });
    }

    const userType = userProfile[0].user_type;

    if (userType === "admin") {
      // Admin can see all sessions
      let query = `
        SELECT cs.*, 
               seeker.username as seeker_username,
               volunteer.username as volunteer_username,
               COUNT(sp.user_id) as current_participants
        FROM chat_sessions cs
        LEFT JOIN user_profiles seeker ON cs.seeker_id = seeker.user_id
        LEFT JOIN user_profiles volunteer ON cs.volunteer_id = volunteer.user_id
        LEFT JOIN session_participants sp ON cs.id = sp.session_id AND sp.is_active = true
      `;
      const params = [];

      if (status) {
        query += ` WHERE cs.status = $1`;
        params.push(status);
      }

      if (sessionType) {
        const paramIndex = params.length + 1;
        if (status) {
          query += ` AND cs.session_type = $${paramIndex}`;
        } else {
          query += ` WHERE cs.session_type = $${paramIndex}`;
        }
        params.push(sessionType);
      }

      query += ` GROUP BY cs.id, seeker.username, volunteer.username ORDER BY cs.started_at DESC`;

      const sessions = await sql(query, params);
      return Response.json({ sessions });
    } else if (userType === "volunteer") {
      // Volunteers can see sessions they're assigned to or waiting sessions
      if (status === "waiting") {
        // Show available sessions to join (not full)
        let query = `
          SELECT cs.*, 
                 seeker.username as seeker_username,
                 COUNT(sp.user_id) as current_participants
          FROM chat_sessions cs
          LEFT JOIN user_profiles seeker ON cs.seeker_id = seeker.user_id
          LEFT JOIN session_participants sp ON cs.id = sp.session_id AND sp.is_active = true
          WHERE cs.status = 'waiting'
        `;

        if (sessionType) {
          query += ` AND cs.session_type = '${sessionType}'`;
        }

        query += `
          GROUP BY cs.id, seeker.username
          HAVING COUNT(sp.user_id) < cs.max_participants
          ORDER BY cs.started_at ASC
        `;

        const sessions = await sql(query);
        return Response.json({ sessions });
      } else {
        // Show volunteer's own sessions
        let query = `
          SELECT cs.*, 
                 seeker.username as seeker_username,
                 COUNT(sp.user_id) as current_participants
          FROM chat_sessions cs
          LEFT JOIN user_profiles seeker ON cs.seeker_id = seeker.user_id
          LEFT JOIN session_participants sp ON cs.id = sp.session_id AND sp.is_active = true
          WHERE cs.volunteer_id = $1
        `;
        const params = [session.user.id];

        if (status) {
          query += ` AND cs.status = $2`;
          params.push(status);
        }

        if (sessionType) {
          const paramIndex = params.length + 1;
          query += ` AND cs.session_type = $${paramIndex}`;
          params.push(sessionType);
        }

        query += ` GROUP BY cs.id, seeker.username ORDER BY cs.started_at DESC`;

        const sessions = await sql(query, params);
        return Response.json({ sessions });
      }
    } else {
      // Seekers can only see their own sessions
      let query = `
        SELECT cs.*, 
               volunteer.username as volunteer_username,
               COUNT(sp.user_id) as current_participants
        FROM chat_sessions cs
        LEFT JOIN user_profiles volunteer ON cs.volunteer_id = volunteer.user_id
        LEFT JOIN session_participants sp ON cs.id = sp.session_id AND sp.is_active = true
        WHERE cs.seeker_id = $1
      `;
      const params = [session.user.id];

      if (status) {
        query += ` AND cs.status = $2`;
        params.push(status);
      }

      if (sessionType) {
        const paramIndex = params.length + 1;
        query += ` AND cs.session_type = $${paramIndex}`;
        params.push(sessionType);
      }

      query += ` GROUP BY cs.id, volunteer.username ORDER BY cs.started_at DESC`;

      const sessions = await sql(query, params);
      return Response.json({ sessions });
    }
  } catch (error) {
    console.error("Error fetching chat sessions:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
