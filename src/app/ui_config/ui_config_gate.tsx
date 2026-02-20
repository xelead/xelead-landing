"use client";

import { useEffect, useState } from "react";

import type { UiConfig } from "@/types/ui_config";
import { UI_CONFIG_UPDATED_EVENT } from "./ui_config_shared";

type UiConfigGateProps = {
	children: React.ReactNode;
};

function setHeadLink(rel: string, href: string) {
	const selector = `link[rel="${rel}"]`;
	let link = document.head.querySelector<HTMLLinkElement>(selector);
	if (!link) {
		link = document.createElement("link");
		link.setAttribute("rel", rel);
		document.head.appendChild(link);
	}
	link.setAttribute("href", href);
}

function applyFaviconConfig(config: UiConfig) {
	const assetsBaseUrl = (config.NEXT_PUBLIC_ASSETS_BASE_URL || "").replace(/\/$/, "");
	if (!assetsBaseUrl) return;

	const faviconUrl = `${assetsBaseUrl}/files/images/favicon/fav_icon.png`;
	setHeadLink("icon", faviconUrl);
	setHeadLink("shortcut icon", faviconUrl);
	setHeadLink("apple-touch-icon", faviconUrl);
}

export default function UiConfigGate({ children }: UiConfigGateProps) {
	const [isReady, setIsReady] = useState(false);

	useEffect(() => {
		let mounted = true;

		const loadUiConfig = async () => {
			try {
				if (window.uiConfig) {
					applyFaviconConfig(window.uiConfig);
					setIsReady(true);
					return;
				}

				const response = await fetch("/api/ui_config", { cache: "no-store" });
				if (!response.ok) {
					throw new Error(`Failed to load UI config (${response.status})`);
				}

				const config = (await response.json()) as UiConfig;
				if (!mounted) return;

				window.uiConfig = config;
				applyFaviconConfig(config);
				window.dispatchEvent(new Event(UI_CONFIG_UPDATED_EVENT));
			} catch (error) {
				console.error("Unable to initialize window.uiConfig", error);
				if (mounted && !window.uiConfig) {
					window.uiConfig = {};
				}
			} finally {
				if (mounted) {
					setIsReady(true);
				}
			}
		};

		void loadUiConfig();

		return () => {
			mounted = false;
		};
	}, []);

	if (!isReady) {
		return null;
	}

	return <>{children}</>;
}
