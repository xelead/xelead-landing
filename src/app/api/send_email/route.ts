import {getCloudflareContext} from "@opennextjs/cloudflare";

type EmailRequest = {
	name?: string;
	email: string;
	message: string;
	company?: string;
	turnstileToken: string;
};

type TurnstileResponse = {
	success: boolean;
	"error-codes"?: string[];
	challenge_ts?: string;
	hostname?: string;
	action?: string;
	cdata?: string;
};

type WorkerEnv = {
	POSTMARK_SERVER_TOKEN?: string;
	POSTMARK_FROM_EMAIL?: string;
	POSTMARK_TO_EMAIL?: string;
	CORS_ORIGIN?: string;
	TURNSTILE_SECRET_KEY?: string;
};

const MAX_FIELD_LENGTH = 5000;

const buildCorsHeaders = (origin?: string) => {
	const allowOrigin = origin && origin.length > 0 ? origin : "*";
	return {
		"Access-Control-Allow-Origin": allowOrigin,
		"Access-Control-Allow-Methods": "POST, OPTIONS",
		"Access-Control-Allow-Headers": "Content-Type",
		"Access-Control-Max-Age": "86400",
	};
};

const toSafeString = (value: unknown) => {
	if (typeof value !== "string") return "";
	return value.trim();
};

const isWithinLimit = (value: string) => value.length > 0 && value.length <= MAX_FIELD_LENGTH;

async function toEnvString(value: unknown): Promise<string> {
	if (typeof value === "string") return value;
	// Cloud Flare secrets should be get using .get() method: https://developers.cloudflare.com/secrets-store/integrations/workers/
	if (value && typeof value === "object" && "get" in value) {
		const getter = (value as { get?: () => Promise<string> | string }).get;
		if (typeof getter === "function") {
			return await getter();
		}
	}
	return "";
}

const verifyTurnstile = async (
	token: string,
	secret: string,
	requestId?: string,
	remoteIp?: string | null
) => {
	const params = new URLSearchParams();
	params.set("secret", secret);
	params.set("response", token);
	if (remoteIp) {
		params.set("remoteip", remoteIp);
	}

	const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
		method: "POST",
		body: params,
	});

	if (!response.ok) {
		let bodyText = "";
		try {
			bodyText = await response.text();
		} catch {
			bodyText = "";
		}
		console.error("send_email error: turnstile verify http error", {
			requestId,
			status: response.status,
			statusText: response.statusText,
			bodyText,
		});
		throw new Error("Turnstile verification failed");
	}

	const data = (await response.json()) as TurnstileResponse;
	if (!data.success) {
		const errors = data["error-codes"]?.join(", ") || "unknown";
		console.error("send_email error: turnstile rejected", {
			requestId,
			errors,
			hostname: data.hostname,
			action: data.action,
			challengeTs: data.challenge_ts,
		});
		throw new Error(`Turnstile rejected: ${errors}`);
	}
};

const getWorkerEnv = (): WorkerEnv | NodeJS.ProcessEnv => {
	try {
		return getCloudflareContext().env as WorkerEnv;
	} catch {
		console.log("Worker environment not available, falling back to process.env");
		return process.env;
	}
};

const getEnv = async () => {
	const workerEnv = getWorkerEnv();
	return {
		postmarkServerToken: await toEnvString(workerEnv?.POSTMARK_SERVER_TOKEN),
		postmarkFromEmail: await toEnvString(workerEnv?.POSTMARK_FROM_EMAIL),
		postmarkToEmail: await toEnvString(workerEnv?.POSTMARK_TO_EMAIL),
		corsOrigin: await toEnvString(workerEnv?.CORS_ORIGIN),
		turnstileSecretKey: await toEnvString(workerEnv?.TURNSTILE_SECRET_KEY),
	};
};

const jsonResponse = (
	status: number,
	body: Record<string, unknown>,
	corsHeaders: Record<string, string>,
	requestId?: string
) => {
	const headers: Record<string, string> = {
		...corsHeaders,
		"Content-Type": "application/json",
		"X-Send-Email-Handler": "1",
	};
	if (requestId) {
		headers["X-Request-Id"] = requestId;
	}
	return new Response(JSON.stringify(body), { status, headers });
};

export async function OPTIONS(request: Request) {
	const { corsOrigin } = await getEnv();
	const corsHeaders = buildCorsHeaders(corsOrigin);
	return new Response(null, { status: 204, headers: corsHeaders });
}

export async function POST(request: Request) {
	try {
		console.log("send_email request received");
		const requestId =
			typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : undefined;
		const { postmarkServerToken, postmarkFromEmail, postmarkToEmail, corsOrigin, turnstileSecretKey } = await getEnv();
		const corsHeaders = buildCorsHeaders(corsOrigin);

		const contentType = request.headers.get("Content-Type") || "";
		if (!contentType.includes("application/json")) {
			return jsonResponse(415, { error: "Content-Type must be application/json", requestId }, corsHeaders, requestId);
		}

		let payload: EmailRequest;
		try {
			payload = (await request.json()) as EmailRequest;
		} catch {
			return jsonResponse(400, { error: "Invalid JSON", requestId }, corsHeaders, requestId);
		}

		const name = toSafeString(payload.name);
		const email = toSafeString(payload.email);
		const message = toSafeString(payload.message);
		const company = toSafeString(payload.company);
		const turnstileToken = toSafeString(payload.turnstileToken);

		if (!isWithinLimit(email) || !isWithinLimit(message)) {
			return jsonResponse(400, { error: "Missing or invalid fields", requestId }, corsHeaders, requestId);
		}

		if (!isWithinLimit(turnstileToken)) {
			return jsonResponse(400, { error: "Captcha required", requestId }, corsHeaders, requestId);
		}

		if (!postmarkServerToken || !postmarkFromEmail || !postmarkToEmail || !turnstileSecretKey) {
			console.error("send_email error: server misconfigured", { requestId });
			return jsonResponse(500, { error: "Server misconfigured", requestId }, corsHeaders, requestId);
		}

		try {
			const remoteIp = request.headers.get("CF-Connecting-IP");
			await verifyTurnstile(turnstileToken, turnstileSecretKey, requestId, remoteIp);
		} catch (err) {
			const message = err instanceof Error ? err.message : "Captcha verification failed";
			console.error("send_email error: turnstile verify failed", { requestId, message });
			return jsonResponse(400, { error: message, requestId }, corsHeaders, requestId);
		}

		const subject = "New landing page inquiry";
		const textLines = [
			`Name: ${name || "Proposal request"}`,
			`Email: ${email}`,
			company ? `Company: ${company}` : null,
			"",
			message,
		].filter(Boolean);

		let postmarkResponse: Response;
		try {
			postmarkResponse = await fetch("https://api.postmarkapp.com/email", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"X-Postmark-Server-Token": postmarkServerToken,
				},
				body: JSON.stringify({
					From: postmarkFromEmail,
					To: postmarkToEmail,
					ReplyTo: email,
					Subject: subject,
					TextBody: textLines.join("\n"),
				}),
			});
		} catch (err) {
			const details = err instanceof Error ? err.message : "Network request failed";
			console.error("send_email error: postmark request failed", { requestId, details });
			return jsonResponse(
				502,
				{ error: "Postmark request failed", details, requestId },
				corsHeaders,
				requestId
			);
		}

		if (!postmarkResponse.ok) {
			const errorBody = await postmarkResponse.text();
			console.error("send_email error: postmark response not ok", { requestId, errorBody });
			return jsonResponse(
				502,
				{ error: "Failed to send email", details: errorBody, requestId },
				corsHeaders,
				requestId
			);
		}

		let postmarkPayload:
			| { MessageID?: string; Message?: string; ErrorCode?: number; To?: string; SubmittedAt?: string }
			| undefined;
		try {
			postmarkPayload = (await postmarkResponse.json()) as {
				MessageID?: string;
				Message?: string;
				ErrorCode?: number;
				To?: string;
				SubmittedAt?: string;
			};
		} catch {
			postmarkPayload = undefined;
		}
		console.log("send_email info: postmark accepted", { requestId, postmarkPayload });

		return jsonResponse(
			200,
			{ ok: true, requestId, messageId: postmarkPayload?.MessageID },
			corsHeaders,
			requestId
		);
	} catch (err) {
		const env = await getEnv()
		const corsHeaders = buildCorsHeaders(env.corsOrigin);
		const details = err instanceof Error ? err.message : "Unknown error";
		const stack = err instanceof Error ? err.stack : undefined;
		console.error("send_email error: unexpected", { details, stack });
		return jsonResponse(500, { error: "Internal server error", details }, corsHeaders);
	}
}
