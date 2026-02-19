import {
	forwardRef,
	useCallback,
	useEffect,
	useImperativeHandle,
	useRef,
	useState,
} from "react";

import { landingPageConfig } from "../config";
import { sendProposalEmail } from "../proposal_api";

declare global {
	interface Window {
		turnstile?: {
			reset: (widgetId?: string) => void;
			render?: (
				container: HTMLElement,
				options: Record<string, string | ((token?: string) => void)>
			) => string;
		};
	}
}

export type ProposalDialogHandle = {
	open: () => void;
	close: () => void;
};

type ProposalStatus = {
	tone: "" | "error" | "success";
	message: string;
};

const emptyStatus: ProposalStatus = { tone: "", message: "" };

const ProposalDialog = forwardRef<ProposalDialogHandle>(function ProposalDialog(_, ref) {
	const dialogRef = useRef<HTMLDialogElement>(null);
	const captchaRef = useRef<HTMLDivElement>(null);
	const turnstileWidgetId = useRef<string | null>(null);
	const turnstilePollRef = useRef<ReturnType<typeof setInterval> | null>(null);
	const [email, setEmail] = useState("");
	const [comment, setComment] = useState("");
	const [turnstileToken, setTurnstileToken] = useState("");
	const [status, setStatus] = useState<ProposalStatus>(emptyStatus);
	const [busy, setBusy] = useState(false);
	const [isOpen, setIsOpen] = useState(false);

	const { apiBaseUrl, turnstileSiteKey } = landingPageConfig;

	const resetForm = useCallback(() => {
		setEmail("");
		setComment("");
		setTurnstileToken("");
		setStatus(emptyStatus);
		setBusy(false);
		if (typeof window !== "undefined") {
			try {
				if (turnstileWidgetId.current) {
					window.turnstile?.reset(turnstileWidgetId.current);
				}
			} catch (err) {
				console.warn("Turnstile reset failed", err);
			}
		}
	}, []);

	const renderTurnstile = useCallback(() => {
		if (typeof window === "undefined") return;
		if (!turnstileSiteKey) return;
		if (!window.turnstile?.render) return;

		const container = captchaRef.current;
		if (!container) return;
		if (container.dataset.turnstileRendered === "true") return;

		try {
			const widgetId = window.turnstile.render(container, {
				sitekey: turnstileSiteKey,
				callback: (token?: string) => {
					if (token) {
						setTurnstileToken(token);
						setStatus((prev) => (prev.tone === "error" ? emptyStatus : prev));
					}
				},
				"expired-callback": () => {
					setTurnstileToken("");
				},
			});
			turnstileWidgetId.current = widgetId;
			container.dataset.turnstileRendered = "true";
			return true;
		} catch (err) {
			console.warn("Turnstile render failed", err);
		}

		return false;
	}, [turnstileSiteKey]);

	const open = useCallback(() => {
		resetForm();
		dialogRef.current?.showModal();
		setIsOpen(true);
	}, [resetForm]);

	const close = useCallback(() => {
		dialogRef.current?.close();
		setIsOpen(false);
	}, []);

	useEffect(() => {
		if (!isOpen) return;

		if (renderTurnstile()) {
			return;
		}

		if (turnstilePollRef.current) {
			clearInterval(turnstilePollRef.current);
		}

		let attempts = 0;
		turnstilePollRef.current = setInterval(() => {
			attempts += 1;
			if (renderTurnstile() || attempts > 20) {
				if (turnstilePollRef.current) {
					clearInterval(turnstilePollRef.current);
					turnstilePollRef.current = null;
				}
			}
		}, 250);

		return () => {
			if (turnstilePollRef.current) {
				clearInterval(turnstilePollRef.current);
				turnstilePollRef.current = null;
			}
		};
	}, [isOpen, renderTurnstile]);

	useImperativeHandle(
		ref,
		() => ({
			open,
			close,
		}),
		[open, close]
	);

	const handleSubmit = useCallback(
		async (event: React.FormEvent<HTMLFormElement>) => {
			event.preventDefault();
			if (!email.trim()) {
				setStatus({ tone: "error", message: "Please add a valid email address." });
				return;
			}
			if (!comment.trim()) {
				setStatus({ tone: "error", message: "Please describe what you want to build." });
				return;
			}
			if (!turnstileToken.trim()) {
				setStatus({ tone: "error", message: "Please complete the captcha." });
				return;
			}

			setBusy(true);
			setStatus({ tone: "", message: "Sending..." });

			try {
				const response = await sendProposalEmail(apiBaseUrl || "", {
					email: email.trim(),
					comment: comment.trim(),
					turnstileToken: turnstileToken.trim(),
				});
				console.log("proposal email sent", {
					requestId: response?.requestId,
					messageId: response?.messageId,
				});
				setStatus({ tone: "success", message: "Thanks! We'll reply shortly." });
				setEmail("");
				setComment("");
				setTurnstileToken("");
			} catch (err) {
				const message = err instanceof Error ? err.message : "Something went wrong.";
				setStatus({ tone: "error", message });
			} finally {
				setBusy(false);
			}
		},
		[email, comment, turnstileToken, apiBaseUrl]
	);

	return (
		<dialog
			id="proposalDialog"
			className="proposal-dialog"
			data-api-base-url={apiBaseUrl}
			aria-labelledby="proposalTitle"
			ref={dialogRef}
			onClose={() => setIsOpen(false)}
		>
			<div className="proposal-shell">
				<div className="proposal-head">
					<div>
						<p className="proposal-kicker">Project intake</p>
						<h3 id="proposalTitle">Get a proposal</h3>
						<p className="proposal-sub">Share the essentials and we will respond with a short proposal.</p>
					</div>
					<button className="dialog-close" type="button" aria-label="Close dialog" onClick={close}>
						&times;
					</button>
				</div>

				<form className="proposal-form" noValidate onSubmit={handleSubmit}>
					<label className="field">
						<span>Email</span>
						<input
							name="email"
							type="email"
							autoComplete="email"
							required
							placeholder="you@company.com"
							value={email}
							onChange={(event) => setEmail(event.target.value)}
						/>
					</label>

					<label className="field">
						<span>Comment</span>
						<textarea
							name="comment"
							rows={3}
							required
							placeholder="What are you building and when do you want to launch?"
							value={comment}
							onChange={(event) => setComment(event.target.value)}
						></textarea>
					</label>

					<input name="turnstileToken" type="hidden" value={turnstileToken} />
					<div className="proposal-captcha">
						{turnstileSiteKey ? (
							<div
								ref={captchaRef}
								className="cf-turnstile"
							></div>
						) : (
							<span>Turnstile site key missing.</span>
						)}
					</div>

					<p className="proposal-status" role="status" aria-live="polite" data-tone={status.tone}>
						{status.message}
					</p>

					<div className="proposal-actions">
						<button className="btn" type="button" data-dialog-close="true" onClick={close}>
							Cancel
						</button>
						<button
							className="btn btn-primary"
							type="submit"
							disabled={busy}
							data-busy={busy}
						>
							Send request
						</button>
					</div>
				</form>
			</div>
		</dialog>
	);
});

export default ProposalDialog;
