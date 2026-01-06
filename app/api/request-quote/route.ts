import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { name, email, phone, stockNumber, message } = data;

    // Validate required fields
    if (!name || !email || !stockNumber) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Create transporter (using Gmail SMTP as example)
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST, // e.g., "smtp.gmail.com"
      port: Number(process.env.SMTP_PORT) || 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const mailOptions = {
      from: `"Quote Request" <${process.env.SMTP_USER}>`,
      to: 'sales@concordmt.com',
      subject: `Quote Request for Stock# ${stockNumber}`,
      text: `
        Name: ${name}
        Email: ${email}
        Phone: ${phone || 'N/A'}
        Stock#: ${stockNumber}
        Message: ${message || 'N/A'}
      `,
      html: `
        <h2>Quote Request</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
        <p><strong>Stock#:</strong> ${stockNumber}</p>
        <p><strong>Message:</strong> ${message || 'N/A'}</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending quote email:', error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
