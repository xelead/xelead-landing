import {EmailProviderError, type EmailMessage, type EmailProvider} from "./email_provider";

type NodemailerConfig = {
	host: string;
	port?: number;
	secure?: boolean;
	user: string;
	pass: string;
};

const createTransport = async (config: NodemailerConfig) => {
	try {
		const nodemailer = await import("nodemailer");
		return nodemailer.createTransport({
			host: config.host,
			port: config.port,
			secure: config.secure ?? false,
			auth: config.user && config.pass
				? { user: config.user, pass: config.pass }
				: undefined,
		});
	} catch (err) {
		const details = err instanceof Error ? err.message : "Failed to load nodemailer";
		throw new EmailProviderError("Nodemailer unavailable", details);
	}
};

export const createNodemailerProvider = async (config: NodemailerConfig): Promise<EmailProvider> => {
	const transport = await createTransport(config);

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
