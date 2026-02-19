import type {EnvConfig, EmailProviderName} from "./env_helpers";
import {createNodemailerProvider} from "./nodemailer_provider";
import {createPostmarkProvider} from "./postmark_provider";
import {createSesProvider} from "./ses_provider";

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

export const getEmailConfigIssues = (env: EnvConfig) => {
	const issues: string[] = [];
	if (env.emailProvider === "nodemailer") {
		if (!env.nodemailerHost) issues.push(missingField("NODEMAILER_HOST"));
		if (!env.nodemailerPort) issues.push(missingField("NODEMAILER_PORT"));
		if ((env.nodemailerUser && !env.nodemailerPass) || (!env.nodemailerUser && env.nodemailerPass)) {
			issues.push("NODEMAILER_USER and NODEMAILER_PASS must be set together");
		}
		return issues;
	}

	if (env.emailProvider === "ses") {
		if (!env.awsRegion) issues.push(missingField("AWS_REGION"));
		if (!env.awsAccessKeyId) issues.push(missingField("AWS_ACCESS_KEY_ID"));
		if (!env.awsSecretAccessKey) issues.push(missingField("AWS_SECRET_ACCESS_KEY"));
		if (!env.notifyFromEmail) issues.push(missingField("NOTIFY_FROM_EMAIL"));
		if (!env.notifyToEmail) issues.push(missingField("NOTIFY_TO_EMAIL"));
		return issues;
	}

	if (!env.postmarkServerToken) issues.push(missingField("POSTMARK_SERVER_TOKEN"));
	if (!env.notifyFromEmail) issues.push(missingField("NOTIFY_FROM_EMAIL"));
	if (!env.notifyToEmail) issues.push(missingField("NOTIFY_TO_EMAIL"));
	return issues;
};

export const resolveFromTo = (env: EnvConfig) => {
	return {
		fromEmail: env.notifyFromEmail,
		toEmail: env.notifyToEmail,
	};
};

export const resolveEmailProvider = async (env: EnvConfig): Promise<EmailProvider> => {
	if (env.emailProvider === "nodemailer") {
		return await createNodemailerProvider(env);
	}

	if (env.emailProvider === "ses") {
		return createSesProvider(env);
	}

	return createPostmarkProvider(env);
};
