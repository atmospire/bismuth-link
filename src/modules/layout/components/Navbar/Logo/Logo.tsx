"use client";

import { useRouter } from "next/navigation";
import { Flex, Text } from "@mantine/core";
import { Routes } from "~/constants/routes";

import styles from "./Logo.module.scss";

interface LogoOptions {
    goHomeOnClick?: boolean;
}

export function Logo({ goHomeOnClick = true }: LogoOptions) {
    const router = useRouter();

    const title = process.env.NEXT_PUBLIC_APP_NAME ?? "Bismuth";

    return (
        <>
            <Flex justify={"center"} align={"center"} h={"100%"} gap={"xs"}>
                <Text
                    className={styles.logo}
                    onClick={() => {
                        if (goHomeOnClick) void router.push(Routes.HOME);
                    }}
                >
                    {title}
                </Text>
            </Flex>
        </>
    );
}
