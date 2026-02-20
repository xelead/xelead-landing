"use client";

import { useEffect, useState } from "react";

import type { UiConfig } from "@/types/ui_config";
import { UI_CONFIG_UPDATED_EVENT } from "./ui_config_shared";

type UiConfigGateProps = {
	children: React.ReactNode;
};

export default function UiConfigGate({ children }: UiConfigGateProps) {
	const [isReady, setIsReady] = useState(false);

	useEffect(() => {
		let mounted = true;

		const loadUiConfig = async () => {
			try {
				if (window.uiConfig) {
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
