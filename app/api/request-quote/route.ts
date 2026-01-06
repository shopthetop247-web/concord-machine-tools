import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { name, email, phone, message, stockNumber } = data;

    if (!name || !email || !stockNumber) {
      return NextResponse.json(
        { error: 'Name, email, and stock number are required.' },
        { status: 400 }
      );
    }

    // Create Nodemailer transporter using Gmail
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, // from .env.local
        pass: process.env.EMAIL_PASS, // from .env.local
      },
    });

    // Email content
    const mailOptions = {
      from: `"Concord Machine Tools" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER, // send to yourself
      subject: `Quote Request for Stock# ${stockNumber}`,
      html: `
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
        <p><strong>Stock#:</strong> ${stockNumber}</p>
        <p><strong>Message:</strong><br/>${message || 'N/A'}</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { error: 'Failed to send email. Please try again later.' },
      { status: 500 }
    );
  }
}
