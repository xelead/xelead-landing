type HeaderProps = {
	phone: string;
	email: string;
	onProposal: () => void;
};

export default function Header({ phone, email, onProposal }: HeaderProps) {
	return (
		<header className="container">
			<div className="row between gap-16">
				<div className="brand">
					<div className="logo">
						<img src="/files/images/logo/xelead_logo.png" alt="Xelead logo" />
					</div>
					<div>
						<h1>Xelead</h1>
						<div className="meta">Dallas, TX</div>
						<div className="contact-mini">
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
						</div>
					</div>
				</div>

				<nav aria-label="Primary">
					<a href="#services">Services</a>
					<a href="#process">Process</a>
					<a href="#work">Outcomes</a>
				</nav>

				<div className="row gap-12">
					<button className="btn btn-primary" type="button" onClick={onProposal}>
						Get a proposal
						<span aria-hidden="true">&rarr;</span>
					</button>
				</div>
			</div>
		</header>
	);
}
