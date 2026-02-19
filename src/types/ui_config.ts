export type UiConfig = Record<string, string>;

declare global {
	interface Window {
		uiConfig?: UiConfig;
	}
}
