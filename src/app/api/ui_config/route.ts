import { NextResponse } from "next/server";
import { getEnvString, getWorkerEnv } from "../send_email/env_helpers";

type UiConfig = Record<string, string>;

async function getPublicEnvConfig(): Promise<UiConfig> {
	const uiConfig: UiConfig = {};
	const workerEnv = getWorkerEnv();
	const publicKeys = Object.keys(workerEnv).filter((key) => key.startsWith("NEXT_PUBLIC"));

	const entries = await Promise.all(
		publicKeys.map(async (key) => [key, await getEnvString(key)] as const)
	);
	for (const [key, value] of entries) uiConfig[key] = value;

	return uiConfig;
}

export async function GET() {
	return NextResponse.json(await getPublicEnvConfig(), {
		headers: {
			"Cache-Control": "no-store, max-age=0",
		},
	});
}
