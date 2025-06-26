"use client";

import { createContext } from "react";

export interface LayoutOptions {
    /**
     * Whether wrap the page content into a container
     */
    container: boolean;
    /**
     * Whether to render sidebar menu.
     */
    navbar: boolean;
}

export interface LayoutContextOptions {
    state: LayoutOptions;
    setState: (state: LayoutOptions) => void;
}

export const LayoutContext = createContext<LayoutContextOptions>({
    state: {
        container: false,
        navbar: true,
    },
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    setState: () => {},
});
