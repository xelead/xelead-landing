type LandingPageConfig = {
	turnstileSiteKey: string;
	apiBaseUrl: string;
	assetsUrl: string;
};

export const landingPageConfig: LandingPageConfig = {
	turnstileSiteKey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "",
	apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL ?? "",
	assetsUrl: process.env.NEXT_PUBLIC_ASSETS_BASE_URL ?? ""
};

console.log("Configuration as:", landingPageConfig)
