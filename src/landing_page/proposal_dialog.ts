import { getPublicUiConfigValue } from "./config";
import { sendProposalEmail } from "./proposal_api";

type ProposalConfig = {
    apiBaseUrl: string;
};

type ProposalPayload = {
    email: string;
    comment: string;
    turnstileToken: string;
};

type TurnstileApi = {
    reset: (widgetId?: string) => void;
    render?: (
        container: HTMLElement,
        options: Record<string, string | ((token?: string) => void)>
    ) => string;
};

declare global {
    interface Window {
        turnstile?: TurnstileApi;
        proposalTurnstileCallback?: (token: string) => void;
        proposalTurnstileExpired?: () => void;
    }
}

function el(id: string): HTMLElement {
    const node = document.getElementById(id);
    if (!node) throw new Error(`Missing element: ${id}`);
    return node;
}

function readDialogConfig(dialog: HTMLDialogElement): ProposalConfig {
    const defaultApiBaseUrl = getPublicUiConfigValue("NEXT_PUBLIC_API_BASE_URL");
    const apiBaseUrl = dialog.getAttribute("data-api-base-url")?.trim() || defaultApiBaseUrl;
    return {
        apiBaseUrl,
    };
}

function setStatus(node: HTMLElement, tone: string, message: string): void {
    node.textContent = message;
    node.dataset.tone = tone;
}

function isTurnstileReady(): boolean {
    return typeof window !== "undefined" && typeof window.turnstile !== "undefined";
}

function setSubmitState(button: HTMLButtonElement, busy: boolean): void {
    button.disabled = busy;
    button.dataset.busy = busy ? "true" : "false";
}

function resetForm(form: HTMLFormElement, statusNode: HTMLParagraphElement): void {
    form.reset();
    statusNode.textContent = "";
    statusNode.dataset.tone = "";
    const token = form.querySelector<HTMLInputElement>("#proposalTurnstileToken");
    if (token) token.value = "";
    if (isTurnstileReady()) {
        try {
            if (window.turnstile) {
                window.turnstile.reset();
            }
        } catch (err) {
            console.warn("Turnstile reset failed", err);
        }
    }
}

function wireTurnstile(form: HTMLFormElement, statusNode: HTMLParagraphElement): void {
    const widget = form.querySelector<HTMLElement>(".cf-turnstile");
    const tokenInput = form.querySelector<HTMLInputElement>("#proposalTurnstileToken");

    if (!widget || !tokenInput) return;

    const defaultSiteKey = getPublicUiConfigValue("NEXT_PUBLIC_TURNSTILE_SITE_KEY");
    const siteKey = widget.getAttribute("data-sitekey")?.trim() || defaultSiteKey;
    if (siteKey) {
        widget.setAttribute("data-sitekey", siteKey);
    }

    window.proposalTurnstileCallback = (token: string) => {
        tokenInput.value = token;
        if (statusNode.dataset.tone === "error") {
            setStatus(statusNode, "", "");
        }
    };

    window.proposalTurnstileExpired = () => {
        tokenInput.value = "";
    };
}

async function sendProposal(config: ProposalConfig, payload: ProposalPayload): Promise<void> {
    await sendProposalEmail(config.apiBaseUrl || "", payload);
}

export function initProposalDialog(): void {
    const dialog = el("proposalDialog") as HTMLDialogElement;
    const form = el("proposalForm") as HTMLFormElement;
    const statusNode = el("proposalStatus") as HTMLParagraphElement;
    const submitButton = el("proposalSubmit") as HTMLButtonElement;
    const closeButton = el("proposalClose") as HTMLButtonElement;

    const config = readDialogConfig(dialog);
    wireTurnstile(form, statusNode);

    document.addEventListener("click", (event) => {
        const target = event.target instanceof HTMLElement ? event.target : null;
        const trigger = target?.closest("button[data-action=proposal]");
        if (!trigger) return;

        resetForm(form, statusNode);
        dialog.showModal();
    });

    closeButton.addEventListener("click", () => {
        dialog.close();
    });

    dialog.addEventListener("click", (event) => {
        const target = event.target instanceof HTMLElement ? event.target : null;
        if (target?.closest("[data-dialog-close]")) {
            dialog.close();
        }
    });

    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        const emailInput = el("proposalEmail") as HTMLInputElement;
        const commentInput = el("proposalComment") as HTMLTextAreaElement;
        const tokenInput = el("proposalTurnstileToken") as HTMLInputElement;

        if (!emailInput.value.trim()) {
            setStatus(statusNode, "error", "Please add a valid email address.");
            return;
        }
        if (!commentInput.value.trim()) {
            setStatus(statusNode, "error", "Please describe what you want to build.");
            return;
        }
        if (!tokenInput.value.trim()) {
            setStatus(statusNode, "error", "Please complete the captcha.");
            return;
        }
        setSubmitState(submitButton, true);
        setStatus(statusNode, "", "Sending...");

        try {
            await sendProposal(config, {
                email: emailInput.value.trim(),
                comment: commentInput.value.trim(),
                turnstileToken: tokenInput.value.trim(),
            });
            setStatus(statusNode, "success", "Thanks! We'll reply shortly.");
            form.reset();
        } catch (err) {
            const message = err instanceof Error ? err.message : "Something went wrong.";
            setStatus(statusNode, "error", message);
        } finally {
            setSubmitState(submitButton, false);
        }
    });
}
