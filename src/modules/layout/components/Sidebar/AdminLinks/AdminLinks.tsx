"use client";

import React, { type JSX } from "react";
import AdminLink from "next/link";
import { usePathname } from "next/navigation";
import { Box, Flex, NavLink } from "@mantine/core";
import { IconClipboardData, IconLayoutDashboard, IconUsersGroup } from "@tabler/icons-react";
import { Routes } from "~/constants/routes";
import { Authorized } from "~/modules";

import style from "../Links/Links.module.scss";

interface AdminLink {
    icon: JSX.Element;
    label: string;
    href: string;
}

/**
 * Renders admin links for sidebar
 */
export function AdminLinks() {
    const pathname = usePathname();

    const adminLinks: AdminLink[] = [
        {
            icon: <IconClipboardData />,
            label: "Requests",
            href: "Routes.ADMIN_REQUESTS",
        },
        {
            icon: <IconUsersGroup />,
            label: "Users",
            href: "Routes.ADMIN_USERS",
        },
        {
            icon: <IconLayoutDashboard />,
            label: "Dashboard",
            href: "Routes.ADMIN_DASHBOARD",
        },
    ];

    return (
        <>
            <Flex direction={"column"} gap={"md"} px={"xl"}>
                {adminLinks.map((link, index) => (
                    <Authorized role={"Admin"} key={`link-${index}`}>
                        <Box>
                            <NavLink
                                className={style.link}
                                href={link.href}
                                leftSection={link.icon}
                                variant={"subtle"}
                                label={link.label}
                                active={pathname == link.href}
                                component={AdminLink}
                            />
                        </Box>
                    </Authorized>
                ))}
            </Flex>
        </>
    );
}
