import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

export async function GET(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Get user's current preferences
    const preferences = await sql`
      SELECT 
        sp.preferred_specializations,
        sp.preferred_languages,
        sp.preferred_volunteer_gender,
        sp.preferred_volunteer_age_range,
        sp.emergency_contact_info,
        sp.crisis_keywords,
        sp.created_at,
        sp.updated_at
      FROM seeker_preferences sp
      WHERE sp.seeker_id = ${session.user.id}
    `;

    // Get available specializations for selection
    const availableSpecializations = await sql`
      SELECT 
        vs.id,
        vs.name,
        vs.description,
        vs.category_type,
        vs.icon_name,
        COUNT(vsa.volunteer_id) as available_volunteers
      FROM volunteer_specializations vs
      LEFT JOIN volunteer_specialization_assignments vsa ON vs.id = vsa.specialization_id
      WHERE vs.is_active = true
      GROUP BY vs.id, vs.name, vs.description, vs.category_type, vs.icon_name
      ORDER BY vs.category_type, vs.name
    `;

    const currentPrefs = preferences.length > 0 ? preferences[0] : {
      preferred_specializations: [],
      preferred_languages: ['en'],
      preferred_volunteer_gender: 'any',
      preferred_volunteer_age_range: 'any',
      emergency_contact_info: null,
      crisis_keywords: []
    };

    // Group specializations by category for easier selection
    const categorizedSpecializations = availableSpecializations.reduce((acc, spec) => {
      if (!acc[spec.category_type]) {
        acc[spec.category_type] = [];
      }
      acc[spec.category_type].push({
        id: spec.id,
        name: spec.name,
        description: spec.description,
        icon_name: spec.icon_name,
        available_volunteers: parseInt(spec.available_volunteers),
        is_preferred: currentPrefs.preferred_specializations?.includes(spec.id) || false
      });
      return acc;
    }, {});

    return Response.json({
      current_preferences: currentPrefs,
      available_specializations: availableSpecializations.map(spec => ({
        id: spec.id,
        name: spec.name,
        description: spec.description,
        category_type: spec.category_type,
        icon_name: spec.icon_name,
        available_volunteers: parseInt(spec.available_volunteers)
      })),
      categorized_specializations: categorizedSpecializations,
      has_preferences: preferences.length > 0
    });

  } catch (error) {
    console.error('Error fetching seeker preferences:', error);
    return Response.json(
      { error: 'Failed to fetch preferences' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: 'Authentication required' }, { status: 401 });
    }

    const {
      preferred_specializations = [],
      preferred_languages = ['en'],
      preferred_volunteer_gender = 'any',
      preferred_volunteer_age_range = 'any',
      emergency_contact_info = null,
      crisis_keywords = []
    } = await request.json();

    // Verify user is a seeker or create seeker profile if needed
    const userProfile = await sql`
      SELECT user_type FROM user_profiles 
      WHERE user_id = ${session.user.id}
    `;

    if (userProfile.length === 0) {
      // Create seeker profile if it doesn't exist
      await sql`
        INSERT INTO user_profiles (user_id, user_type, preferred_language)
        VALUES (${session.user.id}, 'seeker', ${preferred_languages[0] || 'en'})
      `;
    }

    // Upsert seeker preferences
    await sql`
      INSERT INTO seeker_preferences (
        seeker_id,
        preferred_specializations,
        preferred_languages,
        preferred_volunteer_gender,
        preferred_volunteer_age_range,
        emergency_contact_info,
        crisis_keywords,
        updated_at
      ) VALUES (
        ${session.user.id},
        ${preferred_specializations},
        ${preferred_languages},
        ${preferred_volunteer_gender},
        ${preferred_volunteer_age_range},
        ${emergency_contact_info ? JSON.stringify(emergency_contact_info) : null},
        ${crisis_keywords},
        NOW()
      )
      ON CONFLICT (seeker_id)
      DO UPDATE SET
        preferred_specializations = EXCLUDED.preferred_specializations,
        preferred_languages = EXCLUDED.preferred_languages,
        preferred_volunteer_gender = EXCLUDED.preferred_volunteer_gender,
        preferred_volunteer_age_range = EXCLUDED.preferred_volunteer_age_range,
        emergency_contact_info = EXCLUDED.emergency_contact_info,
        crisis_keywords = EXCLUDED.crisis_keywords,
        updated_at = EXCLUDED.updated_at
    `;

    // Update user profile with language preference
    await sql`
      UPDATE user_profiles 
      SET preferred_language = ${preferred_languages[0] || 'en'},
          language_preferences = ${preferred_languages},
          updated_at = NOW()
      WHERE user_id = ${session.user.id}
    `;

    // Get updated preferences to return
    const updatedPreferences = await sql`
      SELECT 
        sp.preferred_specializations,
        sp.preferred_languages,
        sp.preferred_volunteer_gender,
        sp.preferred_volunteer_age_range,
        sp.emergency_contact_info,
        sp.crisis_keywords,
        sp.updated_at
      FROM seeker_preferences sp
      WHERE sp.seeker_id = ${session.user.id}
    `;

    // Get names of preferred specializations for display
    let preferredSpecializationNames = [];
    if (preferred_specializations.length > 0) {
      const specNames = await sql`
        SELECT name FROM volunteer_specializations 
        WHERE id = ANY(${preferred_specializations})
      `;
      preferredSpecializationNames = specNames.map(spec => spec.name);
    }

    return Response.json({
      success: true,
      message: 'Preferences updated successfully',
      preferences: updatedPreferences[0],
      preferred_specialization_names: preferredSpecializationNames
    });

  } catch (error) {
    console.error('Error updating seeker preferences:', error);
    return Response.json(
      { error: 'Failed to update preferences' },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Delete seeker preferences
    await sql`
      DELETE FROM seeker_preferences 
      WHERE seeker_id = ${session.user.id}
    `;

    return Response.json({
      success: true,
      message: 'Preferences deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting seeker preferences:', error);
    return Response.json(
      { error: 'Failed to delete preferences' },
      { status: 500 }
    );
  }
}