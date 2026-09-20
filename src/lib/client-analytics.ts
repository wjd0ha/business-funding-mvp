const sessionKey = "bizfit-radar-session-v2";

export function getRadarSessionId() {
  if (typeof window === "undefined") return "";
  const stored = window.sessionStorage.getItem(sessionKey);
  if (stored) return stored;
  const created = crypto.randomUUID();
  window.sessionStorage.setItem(sessionKey, created);
  return created;
}

export function trackEvent(type: string, sessionId?: string, noticeId?: string, leadId?: string, meta?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  void fetch("/api/events", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type, sessionId: sessionId || getRadarSessionId(), noticeId, leadId, meta }),
    keepalive: true,
  }).catch(() => undefined);
}

export function trackPageView(page: "home" | "prep-map") {
  if (typeof window === "undefined") return;
  const key = `bizfit-last-view:${page}`;
  const last = Number(window.sessionStorage.getItem(key) || 0);
  if (Date.now() - last < 2000) return;
  window.sessionStorage.setItem(key, String(Date.now()));
  trackEvent("page_view", undefined, undefined, undefined, { page });
}
