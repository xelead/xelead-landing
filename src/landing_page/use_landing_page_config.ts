"use client";

import { useEffect, useState } from "react";

import { UI_CONFIG_UPDATED_EVENT } from "@/app/ui_config/ui_config_shared";
import { getLandingPageConfig } from "./config";

export function useLandingPageConfig() {
	const [config, setConfig] = useState(getLandingPageConfig);

	useEffect(() => {
		const handleUiConfigUpdated = () => {
			setConfig(getLandingPageConfig());
		};

		window.addEventListener(UI_CONFIG_UPDATED_EVENT, handleUiConfigUpdated);
		return () => {
			window.removeEventListener(UI_CONFIG_UPDATED_EVENT, handleUiConfigUpdated);
		};
	}, []);

	return config;
}
