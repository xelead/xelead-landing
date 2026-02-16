import styles from "./header.module.css";
import utilities from "./landing_utilities.module.css";

type HeaderProps = {
	phone: string;
	email: string;
	onProposal: () => void;
};

export default function Header({ phone, email, onProposal }: HeaderProps) {
	return (
		<header className={`${utilities.container} ${styles.header}`}>
			<div className={`${utilities.row} ${utilities.between} ${utilities.gap16} ${styles.headerRow}`}>
				<div className={styles.brand}>
					<div className={utilities.logo}>
						<img src="/files/images/logo/xelead_logo.png" alt="Xelead logo" />
					</div>
					<div>
						<h1 className={styles.brandTitle}>Xelead</h1>
						<div className={styles.meta}>Dallas, TX</div>
						<div className={utilities.contactMini}>
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
						</div>
					</div>
				</div>

				<nav className={styles.nav} aria-label="Primary">
					<a href="#services">Services</a>
					<a href="#process">Process</a>
					<a href="#work">Outcomes</a>
				</nav>

				<div className={`${utilities.row} ${utilities.gap12} ${styles.headerActions}`}>
					<button className={`${utilities.btn} ${utilities.btnPrimary}`} type="button" onClick={onProposal}>
						Get a proposal
						<span aria-hidden="true">&rarr;</span>
					</button>
				</div>
			</div>
		</header>
	);
}
