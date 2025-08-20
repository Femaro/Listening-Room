import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

export async function POST(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { 
      seeker_country_code, 
      preferred_volunteer_countries = [], 
      language_preferences = ['en'],
      volunteer_radius_km = 0, // 0 means global
      session_type = 'one_on_one' 
    } = await request.json();

    // Get seeker's profile for additional preferences
    const seekerProfile = await sql`
      SELECT * FROM user_profiles 
      WHERE user_id = ${session.user.id} AND user_type = 'seeker'
    `;

    if (seekerProfile.length === 0) {
      return Response.json({ error: 'Seeker profile not found' }, { status: 404 });
    }

    // Update seeker's location if provided
    if (seeker_country_code) {
      await sql`
        UPDATE user_profiles 
        SET country_code = ${seeker_country_code},
            preferred_volunteer_countries = ${preferred_volunteer_countries},
            volunteer_radius_km = ${volunteer_radius_km},
            language_preferences = ${language_preferences},
            updated_at = NOW()
        WHERE user_id = ${session.user.id}
      `;
    }

    // Build volunteer matching query based on location preferences
    let volunteerQuery;
    
    if (volunteer_radius_km === 0 || preferred_volunteer_countries.length === 0) {
      // Global matching - any available volunteer
      volunteerQuery = sql`
        SELECT DISTINCT 
          vas.volunteer_id,
          vas.is_online,
          vas.is_available,
          vas.current_active_sessions,
          vas.max_concurrent_sessions,
          vas.country_code as volunteer_country,
          up.username,
          up.preferred_language,
          up.language_preferences,
          gl.country_name,
          gl.flag_emoji,
          gl.timezone_examples
        FROM volunteer_availability_status vas
        JOIN user_profiles up ON vas.volunteer_id = up.user_id
        LEFT JOIN global_locations gl ON vas.country_code = gl.country_code
        WHERE vas.is_online = true 
          AND vas.is_available = true
          AND vas.current_active_sessions < vas.max_concurrent_sessions
          AND up.user_type = 'volunteer'
          AND up.is_active = true
        ORDER BY 
          CASE WHEN vas.country_code = ${seeker_country_code} THEN 0 ELSE 1 END,
          vas.current_active_sessions ASC,
          RANDOM()
        LIMIT 10
      `;
    } else {
      // Location-specific matching
      volunteerQuery = sql`
        SELECT DISTINCT 
          vas.volunteer_id,
          vas.is_online,
          vas.is_available,
          vas.current_active_sessions,
          vas.max_concurrent_sessions,
          vas.country_code as volunteer_country,
          up.username,
          up.preferred_language,
          up.language_preferences,
          gl.country_name,
          gl.flag_emoji,
          gl.timezone_examples
        FROM volunteer_availability_status vas
        JOIN user_profiles up ON vas.volunteer_id = up.user_id
        LEFT JOIN global_locations gl ON vas.country_code = gl.country_code
        WHERE vas.is_online = true 
          AND vas.is_available = true
          AND vas.current_active_sessions < vas.max_concurrent_sessions
          AND up.user_type = 'volunteer'
          AND up.is_active = true
          AND (
            vas.serves_global = true
            OR vas.country_code = ANY(${preferred_volunteer_countries})
            OR vas.country_code = ${seeker_country_code}
            OR ${preferred_volunteer_countries}::text[] && vas.preferred_regions
          )
        ORDER BY 
          CASE WHEN vas.country_code = ${seeker_country_code} THEN 0 ELSE 1 END,
          CASE WHEN vas.country_code = ANY(${preferred_volunteer_countries}) THEN 0 ELSE 1 END,
          vas.current_active_sessions ASC,
          RANDOM()
        LIMIT 10
      `;
    }

    const availableVolunteers = await volunteerQuery;

    // Filter by language preferences if specified
    const languageFilteredVolunteers = availableVolunteers.filter(volunteer => {
      if (language_preferences.length === 0) return true;
      
      const volunteerLanguages = volunteer.language_preferences || ['en'];
      return language_preferences.some(lang => volunteerLanguages.includes(lang));
    });

    // Get optimal volunteer (prefer same country, then region, then global)
    const optimalVolunteer = languageFilteredVolunteers.length > 0 
      ? languageFilteredVolunteers[0] 
      : availableVolunteers[0];

    if (!optimalVolunteer) {
      return Response.json({
        matched_volunteer: null,
        available_volunteers: [],
        message: 'No volunteers currently available. Please try again in a few moments.',
        retry_suggestions: [
          'Try expanding your location preferences to global',
          'Consider including more language options',
          'Check back in 5-10 minutes when more volunteers may be online'
        ]
      });
    }

    // Get currency information for the seeker's location
    const currencyInfo = await sql`
      SELECT gl.currency_code, gl.currency_symbol, cr.exchange_rate
      FROM global_locations gl
      LEFT JOIN currency_rates cr ON gl.currency_code = cr.target_currency AND cr.base_currency = 'USD'
      WHERE gl.country_code = ${seeker_country_code}
    `;

    const sessionCurrency = currencyInfo.length > 0 ? currencyInfo[0] : {
      currency_code: 'USD',
      currency_symbol: '$',
      exchange_rate: 1.0
    };

    // Create the chat session with location and currency info
    const newSession = await sql`
      INSERT INTO chat_sessions (
        seeker_id, 
        volunteer_id, 
        status, 
        language,
        session_type,
        seeker_country_code,
        volunteer_country_code,
        session_currency,
        local_currency_rate
      ) VALUES (
        ${session.user.id},
        ${optimalVolunteer.volunteer_id},
        'waiting',
        ${language_preferences[0] || 'en'},
        ${session_type},
        ${seeker_country_code},
        ${optimalVolunteer.volunteer_country},
        ${sessionCurrency.currency_code},
        ${parseFloat(sessionCurrency.exchange_rate) || 1.0}
      )
      RETURNING id, created_at
    `;

    // Update volunteer's active session count
    await sql`
      UPDATE volunteer_availability_status 
      SET current_active_sessions = current_active_sessions + 1,
          last_active = NOW(),
          updated_at = NOW()
      WHERE volunteer_id = ${optimalVolunteer.volunteer_id}
    `;

    // Add session participants
    await sql.transaction([
      sql`INSERT INTO session_participants (session_id, user_id, role) VALUES (${newSession[0].id}, ${session.user.id}, 'seeker')`,
      sql`INSERT INTO session_participants (session_id, user_id, role) VALUES (${newSession[0].id}, ${optimalVolunteer.volunteer_id}, 'volunteer')`
    ]);

    return Response.json({
      session_id: newSession[0].id,
      matched_volunteer: {
        id: optimalVolunteer.volunteer_id,
        username: optimalVolunteer.username || 'Anonymous Volunteer',
        country: optimalVolunteer.country_name,
        country_code: optimalVolunteer.volunteer_country,
        flag_emoji: optimalVolunteer.flag_emoji,
        languages: optimalVolunteer.language_preferences || ['en'],
        timezone_examples: optimalVolunteer.timezone_examples
      },
      session_details: {
        currency: sessionCurrency.currency_code,
        currency_symbol: sessionCurrency.currency_symbol,
        exchange_rate: parseFloat(sessionCurrency.exchange_rate) || 1.0,
        session_type,
        language: language_preferences[0] || 'en'
      },
      matching_criteria: {
        preferred_countries: preferred_volunteer_countries,
        language_preferences,
        volunteer_radius_km,
        matched_by: optimalVolunteer.volunteer_country === seeker_country_code ? 'same_country' : 
                   preferred_volunteer_countries.includes(optimalVolunteer.volunteer_country) ? 'preferred_country' : 'global'
      },
      available_alternatives: languageFilteredVolunteers.slice(1, 6).map(v => ({
        country: v.country_name,
        flag_emoji: v.flag_emoji,
        languages: v.language_preferences
      }))
    });

  } catch (error) {
    console.error('Volunteer matching error:', error);
    return Response.json(
      { error: 'Failed to match volunteer', details: error.message },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const country_code = url.searchParams.get('country_code');
    const language = url.searchParams.get('language') || 'en';

    // Get volunteer statistics by region
    const volunteerStats = await sql`
      SELECT 
        gl.region,
        gl.country_code,
        gl.country_name,
        gl.flag_emoji,
        COUNT(CASE WHEN vas.is_online = true THEN 1 END) as online_volunteers,
        COUNT(CASE WHEN vas.is_available = true THEN 1 END) as available_volunteers,
        COUNT(*) as total_volunteers
      FROM global_locations gl
      LEFT JOIN volunteer_availability_status vas ON gl.country_code = vas.country_code
      LEFT JOIN user_profiles up ON vas.volunteer_id = up.user_id AND up.user_type = 'volunteer'
      WHERE gl.is_active = true
      GROUP BY gl.region, gl.country_code, gl.country_name, gl.flag_emoji
      ORDER BY gl.region, available_volunteers DESC, gl.country_name
    `;

    // Group by regions
    const statsByRegion = volunteerStats.reduce((acc, stat) => {
      if (!acc[stat.region]) {
        acc[stat.region] = [];
      }
      acc[stat.region].push({
        country_code: stat.country_code,
        country_name: stat.country_name,
        flag_emoji: stat.flag_emoji,
        online_volunteers: parseInt(stat.online_volunteers),
        available_volunteers: parseInt(stat.available_volunteers),
        total_volunteers: parseInt(stat.total_volunteers)
      });
      return acc;
    }, {});

    // Get recommended countries based on current availability
    const recommendedCountries = await sql`
      SELECT 
        gl.country_code,
        gl.country_name,
        gl.flag_emoji,
        gl.region,
        COUNT(CASE WHEN vas.is_available = true THEN 1 END) as available_volunteers
      FROM global_locations gl
      LEFT JOIN volunteer_availability_status vas ON gl.country_code = vas.country_code
      WHERE gl.is_active = true
      GROUP BY gl.country_code, gl.country_name, gl.flag_emoji, gl.region
      HAVING COUNT(CASE WHEN vas.is_available = true THEN 1 END) > 0
      ORDER BY available_volunteers DESC, gl.country_name
      LIMIT 10
    `;

    return Response.json({
      volunteer_stats_by_region: statsByRegion,
      recommended_countries: recommendedCountries.map(country => ({
        country_code: country.country_code,
        country_name: country.country_name,
        flag_emoji: country.flag_emoji,
        region: country.region,
        available_volunteers: parseInt(country.available_volunteers)
      })),
      total_global_volunteers: volunteerStats.reduce((sum, stat) => sum + parseInt(stat.total_volunteers), 0),
      total_available_now: volunteerStats.reduce((sum, stat) => sum + parseInt(stat.available_volunteers), 0),
      suggested_language: language
    });

  } catch (error) {
    console.error('Volunteer stats error:', error);
    return Response.json(
      { error: 'Failed to get volunteer statistics' },
      { status: 500 }
    );
  }
}