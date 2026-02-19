import { NextResponse } from "next/server";

type UiConfig = Record<string, string>;

function getPublicEnvConfig(): UiConfig {
	const uiConfig: UiConfig = {};

	for (const [key, value] of Object.entries(process.env)) {
		if (!key.startsWith("NEXT_PUBLIC")) continue;
		uiConfig[key] = typeof value === "string" ? value : "";
	}

	return uiConfig;
}

export async function GET() {
	return NextResponse.json(getPublicEnvConfig(), {
		headers: {
			"Cache-Control": "no-store, max-age=0",
		},
	});
}
