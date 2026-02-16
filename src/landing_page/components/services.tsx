export default function Services() {
	return (
		<section id="services">
			<div className="section-head">
				<div>
					<div className="k gradient-text">What we do</div>
					<h2>Custom AI, built to deploy.</h2>
				</div>
				<div className="r">Minimal process. Clear milestones. Production-ready deliverables.</div>
			</div>

			<div className="grid3">
				<div className="card svc reveal">
					<div className="ico" aria-hidden="true">
						<svg
							width="18"
							height="18"
							viewBox="0 0 24 24"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path d="M13 2L3 14h8l-1 8 11-14h-8l0-6Z" fill="white" />
						</svg>
					</div>
					<h3>Custom AI apps</h3>
					<p>Build internal apps that automate work, reduce errors, and speed up decisions.</p>
				</div>

				<div className="card svc reveal" style={{ transitionDelay: "80ms" }}>
					<div className="ico" aria-hidden="true">
						<svg
							width="18"
							height="18"
							viewBox="0 0 24 24"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path d="M12 2l1.2 5.2L18 8l-4.8 0.8L12 14l-1.2-5.2L6 8l4.8-0.8L12 2Z" fill="white" />
						</svg>
					</div>
					<h3>Workflow integrations</h3>
					<p>Connect to CRM, inbox, docs, and ticketing-so the app fits your team's flow.</p>
				</div>

				<div className="card svc reveal" style={{ transitionDelay: "140ms" }}>
					<div className="ico" aria-hidden="true">
						<svg
							width="18"
							height="18"
							viewBox="0 0 24 24"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path d="M12 2l7 4v6c0 5-3 9-7 10-4-1-7-5-7-10V6l7-4Z" fill="white" />
						</svg>
					</div>
					<h3>Security &amp; reliability</h3>
					<p>Designed for real use: permissions, auditability, and dependable performance.</p>
				</div>
			</div>
		</section>
	);
}
