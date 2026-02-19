import {getCloudflareContext} from "@opennextjs/cloudflare";

export type EmailProviderName = "postmark" | "nodemailer" | "ses";

export type WorkerEnv = {
	POSTMARK_SERVER_TOKEN?: string;
	POSTMARK_FROM_EMAIL?: string;
	POSTMARK_TO_EMAIL?: string;
	NODEMAILER_HOST?: string;
	NODEMAILER_PORT?: string | number;
	NODEMAILER_USER?: string;
	NODEMAILER_PASS?: string;
	NODEMAILER_SECURE?: string | boolean;
	NODEMAILER_FROM_EMAIL?: string;
	NODEMAILER_TO_EMAIL?: string;
	AWS_REGION?: string;
	AWS_ACCESS_KEY_ID?: string;
	AWS_SECRET_ACCESS_KEY?: string;
	AWS_SESSION_TOKEN?: string;
	SES_FROM_EMAIL?: string;
	SES_TO_EMAIL?: string;
	SES_CONFIGURATION_SET?: string;
	EMAIL_PROVIDER?: string;
	CORS_ORIGIN?: string;
	TURNSTILE_SECRET_KEY?: string;
};

export type EnvConfig = {
	emailProvider: EmailProviderName;
	postmarkServerToken: string;
	postmarkFromEmail: string;
	postmarkToEmail: string;
	nodemailerHost: string;
	nodemailerPort?: number;
	nodemailerUser: string;
	nodemailerPass: string;
	nodemailerSecure?: boolean;
	nodemailerFromEmail: string;
	nodemailerToEmail: string;
	awsRegion: string;
	awsAccessKeyId: string;
	awsSecretAccessKey: string;
	awsSessionToken: string;
	sesFromEmail: string;
	sesToEmail: string;
	sesConfigurationSet: string;
	corsOrigin: string;
	turnstileSecretKey: string;
};

export const buildCorsHeaders = (origin?: string) => {
	const allowOrigin = origin && origin.length > 0 ? origin : "*";
	return {
		"Access-Control-Allow-Origin": allowOrigin,
		"Access-Control-Allow-Methods": "POST, OPTIONS",
		"Access-Control-Allow-Headers": "Content-Type",
		"Access-Control-Max-Age": "86400",
	};
};

const normalizeProvider = (value: string): EmailProviderName => {
	const normalized = value.toLowerCase();
	if (normalized === "nodemailer") return "nodemailer";
	if (normalized === "ses") return "ses";
	return "ses";
};

const getWorkerEnv = (): WorkerEnv | NodeJS.ProcessEnv => {
	try {
		return getCloudflareContext().env as WorkerEnv;
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

const toEnvNumber = async (value: unknown): Promise<number | undefined> => {
	const raw = await toEnvString(value);
	if (!raw) return undefined;
	const parsed = Number(raw);
	if (!Number.isFinite(parsed)) return undefined;
	return parsed;
};

const toEnvBoolean = async (value: unknown): Promise<boolean | undefined> => {
	const raw = (await toEnvString(value)).trim();
	if (!raw) return undefined;
	const normalized = raw.toLowerCase();
	if (["true", "1", "yes", "on"].includes(normalized)) return true;
	if (["false", "0", "no", "off"].includes(normalized)) return false;
	return undefined;
};

export const getEnv = async (): Promise<EnvConfig> => {
	const workerEnv = getWorkerEnv();
	const emailProvider = normalizeProvider(await toEnvString(workerEnv?.EMAIL_PROVIDER));

	return {
		emailProvider,
		postmarkServerToken: await toEnvString(workerEnv?.POSTMARK_SERVER_TOKEN),
		postmarkFromEmail: await toEnvString(workerEnv?.POSTMARK_FROM_EMAIL),
		postmarkToEmail: await toEnvString(workerEnv?.POSTMARK_TO_EMAIL),
		nodemailerHost: await toEnvString(workerEnv?.NODEMAILER_HOST),
		nodemailerPort: await toEnvNumber(workerEnv?.NODEMAILER_PORT),
		nodemailerUser: await toEnvString(workerEnv?.NODEMAILER_USER),
		nodemailerPass: await toEnvString(workerEnv?.NODEMAILER_PASS),
		nodemailerSecure: await toEnvBoolean(workerEnv?.NODEMAILER_SECURE),
		nodemailerFromEmail: await toEnvString(workerEnv?.NODEMAILER_FROM_EMAIL),
		nodemailerToEmail: await toEnvString(workerEnv?.NODEMAILER_TO_EMAIL),
		awsRegion: await toEnvString(workerEnv?.AWS_REGION),
		awsAccessKeyId: await toEnvString(workerEnv?.AWS_ACCESS_KEY_ID),
		awsSecretAccessKey: await toEnvString(workerEnv?.AWS_SECRET_ACCESS_KEY),
		awsSessionToken: await toEnvString(workerEnv?.AWS_SESSION_TOKEN),
		sesFromEmail: await toEnvString(workerEnv?.SES_FROM_EMAIL),
		sesToEmail: await toEnvString(workerEnv?.SES_TO_EMAIL),
		sesConfigurationSet: await toEnvString(workerEnv?.SES_CONFIGURATION_SET),
		corsOrigin: await toEnvString(workerEnv?.CORS_ORIGIN),
		turnstileSecretKey: await toEnvString(workerEnv?.TURNSTILE_SECRET_KEY),
	};
};
