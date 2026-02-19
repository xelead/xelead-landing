import {getEnvString} from "./env_helpers";
import {createNodemailerProvider} from "./nodemailer_provider";
import {createPostmarkProvider} from "./postmark_provider";
import {createSesProvider} from "./ses_provider";

export type EmailProviderName = "postmark" | "nodemailer" | "ses";

export type EmailMessage = {
	from: string;
	to: string;
	replyTo?: string;
	subject: string;
	text: string;
};

export type EmailSendResult = {
	messageId?: string;
	raw?: unknown;
};

export class EmailProviderError extends Error {
	details?: string;

	constructor(message: string, details?: string) {
		super(message);
		this.details = details;
	}
}

export type EmailProvider = {
	name: EmailProviderName;
	sendEmail: (message: EmailMessage, requestId?: string) => Promise<EmailSendResult>;
};

const missingField = (label: string) => `Missing ${label}`;

const normalizeProvider = (value: string): EmailProviderName => {
	const normalized = value.toLowerCase();
	if (normalized === "nodemailer") return "nodemailer";
	if (normalized === "ses") return "ses";
	return "ses";
};

const getProvider = async (): Promise<EmailProviderName> => {
	return normalizeProvider(await getEnvString("EMAIL_PROVIDER"));
};

const getEnvNumber = async (key: Parameters<typeof getEnvString>[0]) => {
	const raw = await getEnvString(key);
	if (!raw) return undefined;
	const parsed = Number(raw);
	if (!Number.isFinite(parsed)) return undefined;
	return parsed;
};

const getEnvBoolean = async (key: Parameters<typeof getEnvString>[0]) => {
	const raw = (await getEnvString(key)).trim();
	if (!raw) return undefined;
	const normalized = raw.toLowerCase();
	if (["true", "1", "yes", "on"].includes(normalized)) return true;
	if (["false", "0", "no", "off"].includes(normalized)) return false;
	return undefined;
};

export const getEmailConfigIssues = async () => {
	const issues: string[] = [];
	const provider = await getProvider();
	if (provider === "nodemailer") {
		const nodemailerHost = await getEnvString("NODEMAILER_HOST");
		const nodemailerPort = await getEnvNumber("NODEMAILER_PORT");
		const nodemailerUser = await getEnvString("NODEMAILER_USER");
		const nodemailerPass = await getEnvString("NODEMAILER_PASS");

		if (!nodemailerHost) issues.push(missingField("NODEMAILER_HOST"));
		if (!nodemailerPort) issues.push(missingField("NODEMAILER_PORT"));
		if (!(await getEnvString("NOTIFY_FROM_EMAIL"))) issues.push(missingField("NOTIFY_FROM_EMAIL"));
		if (!(await getEnvString("NOTIFY_TO_EMAIL"))) issues.push(missingField("NOTIFY_TO_EMAIL"));
		if ((nodemailerUser && !nodemailerPass) || (!nodemailerUser && nodemailerPass)) {
			issues.push("NODEMAILER_USER and NODEMAILER_PASS must be set together");
		}
		return issues;
	}

	if (provider === "ses") {
		if (!(await getEnvString("AWS_REGION"))) issues.push(missingField("AWS_REGION"));
		if (!(await getEnvString("AWS_ACCESS_KEY_ID"))) issues.push(missingField("AWS_ACCESS_KEY_ID"));
		if (!(await getEnvString("AWS_SECRET_ACCESS_KEY"))) issues.push(missingField("AWS_SECRET_ACCESS_KEY"));
		if (!(await getEnvString("NOTIFY_FROM_EMAIL"))) issues.push(missingField("NOTIFY_FROM_EMAIL"));
		if (!(await getEnvString("NOTIFY_TO_EMAIL"))) issues.push(missingField("NOTIFY_TO_EMAIL"));
		return issues;
	}

	if (!(await getEnvString("POSTMARK_SERVER_TOKEN"))) issues.push(missingField("POSTMARK_SERVER_TOKEN"));
	if (!(await getEnvString("NOTIFY_FROM_EMAIL"))) issues.push(missingField("NOTIFY_FROM_EMAIL"));
	if (!(await getEnvString("NOTIFY_TO_EMAIL"))) issues.push(missingField("NOTIFY_TO_EMAIL"));
	return issues;
};

export const resolveFromTo = async () => {
	return {
		fromEmail: await getEnvString("NOTIFY_FROM_EMAIL"),
		toEmail: await getEnvString("NOTIFY_TO_EMAIL"),
	};
};

export const resolveEmailProvider = async (): Promise<EmailProvider> => {
	const provider = await getProvider();
	if (provider === "nodemailer") {
		return await createNodemailerProvider({
			host: await getEnvString("NODEMAILER_HOST"),
			port: await getEnvNumber("NODEMAILER_PORT"),
			secure: await getEnvBoolean("NODEMAILER_SECURE"),
			user: await getEnvString("NODEMAILER_USER"),
			pass: await getEnvString("NODEMAILER_PASS"),
		});
	}

	if (provider === "ses") {
		return createSesProvider({
			region: await getEnvString("AWS_REGION"),
			accessKeyId: await getEnvString("AWS_ACCESS_KEY_ID"),
			secretAccessKey: await getEnvString("AWS_SECRET_ACCESS_KEY"),
			sessionToken: await getEnvString("AWS_SESSION_TOKEN"),
			configurationSetName: await getEnvString("SES_CONFIGURATION_SET"),
		});
	}

	return createPostmarkProvider({
		serverToken: await getEnvString("POSTMARK_SERVER_TOKEN"),
	});
};
