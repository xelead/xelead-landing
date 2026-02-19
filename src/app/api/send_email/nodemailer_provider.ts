import type {EnvConfig} from "./env_helpers";
import {EmailProviderError, type EmailMessage, type EmailProvider} from "./email_provider";

const createTransport = async (env: EnvConfig) => {
	try {
		const nodemailer = await import("nodemailer");
		return nodemailer.createTransport({
			host: env.nodemailerHost,
			port: env.nodemailerPort,
			secure: env.nodemailerSecure ?? false,
			auth: env.nodemailerUser && env.nodemailerPass
				? { user: env.nodemailerUser, pass: env.nodemailerPass }
				: undefined,
		});
	} catch (err) {
		const details = err instanceof Error ? err.message : "Failed to load nodemailer";
		throw new EmailProviderError("Nodemailer unavailable", details);
	}
};

export const createNodemailerProvider = async (env: EnvConfig): Promise<EmailProvider> => {
	const transport = await createTransport(env);

	return {
		name: "nodemailer",
		async sendEmail(message: EmailMessage, requestId?: string) {
			try {
				const info = await transport.sendMail({
					from: message.from,
					to: message.to,
					replyTo: message.replyTo,
					subject: message.subject,
					text: message.text,
				});
				console.log("send_email info: nodemailer accepted", { requestId, messageId: info?.messageId });
				return { messageId: info?.messageId, raw: info };
			} catch (err) {
				const details = err instanceof Error ? err.message : "Network request failed";
				console.error("send_email error: nodemailer request failed", { requestId, details });
				throw new EmailProviderError("Nodemailer request failed", details);
			}
		},
	};
};
