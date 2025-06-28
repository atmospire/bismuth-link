"use client";

import React, { type JSX } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Divider, Flex, NavLink } from "@mantine/core";
import { IconHome, IconJoker, IconLink } from "@tabler/icons-react";
import { Routes } from "~/constants/routes";

import style from "./Links.module.scss";

interface Link {
    icon: JSX.Element;
    label: string;
    href: string;
}

// Links that probably every user should see, e.g. dashboard
export const links = (iconSize = 24): Link[] => [
    {
        icon: <IconHome size={iconSize} />,
        label: "Home",
        href: Routes.HOME,
    },
    {
        icon: <IconLink size={iconSize} />,
        label: "Link",
        href: Routes.LINKING,
    },
    {
        icon: <IconJoker size={iconSize} />,
        label: "Funnies",
        href: Routes.FUNNY,
    },
];

/**
 * Renders links for sidebar
 */
export function Links() {
    const pathname = usePathname();

    return (
        <>
            <Flex direction={"row"} gap={"xs"}>
                {links().map((link, index) => (
                    <Flex key={index} gap={"xs"}>
                        <NavLink
                            className={style.link}
                            href={link.href}
                            leftSection={link.icon}
                            variant={"subtle"}
                            label={link.label}
                            active={pathname == link.href}
                            component={Link}
                        />
                        {index < links().length - 1 && <Divider orientation="vertical" />}
                    </Flex>
                ))}
            </Flex>
        </>
    );
}
