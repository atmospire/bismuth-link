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

    const title = "FlowerOnline";

    // Should be a one in 143 chance
    // const maxMiku = 143;
    // const maxTeto = 401;
    // const chance = Math.floor(Math.random() * maxMiku) + 1;
    // const chanceTuah = Math.floor(Math.random() * maxTeto) + 1;
    // if (chance === maxMiku) {
    //     title = "Mikuseerr";
    // }
    // if (chanceTuah === maxTeto) {
    //     title = "Tetoseerr";
    // }

    return (
        <>
            <Flex justify={"center"} align={"center"} h={"100%"} gap={"xs"} p={"md"}>
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
