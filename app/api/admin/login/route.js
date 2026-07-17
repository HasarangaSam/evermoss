import { session } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { email = "", password = "" } = await req.json();
    const adminEmail = process.env.ADMIN_EMAIL.trim();
    const adminPassword = process.env.ADMIN_PASSWORD.trim();

    if (email.trim() !== adminEmail || password !== adminPassword) {
      return NextResponse.json({ error: "Invalid login" }, { status: 401 });
    }

    const res = NextResponse.json({ ok: true });
    res.cookies.set("evermoss_admin", await session(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      // The session is checked by both /admin and /api/admin routes.
      path: "/",
      maxAge: 604800,
    });
    return res;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
