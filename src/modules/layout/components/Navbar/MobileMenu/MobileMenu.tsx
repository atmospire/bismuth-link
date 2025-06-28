"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "@mantine/core";
import { IconBrandDiscord, IconMenu2, IconX } from "@tabler/icons-react";
import { Authorized } from "~/modules/users";
import { signIn, useSession } from "next-auth/react";

import { CurrentUser } from "../../../../users/components/CurrentUser/CurrentUser";
import { adminLinks } from "../AdminLinks";
import { links } from "../Links";

export function isNavActive(href: string, path: string) {
    return href === "/" ? path === "/" : path?.includes(href);
}

export function MobileMenu() {
    const [opened, setOpened] = useState(false);
    const pathname = usePathname();
    const { data: session } = useSession({ required: false });

    return (
        <Menu withinPortal={false} opened={opened} onChange={setOpened}>
            <Menu.Target>
                {opened ? <IconX color="white" size={32} /> : <IconMenu2 color="white" size={32} />}
            </Menu.Target>

            <Menu.Dropdown>
                {links(16).map((link, index) => (
                    <Menu.Item
                        bg={isNavActive(link.href, pathname) ? "primary" : "inherit"}
                        key={index}
                        leftSection={link.icon}
                        href={link.href}
                        component={Link}
                    >
                        {link.label}
                    </Menu.Item>
                ))}
                <Authorized role={"Admin"}>
                    <Menu.Divider />
                    <Menu.Label>Admin Menu</Menu.Label>
                    {adminLinks(16).map((link, index) => (
                        <Menu.Item
                            bg={isNavActive(link.href, pathname) ? "primary" : "inherit"}
                            key={index}
                            leftSection={link.icon}
                            href={link.href}
                            component={Link}
                        >
                            {link.label}
                        </Menu.Item>
                    ))}
                </Authorized>
                <Menu.Divider />
                {session && <CurrentUser mobileView />}
                {!session && (
                    <Menu.Item onClick={() => signIn("discord")} leftSection={<IconBrandDiscord size={14} />}>
                        Sign in
                    </Menu.Item>
                )}
            </Menu.Dropdown>
        </Menu>
    );
}
