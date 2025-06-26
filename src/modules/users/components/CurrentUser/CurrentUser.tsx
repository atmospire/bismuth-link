"use client";

import { ActionIcon, Badge, Box, Flex, Text } from "@mantine/core";
import { IconLogout } from "@tabler/icons-react";
import { useConfirmModal, useRoleColor } from "~/modules";
import { signOut, useSession } from "next-auth/react";

import { PunchableAvatar } from "../PunchableAvatar";
import styles from "./CurrentUser.module.scss";

/**
 * Component rendering currently signed-in user.
 */
export function CurrentUser() {
    const { data } = useSession({ required: false });
    const user = data?.user;

    const { openConfirmModal } = useConfirmModal({
        title: "Log out",
        message: "Are you sure you want to log out?",
    });

    const logout = () => {
        openConfirmModal({
            onConfirm: () => void signOut(),
        });
    };

    const iconSize = 24;
    const roleColor = useRoleColor({ role: user?.role });

    if (user == null) {
        return <></>;
    }

    return (
        <>
            <Box>
                <Flex direction={"row"} align={"center"} gap={"xs"}>
                    <Flex align={"center"} gap={"sm"}>
                        <ActionIcon onClick={logout} className={styles.logout} variant="transparent">
                            <IconLogout size={iconSize} />
                        </ActionIcon>
                        <Flex direction={"column"}>
                            <Text fw={"600"}>{user?.name}</Text>
                            <Badge className={styles.roleBadge} size="xs" color={roleColor}>
                                {user?.role}
                            </Badge>
                        </Flex>

                        <PunchableAvatar
                            src={user?.image ?? ""}
                            spread={180}
                            angle={225}
                            gravity={1}
                            shapes={["circle", "square"]}
                            colors={["#ffb3ba", "#ffdfba", "#ffffba", "#baffc9", "#bae1ff"]}
                        />
                    </Flex>
                </Flex>
            </Box>
        </>
    );
}
