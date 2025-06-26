"use client";

// Since QueryClientProvider relies on useContext under the hood, we have to put 'use client' on top
import type { ReactNode } from "react";
import { MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import { isServer, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { SessionProvider } from "next-auth/react";
import { theme } from "theme";

function makeQueryClient() {
    return new QueryClient({
        defaultOptions: {
            queries: {
                // With SSR, we usually want to set some default staleTime
                // above 0 to avoid refetching immediately on the client
                staleTime: 60 * 1000,
                refetchInterval: false,
                refetchIntervalInBackground: false,
            },
        },
    });
}

let browserQueryClient: QueryClient | undefined;

function getQueryClient() {
    if (isServer) {
        // Server: always make a new query client
        return makeQueryClient();
    } else {
        // Browser: make a new query client if we don't already have one
        // This is very important, so we don't re-make a new client if React
        // suspends during the initial render. This may not be needed if we
        // have a suspense boundary BELOW the creation of the query client
        browserQueryClient ??= makeQueryClient();
        return browserQueryClient;
    }
}

export default function Providers({ children }: { children: ReactNode }) {
    // NOTE: Avoid useState when initializing the query client if you don't
    //       have a suspense boundary between this and the code that may
    //       suspend because React will throw away the client on the initial
    //       render if it suspends and there is no boundary
    const queryClient = getQueryClient();

    return (
        <>
            <QueryClientProvider client={queryClient}>
                <ReactQueryDevtools position="right" />
                <SessionProvider refetchInterval={0.5 * 60} refetchOnWindowFocus={false}>
                    <MantineProvider forceColorScheme="dark" theme={theme}>
                        <Notifications position="top-center" autoClose={5000} />
                        <ModalsProvider>{children}</ModalsProvider>
                    </MantineProvider>
                </SessionProvider>
            </QueryClientProvider>
        </>
    );
}
