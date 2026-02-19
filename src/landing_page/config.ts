import type { UiConfig } from "@/types/ui_config";

function readUiConfig(): UiConfig {
	if (typeof window === "undefined" || !window.uiConfig) {
		return {};
	}
	return window.uiConfig;
}

export function getPublicUiConfigValue(key: string): string {
	const value = readUiConfig()[key];
	return typeof value === "string" ? value : "";
}
