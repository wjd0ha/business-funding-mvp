import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE, makeAdminCookie, validPassword } from "@/lib/admin-auth";

export async function POST(request: NextRequest) {
  const { password } = await request.json().catch(() => ({ password: "" }));
  if (typeof password !== "string" || !validPassword(password)) {
    return NextResponse.json({ error: "로그인 정보를 확인해주세요." }, { status: 401 });
  }
  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_COOKIE, makeAdminCookie().value, {
    httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict",
    path: "/", maxAge: 60 * 60 * 8,
  });
  return response;
}
