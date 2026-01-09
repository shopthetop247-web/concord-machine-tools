// app/api/request-quote/route.ts
import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

// Create a transporter using Gmail SMTP
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // your Gmail login (jktek1@gmail.com)
    pass: process.env.EMAIL_PASS, // your app password
  },
});

// API route handler
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    // Basic validation
    const { name, email, company, stockNumber, message } = data;
    if (!name || !email || !stockNumber || !message) {
      return NextResponse.json(
        { success: false, error: "All fields are required." },
        { status: 400 }
      );
    }

    // Email options
    const mailOptions = {
      from: `"Quote Request Form" <${process.env.EMAIL_USER}>`, // sender (your Gmail)
      to: "sales@concordmt.com", // recipient
      subject: `Quote Request from ${name} - Stock# ${stockNumber}`,
      text: `
        Name: ${name}
        Company: ${company || 'N/A'}
        Email: ${email}
        Stock#: ${stockNumber}
        Message: ${message}
      `,
      html: `
        <h2>Quote Request</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Company:</strong> ${company || 'N/A'}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Stock#:</strong> ${stockNumber}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, "<br>")}</p>
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true, message: "Email sent successfully!" });
  } catch (err) {
    console.error("Failed to send email:", err);
    return NextResponse.json(
      { success: false, error: "Failed to send email. Please try again later." },
      { status: 500 }
    );
  }
}
