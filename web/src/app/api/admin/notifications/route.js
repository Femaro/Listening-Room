import sql from "@/app/api/utils/sql";
import { sendEmail } from "@/app/api/utils/send-email";
import { auth } from "@/auth";

const ADMIN_EMAIL = "joshuanwamuoh@gmail.com";

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

    // Get all notifications
    const notifications = await sql`
      SELECT * FROM admin_notifications 
      ORDER BY sent_at DESC 
      LIMIT 50
    `;

    return Response.json({
      notifications: notifications,
      total: notifications.length,
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return Response.json(
      { error: "Failed to fetch notifications" },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  try {
    const { type, data } = await request.json();

    let subject = "";
    let html = "";
    let text = "";

    switch (type) {
      case "new_signup":
        subject = "🎉 New User Signed Up - ListeningRoom";
        html = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2563eb;">New User Registration</h2>
            <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Email:</strong> ${data.email}</p>
              <p><strong>User Type:</strong> ${data.userType || "Not specified"}</p>
              <p><strong>Registration Time:</strong> ${new Date().toLocaleString()}</p>
            </div>
            <p>A new user has joined your ListeningRoom platform. You can view their profile and activity in the admin dashboard.</p>
            <a href="${process.env.NEXTAUTH_URL}/admin/analytics" 
               style="background: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
              View Admin Dashboard
            </a>
          </div>
        `;
        text = `New user signed up: ${data.email} as ${data.userType || "unspecified type"} at ${new Date().toLocaleString()}`;
        break;

      case "new_session":
        subject = "💬 New Chat Session Started - ListeningRoom";
        html = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2563eb;">New Chat Session</h2>
            <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Session Type:</strong> ${data.sessionType}</p>
              <p><strong>Language:</strong> ${data.language}</p>
              <p><strong>Topic:</strong> ${data.topic || "General support"}</p>
              <p><strong>Started:</strong> ${new Date().toLocaleString()}</p>
            </div>
            <p>A new chat session has been initiated on your platform.</p>
          </div>
        `;
        text = `New ${data.sessionType} session started in ${data.language} at ${new Date().toLocaleString()}`;
        break;

      case "volunteer_application":
        subject = "👥 New Volunteer Application - ListeningRoom";
        html = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2563eb;">New Volunteer Application</h2>
            <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Applicant Email:</strong> ${data.email}</p>
              <p><strong>Experience:</strong> ${data.experience ? data.experience.substring(0, 100) + "..." : "Not provided"}</p>
              <p><strong>Applied:</strong> ${new Date().toLocaleString()}</p>
            </div>
            <p>A new volunteer application requires review.</p>
            <a href="${process.env.NEXTAUTH_URL}/admin/volunteers" 
               style="background: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Review Application
            </a>
          </div>
        `;
        text = `New volunteer application from ${data.email} at ${new Date().toLocaleString()}`;
        break;

      case "session_feedback":
        subject = "⭐ New Session Feedback - ListeningRoom";
        html = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2563eb;">Session Feedback Received</h2>
            <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Rating:</strong> ${"⭐".repeat(data.rating)} (${data.rating}/5)</p>
              <p><strong>Helpful:</strong> ${data.wasHelpful ? "✅ Yes" : "❌ No"}</p>
              <p><strong>Feedback:</strong> ${data.feedbackText || "No additional feedback"}</p>
              <p><strong>Received:</strong> ${new Date().toLocaleString()}</p>
            </div>
            <p>New feedback has been submitted for a completed session.</p>
          </div>
        `;
        text = `New session feedback: ${data.rating}/5 stars, helpful: ${data.wasHelpful ? "Yes" : "No"}`;
        break;

      default:
        return Response.json(
          { error: "Invalid notification type" },
          { status: 400 },
        );
    }

    // Try to send email
    try {
      await sendEmail({
        to: ADMIN_EMAIL,
        from: "notifications@resend.dev", // Will be updated when custom domain is set up
        subject,
        html,
        text,
      });

      // Log notification in database for tracking
      await sql`
        INSERT INTO admin_notifications (type, data, sent_at, status) 
        VALUES (${type}, ${JSON.stringify(data)}, now(), 'sent')
      `;

      return Response.json({
        success: true,
        message: "Notification sent successfully",
      });
    } catch (emailError) {
      console.error("Failed to send notification email:", emailError);

      // Log failed attempt
      await sql`
        INSERT INTO admin_notifications (type, data, sent_at, status, error_message) 
        VALUES (${type}, ${JSON.stringify(data)}, now(), 'failed', ${emailError.message})
      `;

      // Don't fail the request if email fails - log it but continue
      return Response.json({
        success: false,
        message:
          "Email notification failed. Please check your Resend API key configuration.",
        error: emailError.message,
      });
    }
  } catch (error) {
    console.error("Notification error:", error);
    return Response.json(
      { error: "Failed to process notification" },
      { status: 500 },
    );
  }
}
