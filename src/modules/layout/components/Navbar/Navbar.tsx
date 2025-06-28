"use client";

import { Button, Flex } from "@mantine/core";
import { IconBrandDiscord } from "@tabler/icons-react";
import { useIsMobile } from "~/modules/system";
import { CurrentUser } from "~/modules/users";
import { signIn, useSession } from "next-auth/react";

import { AdminLinks } from "./AdminLinks/AdminLinks";
import { Links } from "./Links";
import { Logo } from "./Logo";
import { MobileMenu } from "./MobileMenu";
import classes from "./Navbar.module.scss";

export function Navbar() {
    const { data: session } = useSession({ required: false });
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
                        {!session && (
                            <Button onClick={() => signIn("discord")} leftSection={<IconBrandDiscord />} me="md">
                                Sign in
                            </Button>
                        )}
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
