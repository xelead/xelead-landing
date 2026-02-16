import styles from "./background.module.css";

export default function Background() {
	return (
		<div className={styles.bg} aria-hidden="true">
			<div className={`${styles.orb} ${styles.orbTop}`}></div>
			<div className={`${styles.orb} ${styles.orbBottom}`}></div>
			<div className={styles.radials}></div>
			<div className={styles.grid}></div>
		</div>
	);
}
