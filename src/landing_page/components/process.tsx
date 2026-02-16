export default function Process() {
	return (
		<section id="process">
			<div className="two">
				<div className="reveal">
					<div className="k gradient-text">How we work</div>
					<h2 style={{ margin: "10px 0 0", fontSize: "28px", letterSpacing: "-0.02em" }}>
						A tight loop from idea to impact.
					</h2>
					<p className="sub" style={{ marginTop: "12px" }}>
						We pair strategy with hands-on building. You get a working app early, then harden it into a secure,
						scalable product your team actually uses.
					</p>

					<div className="steps">
						<div className="step">
							<span className="bullet"></span>
							<span>Discover the workflow</span>
						</div>
						<div className="step">
							<span className="bullet"></span>
							<span>Build a working app</span>
						</div>
						<div className="step">
							<span className="bullet"></span>
							<span>Connect and harden</span>
						</div>
						<div className="step">
							<span className="bullet"></span>
							<span>Launch and improve</span>
						</div>
					</div>
				</div>

				<div className="card deliver reveal" style={{ transitionDelay: "100ms" }}>
					<div className="label">Deliverables</div>
					<div className="title">Everything you need to launch</div>

					<div className="dlist">
						<div className="ditem">
							<div className="check" aria-hidden="true">
								&#10003;
							</div>
							<span>App architecture &amp; integrations</span>
						</div>
						<div className="ditem">
							<div className="check" aria-hidden="true">
								&#10003;
							</div>
							<span>Smart behaviors tailored to your use case</span>
						</div>
						<div className="ditem">
							<div className="check" aria-hidden="true">
								&#10003;
							</div>
							<span>Quality checks and acceptance criteria</span>
						</div>
						<div className="ditem">
							<div className="check" aria-hidden="true">
								&#10003;
							</div>
							<span>Monitoring, performance, and cost controls</span>
						</div>
						<div className="ditem">
							<div className="check" aria-hidden="true">
								&#10003;
							</div>
							<span>Security review and rollout plan</span>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
