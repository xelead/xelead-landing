import {getCloudflareContext} from "@opennextjs/cloudflare";

export type EnvKey =
	| "POSTMARK_SERVER_TOKEN"
	| "NODEMAILER_HOST"
	| "NODEMAILER_PORT"
	| "NODEMAILER_USER"
	| "NODEMAILER_PASS"
	| "NODEMAILER_SECURE"
	| "AWS_REGION"
	| "AWS_ACCESS_KEY_ID"
	| "AWS_SECRET_ACCESS_KEY"
	| "AWS_SESSION_TOKEN"
	| "SES_CONFIGURATION_SET"
	| "NOTIFY_FROM_EMAIL"
	| "NOTIFY_TO_EMAIL"
	| "EMAIL_PROVIDER"
	| "CORS_ORIGIN"
	| "TURNSTILE_SECRET_KEY";

export const buildCorsHeaders = (origin?: string) => {
	const allowOrigin = origin && origin.length > 0 ? origin : "*";
	return {
		"Access-Control-Allow-Origin": allowOrigin,
		"Access-Control-Allow-Methods": "POST, OPTIONS",
		"Access-Control-Allow-Headers": "Content-Type",
		"Access-Control-Max-Age": "86400",
	};
};

export const getWorkerEnv = (): NodeJS.ProcessEnv => {
	try {
		return getCloudflareContext().env as NodeJS.ProcessEnv;
	} catch {
		console.log("Worker environment not available, falling back to process.env");
		return process.env;
	}
};

const toEnvString = async (value: unknown): Promise<string> => {
	if (typeof value === "string") return value;
	if (value && typeof value === "object" && "get" in value) {
		const getter = (value as { get?: () => Promise<string> | string }).get;
		if (typeof getter === "function") {
			return await getter();
		}
	}
	return "";
};

export const getEnvString = async (key: string): Promise<string> => {
	const workerEnv = getWorkerEnv();
	return await toEnvString(workerEnv?.[key]);
};


export const getEnvNumber = async (key: Parameters<typeof getEnvString>[0]) => {
	const raw = await getEnvString(key);
	if (!raw) return undefined;
	const parsed = Number(raw);
	if (!Number.isFinite(parsed)) return undefined;
	return parsed;
};

export const getEnvBoolean = async (key: Parameters<typeof getEnvString>[0]) => {
	const raw = (await getEnvString(key)).trim();
	if (!raw) return undefined;
	const normalized = raw.toLowerCase();
	if (["true", "1", "yes", "on"].includes(normalized)) return true;
	if (["false", "0", "no", "off"].includes(normalized)) return false;
	return undefined;
};
