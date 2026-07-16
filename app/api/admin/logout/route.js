import { NextResponse } from "next/server";

export async function POST() {
  const r = NextResponse.json({ ok: true });
  r.cookies.set("evermoss_admin", "", {
    path: "/admin",
    maxAge: 0,
    httpOnly: true,
    secure: true,
    sameSite: "strict",
  });
  return r;
}
