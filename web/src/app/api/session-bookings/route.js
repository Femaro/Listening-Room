import { auth } from "@/auth";
import sql from "@/app/api/utils/sql";

export async function POST(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { scheduled_session_id, session_code } = body;

    let sessionId = scheduled_session_id;

    // If session_code is provided, find the session by code
    if (session_code && !sessionId) {
      const sessionByCode = await sql`
        SELECT id FROM scheduled_sessions WHERE session_code = ${session_code}
      `;
      if (sessionByCode.length === 0) {
        return Response.json({ error: "Invalid session code" }, { status: 404 });
      }
      sessionId = sessionByCode[0].id;
    }

    if (!sessionId) {
      return Response.json(
        { error: "Session ID or session code is required" },
        { status: 400 }
      );
    }

    // Check if session exists and is available
    const sessionDetails = await sql`
      SELECT ss.*, COUNT(sb.id) as booked_participants
      FROM scheduled_sessions ss
      LEFT JOIN session_bookings sb ON ss.id = sb.scheduled_session_id
      WHERE ss.id = ${sessionId}
      AND ss.status = 'scheduled'
      AND (ss.session_date || ' ' || ss.start_time)::timestamp > NOW()
      GROUP BY ss.id
    `;

    if (sessionDetails.length === 0) {
      return Response.json(
        { error: "Session not found or not available for booking" },
        { status: 404 }
      );
    }

    const sessionInfo = sessionDetails[0];

    // Check if session is full
    if (sessionInfo.booked_participants >= sessionInfo.max_participants) {
      return Response.json({ error: "Session is full" }, { status: 400 });
    }

    // Check if user already booked this session
    const existingBooking = await sql`
      SELECT id FROM session_bookings 
      WHERE scheduled_session_id = ${sessionId} 
      AND user_id = ${session.user.id}
    `;

    if (existingBooking.length > 0) {
      return Response.json(
        { error: "You have already booked this session" },
        { status: 400 }
      );
    }

    // Create the booking
    const booking = await sql`
      INSERT INTO session_bookings (scheduled_session_id, user_id)
      VALUES (${sessionId}, ${session.user.id})
      RETURNING *
    `;

    // Create a confirmation notification
    const sessionDateTime = new Date(`${sessionInfo.session_date}T${sessionInfo.start_time}`);
    const reminderTime = new Date(sessionDateTime.getTime() - 15 * 60 * 1000); // 15 minutes before

    await sql`
      INSERT INTO session_notifications (
        scheduled_session_id,
        user_id,
        notification_type,
        scheduled_for
      ) VALUES (
        ${sessionId},
        ${session.user.id},
        'booking_confirmation',
        NOW()
      ), (
        ${sessionId},
        ${session.user.id},
        'session_reminder',
        ${reminderTime.toISOString()}
      )
    `;

    return Response.json({
      booking: booking[0],
      session: sessionInfo,
      message: "Successfully booked session"
    });

  } catch (error) {
    console.error("Error creating booking:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user's bookings
    const bookings = await sql`
      SELECT sb.*, 
             ss.title,
             ss.description,
             ss.session_date,
             ss.start_time,
             ss.duration_minutes,
             ss.session_code,
             ss.status as session_status,
             up.username as volunteer_name
      FROM session_bookings sb
      JOIN scheduled_sessions ss ON sb.scheduled_session_id = ss.id
      JOIN user_profiles up ON ss.volunteer_id = up.user_id
      WHERE sb.user_id = ${session.user.id}
      ORDER BY ss.session_date ASC, ss.start_time ASC
    `;

    return Response.json({ bookings });

  } catch (error) {
    console.error("Error fetching bookings:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { scheduled_session_id } = body;

    // Check if booking exists
    const booking = await sql`
      SELECT sb.*, ss.session_date, ss.start_time
      FROM session_bookings sb
      JOIN scheduled_sessions ss ON sb.scheduled_session_id = ss.id
      WHERE sb.scheduled_session_id = ${scheduled_session_id}
      AND sb.user_id = ${session.user.id}
    `;

    if (booking.length === 0) {
      return Response.json({ error: "Booking not found" }, { status: 404 });
    }

    // Check if session hasn't started yet
    const sessionDateTime = new Date(`${booking[0].session_date}T${booking[0].start_time}`);
    if (sessionDateTime <= new Date()) {
      return Response.json(
        { error: "Cannot cancel booking for sessions that have already started" },
        { status: 400 }
      );
    }

    // Cancel the booking
    await sql`
      UPDATE session_bookings 
      SET booking_status = 'cancelled'
      WHERE scheduled_session_id = ${scheduled_session_id}
      AND user_id = ${session.user.id}
    `;

    return Response.json({ message: "Booking cancelled successfully" });

  } catch (error) {
    console.error("Error cancelling booking:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}