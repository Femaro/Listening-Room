import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

export async function POST(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: 'Authentication required' }, { status: 401 });
    }

    const {
      payment_method,
      amount,
      currency = 'USD',
      session_id,
      donation_id,
      payment_type, // 'session_payment', 'donation', 'subscription'
      provider_details
    } = await request.json();

    // Get user's location for local currency conversion
    const userProfile = await sql`
      SELECT country_code, preferred_currency FROM user_profiles 
      WHERE user_id = ${session.user.id}
    `;

    const localCurrency = userProfile.length > 0 ? userProfile[0].preferred_currency : currency;

    // Get exchange rate if needed
    let exchangeRate = 1.0;
    let originalAmount = amount;
    let originalCurrency = currency;

    if (localCurrency !== currency) {
      const rates = await sql`
        SELECT exchange_rate FROM currency_rates 
        WHERE base_currency = ${currency} AND target_currency = ${localCurrency}
      `;
      
      if (rates.length > 0) {
        exchangeRate = parseFloat(rates[0].exchange_rate);
        originalAmount = Math.round(amount / exchangeRate);
        originalCurrency = localCurrency;
      }
    }

    // Process payment based on provider
    let paymentResult;
    
    switch (payment_method.provider) {
      case 'stripe':
        paymentResult = await processStripePayment({
          amount: originalAmount,
          currency: originalCurrency,
          payment_method: provider_details,
          metadata: {
            user_id: session.user.id,
            session_id,
            donation_id,
            payment_type
          }
        });
        break;
        
      case 'flutterwave':
        paymentResult = await processFlutterwavePayment({
          amount: originalAmount,
          currency: originalCurrency,
          payment_method: provider_details,
          customer: {
            email: session.user.email,
            name: session.user.name
          },
          metadata: {
            user_id: session.user.id,
            session_id,
            donation_id,
            payment_type
          }
        });
        break;
        
      case 'paypal':
        paymentResult = await processPayPalPayment({
          amount: originalAmount,
          currency: originalCurrency,
          payment_method: provider_details,
          metadata: {
            user_id: session.user.id,
            session_id,
            donation_id,
            payment_type
          }
        });
        break;
        
      case 'bank_transfer':
        paymentResult = await processBankTransfer({
          amount: originalAmount,
          currency: originalCurrency,
          bank_details: provider_details,
          user_id: session.user.id
        });
        break;
        
      case 'ussd':
        paymentResult = await processUSSDPayment({
          amount: originalAmount,
          currency: originalCurrency,
          ussd_details: provider_details,
          user_id: session.user.id
        });
        break;
        
      case 'mobile_money':
        paymentResult = await processMobileMoneyPayment({
          amount: originalAmount,
          currency: originalCurrency,
          mobile_details: provider_details,
          user_id: session.user.id
        });
        break;
        
      default:
        throw new Error(`Unsupported payment provider: ${payment_method.provider}`);
    }

    // Store payment transaction
    const transaction = await sql`
      INSERT INTO payment_transactions (
        user_id,
        session_id,
        donation_id,
        transaction_type,
        amount,
        currency,
        original_amount,
        original_currency,
        exchange_rate,
        provider,
        provider_transaction_id,
        provider_payment_intent_id,
        status,
        metadata
      ) VALUES (
        ${session.user.id},
        ${session_id || null},
        ${donation_id || null},
        ${payment_type},
        ${amount},
        ${currency},
        ${originalAmount},
        ${originalCurrency},
        ${exchangeRate},
        ${payment_method.provider},
        ${paymentResult.transaction_id || null},
        ${paymentResult.payment_intent_id || null},
        ${paymentResult.status || 'pending'},
        ${JSON.stringify(paymentResult.metadata || {})}
      )
      RETURNING id, status, created_at
    `;

    // Update related records based on payment type
    if (payment_type === 'session_payment' && session_id) {
      await sql`
        UPDATE chat_sessions 
        SET continued_after_limit = true,
            updated_at = NOW()
        WHERE id = ${session_id}
      `;
    } else if (payment_type === 'donation' && donation_id) {
      await sql`
        UPDATE donations 
        SET status = ${paymentResult.status === 'completed' ? 'completed' : 'pending'},
            completed_at = ${paymentResult.status === 'completed' ? 'NOW()' : null}
        WHERE id = ${donation_id}
      `;
    }

    return Response.json({
      success: true,
      transaction_id: transaction[0].id,
      payment_status: paymentResult.status,
      provider_transaction_id: paymentResult.transaction_id,
      amount: originalAmount,
      currency: originalCurrency,
      exchange_rate: exchangeRate,
      confirmation_details: paymentResult.confirmation_details,
      next_action: paymentResult.next_action
    });

  } catch (error) {
    console.error('Payment processing error:', error);
    return Response.json(
      { error: 'Payment processing failed', details: error.message },
      { status: 500 }
    );
  }
}

// Stripe payment processing
async function processStripePayment({ amount, currency, payment_method, metadata }) {
  try {
    // This would integrate with Stripe's API
    // For demo purposes, we'll simulate the process
    
    return {
      status: 'completed',
      transaction_id: `stripe_${Date.now()}`,
      payment_intent_id: `pi_${Math.random().toString(36).substr(2, 9)}`,
      confirmation_details: {
        payment_method: 'card',
        last_four: payment_method.card?.last_four || '****',
        brand: payment_method.card?.brand || 'visa'
      },
      metadata: {
        provider: 'stripe',
        processed_at: new Date().toISOString()
      }
    };
  } catch (error) {
    throw new Error(`Stripe payment failed: ${error.message}`);
  }
}

// Flutterwave payment processing (for African markets)
async function processFlutterwavePayment({ amount, currency, payment_method, customer, metadata }) {
  try {
    // This would integrate with Flutterwave's API
    // Popular in Nigeria, Ghana, Kenya, and other African countries
    
    return {
      status: 'completed',
      transaction_id: `flw_${Date.now()}`,
      payment_intent_id: `fw_${Math.random().toString(36).substr(2, 9)}`,
      confirmation_details: {
        payment_method: payment_method.type || 'card',
        customer_email: customer.email,
        reference: `FLW_${Date.now()}`
      },
      metadata: {
        provider: 'flutterwave',
        processed_at: new Date().toISOString()
      }
    };
  } catch (error) {
    throw new Error(`Flutterwave payment failed: ${error.message}`);
  }
}

// PayPal payment processing
async function processPayPalPayment({ amount, currency, payment_method, metadata }) {
  try {
    // This would integrate with PayPal's API
    
    return {
      status: 'completed',
      transaction_id: `pp_${Date.now()}`,
      payment_intent_id: payment_method.paypal_order_id,
      confirmation_details: {
        payment_method: 'paypal',
        email: payment_method.payer_email
      },
      metadata: {
        provider: 'paypal',
        processed_at: new Date().toISOString()
      }
    };
  } catch (error) {
    throw new Error(`PayPal payment failed: ${error.message}`);
  }
}

// Bank transfer processing
async function processBankTransfer({ amount, currency, bank_details, user_id }) {
  try {
    // Generate unique reference for bank transfer
    const reference = `BT_${user_id}_${Date.now()}`;
    
    return {
      status: 'pending',
      transaction_id: reference,
      confirmation_details: {
        payment_method: 'bank_transfer',
        reference: reference,
        bank_account: {
          account_name: 'Listening Room Global Mental Health Support',
          account_number: '1234567890',
          bank_name: 'Partner Bank',
          swift_code: 'PRTBANK123',
          routing_number: '021000021'
        },
        instructions: `Please transfer ${amount} ${currency} to the above account with reference: ${reference}`
      },
      next_action: {
        type: 'bank_transfer_instructions',
        reference: reference
      },
      metadata: {
        provider: 'bank_transfer',
        processed_at: new Date().toISOString()
      }
    };
  } catch (error) {
    throw new Error(`Bank transfer processing failed: ${error.message}`);
  }
}

// USSD payment processing (popular in Africa)
async function processUSSDPayment({ amount, currency, ussd_details, user_id }) {
  try {
    const ussd_code = `*737*${amount}*${user_id}#`;
    
    return {
      status: 'pending',
      transaction_id: `ussd_${Date.now()}`,
      confirmation_details: {
        payment_method: 'ussd',
        ussd_code: ussd_code,
        instructions: `Dial ${ussd_code} on your phone and follow the prompts to complete payment`
      },
      next_action: {
        type: 'ussd_dial',
        ussd_code: ussd_code
      },
      metadata: {
        provider: 'ussd',
        processed_at: new Date().toISOString()
      }
    };
  } catch (error) {
    throw new Error(`USSD payment processing failed: ${error.message}`);
  }
}

// Mobile money processing (M-Pesa, etc.)
async function processMobileMoneyPayment({ amount, currency, mobile_details, user_id }) {
  try {
    const reference = `MM_${user_id}_${Date.now()}`;
    
    return {
      status: 'pending',
      transaction_id: reference,
      confirmation_details: {
        payment_method: 'mobile_money',
        phone_number: mobile_details.phone_number,
        provider: mobile_details.provider, // 'mpesa', 'airtel_money', etc.
        reference: reference
      },
      next_action: {
        type: 'mobile_money_prompt',
        message: `Check your phone for payment prompt. Amount: ${amount} ${currency}`
      },
      metadata: {
        provider: 'mobile_money',
        processed_at: new Date().toISOString()
      }
    };
  } catch (error) {
    throw new Error(`Mobile money payment failed: ${error.message}`);
  }
}

export async function GET(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: 'Authentication required' }, { status: 401 });
    }

    const url = new URL(request.url);
    const transaction_id = url.searchParams.get('transaction_id');

    if (transaction_id) {
      // Get specific transaction details
      const transaction = await sql`
        SELECT * FROM payment_transactions 
        WHERE id = ${transaction_id} AND user_id = ${session.user.id}
      `;

      if (transaction.length === 0) {
        return Response.json({ error: 'Transaction not found' }, { status: 404 });
      }

      return Response.json({
        transaction: transaction[0]
      });
    } else {
      // Get all user transactions
      const transactions = await sql`
        SELECT 
          pt.*,
          cs.started_at as session_started_at,
          d.donor_name,
          d.message as donation_message
        FROM payment_transactions pt
        LEFT JOIN chat_sessions cs ON pt.session_id = cs.id
        LEFT JOIN donations d ON pt.donation_id = d.id
        WHERE pt.user_id = ${session.user.id}
        ORDER BY pt.created_at DESC
        LIMIT 50
      `;

      return Response.json({
        transactions: transactions
      });
    }

  } catch (error) {
    console.error('Error fetching payment transactions:', error);
    return Response.json(
      { error: 'Failed to fetch transactions' },
      { status: 500 }
    );
  }
}