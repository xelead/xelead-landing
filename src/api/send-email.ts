/// <reference types="@cloudflare/workers-types" />

import type { Env } from "../types/env";

type EmailRequest = {
  name?: string;
  email: string;
  message: string;
  company?: string;
  turnstileToken: string;
};

const MAX_FIELD_LENGTH = 5000;

const buildCorsHeaders = (origin?: string) => {
  const allowOrigin = origin && origin.length > 0 ? origin : "*";
  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400"
  };
};

const toSafeString = (value: unknown) => {
  if (typeof value !== "string") return "";
  return value.trim();
};

const isWithinLimit = (value: string) => value.length > 0 && value.length <= MAX_FIELD_LENGTH;

type TurnstileResponse = {
  success: boolean;
  "error-codes"?: string[];
};

const verifyTurnstile = async (token: string, secret: string, remoteIp?: string | null) => {
  const params = new URLSearchParams();
  params.set("secret", secret);
  params.set("response", token);
  if (remoteIp) {
    params.set("remoteip", remoteIp);
  }

  const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    body: params
  });

  if (!response.ok) {
    throw new Error("Turnstile verification failed");
  }

  const data = (await response.json()) as TurnstileResponse;
  if (!data.success) {
    const errors = data["error-codes"]?.join(", ") || "unknown";
    throw new Error(`Turnstile rejected: ${errors}`);
  }
};

export const onRequest: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  const corsHeaders = buildCorsHeaders(env.CORS_ORIGIN);

  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }

  const contentType = request.headers.get("Content-Type") || "";
  if (!contentType.includes("application/json")) {
    return new Response(JSON.stringify({ error: "Content-Type must be application/json" }), {
      status: 415,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }

  let payload: EmailRequest;
  try {
    payload = (await request.json()) as EmailRequest;
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }

  const name = toSafeString(payload.name);
  const email = toSafeString(payload.email);
  const message = toSafeString(payload.message);
  const company = toSafeString(payload.company);
  const turnstileToken = toSafeString(payload.turnstileToken);

  if (!isWithinLimit(email) || !isWithinLimit(message)) {
    return new Response(JSON.stringify({ error: "Missing or invalid fields" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }

  if (!isWithinLimit(turnstileToken)) {
    return new Response(JSON.stringify({ error: "Captcha required" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }

  if (!env.POSTMARK_SERVER_TOKEN || !env.POSTMARK_FROM_EMAIL || !env.POSTMARK_TO_EMAIL || !env.TURNSTILE_SECRET_KEY) {
    return new Response(JSON.stringify({ error: "Server misconfigured" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }

  try {
    const remoteIp = request.headers.get("CF-Connecting-IP");
    await verifyTurnstile(turnstileToken, env.TURNSTILE_SECRET_KEY, remoteIp);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Captcha verification failed";
    return new Response(JSON.stringify({ error: message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }

  const subject = "New landing page inquiry";
  const textLines = [
    `Name: ${name || "Proposal request"}`,
    `Email: ${email}`,
    company ? `Company: ${company}` : null,
    "",
    message
  ].filter(Boolean);

  const postmarkResponse = await fetch("https://api.postmarkapp.com/email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Postmark-Server-Token": env.POSTMARK_SERVER_TOKEN
    },
    body: JSON.stringify({
      From: env.POSTMARK_FROM_EMAIL,
      To: env.POSTMARK_TO_EMAIL,
      ReplyTo: email,
      Subject: subject,
      TextBody: textLines.join("\n")
    })
  });

  if (!postmarkResponse.ok) {
    const errorBody = await postmarkResponse.text();
    return new Response(JSON.stringify({ error: "Failed to send email", details: errorBody }), {
      status: 502,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { ...corsHeaders, "Content-Type": "application/json" }
  });
};
