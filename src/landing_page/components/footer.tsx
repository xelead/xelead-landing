import styles from "./footer.module.css";
import utilities from "./landing_utilities.module.css";

type FooterProps = {
	phone: string;
	email: string;
	address: string;
	year: number;
};

export default function Footer({ phone, email, address, year }: FooterProps) {
	return (
		<footer className={styles.footerSection}>
			<div className={utilities.container}>
				<div className={styles.footer}>
					<div>
						<div className={`${utilities.row} ${utilities.gap12}`}>
							<div className={utilities.logo} aria-hidden="true" style={{ width: "36px", height: "36px", borderRadius: "16px" }}>
								<svg
									width="16"
									height="16"
									viewBox="0 0 24 24"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path d="M12 2l1.2 5.2L18 8l-4.8 0.8L12 14l-1.2-5.2L6 8l4.8-0.8L12 2Z" fill="white" opacity="0.95" />
								</svg>
							</div>
							<div>
								<div className={styles.brandName}>Xelead</div>
								<div className={styles.brandMeta}>Custom AI applications &middot; Dallas</div>
							</div>
						</div>

						<div className={styles.note}>&copy; {year} Xelead. All rights reserved.</div>
						<div className={utilities.contactMini} style={{ marginTop: "10px" }}>
							<div className={utilities.contactLine}>
								<span className={utilities.contactChip}>
									<span className={utilities.tinyDot}></span>
									<span>{phone}</span>
								</span>
								<span className={utilities.contactChip}>
									<span className={utilities.tinyDot}></span>
									<span>{email}</span>
								</span>
							</div>
							<div className={styles.address}>{address}</div>
						</div>
					</div>

					<div className={styles.links}>
						<a href="#services">Services</a>
						<a href="#process">Process</a>
						<a href="#work">Outcomes</a>
						<a href="#" aria-disabled="true">
							Privacy
						</a>
					</div>
				</div>
			</div>
		</footer>
	);
}
