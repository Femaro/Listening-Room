import sql from "@/app/api/utils/sql";
import { sendEmail } from "@/app/api/utils/send-email";
import { auth } from "@/auth";

export async function POST(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { session_id, urgency_level = 'normal' } = await request.json();

    if (!session_id) {
      return Response.json({ error: 'Session ID required' }, { status: 400 });
    }

    // Get session details
    const sessionData = await sql`
      SELECT 
        cs.id,
        cs.seeker_id,
        cs.status,
        cs.language,
        cs.session_type,
        cs.topic,
        cs.urgency_level,
        cs.seeker_country_code,
        cs.primary_specialization_id,
        up_seeker.country_name as seeker_country,
        up_seeker.preferred_language as seeker_language,
        vs.name as specialization_name
      FROM chat_sessions cs
      LEFT JOIN user_profiles up_seeker ON cs.seeker_id = up_seeker.user_id
      LEFT JOIN volunteer_specializations vs ON cs.primary_specialization_id = vs.id
      WHERE cs.id = ${session_id} AND cs.status = 'waiting'
    `;

    if (sessionData.length === 0) {
      return Response.json({ error: 'Session not found or not waiting' }, { status: 404 });
    }

    const sessionInfo = sessionData[0];

    // Find available volunteers based on preferences and specialization
    let volunteersQuery = sql`
      SELECT DISTINCT
        au.id,
        au.name,
        au.email,
        up.country_name,
        up.timezone,
        up.preferred_language,
        vas.is_online,
        vas.is_available,
        vsa.specialization_id,
        vsa.experience_level,
        vs.name as specialization_name
      FROM auth_users au
      JOIN user_profiles up ON au.id = up.user_id
      JOIN volunteer_availability_status vas ON au.id = vas.volunteer_id
      LEFT JOIN volunteer_specialization_assignments vsa ON au.id = vsa.volunteer_id
      LEFT JOIN volunteer_specializations vs ON vsa.specialization_id = vs.id
      WHERE up.user_type = 'volunteer'
        AND vas.is_online = true
        AND vas.is_available = true
        AND vas.current_active_sessions < vas.max_concurrent_sessions
    `;

    // Add specialization filter if specified
    if (sessionInfo.primary_specialization_id) {
      volunteersQuery = sql`${volunteersQuery}
        AND vsa.specialization_id = ${sessionInfo.primary_specialization_id}
      `;
    }

    // Add language filter
    if (sessionInfo.seeker_language) {
      volunteersQuery = sql`${volunteersQuery}
        AND (up.preferred_language = ${sessionInfo.seeker_language}
             OR ${sessionInfo.seeker_language} = ANY(up.language_preferences))
      `;
    }

    // Add location preference (same country first, then global)
    if (sessionInfo.seeker_country_code) {
      volunteersQuery = sql`${volunteersQuery}
        ORDER BY 
          CASE WHEN up.country_code = ${sessionInfo.seeker_country_code} THEN 1 ELSE 2 END,
          vsa.experience_level DESC,
          vas.last_active DESC
      `;
    } else {
      volunteersQuery = sql`${volunteersQuery}
        ORDER BY 
          vsa.experience_level DESC,
          vas.last_active DESC
      `;
    }

    volunteersQuery = sql`${volunteersQuery} LIMIT 10`;

    const volunteers = await volunteersQuery;

    if (volunteers.length === 0) {
      return Response.json({ 
        success: false, 
        message: 'No available volunteers found for this request' 
      });
    }

    // Send email notifications to volunteers
    const emailPromises = volunteers.map(async (volunteer) => {
      try {
        const emailSubject = `🔔 New Support Request - ${sessionInfo.specialization_name || 'General Support'}`;
        
        const urgencyEmoji = urgency_level === 'high' ? '🚨' : urgency_level === 'medium' ? '⚠️' : '💙';
        
        const emailBody = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #0d9488 0%, #14b8a6 100%); color: white; padding: 20px; border-radius: 10px 10px 0 0;">
              <h1 style="margin: 0; font-size: 24px;">CLAEVA INTERNATIONAL LLC</h1>
              <p style="margin: 5px 0 0 0; opacity: 0.9;">Global Mental Health Support</p>
            </div>
            
            <div style="background: #f9fafb; padding: 20px; border-radius: 0 0 10px 10px;">
              <h2 style="color: #0d9488; margin-top: 0;">${urgencyEmoji} New Support Request</h2>
              
              <div style="background: white; padding: 15px; border-radius: 8px; margin: 15px 0;">
                <h3 style="margin: 0 0 10px 0; color: #374151;">Request Details</h3>
                <p><strong>Type:</strong> ${sessionInfo.specialization_name || 'General Support'}</p>
                <p><strong>Language:</strong> ${sessionInfo.seeker_language || 'English'}</p>
                <p><strong>Location:</strong> ${sessionInfo.seeker_country || 'Global'}</p>
                <p><strong>Urgency:</strong> ${urgency_level.toUpperCase()}</p>
                ${sessionInfo.topic ? `<p><strong>Topic:</strong> ${sessionInfo.topic}</p>` : ''}
                <p><strong>Session Type:</strong> ${sessionInfo.session_type === 'one_on_one' ? 'One-on-One' : 'Group Session'}</p>
              </div>

              <div style="background: #ecfdf5; padding: 15px; border-radius: 8px; border-left: 4px solid #10b981;">
                <h4 style="margin: 0 0 10px 0; color: #059669;">Why You're Selected</h4>
                <p style="margin: 0; color: #047857;">
                  ✓ ${volunteer.specialization_name ? `Specialized in ${volunteer.specialization_name}` : 'General availability'}<br>
                  ✓ ${volunteer.experience_level ? `${volunteer.experience_level.charAt(0).toUpperCase() + volunteer.experience_level.slice(1)} level experience` : 'Experienced volunteer'}<br>
                  ✓ Language match: ${volunteer.preferred_language || 'English'}<br>
                  ${volunteer.country_name === sessionInfo.seeker_country ? '✓ Same country location' : '✓ Global volunteer'}
                </p>
              </div>

              <div style="text-align: center; margin: 25px 0;">
                <a href="${process.env.NEXTAUTH_URL}/volunteer/dashboard" 
                   style="background: #0d9488; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                  View Dashboard & Accept
                </a>
              </div>

              <div style="background: #fef3c7; padding: 15px; border-radius: 8px; border-left: 4px solid #f59e0b;">
                <h4 style="margin: 0 0 10px 0; color: #d97706;">Quick Response Needed</h4>
                <p style="margin: 0; color: #92400e; font-size: 14px;">
                  Someone is waiting for support. Please log into your dashboard to accept or decline this request within the next 5 minutes.
                </p>
              </div>

              <div style="margin: 20px 0; text-align: center; color: #6b7280; font-size: 12px;">
                <p>This is an automated notification from CLAEVA INTERNATIONAL LLC</p>
                <p>If you're not available, you can update your status in your volunteer dashboard</p>
                <p style="margin: 10px 0;">
                  <a href="${process.env.NEXTAUTH_URL}/volunteer/dashboard" style="color: #0d9488;">Volunteer Dashboard</a> | 
                  <a href="mailto:support@securedlisteningroom.com" style="color: #0d9488;">Contact Support</a>
                </p>
              </div>
            </div>
          </div>
        `;

        return await sendEmail({
          to: volunteer.email,
          subject: emailSubject,
          html: emailBody,
          priority: urgency_level === 'high' ? 'high' : 'normal'
        });

      } catch (emailError) {
        console.error(`Failed to send email to volunteer ${volunteer.id}:`, emailError);
        return { success: false, volunteer: volunteer.id, error: emailError.message };
      }
    });

    const emailResults = await Promise.allSettled(emailPromises);
    
    const successful = emailResults.filter(result => result.status === 'fulfilled' && result.value.success).length;
    const failed = emailResults.length - successful;

    // Log notification activity
    await sql`
      INSERT INTO admin_notifications (
        type,
        data,
        status
      ) VALUES (
        'volunteer_notification',
        ${JSON.stringify({
          session_id: session_id,
          urgency_level: urgency_level,
          volunteers_notified: volunteers.length,
          emails_sent: successful,
          emails_failed: failed,
          specialization: sessionInfo.specialization_name,
          seeker_country: sessionInfo.seeker_country
        })},
        ${successful > 0 ? 'sent' : 'failed'}
      )
    `;

    return Response.json({
      success: successful > 0,
      volunteers_notified: volunteers.length,
      emails_sent: successful,
      emails_failed: failed,
      session_details: {
        id: sessionInfo.id,
        specialization: sessionInfo.specialization_name,
        urgency: urgency_level,
        language: sessionInfo.seeker_language,
        country: sessionInfo.seeker_country
      }
    });

  } catch (error) {
    console.error('Error sending volunteer notifications:', error);
    
    // Log error notification
    try {
      await sql`
        INSERT INTO admin_notifications (
          type,
          data,
          status,
          error_message
        ) VALUES (
          'volunteer_notification_error',
          ${JSON.stringify({ session_id: request.session_id, error: error.message })},
          'failed',
          ${error.message}
        )
      `;
    } catch (logError) {
      console.error('Failed to log notification error:', logError);
    }

    return Response.json(
      { error: 'Failed to send volunteer notifications', details: error.message },
      { status: 500 }
    );
  }
}

// Get notification history
export async function GET(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: 'Authentication required' }, { status: 401 });
    }

    const url = new URL(request.url);
    const type = url.searchParams.get('type');
    const limit = parseInt(url.searchParams.get('limit')) || 50;

    let query = sql`
      SELECT 
        an.id,
        an.type,
        an.data,
        an.sent_at,
        an.status,
        an.error_message,
        an.created_at
      FROM admin_notifications an
      WHERE an.type LIKE 'volunteer_%'
    `;

    if (type) {
      query = sql`${query} AND an.type = ${type}`;
    }

    query = sql`${query} 
      ORDER BY an.created_at DESC 
      LIMIT ${limit}
    `;

    const notifications = await query;

    return Response.json({
      notifications: notifications,
      total: notifications.length
    });

  } catch (error) {
    console.error('Error fetching notification history:', error);
    return Response.json(
      { error: 'Failed to fetch notifications' },
      { status: 500 }
    );
  }
}