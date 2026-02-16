type FooterProps = {
	phone: string;
	email: string;
	address: string;
	year: number;
};

export default function Footer({ phone, email, address, year }: FooterProps) {
	return (
		<footer>
			<div className="container">
				<div className="footer">
					<div>
						<div className="row gap-12">
							<div className="logo" aria-hidden="true" style={{ width: "36px", height: "36px", borderRadius: "16px" }}>
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
								<div style={{ fontWeight: 700, fontSize: "14px" }}>Xelead</div>
								<div style={{ color: "var(--muted2)", fontSize: "12px", marginTop: "2px" }}>
									Custom AI applications &middot; Dallas
								</div>
							</div>
						</div>

						<div style={{ marginTop: "10px", color: "rgba(255,255,255,0.50)", fontSize: "12px" }}>
							&copy; {year} Xelead. All rights reserved.
						</div>
						<div className="contact-mini" style={{ marginTop: "10px" }}>
							<div className="line">
								<span className="chip">
									<span className="tiny-dot"></span>
									<span>{phone}</span>
								</span>
								<span className="chip">
									<span className="tiny-dot"></span>
									<span>{email}</span>
								</span>
							</div>
							<div style={{ marginTop: "6px", color: "rgba(255,255,255,0.55)" }}>{address}</div>
						</div>
					</div>

					<div className="links">
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
