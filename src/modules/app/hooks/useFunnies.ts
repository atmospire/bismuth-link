"use client";

import { useQuery } from "@tanstack/react-query";
import type { FunniesResponse } from "~/types/FunniesResponse";

export function useFunnies() {
    const { data, isLoading } = useQuery<FunniesResponse[]>({
        queryKey: ["funnies"],
        queryFn: () => {
            return fetch(`/api/funnies`).then((res) => res.json());
        },
    });

    return {
        data,
        isLoading,
    };
}
