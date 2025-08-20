import { auth } from "@/auth";
import sql from "@/app/api/utils/sql";

export async function POST(request) {
  try {
    const session = await auth();
    const body = await request.json();

    const {
      name,
      email,
      phone,
      country,
      city,
      timezone,
      preferredLanguages,
      availability,
      background,
      experience,
      motivation,
      specializations,
      agreeToTerms,
      agreeToBackground,
      status,
    } = body;

    // For new registrations (no session), we need the basic info
    if (!session?.user?.id) {
      if (!name || !email || !motivation) {
        return Response.json(
          { error: "Name, email, and motivation are required" },
          { status: 400 },
        );
      }
    }

    if (!motivation) {
      return Response.json(
        { error: "Motivation is required" },
        { status: 400 },
      );
    }

    let userId = session?.user?.id;

    // If no session (new registration), the user should be created by the register API first
    if (!userId) {
      return Response.json(
        { error: "User account must be created first" },
        { status: 400 },
      );
    }

    // Check if user already has an application
    const existingApplication = await sql`
      SELECT id FROM volunteer_applications WHERE user_id = ${userId}
    `;

    if (existingApplication.length > 0) {
      return Response.json(
        { error: "Application already exists" },
        { status: 400 },
      );
    }

    // Create the volunteer application
    const application = await sql`
      INSERT INTO volunteer_applications (
        user_id, 
        background, 
        experience, 
        motivation, 
        status
      )
      VALUES (
        ${userId}, 
        ${background || ""}, 
        ${experience || ""}, 
        ${motivation}, 
        ${status || "pending"}
      )
      RETURNING *
    `;

    // Create or update user profile with additional information
    if (name || email || phone || country || timezone) {
      await sql`
        INSERT INTO user_profiles (
          user_id, 
          user_type, 
          preferred_language, 
          country_code, 
          country_name, 
          timezone, 
          city, 
          region, 
          language_preferences
        ) VALUES (
          ${userId},
          'volunteer',
          ${preferredLanguages?.[0] || "en"},
          ${country?.substring(0, 2) || null},
          ${country || null},
          ${timezone || null},
          ${city || null},
          ${country || null},
          ${JSON.stringify(preferredLanguages || ["en"])}
        )
        ON CONFLICT (user_id) 
        DO UPDATE SET
          user_type = 'volunteer',
          preferred_language = COALESCE(${preferredLanguages?.[0] || "en"}, user_profiles.preferred_language),
          country_code = COALESCE(${country?.substring(0, 2) || null}, user_profiles.country_code),
          country_name = COALESCE(${country || null}, user_profiles.country_name),
          timezone = COALESCE(${timezone || null}, user_profiles.timezone),
          city = COALESCE(${city || null}, user_profiles.city),
          region = COALESCE(${country || null}, user_profiles.region),
          language_preferences = COALESCE(${JSON.stringify(preferredLanguages || ["en"])}, user_profiles.language_preferences),
          updated_at = now()
      `;
    }

    // Store availability if provided
    if (availability && availability.length > 0) {
      const dayMap = {
        Monday: 0,
        Tuesday: 1,
        Wednesday: 2,
        Thursday: 3,
        Friday: 4,
        Saturday: 5,
        Sunday: 6,
      };

      for (const day of availability) {
        if (dayMap[day] !== undefined) {
          await sql`
            INSERT INTO volunteer_availability (
              volunteer_id, 
              day_of_week, 
              start_time, 
              end_time, 
              timezone
            ) VALUES (
              ${userId},
              ${dayMap[day]},
              '09:00',
              '17:00',
              ${timezone || "UTC"}
            )
            ON CONFLICT (volunteer_id, day_of_week) DO NOTHING
          `;
        }
      }
    }

    // Store specializations if provided
    if (specializations && specializations.length > 0) {
      // First, ensure specializations exist in the database
      for (const spec of specializations) {
        await sql`
          INSERT INTO volunteer_specializations (name, description, category_type)
          VALUES (${spec}, ${spec}, 'general')
          ON CONFLICT (name) DO NOTHING
        `;
      }

      // Now assign them to the volunteer
      for (const spec of specializations) {
        const specResult = await sql`
          SELECT id FROM volunteer_specializations WHERE name = ${spec}
        `;

        if (specResult.length > 0) {
          await sql`
            INSERT INTO volunteer_specialization_assignments (
              volunteer_id, 
              specialization_id, 
              experience_level
            ) VALUES (
              ${userId},
              ${specResult[0].id},
              'beginner'
            )
            ON CONFLICT (volunteer_id, specialization_id) DO NOTHING
          `;
        }
      }
    }

    // Create initial availability status
    await sql`
      INSERT INTO volunteer_availability_status (
        volunteer_id,
        is_online,
        is_available,
        max_concurrent_sessions,
        current_active_sessions,
        timezone,
        serves_global
      ) VALUES (
        ${userId},
        false,
        false,
        1,
        0,
        ${timezone || "UTC"},
        true
      )
      ON CONFLICT (volunteer_id) DO NOTHING
    `;

    // Send notification for new volunteer application
    try {
      await fetch(
        `${request.headers.get("origin") || process.env.NEXTAUTH_URL}/api/admin/notifications`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type: "volunteer_application",
            data: {
              name: name || "Unknown",
              email: email || session?.user?.email || "Unknown",
              country: country || "Unknown",
              specializations: specializations || [],
              motivation: motivation.substring(0, 200),
            },
          }),
        },
      );
    } catch (notificationError) {
      console.error(
        "Failed to send volunteer application notification:",
        notificationError,
      );
      // Don't fail the application creation if notification fails
    }

    return Response.json({
      application: application[0],
      message: "Application submitted successfully",
    });
  } catch (error) {
    console.error("Error creating volunteer application:", error);
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

    const url = new URL(request.url);
    const status = url.searchParams.get("status");

    if (userProfile.length > 0 && userProfile[0].user_type === "admin") {
      // Admin can see all applications
      let query = `
        SELECT va.*, au.email, up.username 
        FROM volunteer_applications va
        JOIN auth_users au ON va.user_id = au.id
        LEFT JOIN user_profiles up ON va.user_id = up.user_id
      `;
      const params = [];

      if (status) {
        query += ` WHERE va.status = $1`;
        params.push(status);
      }

      query += ` ORDER BY va.created_at DESC`;

      const applications = await sql(query, params);
      return Response.json({ applications });
    } else {
      // Regular user can only see their own application
      const application = await sql`
        SELECT * FROM volunteer_applications WHERE user_id = ${session.user.id}
      `;

      return Response.json({ application: application[0] || null });
    }
  } catch (error) {
    console.error("Error fetching volunteer applications:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
