"use client";

import { Text } from "@mantine/core";
import { modals } from "@mantine/modals";

/**
 * Options for opening confirm modal
 * @param onConfirm - Function to call on confirm
 * @param onCancel - Function to call on cancel
 * */
interface OpenConfirmModalOptions {
    onConfirm: () => void;
    onCancel?: () => void;
}

/**
 * Options for confirm modal
 * @param title - Modal title
 * @param message - Modal message
 * */
interface ConfirmModalOptions {
    title: string;
    message: React.ReactNode | string;
    color?: string;
}

/**
 * Hook for opening confirm modal
 * @param title - Modal title
 * @param message - Modal message
 * @returns openConfirmModal - Function to open confirm modal
 **/
export function useConfirmModal({ title, message, color }: ConfirmModalOptions) {
    const openConfirmModal = ({ onConfirm, onCancel }: OpenConfirmModalOptions) =>
        modals.openConfirmModal({
            title,
            centered: true,
            children: message ?? <Text>{message}</Text>,
            labels: {
                confirm: "Yes",
                cancel: "No",
            },
            // Uses primary color if there is no color set.
            confirmProps: { color: color ?? "" },
            onCancel,
            onConfirm,
        });

    return { openConfirmModal };
}
