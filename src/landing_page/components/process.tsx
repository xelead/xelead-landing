import styles from "./process.module.css";
import utilities from "./landing_utilities.module.css";

export default function Process() {
	return (
		<section id="process" className={styles.section}>
			<div className={styles.two}>
				<div className={utilities.reveal}>
					<div className={`${utilities.kicker} ${utilities.gradientText}`}>How we work</div>
					<h2 className={styles.heading}>A tight loop from idea to impact.</h2>
					<p className={utilities.sub} style={{ marginTop: "12px" }}>
						We pair strategy with hands-on building. You get a working app early, then harden it into a secure,
						scalable product your team actually uses.
					</p>

					<div className={styles.steps}>
						<div className={styles.step}>
							<span className={styles.stepBullet}></span>
							<span className={styles.stepText}>Discover the workflow</span>
						</div>
						<div className={styles.step}>
							<span className={styles.stepBullet}></span>
							<span className={styles.stepText}>Build a working app</span>
						</div>
						<div className={styles.step}>
							<span className={styles.stepBullet}></span>
							<span className={styles.stepText}>Connect and harden</span>
						</div>
						<div className={styles.step}>
							<span className={styles.stepBullet}></span>
							<span className={styles.stepText}>Launch and improve</span>
						</div>
					</div>
				</div>

				<div className={`${utilities.card} ${styles.deliver} ${utilities.reveal}`} style={{ transitionDelay: "100ms" }}>
					<div className={styles.deliverLabel}>Deliverables</div>
					<div className={styles.deliverTitle}>Everything you need to launch</div>

					<div className={styles.dlist}>
						<div className={styles.ditem}>
							<div className={styles.check} aria-hidden="true">
								&#10003;
							</div>
							<span className={styles.ditemText}>App architecture &amp; integrations</span>
						</div>
						<div className={styles.ditem}>
							<div className={styles.check} aria-hidden="true">
								&#10003;
							</div>
							<span className={styles.ditemText}>Smart behaviors tailored to your use case</span>
						</div>
						<div className={styles.ditem}>
							<div className={styles.check} aria-hidden="true">
								&#10003;
							</div>
							<span className={styles.ditemText}>Quality checks and acceptance criteria</span>
						</div>
						<div className={styles.ditem}>
							<div className={styles.check} aria-hidden="true">
								&#10003;
							</div>
							<span className={styles.ditemText}>Monitoring, performance, and cost controls</span>
						</div>
						<div className={styles.ditem}>
							<div className={styles.check} aria-hidden="true">
								&#10003;
							</div>
							<span className={styles.ditemText}>Security review and rollout plan</span>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
