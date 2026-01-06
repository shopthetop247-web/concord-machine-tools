// app/api/request-quote/route.ts
import nodemailer from 'nodemailer';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, message, stockNumber } = await req.json();

    if (!name || !email || !stockNumber) {
      return NextResponse.json(
        { error: 'Name, email, and stock number are required.' },
        { status: 400 }
      );
    }

    // Create Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, // jktek1@gmail.com
        pass: process.env.EMAIL_PASS, // your password
      },
    });

    // Email content
    const mailOptions = {
      from: `"${name}" <${email}>`,
      to: process.env.EMAIL_USER,
      subject: `Quote Request for Stock# ${stockNumber}`,
      text: `
        Name: ${name}
        Email: ${email}
        Phone: ${phone || 'N/A'}
        Stock#: ${stockNumber}
        Message: ${message || 'N/A'}
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: 'Quote request sent successfully!' });
  } catch (err: any) {
    console.error('Error sending quote request:', err);
    return NextResponse.json(
      { error: 'Failed to send email. Please try again later.' },
      { status: 500 }
    );
  }
}
