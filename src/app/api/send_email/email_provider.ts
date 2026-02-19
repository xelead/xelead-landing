import type {EnvConfig, EmailProviderName} from "./env_helpers";
import {createNodemailerProvider} from "./nodemailer_provider";
import {createPostmarkProvider} from "./postmark_provider";

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
		if (!env.nodemailerFromEmail) issues.push(missingField("NODEMAILER_FROM_EMAIL"));
		if (!env.nodemailerToEmail) issues.push(missingField("NODEMAILER_TO_EMAIL"));
		if ((env.nodemailerUser && !env.nodemailerPass) || (!env.nodemailerUser && env.nodemailerPass)) {
			issues.push("NODEMAILER_USER and NODEMAILER_PASS must be set together");
		}
		return issues;
	}

	if (!env.postmarkServerToken) issues.push(missingField("POSTMARK_SERVER_TOKEN"));
	if (!env.postmarkFromEmail) issues.push(missingField("POSTMARK_FROM_EMAIL"));
	if (!env.postmarkToEmail) issues.push(missingField("POSTMARK_TO_EMAIL"));
	return issues;
};

export const resolveFromTo = (env: EnvConfig) => {
	if (env.emailProvider === "nodemailer") {
		return {
			fromEmail: env.nodemailerFromEmail,
			toEmail: env.nodemailerToEmail,
		};
	}

	return {
		fromEmail: env.postmarkFromEmail,
		toEmail: env.postmarkToEmail,
	};
};

export const resolveEmailProvider = async (env: EnvConfig): Promise<EmailProvider> => {
	if (env.emailProvider === "nodemailer") {
		return await createNodemailerProvider(env);
	}

	return createPostmarkProvider(env);
};
