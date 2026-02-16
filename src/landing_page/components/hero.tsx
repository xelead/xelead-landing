type HeroProps = {
	onStart: () => void;
	onHow: () => void;
};

export default function Hero({ onStart, onHow }: HeroProps) {
	return (
		<section className="hero">
			<div>
				<div className="pill reveal">
					<span className="dot"></span>
					Custom AI applications for modern businesses
				</div>

				<h2 className="headline reveal" style={{ transitionDelay: "80ms" }}>
					Build AI that fits your business-
					<span className="gradient-text">not the other way around.</span>
				</h2>

				<p className="sub reveal" style={{ transitionDelay: "140ms" }}>
					Xelead is a Dallas-based team that designs and delivers custom AI applications-end-to-end apps that fit your
					processes, your data, and your goals.
				</p>

				<div className="row wrap gap-12" style={{ marginTop: "18px" }}>
					<button
						className="btn btn-primary reveal"
						style={{ transitionDelay: "200ms" }}
						type="button"
						onClick={onStart}
					>
						Start a project <span aria-hidden="true">&rarr;</span>
					</button>
					<button
						className="btn reveal"
						style={{ transitionDelay: "240ms" }}
						type="button"
						onClick={onHow}
					>
						See how we work
					</button>
				</div>

				<div className="stats reveal" style={{ transitionDelay: "280ms" }}>
					<div className="stat">
						<div className="v">2-6 weeks</div>
						<div className="k">Fast builds</div>
					</div>
					<div className="stat">
						<div className="v">Enterprise</div>
						<div className="k">Security-first</div>
					</div>
					<div className="stat">
						<div className="v">Outcomes</div>
						<div className="k">Measurable ROI</div>
					</div>
				</div>
			</div>

			<div className="hero-card reveal" style={{ transitionDelay: "140ms" }}>
				<div className="inner card">
					<div className="h-top">
						<div>
							<div className="label">Example delivery</div>
							<div className="title">Custom AI App</div>
						</div>
						<div className="iconbox" aria-hidden="true">
							<svg
								width="18"
								height="18"
								viewBox="0 0 24 24"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path d="M13 2L3 14h8l-1 8 11-14h-8l0-6Z" fill="white" opacity="0.95" />
							</svg>
						</div>
					</div>

					<div className="list">
						<div className="item">
							<div className="t">Connects to your tools</div>
							<div className="d">
								Works with the systems you already use-without disruption.
							</div>
						</div>
						<div className="item">
							<div className="t">Built around your data</div>
							<div className="d">Uses your approved information so results stay consistent.</div>
						</div>
						<div className="item">
							<div className="t">Safe, controllable actions</div>
							<div className="d">Clear review steps and activity logs for confidence.</div>
						</div>
					</div>

					<div className="impact">
						<div className="row">
							<div style={{ fontSize: "13px", fontWeight: 600 }}>Typical impact</div>
							<div className="gradient-text" style={{ fontSize: "13px", fontWeight: 700 }}>
								15-35% time saved
							</div>
						</div>
						<div className="bar">
							<span></span>
						</div>
						<div className="footnote">Based on real-world app launches</div>
					</div>

					<div className="badges">
						<span className="badge">
							<span className="miniicon" aria-hidden="true">
								<svg
									width="14"
									height="14"
									viewBox="0 0 24 24"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path d="M12 2l7 4v6c0 5-3 9-7 10-4-1-7-5-7-10V6l7-4Z" fill="white" opacity="0.95" />
								</svg>
							</span>
							Privacy &amp; security
						</span>
						<span className="badge">Enterprise-ready</span>
						<span className="badge">Flexible hosting</span>
					</div>
				</div>
			</div>
		</section>
	);
}
