type OutcomesProps = {
	onProposal: () => void;
};

export default function Outcomes({ onProposal }: OutcomesProps) {
	return (
		<section id="work">
			<div className="outcomes reveal">
				<div className="outgrid">
					<div>
						<div className="k gradient-text">Outcomes</div>
						<h2 style={{ margin: "10px 0 0", fontSize: "28px", letterSpacing: "-0.02em" }}>
							Launch smarter workflows-without new headcount.
						</h2>
						<p className="sub" style={{ marginTop: "12px" }}>
							Our work focuses on measurable impact: faster cycle times, higher quality, and better decision-making.
						</p>
						<div className="tags">
							<span className="tag">Reduce manual effort</span>
							<span className="tag">Improve resolution</span>
							<span className="tag">Boost conversion</span>
							<span className="tag">Decrease errors</span>
						</div>
					</div>

					<div className="metrics">
						<div className="metric">
							<div className="k">Time saved</div>
							<div className="v gradient-text">15-35%</div>
						</div>
						<div className="metric">
							<div className="k">Faster turnaround</div>
							<div className="v gradient-text">2-5x</div>
						</div>
						<div className="metric">
							<div className="k">Adoption</div>
							<div className="v gradient-text">Built for users</div>
						</div>
					</div>
				</div>

				<div className="cta">
					<div>
						<div style={{ fontWeight: 700 }}>Ready to explore an AI build?</div>
						<div style={{ marginTop: "6px", color: "var(--muted2)", fontSize: "14px" }}>
							Tell us your workflow and we'll propose a path to production.
						</div>
					</div>
					<div className="row wrap gap-12">
						<button className="btn btn-primary" type="button" onClick={onProposal}>
							Get a proposal <span aria-hidden="true">&rarr;</span>
						</button>
					</div>
				</div>
			</div>
		</section>
	);
}
