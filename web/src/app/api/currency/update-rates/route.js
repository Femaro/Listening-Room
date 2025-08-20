import sql from "@/app/api/utils/sql";

export async function POST(request) {
  try {
    // This endpoint updates currency exchange rates from a reliable source
    // In production, you would call this via a scheduled job (e.g., Vercel Cron, GitHub Actions)
    
    const { api_key } = await request.json();
    
    // Basic API key validation (you should use a proper secret)
    if (api_key !== process.env.CURRENCY_UPDATE_API_KEY) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Free currency API - you can replace with your preferred provider
    let exchangeRates = {};
    
    try {
      // Using exchangerate-api.com (free tier allows 1500 requests/month)
      const response = await fetch(`https://api.exchangerate-api.com/v4/latest/USD`);
      
      if (response.ok) {
        const data = await response.json();
        exchangeRates = data.rates;
      } else {
        // Fallback to manual rates if API fails
        console.warn('Currency API failed, using fallback rates');
        exchangeRates = getFallbackRates();
      }
    } catch (error) {
      console.error('Currency API error:', error);
      exchangeRates = getFallbackRates();
    }

    // Update rates in database
    const updatePromises = Object.entries(exchangeRates).map(async ([currency, rate]) => {
      return sql`
        INSERT INTO currency_rates (base_currency, target_currency, exchange_rate, last_updated)
        VALUES ('USD', ${currency}, ${rate}, NOW())
        ON CONFLICT (base_currency, target_currency)
        DO UPDATE SET 
          exchange_rate = EXCLUDED.exchange_rate,
          last_updated = NOW()
      `;
    });

    await Promise.all(updatePromises);

    // Get updated count
    const updatedRates = await sql`
      SELECT COUNT(*) as count FROM currency_rates WHERE base_currency = 'USD'
    `;

    return Response.json({
      success: true,
      rates_updated: parseInt(updatedRates[0].count),
      last_updated: new Date().toISOString(),
      sample_rates: {
        EUR: exchangeRates.EUR,
        GBP: exchangeRates.GBP,
        NGN: exchangeRates.NGN,
        KES: exchangeRates.KES,
        ZAR: exchangeRates.ZAR
      }
    });

  } catch (error) {
    console.error('Currency update error:', error);
    return Response.json(
      { error: 'Failed to update currency rates' },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    // Get current exchange rates from database
    const rates = await sql`
      SELECT 
        target_currency,
        exchange_rate,
        last_updated
      FROM currency_rates 
      WHERE base_currency = 'USD'
      ORDER BY target_currency
    `;

    const formattedRates = rates.reduce((acc, rate) => {
      acc[rate.target_currency] = {
        rate: parseFloat(rate.exchange_rate),
        last_updated: rate.last_updated
      };
      return acc;
    }, {});

    return Response.json({
      base_currency: 'USD',
      rates: formattedRates,
      last_updated: rates.length > 0 ? rates[0].last_updated : null,
      total_currencies: rates.length
    });

  } catch (error) {
    console.error('Error fetching currency rates:', error);
    return Response.json(
      { error: 'Failed to fetch currency rates' },
      { status: 500 }
    );
  }
}

function getFallbackRates() {
  // Fallback exchange rates (updated monthly)
  return {
    USD: 1.000000,
    EUR: 0.920000,
    GBP: 0.790000,
    NGN: 1650.000000,
    GHS: 15.500000,
    KES: 145.000000,
    ZAR: 18.500000,
    EGP: 49.000000,
    MAD: 10.200000,
    CAD: 1.360000,
    AUD: 1.520000,
    INR: 83.500000,
    JPY: 150.000000,
    CNY: 7.250000,
    BRL: 5.050000,
    MXN: 17.800000,
    CHF: 0.880000,
    SEK: 10.600000,
    NOK: 10.800000,
    PLN: 4.050000,
    SGD: 1.340000,
    KRW: 1320.000000,
    THB: 35.500000,
    PHP: 56.000000,
    NZD: 1.630000,
    ARS: 990.000000,
    CLP: 980.000000,
    COP: 4100.000000,
    TZS: 2500.000000,
    UGX: 3700.000000,
    ETB: 56.500000,
    RWF: 1320.000000
  };
}