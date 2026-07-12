import connectDB from "@/lib/mongoose";
import Message from "@/models/Message";
import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();

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
    // SAVE MESSAGE TO DATABASE
    // ==========================

    await Message.create({
      name: body.name,

      email: body.email,

      phone: body.phone || "",

      message: body.message,

      status: "new",
    });

    // ==========================
    // SEND EMAIL NOTIFICATION
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

      await transporter.sendMail({
        from: process.env.SMTP_FROM,

        to: "hasarangasamarakoon@gmail.com",

        replyTo: body.email,

        subject: `Evermoss enquiry from ${body.name}`,

        text: `Name: ${body.name}

Email: ${body.email}

Phone: ${body.phone || "—"}


Message:

${body.message}`,
      });
    }

    return Response.json({
      ok: true,
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
