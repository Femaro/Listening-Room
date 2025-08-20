import { auth } from "@/auth";
import sql from "@/app/api/utils/sql";

export async function POST(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { username, user_type, preferred_language, general_topic } = body;

    if (!username || !user_type) {
      return Response.json(
        { error: "Username and user type are required" },
        { status: 400 },
      );
    }

    if (!["seeker", "volunteer"].includes(user_type)) {
      return Response.json({ error: "Invalid user type" }, { status: 400 });
    }

    // Check if profile already exists
    const existingProfile = await sql`
      SELECT id FROM user_profiles WHERE user_id = ${session.user.id}
    `;

    if (existingProfile.length > 0) {
      return Response.json(
        { error: "Profile already exists" },
        { status: 400 },
      );
    }

    // Check if username is taken
    const existingUsername = await sql`
      SELECT id FROM user_profiles WHERE username = ${username}
    `;

    if (existingUsername.length > 0) {
      return Response.json(
        { error: "Username is already taken" },
        { status: 400 },
      );
    }

    const profile = await sql`
      INSERT INTO user_profiles (user_id, username, user_type, preferred_language, general_topic)
      VALUES (${session.user.id}, ${username}, ${user_type}, ${preferred_language || "en"}, ${general_topic || null})
      RETURNING *
    `;

    // Send notification for new user signup
    try {
      await fetch(
        `${request.headers.get("origin") || process.env.NEXTAUTH_URL}/api/admin/notifications`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type: "new_signup",
            data: {
              email: session.user.email,
              userType: user_type,
              username: username,
              language: preferred_language || "en",
            },
          }),
        },
      );
    } catch (notificationError) {
      console.error("Failed to send signup notification:", notificationError);
      // Don't fail the profile creation if notification fails
    }

    return Response.json({ profile: profile[0] });
  } catch (error) {
    console.error("Error creating profile:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const profile = await sql`
      SELECT * FROM user_profiles WHERE user_id = ${session.user.id}
    `;

    if (profile.length === 0) {
      return Response.json({ profile: null });
    }

    return Response.json({ profile: profile[0] });
  } catch (error) {
    console.error("Error fetching profile:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { username, preferred_language, general_topic, is_active } = body;

    // Check if profile exists
    const existingProfile = await sql`
      SELECT id FROM user_profiles WHERE user_id = ${session.user.id}
    `;

    if (existingProfile.length === 0) {
      return Response.json({ error: "Profile not found" }, { status: 404 });
    }

    // If username is being updated, check if it's taken
    if (username) {
      const existingUsername = await sql`
        SELECT id FROM user_profiles WHERE username = ${username} AND user_id != ${session.user.id}
      `;

      if (existingUsername.length > 0) {
        return Response.json(
          { error: "Username is already taken" },
          { status: 400 },
        );
      }
    }

    // Build update query dynamically
    const updates = [];
    const values = [];
    let paramCount = 1;

    if (username !== undefined) {
      updates.push(`username = $${paramCount}`);
      values.push(username);
      paramCount++;
    }
    if (preferred_language !== undefined) {
      updates.push(`preferred_language = $${paramCount}`);
      values.push(preferred_language);
      paramCount++;
    }
    if (general_topic !== undefined) {
      updates.push(`general_topic = $${paramCount}`);
      values.push(general_topic);
      paramCount++;
    }
    if (is_active !== undefined) {
      updates.push(`is_active = $${paramCount}`);
      values.push(is_active);
      paramCount++;
    }

    updates.push(`updated_at = $${paramCount}`);
    values.push(new Date().toISOString());
    paramCount++;

    values.push(session.user.id);

    const query = `
      UPDATE user_profiles 
      SET ${updates.join(", ")}
      WHERE user_id = $${paramCount}
      RETURNING *
    `;

    const profile = await sql(query, values);

    return Response.json({ profile: profile[0] });
  } catch (error) {
    console.error("Error updating profile:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
