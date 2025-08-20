import sql from "@/app/api/utils/sql";

export async function POST(request) {
  try {
    const body = await request.json();
    const { token, code } = body;

    if (!token && !code) {
      return Response.json(
        { error: "Activation token or code is required" },
        { status: 400 }
      );
    }

    let user = null;
    let userId = null;

    if (token) {
      // Activate by token (from email link)
      const userResult = await sql`
        SELECT id, email, name, email_verified, activation_token_expires
        FROM auth_users 
        WHERE activation_token = ${token} 
        AND activation_token_expires > NOW()
      `;

      if (userResult.length === 0) {
        return Response.json(
          { error: "Invalid or expired activation token" },
          { status: 400 }
        );
      }

      user = userResult[0];
      userId = user.id;

    } else if (code) {
      // Activate by code (from manual entry)
      const tokenResult = await sql`
        SELECT evt.user_id, u.email, u.name, u.email_verified
        FROM email_verification_tokens evt
        JOIN auth_users u ON evt.user_id = u.id
        WHERE evt.token = ${code} 
        AND evt.type = 'activation'
        AND evt.expires_at > NOW()
        AND evt.used_at IS NULL
      `;

      if (tokenResult.length === 0) {
        return Response.json(
          { error: "Invalid or expired activation code" },
          { status: 400 }
        );
      }

      user = tokenResult[0];
      userId = user.user_id;

      // Mark the verification token as used
      await sql`
        UPDATE email_verification_tokens 
        SET used_at = NOW() 
        WHERE token = ${code} AND user_id = ${userId}
      `;
    }

    // Check if already verified
    if (user.email_verified) {
      return Response.json(
        { error: "This account is already activated" },
        { status: 400 }
      );
    }

    // Activate the user account
    await sql`
      UPDATE auth_users 
      SET email_verified = true, 
          "emailVerified" = NOW(),
          activation_token = NULL,
          activation_token_expires = NULL
      WHERE id = ${userId}
    `;

    // Clean up all verification tokens for this user
    await sql`
      DELETE FROM email_verification_tokens 
      WHERE user_id = ${userId}
    `;

    // For volunteers, initialize training progress
    const profile = await sql`
      SELECT user_type FROM user_profiles WHERE user_id = ${userId}
    `;

    if (profile.length > 0 && profile[0].user_type === 'volunteer') {
      // Get all training modules
      const modules = await sql`
        SELECT id FROM training_modules WHERE is_active = true ORDER BY module_order
      `;

      // Initialize progress for each module
      for (const module of modules) {
        await sql`
          INSERT INTO volunteer_training_progress (volunteer_id, module_id, status)
          VALUES (${userId}, ${module.id}, 'not_started')
          ON CONFLICT (volunteer_id, module_id) DO NOTHING
        `;
      }
    }

    // Send welcome email
    const welcomeEmailBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #0D9488;">Welcome to ListeningRoom!</h2>
        <p>Hi ${user.name},</p>
        <p>🎉 Your account has been successfully activated!</p>
        
        ${profile.length > 0 && profile[0].user_type === 'volunteer' ? `
          <div style="background: #F0FDF4; border: 1px solid #BBF7D0; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <h3 style="color: #065F46; margin-top: 0;">Next Steps for Volunteers</h3>
            <p>As a volunteer, you'll need to complete our training modules before you can start helping others:</p>
            <ul>
              <li>✅ Complete all required training modules</li>
              <li>📚 Review our platform guidelines</li>
              <li>🎯 Pass the certification quiz</li>
              <li>🚀 Start making a difference!</li>
            </ul>
            <a href="${process.env.NEXTAUTH_URL}/training" style="background: #059669; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; display: inline-block; margin-top: 10px;">
              Start Training →
            </a>
          </div>
        ` : `
          <div style="background: #EFF6FF; border: 1px solid #BFDBFE; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <h3 style="color: #1E40AF; margin-top: 0;">Ready to Connect</h3>
            <p>You can now:</p>
            <ul>
              <li>💬 Start instant conversations with volunteers</li>
              <li>📅 Browse and join scheduled listening sessions</li>
              <li>🤝 Connect with trained listeners whenever you need support</li>
            </ul>
            <a href="${process.env.NEXTAUTH_URL}/dashboard" style="background: #2563EB; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; display: inline-block; margin-top: 10px;">
              Go to Dashboard →
            </a>
          </div>
        `}
        
        <p>Thank you for joining our community. Together, we're creating a safe space for meaningful conversations.</p>
        
        <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 30px 0;">
        <p style="color: #6B7280; font-size: 14px;">
          If you need help getting started, visit our <a href="${process.env.NEXTAUTH_URL}/faq">FAQ page</a> or contact support.
        </p>
      </div>
    `;

    await sql`
      INSERT INTO email_notifications (
        user_id, email, subject, body, template_type, scheduled_for
      ) VALUES (
        ${userId},
        ${user.email},
        'Welcome to ListeningRoom - Account Activated!',
        ${welcomeEmailBody},
        'welcome',
        NOW()
      )
    `;

    return Response.json({
      message: "Account activated successfully!",
      userType: profile.length > 0 ? profile[0].user_type : 'seeker',
      redirectUrl: profile.length > 0 && profile[0].user_type === 'volunteer' 
        ? '/training' 
        : '/dashboard'
    });

  } catch (error) {
    console.error("Activation error:", error);
    return Response.json(
      { error: "An error occurred during activation" },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  const url = new URL(request.url);
  const token = url.searchParams.get("token");

  if (!token) {
    return Response.json(
      { error: "Activation token is required" },
      { status: 400 }
    );
  }

  try {
    // Check if token is valid
    const user = await sql`
      SELECT id, email, name, email_verified, activation_token_expires
      FROM auth_users 
      WHERE activation_token = ${token}
    `;

    if (user.length === 0) {
      return Response.json(
        { error: "Invalid activation token" },
        { status: 400 }
      );
    }

    const userData = user[0];

    if (userData.email_verified) {
      return Response.json({
        alreadyActivated: true,
        message: "This account is already activated"
      });
    }

    if (new Date(userData.activation_token_expires) < new Date()) {
      return Response.json(
        { error: "Activation token has expired" },
        { status: 400 }
      );
    }

    return Response.json({
      valid: true,
      email: userData.email,
      name: userData.name
    });

  } catch (error) {
    console.error("Token validation error:", error);
    return Response.json(
      { error: "An error occurred validating the token" },
      { status: 500 }
    );
  }
}