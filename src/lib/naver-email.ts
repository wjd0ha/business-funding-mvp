import nodemailer from "nodemailer";

export const NAVER_SENDER = "bizfit_official@naver.com";

export function hasNaverEmailConfig() {
  return Boolean(process.env.NAVER_SMTP_APP_PASSWORD);
}

function createNaverTransport() {
  const password = process.env.NAVER_SMTP_APP_PASSWORD;
  if (!password) throw new Error("네이버 SMTP 애플리케이션 비밀번호가 없습니다.");
  return nodemailer.createTransport({
    host: "smtp.naver.com",
    port: 465,
    secure: true,
    auth: { user: NAVER_SENDER, pass: password },
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 20_000,
  });
}

export async function verifyNaverEmail() {
  await createNaverTransport().verify();
}

export async function sendNaverEmail(input: { to: string; subject: string; html: string }) {
  const result = await createNaverTransport().sendMail({
    from: `Bizfit <${NAVER_SENDER}>`,
    to: input.to,
    subject: input.subject,
    html: input.html,
  });
  if (!result.accepted.some((address) => address.toLowerCase() === input.to.toLowerCase())) {
    throw new Error("네이버 SMTP에서 수신 주소를 승인하지 않았습니다.");
  }
  return result.messageId;
}
