"use client";

import { Flex } from "@mantine/core";
import { CurrentUser } from "~/modules/users";

import { AdminLinks } from "./AdminLinks/AdminLinks";
import { Links } from "./Links";
import { Logo } from "./Logo";
import classes from "./Navbar.module.scss";

export function Navbar() {
    return (
        <Flex
            direction="row"
            w="100%"
            h={"5rem"}
            gap={"sm"}
            align={"center"}
            justify={"space-between"}
            className={classes.sidebar}
            px={"sm"}
        >
            <Flex align={"center"} gap={"sm"}>
                <Logo />
                <Links />
            </Flex>

            <Flex align={"center"}>
                <AdminLinks />
                <CurrentUser />
            </Flex>
        </Flex>
    );
}
