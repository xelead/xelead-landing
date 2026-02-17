type ProposalPayload = {
  email: string;
  comment: string;
  turnstileToken: string;
};

type EmailPayload = {
  email: string;
  message: string;
  turnstileToken: string;
  name?: string;
};

const normalizeBaseUrl = (baseUrl: string): string => baseUrl.replace(/\/+$/, "");

const buildEmailUrl = (baseUrl: string): string => {
  const normalized = normalizeBaseUrl(baseUrl);
  if (!normalized) return "/api/send_email";
  if (normalized.endsWith("/api")) return `${normalized}/send_email`;
  return `${normalized}/api/send_email`;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const parseJsonError = async (response: Response, fallback: string): Promise<string> => {
  try {
    const data: unknown = await response.json();
    if (isRecord(data)) {
      const message = typeof data.message === "string" ? data.message.trim() : "";
      if (message) {
        return message;
      }
      const error = typeof data.error === "string" ? data.error.trim() : "";
      if (error) {
        return error;
      }
    }
  } catch {
    // ignore parse errors
  }
  return fallback;
};

export const sendProposalEmail = async (apiBaseUrl: string, payload: ProposalPayload): Promise<void> => {
  const emailUrl = buildEmailUrl(apiBaseUrl);
  const emailPayload: EmailPayload = {
    email: payload.email,
    message: payload.comment,
    turnstileToken: payload.turnstileToken,
    name: payload.email,
  };

  const response = await fetch(emailUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(emailPayload),
  });

  if (!response.ok) {
    const message = await parseJsonError(response, `Email request failed (${response.status})`);
    throw new Error(message);
  }
};
