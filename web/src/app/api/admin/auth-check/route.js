import { auth } from "@/auth";
import sql from "@/app/api/utils/sql";

// List of CLAEVA INTERNATIONAL LLC admin email addresses
const ADMIN_EMAILS = [
  'admin@cleavainternational.com',
  'support@securedlisteningroom.com',
  'joshua.nwamuoh@cleavainternational.com',
  'ceo@cleavainternational.com',
  'ops@cleavainternational.com'
];

export async function GET(request) {
  try {
    const session = await auth();
    
    if (!session?.user?.email) {
      return Response.json({ isAdmin: false, reason: 'Not authenticated' });
    }

    // Check if user email is in admin list
    const isEmailAdmin = ADMIN_EMAILS.includes(session.user.email.toLowerCase());
    
    if (!isEmailAdmin) {
      return Response.json({ 
        isAdmin: false, 
        reason: 'Email not in admin list',
        userEmail: session.user.email 
      });
    }

    // Additional check: verify user profile has admin role in database
    try {
      const userProfile = await sql`
        SELECT user_type, is_active 
        FROM user_profiles 
        WHERE user_id = ${session.user.id}
      `;

      if (userProfile.length === 0) {
        // Create admin profile if it doesn't exist for admin email
        await sql`
          INSERT INTO user_profiles (
            user_id, 
            user_type, 
            preferred_language,
            is_active
          ) VALUES (
            ${session.user.id}, 
            'admin', 
            'en',
            true
          )
        `;
      } else if (userProfile[0].user_type !== 'admin') {
        // Update existing profile to admin if they're in admin email list
        await sql`
          UPDATE user_profiles 
          SET user_type = 'admin', is_active = true
          WHERE user_id = ${session.user.id}
        `;
      }

      return Response.json({ 
        isAdmin: true, 
        userEmail: session.user.email,
        userId: session.user.id,
        permissions: ['view_analytics', 'manage_reports', 'manage_users', 'system_admin']
      });

    } catch (dbError) {
      console.error('Database error during admin check:', dbError);
      
      // If DB is down but email is admin, still grant access
      return Response.json({ 
        isAdmin: true, 
        userEmail: session.user.email,
        userId: session.user.id,
        permissions: ['view_analytics', 'manage_reports'],
        warning: 'Limited access due to database issue'
      });
    }

  } catch (error) {
    console.error('Admin auth check error:', error);
    return Response.json({ 
      isAdmin: false, 
      error: 'Authentication check failed' 
    }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await auth();
    
    if (!session?.user?.email || !ADMIN_EMAILS.includes(session.user.email.toLowerCase())) {
      return Response.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { action, targetUserId, newRole } = await request.json();

    switch (action) {
      case 'grant_admin':
        // Grant admin access to another user
        await sql`
          UPDATE user_profiles 
          SET user_type = 'admin' 
          WHERE user_id = ${targetUserId}
        `;

        // Log admin action
        await sql`
          INSERT INTO admin_notifications (
            type, 
            data
          ) VALUES (
            'admin_access_granted',
            ${JSON.stringify({
              granted_by: session.user.id,
              granted_to: targetUserId,
              timestamp: new Date().toISOString()
            })}
          )
        `;

        return Response.json({ 
          success: true, 
          message: 'Admin access granted' 
        });

      case 'revoke_admin':
        // Revoke admin access
        await sql`
          UPDATE user_profiles 
          SET user_type = 'volunteer' 
          WHERE user_id = ${targetUserId}
        `;

        // Log admin action
        await sql`
          INSERT INTO admin_notifications (
            type, 
            data
          ) VALUES (
            'admin_access_revoked',
            ${JSON.stringify({
              revoked_by: session.user.id,
              revoked_from: targetUserId,
              timestamp: new Date().toISOString()
            })}
          )
        `;

        return Response.json({ 
          success: true, 
          message: 'Admin access revoked' 
        });

      default:
        return Response.json({ error: 'Invalid action' }, { status: 400 });
    }

  } catch (error) {
    console.error('Admin action error:', error);
    return Response.json({ 
      error: 'Failed to perform admin action' 
    }, { status: 500 });
  }
}