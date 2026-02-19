import {SESv2Client, SendEmailCommand} from "@aws-sdk/client-sesv2";
import type {EnvConfig} from "./env_helpers";
import {EmailProviderError, type EmailMessage, type EmailProvider} from "./email_provider";

const createClient = (env: EnvConfig) => {
	return new SESv2Client({
		region: env.awsRegion,
		credentials: {
			accessKeyId: env.awsAccessKeyId,
			secretAccessKey: env.awsSecretAccessKey,
			sessionToken: env.awsSessionToken || undefined,
		},
	});
};

export const createSesProvider = (env: EnvConfig): EmailProvider => {
	const client = createClient(env);
	const configurationSetName = env.sesConfigurationSet || undefined;

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
