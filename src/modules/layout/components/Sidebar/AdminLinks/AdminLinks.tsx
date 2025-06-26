"use client";

import React, { type JSX } from "react";
import AdminLink from "next/link";
import { ActionIcon, Menu } from "@mantine/core";
import { IconLayoutDashboard, IconSpiral, IconUsersGroup } from "@tabler/icons-react";
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
    const adminLinks: AdminLink[] = [
        {
            icon: <IconLayoutDashboard />,
            label: "Dashboard",
            href: Routes.ADMIN_DASHBOARD,
        },
        {
            icon: <IconUsersGroup />,
            label: "Users",
            href: Routes.ADMIN_USERS,
        },
    ];

    return (
        <>
            <Authorized role={"Admin"}>
                <Menu shadow="md" width={200}>
                    <Menu.Target>
                        <ActionIcon variant="transparent">
                            <IconSpiral size={24} />
                        </ActionIcon>
                    </Menu.Target>
                    <Menu.Dropdown>
                        <Menu.Label>Admin Menu</Menu.Label>
                        {adminLinks.map((link, index) => (
                            <Menu.Item
                                key={index}
                                className={style.link}
                                href={link.href}
                                leftSection={link.icon}
                                variant={"subtle"}
                                component={AdminLink}
                            >
                                {link.label}
                            </Menu.Item>
                        ))}
                    </Menu.Dropdown>
                </Menu>
            </Authorized>
        </>
    );
}
