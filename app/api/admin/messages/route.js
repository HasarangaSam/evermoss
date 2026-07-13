import connectDB from "@/lib/mongoose";
import Message from "@/models/Message";
import { authorized } from "@/lib/auth";

// ==========================
// GET ALL MESSAGES
// ==========================

export async function GET(req) {
  try {
    if (!(await authorized(req))) {
      return Response.json(
        {
          error: "Unauthorized",
        },
        {
          status: 401,
        },
      );
    }

    await connectDB();

    const messages = await Message.find().sort({
      createdAt: -1,
    });

    return Response.json(messages);
  } catch (error) {
    console.error("GET messages error:", error);

    return Response.json(
      {
        error: "Failed to load messages",
      },
      {
        status: 500,
      },
    );
  }
}

// ==========================
// DELETE MESSAGE
// ==========================

export async function DELETE(req) {
  try {
    if (!(await authorized(req))) {
      return Response.json(
        {
          error: "Unauthorized",
        },
        {
          status: 401,
        },
      );
    }

    await connectDB();

    const { id } = await req.json();

    if (!id) {
      return Response.json(
        {
          error: "Message ID required",
        },
        {
          status: 400,
        },
      );
    }

    const deletedMessage = await Message.findByIdAndDelete(id);

    if (!deletedMessage) {
      return Response.json(
        {
          error: "Message not found",
        },
        {
          status: 404,
        },
      );
    }

    return Response.json({
      ok: true,
      message: "Message deleted",
    });
  } catch (error) {
    console.error("DELETE message error:", error);

    return Response.json(
      {
        error: "Delete failed",
      },
      {
        status: 500,
      },
    );
  }
}

// ==========================
// UPDATE MESSAGE STATUS
// ==========================

export async function PATCH(req) {
  try {
    if (!(await authorized(req))) {
      return Response.json(
        {
          error: "Unauthorized",
        },
        {
          status: 401,
        },
      );
    }

    await connectDB();

    const { id, status } = await req.json();

    if (!id) {
      return Response.json(
        {
          error: "Message ID required",
        },
        {
          status: 400,
        },
      );
    }

    if (!["new", "read", "replied"].includes(status)) {
      return Response.json(
        {
          error: "Invalid status",
        },
        {
          status: 400,
        },
      );
    }

    const updatedMessage = await Message.findByIdAndUpdate(
      id,
      {
        status,
      },
      {
        new: true,
      },
    );

    if (!updatedMessage) {
      return Response.json(
        {
          error: "Message not found",
        },
        {
          status: 404,
        },
      );
    }

    return Response.json({
      ok: true,
      message: "Status updated",
      data: updatedMessage,
    });
  } catch (error) {
    console.error("PATCH message error:", error);

    return Response.json(
      {
        error: "Status update failed",
      },
      {
        status: 500,
      },
    );
  }
}
