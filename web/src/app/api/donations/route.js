import sql from "@/app/api/utils/sql";
import {
  applyRateLimit,
  sanitizeInput,
  secureLog,
} from "@/app/api/utils/security";
import { sendEmail } from "@/app/api/utils/send-email";

// Create a new donation
export async function POST(request) {
  try {
    // Apply rate limiting
    const rateLimitResponse = await applyRateLimit(request, "donations_create");
    if (rateLimitResponse) {
      return rateLimitResponse;
    }

    const body = await request.json();
    const {
      amount,
      currency = "NGN",
      donor_name,
      donor_email,
      message,
      is_anonymous = false,
    } = body;

    // Validate required fields
    if (!amount || !donor_email) {
      return Response.json(
        { error: "Amount and email are required" },
        { status: 400 },
      );
    }

    if (amount < 10000) {
      // Minimum 100 NGN (in kobo)
      return Response.json(
        { error: "Minimum donation amount is ₦100" },
        { status: 400 },
      );
    }

    if (!donor_email.includes("@")) {
      return Response.json(
        { error: "Valid email address is required" },
        { status: 400 },
      );
    }

    // Sanitize inputs
    const sanitizedDonorName = donor_name
      ? sanitizeInput(donor_name).substring(0, 100)
      : null;
    const sanitizedDonorEmail = sanitizeInput(donor_email).substring(0, 255);
    const sanitizedMessage = message
      ? sanitizeInput(message).substring(0, 500)
      : null;

    // Create donation record
    const result = await sql`
      INSERT INTO donations (
        amount, 
        currency, 
        donor_name, 
        donor_email, 
        message, 
        is_anonymous, 
        status,
        created_at
      )
      VALUES (
        ${amount}, 
        ${currency}, 
        ${is_anonymous ? null : sanitizedDonorName}, 
        ${sanitizedDonorEmail}, 
        ${sanitizedMessage}, 
        ${is_anonymous}, 
        'pending',
        NOW()
      )
      RETURNING id, amount, currency, donor_name, donor_email, message, is_anonymous, status, created_at
    `;

    const donation = result[0];

    // Send notification email to admin
    try {
      await sendEmail({
        to: "joshuanwamuoh@gmail.com",
        subject: "New Donation Initiated - ListeningRoom",
        html: `
          <h2>New Donation Started</h2>
          <p><strong>Amount:</strong> ${(amount / 100).toLocaleString()} ${currency}</p>
          <p><strong>Donor:</strong> ${is_anonymous ? "Anonymous" : sanitizedDonorName || "Unknown"}</p>
          <p><strong>Email:</strong> ${sanitizedDonorEmail}</p>
          ${sanitizedMessage ? `<p><strong>Message:</strong> ${sanitizedMessage}</p>` : ""}
          <p><strong>Status:</strong> Pending Payment</p>
          <p><strong>Created:</strong> ${new Date(donation.created_at).toLocaleString()}</p>
          
          <hr>
          <p><small>This notification was sent from ListeningRoom donation system.</small></p>
        `,
      });
    } catch (emailError) {
      secureLog("error", "Failed to send donation notification email", {
        error: emailError.message,
      });
      // Continue with the process even if email fails
    }

    secureLog("info", "New donation created", {
      donationId: donation.id,
      amount: amount / 100,
      currency,
    });

    return Response.json(donation, { status: 201 });
  } catch (error) {
    secureLog("error", "Error creating donation", { error: error.message });
    return Response.json(
      { error: "Failed to create donation. Please try again." },
      { status: 500 },
    );
  }
}

// Get donations (admin only)
export async function GET(request) {
  try {
    // Apply rate limiting
    const rateLimitResponse = await applyRateLimit(request, "donations_list");
    if (rateLimitResponse) {
      return rateLimitResponse;
    }

    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page")) || 1;
    const limit = Math.min(parseInt(url.searchParams.get("limit")) || 20, 50);
    const status = url.searchParams.get("status");
    const offset = (page - 1) * limit;

    // Build query conditions
    let whereCondition = "1=1";
    let queryParams = [];

    if (status) {
      whereCondition += ` AND status = $${queryParams.length + 1}`;
      queryParams.push(status);
    }

    // Get donations with pagination
    const donations = await sql(
      `SELECT 
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
        created_at, 
        completed_at
      FROM donations 
      WHERE ${whereCondition}
      ORDER BY created_at DESC 
      LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}`,
      [...queryParams, limit, offset],
    );

    // Get total count
    const countResult = await sql(
      `SELECT COUNT(*) as total FROM donations WHERE ${whereCondition}`,
      queryParams,
    );

    const totalCount = parseInt(countResult[0].total);
    const totalPages = Math.ceil(totalCount / limit);

    return Response.json({
      donations,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
        hasNext: page < totalPages,
        hasPrevious: page > 1,
      },
    });
  } catch (error) {
    secureLog("error", "Error fetching donations", { error: error.message });
    return Response.json(
      { error: "Failed to fetch donations" },
      { status: 500 },
    );
  }
}
