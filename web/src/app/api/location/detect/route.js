import sql from "@/app/api/utils/sql";

export async function GET(request) {
  try {
    // Get IP from request headers (handle proxies/CDN)
    const forwarded = request.headers.get('x-forwarded-for');
    const realIP = request.headers.get('x-real-ip');
    const clientIP = forwarded ? forwarded.split(',')[0] : realIP || request.ip;

    // Try to get location from IP using a free service
    let locationData = null;
    
    try {
      const ipResponse = await fetch(`http://ip-api.com/json/${clientIP}?fields=status,message,country,countryCode,region,city,timezone,currency`);
      
      if (ipResponse.ok) {
        const ipData = await ipResponse.json();
        
        if (ipData.status === 'success') {
          locationData = {
            country_code: ipData.countryCode,
            country_name: ipData.country,
            region: ipData.region,
            city: ipData.city,
            timezone: ipData.timezone,
            currency: ipData.currency,
            detected_from: 'ip'
          };
        }
      }
    } catch (ipError) {
      console.error('IP geolocation failed:', ipError);
    }

    // Fallback: Try browser navigator information if available
    if (!locationData) {
      // Get timezone from browser
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const locale = request.headers.get('accept-language')?.split(',')[0] || 'en-US';
      
      locationData = {
        timezone,
        locale,
        detected_from: 'browser',
        country_code: null,
        country_name: null,
        region: null,
        city: null,
        currency: 'USD' // Default fallback
      };
    }

    // Get supported locations from database
    const supportedLocations = await sql`
      SELECT country_code, country_name, region, currency_code, currency_symbol, flag_emoji, languages
      FROM global_locations 
      WHERE is_active = true 
      ORDER BY region, country_name
    `;

    // Group by regions
    const locationsByRegion = supportedLocations.reduce((acc, location) => {
      if (!acc[location.region]) {
        acc[location.region] = [];
      }
      acc[location.region].push(location);
      return acc;
    }, {});

    // Get currency rates for detected currency
    const currencyRates = await sql`
      SELECT target_currency, exchange_rate, last_updated
      FROM currency_rates 
      WHERE base_currency = 'USD'
      ORDER BY target_currency
    `;

    return Response.json({
      detected_location: locationData,
      supported_locations: locationsByRegion,
      currency_rates: currencyRates.reduce((acc, rate) => {
        acc[rate.target_currency] = {
          rate: parseFloat(rate.exchange_rate),
          last_updated: rate.last_updated
        };
        return acc;
      }, {}),
      detection_method: locationData?.detected_from || 'fallback'
    });

  } catch (error) {
    console.error('Location detection error:', error);
    
    // Return fallback data
    const fallbackLocations = await sql`
      SELECT country_code, country_name, region, currency_code, currency_symbol, flag_emoji
      FROM global_locations 
      WHERE is_active = true 
      ORDER BY region, country_name
    `;

    return Response.json({
      detected_location: {
        country_code: 'US',
        country_name: 'United States',
        region: 'North America',
        currency: 'USD',
        timezone: 'America/New_York',
        detected_from: 'fallback'
      },
      supported_locations: fallbackLocations.reduce((acc, location) => {
        if (!acc[location.region]) {
          acc[location.region] = [];
        }
        acc[location.region].push(location);
        return acc;
      }, {}),
      currency_rates: { USD: { rate: 1, last_updated: new Date() } },
      detection_method: 'fallback'
    });
  }
}

export async function POST(request) {
  try {
    const { country_code, timezone, currency } = await request.json();

    // Validate the location data
    const locationInfo = await sql`
      SELECT * FROM global_locations 
      WHERE country_code = ${country_code} AND is_active = true
    `;

    if (locationInfo.length === 0) {
      return Response.json(
        { error: 'Invalid country code' },
        { status: 400 }
      );
    }

    // Get current exchange rate for the currency
    const currencyRate = await sql`
      SELECT exchange_rate, last_updated 
      FROM currency_rates 
      WHERE base_currency = 'USD' AND target_currency = ${currency}
    `;

    return Response.json({
      location: locationInfo[0],
      currency_info: {
        currency,
        rate: currencyRate.length > 0 ? parseFloat(currencyRate[0].exchange_rate) : 1,
        last_updated: currencyRate.length > 0 ? currencyRate[0].last_updated : new Date()
      },
      success: true
    });

  } catch (error) {
    console.error('Location update error:', error);
    return Response.json(
      { error: 'Failed to process location update' },
      { status: 500 }
    );
  }
}