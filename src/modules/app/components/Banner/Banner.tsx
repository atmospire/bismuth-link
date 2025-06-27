"use client";

import { BackgroundImage, Flex, Loader, Text, Tooltip } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";

import styles from "./Banner.module.scss";

export function Banner() {
    const { data: randomFunny, isLoading } = useQuery({
        queryKey: ["randomFunny"],
        queryFn: async () => {
            const response = await fetch("/api/randomFunny");
            if (!response.ok) throw new Error("Failed to fetch");
            return (await response.json()) as { text: string; author: string };
        },
    });

    return (
        <>
            <BackgroundImage src={"/img/grask.webp"} h={"100%"}>
                <Flex
                    w={"100%"}
                    h={"100%"}
                    style={{ flexGrow: 1 }}
                    direction={"column"}
                    justify={"center"}
                    align={"center"}
                >
                    <Text className={styles.title}>Welcome to the Flower Garden</Text>
                    {isLoading ? (
                        <Loader type="dots" />
                    ) : (
                        <Tooltip
                            events={{ hover: true, focus: false, touch: true }}
                            label={`Submitted by: ${randomFunny?.author}`}
                            position="bottom"
                            withArrow
                        >
                            <Text className={styles.undertitle}>
                                &quot;{randomFunny?.text.replaceAll('"', "")}&quot;
                            </Text>
                        </Tooltip>
                    )}
                </Flex>
            </BackgroundImage>
        </>
    );
}
