"use client";

import { notifications } from "@mantine/notifications";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useCreateFunny() {
    const queryClient = useQueryClient();
    const { mutate, isPending: isLoading } = useMutation<void, Error, string>({
        mutationFn: async (funnyText: string) => {
            const response = await fetch(`/api/funnies`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ text: funnyText }),
            });

            if (!response.ok) {
                throw new Error(`Failed to create funny: ${response.statusText}`);
            } else {
                notifications.show({
                    title: "Success!",
                    message: "Funny added successfully",
                    color: "green",
                });
                await queryClient.invalidateQueries({ queryKey: ["funnies"] });
            }
        },
    });

    return {
        mutate,
        isLoading,
    };
}
