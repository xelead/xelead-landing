"use client";

import { useEffect } from "react";

import type { UiConfig } from "@/types/ui_config";
import { UI_CONFIG_UPDATED_EVENT } from "./ui_config_shared";

export default function UiConfigBootstrap() {
	useEffect(() => {
		let mounted = true;

		const loadUiConfig = async () => {
			try {
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
			}
		};

		void loadUiConfig();

		return () => {
			mounted = false;
		};
	}, []);

	return null;
}
