"use client";

import { useContext, useEffect } from "react";
import { LayoutContext } from "~/modules";

interface UseLayoutOptions {
    container?: boolean;
    sidebar?: boolean;
}

/**
 * Sets global layout options, such as disabling the container.
 *
 * @param container Whether to wrap the content of the page into a container, or not.
 * @param sidebar Whether to render the sidebar, or not.
 */
export function useLayout({ container = true, sidebar = true }: UseLayoutOptions) {
    const { setState } = useContext(LayoutContext);

    useEffect(() => {
        setState({
            container,
            navbar: sidebar,
        });

        return () =>
            setState({
                container: false,
                navbar: true,
            });
    }, [container, sidebar, setState]);
}
