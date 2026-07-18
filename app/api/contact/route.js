import connectDB from "@/lib/mongoose";
import Message from "@/models/Message";
import nodemailer from "nodemailer";
import { contactLimiter } from "@/lib/rateLimit";

export async function POST(req) {
  try {
    // ==========================
    // RATE LIMITING
    // ==========================

    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "127.0.0.1";

    const { success } = await contactLimiter.limit(ip);

    if (!success) {
      return Response.json(
        {
          error:
            "Too many messages sent. Please wait a few minutes and try again.",
        },
        {
          status: 429,
        },
      );
    }

    await connectDB();

    const body = await req.json();

    // ==========================
    // HONEYPOT CHECK
    // ==========================

    if (body.website) {
      return Response.json(
        {
          error: "Spam detected",
        },
        {
          status: 400,
        },
      );
    }

    // ==========================
    // VALIDATION
    // ==========================

    if (!body.name || !body.email || !body.message) {
      return Response.json(
        {
          error: "Missing fields",
        },
        {
          status: 400,
        },
      );
    }

    // ==========================
    // LENGTH PROTECTION
    // ==========================

    if (
      body.name.length > 50 ||
      body.email.length > 100 ||
      body.message.length > 1000
    ) {
      return Response.json(
        {
          error: "Input too long",
        },
        {
          status: 400,
        },
      );
    }

    // ==========================
    // SAVE MESSAGE TO DATABASE
    // ==========================

    await Message.create({
      name: body.name.trim(),

      email: body.email.trim(),

      phone: body.phone?.trim() || "",

      message: body.message.trim(),

      status: "new",
    });

    // ==========================
    // SEND EMAILS
    // ==========================

    if (process.env.SMTP_HOST) {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,

        port: Number(process.env.SMTP_PORT || 465),

        secure: true,

        auth: {
          user: process.env.SMTP_USER,

          pass: process.env.SMTP_PASS,
        },
      });

      // ==========================
      // EMAIL 1: SEND TO BUSINESS OWNER
      // ==========================

      await transporter.sendMail({
        from: process.env.SMTP_FROM,

        to: "hasarangasamarakoon@gmail.com",

        replyTo: body.email,

        subject: `Evermoss enquiry from ${body.name}`,

        text: `New enquiry received.

Name: ${body.name}

Email: ${body.email}

Phone: ${body.phone || "—"}

Message:

${body.message}`,
      });

      // ==========================
      // EMAIL 2: SEND CONFIRMATION TO CUSTOMER
      // ==========================

      await transporter.sendMail({
        from: process.env.SMTP_FROM,

        to: body.email,

        subject: "We received your Evermoss enquiry",

        text: `Hi ${body.name},

Thank you for contacting Evermoss.

We have received your enquiry and our team will get back to you as soon as possible.

Your message:

${body.message}

Regards,

Evermoss Team`,
      });
    }

    return Response.json({
      ok: true,

      message: "Message sent successfully",
    });
  } catch (error) {
    console.error("Contact API error:", error);

    return Response.json(
      {
        error: "Unable to send",
      },
      {
        status: 500,
      },
    );
  }
}
