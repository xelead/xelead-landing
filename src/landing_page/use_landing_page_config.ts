"use client";

import { useEffect, useState } from "react";

import { UI_CONFIG_UPDATED_EVENT } from "@/app/ui_config/ui_config_shared";
import { getPublicUiConfigValue } from "./config";

export function usePublicUiConfigValue(key: string) {
	const [value, setValue] = useState(() => getPublicUiConfigValue(key));

	useEffect(() => {
		const handleUiConfigUpdated = () => {
			setValue(getPublicUiConfigValue(key));
		};

		window.addEventListener(UI_CONFIG_UPDATED_EVENT, handleUiConfigUpdated);
		return () => {
			window.removeEventListener(UI_CONFIG_UPDATED_EVENT, handleUiConfigUpdated);
		};
	}, [key]);

	return value;
}
