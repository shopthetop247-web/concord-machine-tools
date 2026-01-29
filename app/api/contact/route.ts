// app/api/contact/route.ts
import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Create transporter (same as request-quote)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    const {
      name,
      company,
      email,
      phone,
      machineBrand,
      machineModel,
      machineYear,
      message,
      website, // honeypot
      turnstileToken,
    } = data;

    // Honeypot check (bots only)
    if (website) {
      return NextResponse.json({ success: true });
    }

    // Basic validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, error: 'Required fields are missing.' },
        { status: 400 }
      );
    }

    // Verify Cloudflare Turnstile
    if (!turnstileToken) {
      return NextResponse.json(
        { success: false, error: 'Security verification failed.' },
        { status: 400 }
      );
    }

    const turnstileRes = await fetch(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          secret: process.env.TURNSTILE_SECRET_KEY,
          response: turnstileToken,
          remoteip: req.headers.get('x-forwarded-for') || undefined,
        }),
      }
    );

    const turnstileData = await turnstileRes.json();

    if (!turnstileData.success) {
      return NextResponse.json(
        { success: false, error: 'Security check failed.' },
        { status: 403 }
      );
    }

    const mailOptions = {
      from: `"Machine For Sale Submission" <${process.env.EMAIL_USER}>`,
      to: 'sales@concordmt.com',
      subject: 'Machine For Sale Submission',
      text: `
Name: ${name}
Company: ${company || 'N/A'}
Email: ${email}
Phone: ${phone || 'N/A'}

Machine Brand: ${machineBrand || 'N/A'}
Machine Model: ${machineModel || 'N/A'}
Machine Year: ${machineYear || 'N/A'}

Message:
${message}
      `,
      html: `
<h2>Machine For Sale Submission</h2>

<p><strong>Name:</strong> ${name}</p>
<p><strong>Company:</strong> ${company || 'N/A'}</p>
<p><strong>Email:</strong> ${email}</p>
<p><strong>Phone:</strong> ${phone || 'N/A'}</p>

<hr />

<p><strong>Machine Brand:</strong> ${machineBrand || 'N/A'}</p>
<p><strong>Machine Model:</strong> ${machineModel || 'N/A'}</p>
<p><strong>Machine Year:</strong> ${machineYear || 'N/A'}</p>

<hr />

<p><strong>Message:</strong></p>
<p>${message.replace(/\n/g, '<br>')}</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({
      success: true,
      message: 'Message sent successfully!',
    });
  } catch (err) {
    console.error('Contact form email failed:', err);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to send message. Please try again later.',
      },
      { status: 500 }
    );
  }
}
