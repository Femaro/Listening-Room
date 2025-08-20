import sql from "@/app/api/utils/sql";

export async function POST(request) {
  try {
    const body = await request.json();
    
    // Verify webhook signature (if you set up secret hash in Flutterwave)
    const verifyHash = request.headers.get('verif-hash');
    
    // Process the webhook event
    if (body.event === 'charge.completed' && body.status === 'successful') {
      const {
        tx_ref,
        id: transaction_id,
        amount,
        currency,
        customer,
        payment_type
      } = body.data;

      // Update donation in database
      const updatedDonation = await sql`
        UPDATE donations 
        SET 
          status = 'completed',
          completed_at = NOW(),
          flutterwave_transaction_id = ${transaction_id},
          flutterwave_payment_method = ${payment_type}
        WHERE flutterwave_tx_ref = ${tx_ref}
        RETURNING *
      `;

      if (updatedDonation.length > 0) {
        console.log('Donation completed:', updatedDonation[0]);
        
        // Here you could send a thank you email or trigger other actions
        try {
          // Optional: Send email notification (if you have email service set up)
          console.log('Donation completed successfully for:', customer.email);
        } catch (emailError) {
          console.error('Failed to send thank you email:', emailError);
        }
      }
    }

    return Response.json({ status: 'success' });
  } catch (error) {
    console.error('Webhook error:', error);
    return Response.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}

// Handle GET requests (for webhook verification)
export async function GET(request) {
  return Response.json({ message: 'Flutterwave webhook endpoint active' });
}