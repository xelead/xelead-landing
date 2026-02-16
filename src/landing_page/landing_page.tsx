"use client";

import { useCallback, useEffect, useRef } from "react";

import Background from "./components/background";
import Footer from "./components/footer";
import Header from "./components/header";
import Hero from "./components/hero";
import Outcomes from "./components/outcomes";
import Process from "./components/process";
import ProposalDialog, { ProposalDialogHandle } from "./components/proposal_dialog";
import Services from "./components/services";
import utilities from "./components/landing_utilities.module.css";

const CONTACT = {
	phone: "+1 (469) 567 0102",
	email: "dev [at] xelead.com",
	address: "539 W. Commerce St #1955, Dallas, Texas 75208, United States",
};

export default function LandingPage() {
	const dialogRef = useRef<ProposalDialogHandle>(null);

	const openProposal = useCallback(() => {
		dialogRef.current?.open();
	}, []);

	const handleAction = useCallback((action: "book" | "how" | "start") => {
		const message =
			action === "book"
				? "We'll set up a time to talk. (Hook this to your booking link.)"
				: action === "how"
					? "We'll walk you through the process."
					: "Let's start your project.";

		if (typeof window !== "undefined") {
			window.alert(message);
		}
	}, []);

	useEffect(() => {
		const elements = Array.from(document.querySelectorAll(`.${utilities.reveal}`));
		if (elements.length === 0) return;

		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) {
						entry.target.classList.add(utilities.revealActive);
					}
				}
			},
			{ threshold: 0.12 }
		);

		elements.forEach((element) => observer.observe(element));
		return () => observer.disconnect();
	}, []);

	return (
		<div className="landing">
			<Background />
			<Header phone={CONTACT.phone} email={CONTACT.email} onProposal={openProposal} />
			<main className={utilities.container}>
				<Hero onStart={() => handleAction("start")} onHow={() => handleAction("how")} />
				<Services />
				<Process />
				<Outcomes onProposal={openProposal} />
			</main>
			<Footer
				phone={CONTACT.phone}
				email={CONTACT.email}
				address={CONTACT.address}
				year={new Date().getFullYear()}
			/>
			<ProposalDialog ref={dialogRef} />
		</div>
	);
}
