import Script from "next/script";

import LandingPage from "@/landing_page/landing_page";

export default function Home() {
	return (
		<>
			<Script src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit" async defer />
			<LandingPage />
		</>
	);
}
