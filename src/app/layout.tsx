import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const assetsBaseUrl = (process.env.NEXT_PUBLIC_ASSETS_BASE_URL || "").replace(/\/$/, "");

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Xelead | Custom AI Applications",
	description: "Custom AI applications for modern businesses.",
	icons: {
		icon: `${assetsBaseUrl}/files/images/favicon/fav_icon.png`,
		shortcut: `${assetsBaseUrl}/files/images/favicon/fav_icon.png`,
		apple: `${assetsBaseUrl}/files/images/favicon/fav_icon.png`,
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={`${geistSans.variable} ${geistMono.variable} landing-body`}>
				{children}
			</body>
		</html>
	);
}
