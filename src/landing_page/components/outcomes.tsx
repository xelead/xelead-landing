import styles from "./outcomes.module.css";
import utilities from "./landing_utilities.module.css";

type OutcomesProps = {
	onProposal: () => void;
};

export default function Outcomes({ onProposal }: OutcomesProps) {
	return (
		<section id="work" className={styles.section}>
			<div className={`${styles.outcomes} ${utilities.reveal}`}>
				<div className={styles.outgrid}>
					<div>
						<div className={`${utilities.kicker} ${utilities.gradientText}`}>Outcomes</div>
						<h2 className={styles.heading}>Launch smarter workflows-without new headcount.</h2>
						<p className={utilities.sub} style={{ marginTop: "12px" }}>
							Our work focuses on measurable impact: faster cycle times, higher quality, and better decision-making.
						</p>
						<div className={styles.tags}>
							<span className={styles.tag}>Reduce manual effort</span>
							<span className={styles.tag}>Improve resolution</span>
							<span className={styles.tag}>Boost conversion</span>
							<span className={styles.tag}>Decrease errors</span>
						</div>
					</div>

					<div className={styles.metrics}>
						<div className={styles.metric}>
							<div className={styles.metricKey}>Time saved</div>
							<div className={`${styles.metricValue} ${utilities.gradientText}`}>15-35%</div>
						</div>
						<div className={styles.metric}>
							<div className={styles.metricKey}>Faster turnaround</div>
							<div className={`${styles.metricValue} ${utilities.gradientText}`}>2-5x</div>
						</div>
						<div className={styles.metric}>
							<div className={styles.metricKey}>Adoption</div>
							<div className={`${styles.metricValue} ${utilities.gradientText}`}>Built for users</div>
						</div>
					</div>
				</div>

				<div className={styles.cta}>
					<div>
						<div className={styles.ctaHeading}>Ready to explore an AI build?</div>
						<div className={styles.ctaSub}>
							Tell us your workflow and we'll propose a path to production.
						</div>
					</div>
					<div className={`${utilities.row} ${utilities.wrap} ${utilities.gap12}`}>
						<button className={`${utilities.btn} ${utilities.btnPrimary} ${styles.ctaButton}`} type="button" onClick={onProposal}>
							Get a proposal <span aria-hidden="true">&rarr;</span>
						</button>
					</div>
				</div>
			</div>
		</section>
	);
}
