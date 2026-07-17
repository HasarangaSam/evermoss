import { NextResponse } from "next/server";

export async function POST() {
  const r = NextResponse.json({ ok: true });
  r.cookies.set("evermoss_admin", "", {
    path: "/",
    maxAge: 0,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  return r;
}
