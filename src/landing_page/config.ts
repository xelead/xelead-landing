import type { UiConfig } from "@/types/ui_config";

type LandingPageConfig = {
	turnstileSiteKey: string;
	apiBaseUrl: string;
	assetsUrl: string;
};

function readUiConfig(): UiConfig {
	if (typeof window === "undefined" || !window.uiConfig) {
		return {};
	}
	return window.uiConfig;
}

function readPublicConfigValue(key: string): string {
	const value = readUiConfig()[key];
	return typeof value === "string" ? value : "";
}

export function getLandingPageConfig(): LandingPageConfig {
	return {
		turnstileSiteKey: readPublicConfigValue("NEXT_PUBLIC_TURNSTILE_SITE_KEY"),
		apiBaseUrl: readPublicConfigValue("NEXT_PUBLIC_API_BASE_URL"),
		assetsUrl: readPublicConfigValue("NEXT_PUBLIC_ASSETS_BASE_URL"),
	};
}
