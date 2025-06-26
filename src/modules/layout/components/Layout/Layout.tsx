"use client";

import { useRef, useState, type PropsWithChildren } from "react";
import { AppShell, Container } from "@mantine/core";
import { LayoutContext, Navbar, type LayoutOptions } from "~/modules";

export function Layout({ children }: PropsWithChildren) {
    useRef<HTMLElement>(null);

    const [state, setState] = useState<LayoutOptions>({
        container: false,
        navbar: true,
    });
    const contextParams = { state, setState };

    const headerOptions = {
        height: state.navbar ? "5rem" : "0",
        breakpoint: "xs",
    };

    return (
        <>
            <LayoutContext.Provider value={contextParams}>
                {state.navbar && (
                    <AppShell header={headerOptions}>
                        {state.navbar && (
                            <AppShell.Header style={{ width: "100%" }}>
                                <Navbar />
                            </AppShell.Header>
                        )}

                        <AppShell.Main>
                            {state.container && (
                                <Container fluid size={"xl"} pt={"xs"} w={"100%"} h={"100%"}>
                                    {children}
                                </Container>
                            )}
                            {!state.container && children}
                        </AppShell.Main>
                    </AppShell>
                )}
                {!state.navbar && (state.container ? <Container size="xl">{children}</Container> : children)}
            </LayoutContext.Provider>
        </>
    );
}
