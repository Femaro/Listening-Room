import { auth } from "@/auth";
import sql from "@/app/api/utils/sql";

export async function GET(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(request.url);
    const volunteerId = url.searchParams.get("volunteer_id");

    if (volunteerId) {
      // Get specific volunteer's availability
      const availability = await sql`
        SELECT vas.*, up.username, up.general_topic
        FROM volunteer_availability_status vas
        JOIN user_profiles up ON vas.volunteer_id = up.user_id
        WHERE vas.volunteer_id = ${volunteerId}
      `;

      if (availability.length === 0) {
        return Response.json({ error: "Volunteer not found" }, { status: 404 });
      }

      return Response.json({ availability: availability[0] });
    } else {
      // Get all available volunteers
      const availableVolunteers = await sql`
        SELECT vas.*, up.username, up.general_topic,
               COUNT(cs.id) as active_sessions
        FROM volunteer_availability_status vas
        JOIN user_profiles up ON vas.volunteer_id = up.user_id
        LEFT JOIN chat_sessions cs ON cs.volunteer_id = vas.volunteer_id AND cs.status = 'active'
        WHERE vas.is_online = true 
        AND vas.is_available = true
        AND vas.current_active_sessions < vas.max_concurrent_sessions
        GROUP BY vas.id, up.username, up.general_topic
        ORDER BY vas.last_active DESC
      `;

      return Response.json({ volunteers: availableVolunteers });
    }
  } catch (error) {
    console.error("Error fetching volunteer availability:", error);
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
        { error: "Only volunteers can set availability" },
        { status: 403 },
      );
    }

    const body = await request.json();
    const {
      is_online = false,
      is_available = false,
      status_message = null,
      max_concurrent_sessions = 1,
    } = body;

    // Update or create volunteer availability status
    const availability = await sql`
      INSERT INTO volunteer_availability_status (
        volunteer_id, 
        is_online, 
        is_available, 
        status_message,
        max_concurrent_sessions,
        last_active,
        updated_at
      )
      VALUES (
        ${session.user.id}, 
        ${is_online}, 
        ${is_available}, 
        ${status_message},
        ${max_concurrent_sessions},
        now(),
        now()
      )
      ON CONFLICT (volunteer_id) 
      DO UPDATE SET 
        is_online = EXCLUDED.is_online,
        is_available = EXCLUDED.is_available,
        status_message = EXCLUDED.status_message,
        max_concurrent_sessions = EXCLUDED.max_concurrent_sessions,
        last_active = now(),
        updated_at = now()
      RETURNING *
    `;

    return Response.json({ availability: availability[0] });
  } catch (error) {
    console.error("Error updating volunteer availability:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(request) {
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
        { error: "Only volunteers can update availability" },
        { status: 403 },
      );
    }

    // Update last_active timestamp (heartbeat)
    const availability = await sql`
      UPDATE volunteer_availability_status 
      SET last_active = now(), updated_at = now()
      WHERE volunteer_id = ${session.user.id}
      RETURNING *
    `;

    if (availability.length === 0) {
      // Create initial availability record
      const newAvailability = await sql`
        INSERT INTO volunteer_availability_status (volunteer_id, last_active)
        VALUES (${session.user.id}, now())
        RETURNING *
      `;
      return Response.json({ availability: newAvailability[0] });
    }

    return Response.json({ availability: availability[0] });
  } catch (error) {
    console.error("Error updating volunteer heartbeat:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request) {
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
        { error: "Only volunteers can set availability" },
        { status: 403 },
      );
    }

    const body = await request.json();
    const {
      is_online = false,
      is_available = false,
      status_message = null,
      max_concurrent_sessions = 1,
    } = body;

    // Update or create volunteer availability status
    const availability = await sql`
      INSERT INTO volunteer_availability_status (
        volunteer_id, 
        is_online, 
        is_available, 
        status_message,
        max_concurrent_sessions,
        last_active,
        updated_at
      )
      VALUES (
        ${session.user.id}, 
        ${is_online}, 
        ${is_available}, 
        ${status_message},
        ${max_concurrent_sessions},
        now(),
        now()
      )
      ON CONFLICT (volunteer_id) 
      DO UPDATE SET 
        is_online = EXCLUDED.is_online,
        is_available = EXCLUDED.is_available,
        status_message = EXCLUDED.status_message,
        max_concurrent_sessions = EXCLUDED.max_concurrent_sessions,
        last_active = now(),
        updated_at = now()
      RETURNING *
    `;

    return Response.json({ availability: availability[0] });
  } catch (error) {
    console.error("Error updating volunteer availability:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
