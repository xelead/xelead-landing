import styles from "./hero.module.css";
import utilities from "./landing_utilities.module.css";

type HeroProps = {
	onStart: () => void;
	onHow: () => void;
};

export default function Hero({ onStart, onHow }: HeroProps) {
	return (
		<section className={styles.hero}>
			<div>
				<div className={`${utilities.pill} ${utilities.reveal}`}>
					<span className={utilities.dot}></span>
					Custom AI applications for modern businesses
				</div>

				<h2 className={`${styles.headline} ${utilities.reveal}`} style={{ transitionDelay: "80ms" }}>
					Build AI that fits your business-
					<span className={utilities.gradientText}>not the other way around.</span>
				</h2>

				<p className={`${utilities.sub} ${utilities.reveal}`} style={{ transitionDelay: "140ms" }}>
					Xelead is a Dallas-based team that designs and delivers custom AI applications-end-to-end apps that fit your
					processes, your data, and your goals.
				</p>

				<div className={`${utilities.row} ${utilities.wrap} ${utilities.gap12} ${styles.actionRow}`}>
					<button
						className={`${utilities.btn} ${utilities.btnPrimary} ${utilities.reveal} ${styles.actionButton}`}
						style={{ transitionDelay: "200ms" }}
						type="button"
						onClick={onStart}
					>
						Start a project <span aria-hidden="true">&rarr;</span>
					</button>
					<button
						className={`${utilities.btn} ${utilities.reveal} ${styles.actionButton}`}
						style={{ transitionDelay: "240ms" }}
						type="button"
						onClick={onHow}
					>
						See how we work
					</button>
				</div>

				<div className={`${styles.stats} ${utilities.reveal}`} style={{ transitionDelay: "280ms" }}>
					<div className={styles.stat}>
						<div className={styles.statValue}>2-6 weeks</div>
						<div className={styles.statKey}>Fast builds</div>
					</div>
					<div className={styles.stat}>
						<div className={styles.statValue}>Enterprise</div>
						<div className={styles.statKey}>Security-first</div>
					</div>
					<div className={styles.stat}>
						<div className={styles.statValue}>Outcomes</div>
						<div className={styles.statKey}>Measurable ROI</div>
					</div>
				</div>
			</div>

			<div className={`${styles.heroCard} ${utilities.reveal}`} style={{ transitionDelay: "140ms" }}>
				<div className={`${styles.heroCardInner} ${utilities.card}`}>
					<div className={styles.heroTop}>
						<div>
							<div className={styles.heroLabel}>Example delivery</div>
							<div className={styles.heroTitle}>Custom AI App</div>
						</div>
						<div className={styles.iconbox} aria-hidden="true">
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

					<div className={styles.list}>
						<div className={styles.item}>
							<div className={styles.itemTitle}>Connects to your tools</div>
							<div className={styles.itemDesc}>
								Works with the systems you already use-without disruption.
							</div>
						</div>
						<div className={styles.item}>
							<div className={styles.itemTitle}>Built around your data</div>
							<div className={styles.itemDesc}>Uses your approved information so results stay consistent.</div>
						</div>
						<div className={styles.item}>
							<div className={styles.itemTitle}>Safe, controllable actions</div>
							<div className={styles.itemDesc}>Clear review steps and activity logs for confidence.</div>
						</div>
					</div>

					<div className={styles.impact}>
						<div className={`${utilities.row} ${styles.impactHeader}`}>
							<div style={{ fontSize: "13px", fontWeight: 600 }}>Typical impact</div>
							<div className={utilities.gradientText} style={{ fontSize: "13px", fontWeight: 700 }}>
								15-35% time saved
							</div>
						</div>
						<div className={styles.bar}>
							<span className={styles.barFill}></span>
						</div>
						<div className={styles.footnote}>Based on real-world app launches</div>
					</div>

					<div className={styles.badges}>
						<span className={styles.badge}>
							<span className={styles.miniicon} aria-hidden="true">
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
						<span className={styles.badge}>Enterprise-ready</span>
						<span className={styles.badge}>Flexible hosting</span>
					</div>
				</div>
			</div>
		</section>
	);
}
