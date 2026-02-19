import {SESv2Client, SendEmailCommand} from "@aws-sdk/client-sesv2";
import {EmailProviderError, type EmailMessage, type EmailProvider} from "./email_provider";

type SesConfig = {
	region: string;
	accessKeyId: string;
	secretAccessKey: string;
	sessionToken: string;
	configurationSetName: string;
};

const createClient = (config: SesConfig) => {
	return new SESv2Client({
		region: config.region,
		credentials: {
			accessKeyId: config.accessKeyId,
			secretAccessKey: config.secretAccessKey,
			sessionToken: config.sessionToken || undefined,
		},
	});
};

export const createSesProvider = (config: SesConfig): EmailProvider => {
	const client = createClient(config);
	const configurationSetName = config.configurationSetName || undefined;

	return {
		name: "ses",
		async sendEmail(message: EmailMessage, requestId?: string) {
			try {
				const command = new SendEmailCommand({
					FromEmailAddress: message.from,
					Destination: {
						ToAddresses: [message.to],
					},
					ReplyToAddresses: message.replyTo ? [message.replyTo] : undefined,
					Content: {
						Simple: {
							Subject: { Data: message.subject },
							Body: {
								Text: { Data: message.text },
							},
						},
					},
					ConfigurationSetName: configurationSetName,
				});
				const result = await client.send(command);
				console.log("send_email info: ses accepted", { requestId, messageId: result?.MessageId });
				return { messageId: result?.MessageId, raw: result };
			} catch (err) {
				const details = err instanceof Error ? err.message : "Network request failed";
				console.error("send_email error: ses request failed", { requestId, details });
				throw new EmailProviderError("SES request failed", details);
			}
		},
	};
};
