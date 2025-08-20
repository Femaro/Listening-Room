export async function POST(request) {
  try {
    const { donationId, amount, currency, donorEmail, donorName, message } = await request.json();

    if (!donationId || !amount || !currency || !donorEmail) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeSecretKey) {
      console.error("Stripe secret key not configured");
      return Response.json(
        { error: "Payment system not configured" },
        { status: 500 }
      );
    }

    // Initialize Stripe (manually since we can't import packages)
    const stripeUrl = 'https://api.stripe.com/v1/checkout/sessions';
    
    const params = new URLSearchParams({
      'payment_method_types[0]': 'card',
      'line_items[0][quantity]': '1',
      'line_items[0][price_data][currency]': currency.toLowerCase(),
      'line_items[0][price_data][product_data][name]': 'Donation to ListeningRoom',
      'line_items[0][price_data][product_data][description]': message ? `Donation: ${message.substring(0, 100)}` : 'Support global mental health conversations',
      'line_items[0][price_data][unit_amount]': amount.toString(),
      mode: 'payment',
      success_url: `${request.headers.get('origin')}/donate/success?session_id={CHECKOUT_SESSION_ID}&donation_id=${donationId}`,
      cancel_url: `${request.headers.get('origin')}/donate?cancelled=true`,
      customer_email: donorEmail,
      'metadata[donation_id]': donationId.toString(),
      'metadata[donor_name]': donorName || 'Anonymous',
      'allow_promotion_codes': 'true'
    });

    const response = await fetch(stripeUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${stripeSecretKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString()
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Stripe API error:', errorText);
      return Response.json(
        { error: 'Failed to create checkout session' },
        { status: 500 }
      );
    }

    const session = await response.json();

    return Response.json({ 
      sessionId: session.id,
      url: session.url 
    });

  } catch (error) {
    console.error('Stripe checkout session error:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}