import { auth } from '@/auth';

export async function POST(request) {
  try {
    const { name, email, subject, category, message } = await request.json();

    // Validate required fields
    if (!name?.trim() || !email?.trim() || !subject?.trim() || !message?.trim()) {
      return Response.json(
        { error: 'All required fields must be filled' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return Response.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    // For now, we'll just log the contact form submission
    // In a production environment, you would typically:
    // 1. Store in database
    // 2. Send email notification to admin team
    // 3. Send confirmation email to user
    
    console.log('Contact form submission:', {
      name: name.trim(),
      email: email.trim(),
      subject: subject.trim(),
      category: category?.trim() || 'general',
      message: message.trim(),
      timestamp: new Date().toISOString(),
      ip: request.headers.get('x-forwarded-for') || 'unknown'
    });

    // In production, you could store this in the database:
    // const sql = (await import('@/app/api/utils/sql')).default;
    // await sql`
    //   INSERT INTO contact_messages (name, email, subject, category, message, created_at)
    //   VALUES (${name.trim()}, ${email.trim()}, ${subject.trim()}, ${category?.trim() || 'general'}, ${message.trim()}, now())
    // `;

    return Response.json(
      { 
        success: true, 
        message: 'Your message has been received. We will get back to you within 24-48 hours.' 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error processing contact form:', error);
    return Response.json(
      { error: 'Failed to send message. Please try again later.' },
      { status: 500 }
    );
  }
}