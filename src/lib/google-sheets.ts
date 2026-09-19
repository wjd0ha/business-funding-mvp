import { createSign } from "node:crypto";

const spreadsheetId = process.env.RADAR_SHEET_ID ?? "";
const credentialsText = process.env.GOOGLE_SERVICE_ACCOUNT_JSON ?? "";

type Credentials = { client_email: string; private_key: string; token_uri?: string };
type SheetRow = Record<string, string>;
let tokenCache: { token: string; until: number } | null = null;

export function hasSheetsConfig() {
  return Boolean(spreadsheetId && credentialsText);
}

function credentials(): Credentials {
  if (!hasSheetsConfig()) throw new Error("Google Sheets 연결 정보가 없습니다.");
  const parsed = JSON.parse(credentialsText) as Credentials;
  if (!parsed.client_email || !parsed.private_key) throw new Error("Google 서비스 계정 정보가 올바르지 않습니다.");
  return parsed;
}

function base64url(value: string | Buffer) {
  return Buffer.from(value).toString("base64url");
}

async function accessToken() {
  if (tokenCache && tokenCache.until > Date.now() + 60_000) return tokenCache.token;
  const account = credentials();
  const now = Math.floor(Date.now() / 1000);
  const endpoint = account.token_uri || "https://oauth2.googleapis.com/token";
  const header = base64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const payload = base64url(JSON.stringify({
    iss: account.client_email,
    scope: "https://www.googleapis.com/auth/spreadsheets",
    aud: endpoint,
    iat: now,
    exp: now + 3600,
  }));
  const unsigned = `${header}.${payload}`;
  const signer = createSign("RSA-SHA256");
  signer.update(unsigned);
  const assertion = `${unsigned}.${base64url(signer.sign(account.private_key))}`;
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion }),
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`Google 인증 오류 (${response.status})`);
  const data = await response.json() as { access_token: string; expires_in: number };
  tokenCache = { token: data.access_token, until: Date.now() + data.expires_in * 1000 };
  return data.access_token;
}

async function sheetsRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${await accessToken()}`,
      "Content-Type": "application/json",
      ...init.headers,
    },
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`Google Sheets 오류 (${response.status})`);
  return response.json() as Promise<T>;
}

function range(tab: string, cells: string) {
  return encodeURIComponent(`'${tab}'!${cells}`);
}

function safeCell(value: unknown): string {
  const text = typeof value === "string" ? value : value == null ? "" : JSON.stringify(value);
  // Prevent spreadsheet formulas from executing when user-supplied text is opened in Sheets.
  return /^[=+\-@\t\r]/.test(text) ? `'${text}` : text;
}

export async function readRows(tab: string): Promise<SheetRow[]> {
  const result = await sheetsRequest<{ values?: string[][] }>(`values/${range(tab, "A1:Z10000")}`);
  const [headers = [], ...rows] = result.values ?? [];
  return rows.filter((row) => row.some(Boolean)).map((row) =>
    Object.fromEntries(headers.map((key, index) => [key, row[index] ?? ""])),
  );
}

export async function appendRow(tab: string, row: Record<string, unknown>) {
  const result = await sheetsRequest<{ values?: string[][] }>(`values/${range(tab, "A1:Z1")}`);
  const headers = result.values?.[0] ?? [];
  if (!headers.length) throw new Error(`${tab} 시트의 헤더가 없습니다.`);
  await sheetsRequest(`values/${range(tab, "A:Z")}:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`, {
    method: "POST",
    body: JSON.stringify({ values: [headers.map((key) => safeCell(row[key]))] }),
  });
}

export async function updateRow(tab: string, rowIndex: number, row: Record<string, unknown>) {
  const result = await sheetsRequest<{ values?: string[][] }>(`values/${range(tab, "A1:Z1")}`);
  const headers = result.values?.[0] ?? [];
  if (!headers.length || rowIndex < 2) throw new Error("잘못된 시트 행입니다.");
  await sheetsRequest(`values/${range(tab, `A${rowIndex}:Z${rowIndex}`)}?valueInputOption=RAW`, {
    method: "PUT",
    body: JSON.stringify({ values: [headers.map((key) => safeCell(row[key]))] }),
  });
}

export function parseList(value: string | undefined): string[] {
  if (!value) return [];
  try { const result = JSON.parse(value); return Array.isArray(result) ? result : []; }
  catch { return []; }
}
