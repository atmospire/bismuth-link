import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "~/styles/globals.scss";

import { type Metadata } from "next";
import { Geist } from "next/font/google";
import { ColorSchemeScript, mantineHtmlProps } from "@mantine/core";
import { BottomMessage } from "~/modules";

import { Layout } from "../modules/layout/components/Layout/Layout";
import Providers from "./Providers";

export const metadata: Metadata = {
    title: "BismuthLink",
    description: "The account link system for Bismuth Servers.",
    icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
    subsets: ["latin"],
});

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en" {...mantineHtmlProps}>
            <head>
                <link rel="preload" href="/img/bismuth.avif" as="image" />
                <ColorSchemeScript forceColorScheme="dark" defaultColorScheme="dark" />
                <meta
                    name="viewport"
                    content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
                />
            </head>
            <body className={geist.className}>
                <main>
                    <Providers>
                        <Layout>{children}</Layout>
                        <BottomMessage />
                    </Providers>
                </main>
            </body>
        </html>
    );
}
