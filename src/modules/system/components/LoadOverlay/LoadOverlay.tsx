"use client";

import { LoadingOverlay } from "@mantine/core";

interface LoadOptions {
    visible?: boolean;
    duration?: number;
}

export function LoadOverlay({ visible, duration }: LoadOptions) {
    return (
        <>
            <LoadingOverlay
                zIndex={2}
                visible={visible ?? false}
                transitionProps={{ duration: duration ?? 250 }}
                overlayProps={{ radius: "sm", blur: 2 }}
            />
        </>
    );
}
