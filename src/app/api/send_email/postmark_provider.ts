import postmark from "postmark";
import type {EnvConfig} from "./env_helpers";
import {EmailProviderError, type EmailMessage, type EmailProvider} from "./email_provider";

const POSTMARK_MESSAGE_STREAM = "user-management";

export const createPostmarkProvider = (env: EnvConfig): EmailProvider => {
	const {postmarkServerToken} = env;

	return {
		name: "postmark",
		async sendEmail(message: EmailMessage, requestId?: string) {
			const client = new postmark.ServerClient(postmarkServerToken);
			let postmarkPayload:
				| { MessageID?: string; Message?: string; ErrorCode?: number; To?: string; SubmittedAt?: string }
				| undefined;

			try {
				postmarkPayload = await client.sendEmail({
					From: message.from,
					To: message.to,
					ReplyTo: message.replyTo,
					Subject: message.subject,
					MessageStream: POSTMARK_MESSAGE_STREAM,
					TextBody: message.text,
				});
			} catch (err) {
				const details = err instanceof Error ? err.message : "Network request failed";
				console.error("send_email error: postmark request failed", { requestId, details });
				throw new EmailProviderError("Postmark request failed", details);
			}

			if (!postmarkPayload || (typeof postmarkPayload.ErrorCode === "number" && postmarkPayload.ErrorCode !== 0)) {
				const errorDetails =
					typeof postmarkPayload?.Message === "string" ? postmarkPayload.Message : "Postmark error";
				console.error("send_email error: postmark response not ok", { requestId, errorDetails });
				throw new EmailProviderError("Failed to send email", errorDetails);
			}

			console.log("send_email info: postmark accepted", { requestId, postmarkPayload });
			return { messageId: postmarkPayload?.MessageID, raw: postmarkPayload };
		},
	};
};
