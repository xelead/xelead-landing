import { initProposalDialog } from "./landing_page/proposalDialog";

function initApp() {
    const CONTACT: { phone: string; email: string; address: string } = {
        phone: "+1 (469) 567 0102",
        email: "dev [at] xelead.com",
        address: "539 W. Commerce St #1955, Dallas, Texas 75208, United States",
    };

    function el(id: string): HTMLElement {
        const node = document.getElementById(id);
        if (!node) throw new Error(`Missing element: ${id}`);
        return node;
    }

    // Inject contact + year
    for (const id of ["phone", "phone2"]) el(id).textContent = CONTACT.phone;
    for (const id of ["email", "email2"]) el(id).textContent = CONTACT.email;
    for (const id of ["address2"]) el(id).textContent = CONTACT.address;
    el("year").textContent = String(new Date().getFullYear());

    // Smooth anchor scrolling
    document.addEventListener("click", (e) => {
        const t = e.target instanceof HTMLElement ? e.target : null;
        const a = t?.closest("a");
        if (!a) return;
        const href = a.getAttribute("href") || "";
        if (!href.startsWith("#") || href === "#") return;
        const target = document.querySelector<HTMLElement>(href);
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
    });

    initProposalDialog();

    // CTA actions (placeholder for non-proposal buttons)
    document.addEventListener("click", (e) => {
        const t = e.target instanceof HTMLElement ? e.target : null;
        const btn = t?.closest("button[data-action]");
        if (!btn) return;
        const action = btn.getAttribute("data-action");
        if (!action || action === "proposal") return;

        const msg =
            action === "book"
                ? "We'll set up a time to talk. (Hook this to your booking link.)"
                : action === "how"
                    ? "We'll walk you through the process."
                    : "Let's start your project.";

        // eslint-disable-next-line no-alert
        alert(msg);
    });

    // Simple reveal on scroll
    const io = new IntersectionObserver(
        (entries) => {
            for (const entry of entries) {
                if (entry.isIntersecting) entry.target.classList.add("on");
            }
        },
        { threshold: 0.12 }
    );
    document.querySelectorAll(".reveal").forEach((n) => io.observe(n));
}

initApp();
