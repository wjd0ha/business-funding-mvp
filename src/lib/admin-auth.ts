import { createHmac, timingSafeEqual } from "node:crypto";
import type { NextRequest } from "next/server";

export const ADMIN_COOKIE = "bizfit_radar_admin";
const maxAge = 60 * 60 * 8;

// The separate Vercel preview is already behind Vercel Authentication.
// Keep the application password mandatory everywhere else, including Production.
export function isVercelPreviewAdmin() {
  return process.env.VERCEL_ENV === "preview" && process.env.RADAR_PREVIEW_SSO === "1";
}

function secret() {
  const value = process.env.RADAR_ADMIN_SECRET || "";
  if (value.length < 32) throw new Error("관리자 보안 키가 설정되지 않았습니다.");
  return value;
}

function signature(value: string) {
  return createHmac("sha256", secret()).update(value).digest("hex");
}

export function makeAdminCookie() {
  const expires = Math.floor(Date.now() / 1000) + maxAge;
  const data = String(expires);
  return { value: `${data}.${signature(data)}`, maxAge };
}

export function isAdmin(request: NextRequest) {
  if (isVercelPreviewAdmin()) return true;
  try {
    const cookie = request.cookies.get(ADMIN_COOKIE)?.value || "";
    const [expires, supplied] = cookie.split(".");
    if (!expires || !supplied || Number(expires) <= Date.now() / 1000) return false;
    const expected = Buffer.from(signature(expires), "hex");
    const actual = Buffer.from(supplied, "hex");
    return actual.length === expected.length && timingSafeEqual(expected, actual);
  } catch { return false; }
}

export function validPassword(value: string) {
  const configured = process.env.RADAR_ADMIN_PASSWORD || "";
  if (configured.length < 16) return false;
  const a = Buffer.from(value);
  const b = Buffer.from(configured);
  return a.length === b.length && timingSafeEqual(a, b);
}
