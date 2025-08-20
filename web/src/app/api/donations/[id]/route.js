import sql from "@/app/api/utils/sql";
import { applyRateLimit, sanitizeInput, secureLog } from "@/app/api/utils/security";
import { sendEmail } from "@/app/api/utils/send-email";

// Update donation (for payment completion)
export async function PATCH(request, { params }) {
  try {
    // Apply rate limiting
    const rateLimitResponse = await applyRateLimit(request, 'donation_update');
    if (rateLimitResponse) {
      return rateLimitResponse;
    }

    const { id } = params;
    const body = await request.json();

    if (!id) {
      return Response.json(
        { error: "Donation ID is required" },
        { status: 400 }
      );
    }

    // Get current donation
    const currentDonation = await sql`
      SELECT * FROM donations WHERE id = ${id}
    `;

    if (currentDonation.length === 0) {
      return Response.json(
        { error: "Donation not found" },
        { status: 404 }
      );
    }

    const donation = currentDonation[0];

    // Prepare update fields
    const updates = {};
    
    if (body.status) {
      if (!['pending', 'completed', 'failed', 'refunded'].includes(body.status)) {
        return Response.json(
          { error: "Invalid status" },
          { status: 400 }
        );
      }
      updates.status = body.status;
    }

    if (body.flutterwave_tx_ref) {
      updates.flutterwave_tx_ref = sanitizeInput(body.flutterwave_tx_ref).substring(0, 255);
    }

    if (body.flutterwave_transaction_id) {
      updates.flutterwave_transaction_id = sanitizeInput(body.flutterwave_transaction_id).substring(0, 255);
    }

    if (body.flutterwave_payment_method) {
      updates.flutterwave_payment_method = sanitizeInput(body.flutterwave_payment_method).substring(0, 50);
    }

    // Set completion timestamp if status is completed
    if (updates.status === 'completed' && !donation.completed_at) {
      updates.completed_at = new Date().toISOString();
    }

    if (Object.keys(updates).length === 0) {
      return Response.json(
        { error: "No valid fields to update" },
        { status: 400 }
      );
    }

    // Build dynamic update query
    const updateFields = Object.keys(updates).map((key, index) => `${key} = $${index + 2}`).join(', ');
    const updateValues = Object.values(updates);

    const result = await sql(
      `UPDATE donations 
       SET ${updateFields}, updated_at = NOW() 
       WHERE id = $1 
       RETURNING *`,
      [id, ...updateValues]
    );

    const updatedDonation = result[0];

    // Send notification email for completed donations
    if (updates.status === 'completed' && donation.status !== 'completed') {
      try {
        // Send thank you email to donor
        if (!donation.is_anonymous && donation.donor_email) {
          await sendEmail({
            to: donation.donor_email,
            subject: "Thank You for Your Donation - ListeningRoom",
            html: `
              <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
                <div style="text-align: center; padding: 20px; background: linear-gradient(135deg, #14B8A6, #10B981); color: white; border-radius: 8px 8px 0 0;">
                  <h1>Thank You! 🎉</h1>
                </div>
                
                <div style="padding: 30px; background: white; border-radius: 0 0 8px 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                  <p>Dear ${donation.donor_name || 'Friend'},</p>
                  
                  <p>Your generous donation of <strong>₦${(donation.amount / 100).toLocaleString()}</strong> has been successfully processed. Thank you for supporting ListeningRoom!</p>
                  
                  <div style="background: #f0fdfa; border: 1px solid #14B8A6; border-radius: 8px; padding: 20px; margin: 20px 0;">
                    <h3 style="color: #0f766e; margin-top: 0;">Your Impact</h3>
                    <p style="color: #0f766e; margin-bottom: 0;">Your donation helps us provide free, anonymous mental health support to those who need it most. You're making a real difference in people's lives.</p>
                  </div>
                  
                  <div style="border-top: 1px solid #e5e5e5; padding-top: 20px; margin-top: 30px;">
                    <h4>Donation Details:</h4>
                    <p><strong>Amount:</strong> ₦${(donation.amount / 100).toLocaleString()} ${donation.currency}</p>
                    <p><strong>Transaction ID:</strong> ${updates.flutterwave_transaction_id || 'N/A'}</p>
                    <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
                  </div>
                  
                  <div style="text-align: center; margin-top: 30px;">
                    <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://listeningroom.app'}" 
                       style="display: inline-block; background: #14B8A6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                      Visit ListeningRoom
                    </a>
                  </div>
                  
                  <p style="font-size: 12px; color: #666; text-align: center; margin-top: 30px;">
                    This email serves as your donation receipt. Keep it for your records.
                  </p>
                </div>
              </div>
            `,
          });
        }

        // Send notification to admin
        await sendEmail({
          to: "joshuanwamuoh@gmail.com",
          subject: "Donation Completed - ListeningRoom",
          html: `
            <h2>🎉 Donation Completed</h2>
            <p><strong>Amount:</strong> ₦${(donation.amount / 100).toLocaleString()} ${donation.currency}</p>
            <p><strong>Donor:</strong> ${donation.is_anonymous ? "Anonymous" : (donation.donor_name || "Unknown")}</p>
            <p><strong>Email:</strong> ${donation.donor_email}</p>
            ${donation.message ? `<p><strong>Message:</strong> ${donation.message}</p>` : ""}
            <p><strong>Transaction ID:</strong> ${updates.flutterwave_transaction_id || 'N/A'}</p>
            <p><strong>Payment Method:</strong> ${updates.flutterwave_payment_method || 'N/A'}</p>
            <p><strong>Completed:</strong> ${new Date().toLocaleString()}</p>
            
            <hr>
            <p><small>This notification was sent from ListeningRoom donation system.</small></p>
          `,
        });

      } catch (emailError) {
        secureLog("error", "Failed to send donation completion emails", { error: emailError.message, donationId: id });
      }
    }

    secureLog("info", "Donation updated", { 
      donationId: id, 
      status: updates.status, 
      previousStatus: donation.status 
    });

    return Response.json(updatedDonation);

  } catch (error) {
    secureLog("error", "Error updating donation", { error: error.message, donationId: params.id });
    return Response.json(
      { error: "Failed to update donation" },
      { status: 500 }
    );
  }
}

// Get single donation
export async function GET(request, { params }) {
  try {
    // Apply rate limiting
    const rateLimitResponse = await applyRateLimit(request, 'donation_get');
    if (rateLimitResponse) {
      return rateLimitResponse;
    }

    const { id } = params;

    if (!id) {
      return Response.json(
        { error: "Donation ID is required" },
        { status: 400 }
      );
    }

    const result = await sql`
      SELECT 
        id, 
        amount, 
        currency, 
        donor_name, 
        donor_email, 
        message, 
        is_anonymous, 
        status, 
        flutterwave_tx_ref,
        flutterwave_transaction_id,
        flutterwave_payment_method,
        created_at, 
        completed_at
      FROM donations 
      WHERE id = ${id}
    `;

    if (result.length === 0) {
      return Response.json(
        { error: "Donation not found" },
        { status: 404 }
      );
    }

    return Response.json(result[0]);

  } catch (error) {
    secureLog("error", "Error fetching donation", { error: error.message, donationId: params.id });
    return Response.json(
      { error: "Failed to fetch donation" },
      { status: 500 }
    );
  }
}