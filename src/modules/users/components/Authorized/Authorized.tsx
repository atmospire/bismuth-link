"use client";

import { useEffect, type PropsWithChildren } from "react";
import { useRouter } from "next/navigation";
import { notifications } from "@mantine/notifications";
import { type UserRole } from "@prisma/client";
import { Routes } from "~/constants/routes";
import { LoadOverlay } from "~/modules/system";
import { useSession } from "next-auth/react";

interface AuthorizedProps {
    role: UserRole;
    padLoader?: boolean;
    redirectHome?: boolean;
}

export function Authorized({ children, role, redirectHome = false }: PropsWithChildren<AuthorizedProps>) {
    const router = useRouter();
    const { data, status } = useSession({ required: false });
    let hasRights = data?.user.role === role;

    // Admin always has rights
    if (data?.user.role === "Admin") hasRights = true;

    useEffect(() => {
        if (status !== "loading" && hasRights == false) {
            if (redirectHome) {
                notifications.clean();
                notifications.show({
                    title: "Unauthorized access",
                    message: "Hey you're not allowed here!",
                    color: "red",
                    autoClose: 5000,
                });
                void router.push(Routes.HOME);
            }
        }
    }, [data?.user.role, hasRights, redirectHome, router, status]);

    if (status === "loading" || hasRights === undefined) {
        return (
            <>
                <LoadOverlay visible />
            </>
        );
    }
    if (!hasRights) {
        return <></>;
    }
    return <>{children}</>;
}
