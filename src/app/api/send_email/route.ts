import {buildCorsHeaders, getEnvString} from "./env_helpers";
import {EmailProviderError, getEmailConfigIssues, resolveEmailProvider, resolveFromTo} from "./email_provider";

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

const MAX_FIELD_LENGTH = 5000;

const toSafeString = (value: unknown) => {
	if (typeof value !== "string") return "";
	return value.trim();
};

const isWithinLimit = (value: string) => value.length > 0 && value.length <= MAX_FIELD_LENGTH;
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
	const corsHeaders = buildCorsHeaders(await getEnvString("CORS_ORIGIN"));
	return new Response(null, { status: 204, headers: corsHeaders });
}

export async function POST(request: Request) {
	try {
		console.log("send_email request received");
		const requestId =
			typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : undefined;
		const corsHeaders = buildCorsHeaders(await getEnvString("CORS_ORIGIN"));

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

		const configIssues = await getEmailConfigIssues();
		const turnstileSecretKey = await getEnvString("TURNSTILE_SECRET_KEY");
		if (!turnstileSecretKey) {
			configIssues.push("Missing TURNSTILE_SECRET_KEY");
		}
		if (configIssues.length > 0) {
			console.error("send_email error: server misconfigured", { requestId, configIssues });
			return jsonResponse(
				500,
				{ error: "Server misconfigured", details: configIssues, requestId },
				corsHeaders,
				requestId
			);
		}

		try {
			const remoteIp = request.headers.get("CF-Connecting-IP");
			await verifyTurnstile(turnstileToken, turnstileSecretKey, requestId, remoteIp);
		} catch (err) {
			const message = err instanceof Error ? err.message : "Captcha verification failed";
			console.error("send_email error: turnstile verify failed", { requestId, message });
			return jsonResponse(400, { error: message, requestId }, corsHeaders, requestId);
		}

		const subject = `New landing page inquiry from ${name || email}`;
		const textLines = [
			`Name: ${name || "Proposal request"}`,
			`Email: ${email}`,
			company ? `Company: ${company}` : null,
			"",
			message,
		].filter(Boolean);

		const { fromEmail, toEmail } = await resolveFromTo();
		const emailProvider = await resolveEmailProvider();
		let sendResult: { messageId?: string } | undefined;
		try {
			sendResult = await emailProvider.sendEmail(
				{
					from: fromEmail,
					to: toEmail,
					replyTo: email,
					subject,
					text: textLines.join("\n"),
				},
				requestId
			);
		} catch (err) {
			const details =
				err instanceof EmailProviderError && err.details
					? err.details
					: err instanceof Error
						? err.message
						: "Network request failed";
			console.error("send_email error: provider request failed", { requestId, details });
			return jsonResponse(
				502,
				{ error: "Email provider request failed", details, requestId },
				corsHeaders,
				requestId
			);
		}

		return jsonResponse(
			200,
			{ ok: true, requestId, messageId: sendResult?.messageId },
			corsHeaders,
			requestId
		);
	} catch (err) {
		const corsHeaders = buildCorsHeaders(await getEnvString("CORS_ORIGIN"));
		const details = err instanceof Error ? err.message : "Unknown error";
		const stack = err instanceof Error ? err.stack : undefined;
		console.error("send_email error: unexpected", { details, stack });
		return jsonResponse(500, { error: "Internal server error", details }, corsHeaders);
	}
}
