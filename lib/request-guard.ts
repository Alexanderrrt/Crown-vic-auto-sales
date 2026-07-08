const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

type GuardOptions = {
  key: string;
  limit: number;
  windowMs: number;
  honeypot?: string;
  content?: string;
};

export function getRequestIdentity(req: Request) {
  const forwardedFor = req.headers.get("x-forwarded-for");
  const realIp = req.headers.get("x-real-ip");
  const ip = forwardedFor?.split(",")[0]?.trim() || realIp || "unknown";
  const userAgent = req.headers.get("user-agent") || "unknown";
  return { ip, userAgent };
}

export function guardPublicRequest(req: Request, options: GuardOptions) {
  const identity = getRequestIdentity(req);
  const key = `${options.key}:${identity.ip}`;

  if (options.honeypot?.trim()) {
    return { ok: false as const, status: 400, error: "Spam check failed." };
  }

  if (looksAutomated(identity.userAgent)) {
    return { ok: false as const, status: 429, error: "Automated traffic is not allowed." };
  }

  if (looksLikeSpam(options.content)) {
    return { ok: false as const, status: 400, error: "Message looks like spam. Please revise it and try again." };
  }

  const now = Date.now();
  const current = rateLimitStore.get(key);
  if (!current || current.resetAt <= now) {
    rateLimitStore.set(key, { count: 1, resetAt: now + options.windowMs });
    cleanupExpired(now);
    return { ok: true as const, identity };
  }

  if (current.count >= options.limit) {
    return { ok: false as const, status: 429, error: "Too many requests. Please wait a moment and try again." };
  }

  current.count += 1;
  rateLimitStore.set(key, current);
  cleanupExpired(now);
  return { ok: true as const, identity };
}

function cleanupExpired(now: number) {
  for (const [key, value] of rateLimitStore.entries()) {
    if (value.resetAt <= now) rateLimitStore.delete(key);
  }
}

function looksAutomated(userAgent: string) {
  const lower = userAgent.toLowerCase();
  return ["bot", "crawler", "spider", "curl", "wget", "python-requests", "postman"].some((token) => lower.includes(token));
}

function looksLikeSpam(content?: string) {
  if (!content) return false;
  const normalized = content.trim().toLowerCase();
  if (!normalized) return false;

  const spamSignals = ["whatsapp", "telegram", "seo service", "casino", "crypto", "loan offer", "click here"];
  if (spamSignals.some((signal) => normalized.includes(signal))) return true;

  const links = normalized.match(/https?:\/\//g)?.length ?? 0;
  if (links > 1) return true;

  const repeatedChars = /(.)\1{7,}/.test(normalized);
  return repeatedChars;
}
