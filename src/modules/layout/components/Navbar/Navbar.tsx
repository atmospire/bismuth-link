"use client";

import { Flex } from "@mantine/core";
import { useIsMobile } from "~/modules/system";
import { CurrentUser } from "~/modules/users";

import { AdminLinks } from "./AdminLinks/AdminLinks";
import { Links } from "./Links";
import { Logo } from "./Logo";
import { MobileMenu } from "./MobileMenu";
import classes from "./Navbar.module.scss";

export function Navbar() {
    const isMobile = useIsMobile();

    return (
        <Flex
            direction="row"
            w="100%"
            maw={"100%"}
            h={"5rem"}
            gap={"sm"}
            align={"center"}
            justify={"space-between"}
            className={classes.sidebar}
            px={"sm"}
        >
            {!isMobile ? (
                <>
                    <Flex align={"center"} gap={"xl"} ps={"md"}>
                        <Logo />
                        <Links />
                    </Flex>

                    <Flex align={"center"} gap={"sm"}>
                        <AdminLinks />
                        <CurrentUser />
                    </Flex>
                </>
            ) : (
                <Flex justify={"space-between"} align={"center"} w={"100%"} px={"md"}>
                    <Logo />
                    <MobileMenu />
                </Flex>
            )}
        </Flex>
    );
}
