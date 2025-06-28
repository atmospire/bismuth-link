"use client";

import { ActionIcon, Badge, Box, Flex, Menu, Text } from "@mantine/core";
import { IconLogout } from "@tabler/icons-react";
import { useConfirmModal, useRoleColor } from "~/modules";
import { signOut, useSession } from "next-auth/react";

import { PunchableAvatar } from "../PunchableAvatar";
import styles from "./CurrentUser.module.scss";

interface CurrentUserOptions {
    mobileView?: boolean;
}

/**
 * Component rendering currently signed-in user.
 */
export function CurrentUser({ mobileView = false }: CurrentUserOptions) {
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
                <Flex align={"center"} p={"xs"}>
                    <Flex align={"center"} gap={"sm"} w={"100%"}>
                        {!mobileView && (
                            <ActionIcon onClick={logout} className={styles.logout} variant="transparent">
                                <IconLogout size={iconSize} />
                            </ActionIcon>
                        )}

                        <Flex direction={"column"} w={"100%"}>
                            <Text fw={"600"} size={mobileView ? "sm" : "initial"}>
                                {user?.name}
                            </Text>
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
                {mobileView && (
                    <>
                        <Menu.Divider />
                        <Menu.Item onClick={() => logout()} leftSection={<IconLogout size={14} />}>
                            Logout
                        </Menu.Item>
                    </>
                )}
            </Box>
        </>
    );
}
