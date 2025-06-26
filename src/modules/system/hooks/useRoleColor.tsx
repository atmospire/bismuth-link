import type { UserRole } from "@prisma/client";

interface UseRoleColorOptions {
    role?: UserRole;
}

const colors: Record<UserRole, string> = {
    Admin: "pink",
    User: "primary",
};

export function useRoleColor({ role }: UseRoleColorOptions) {
    if (role == null) {
        return colors.User;
    }
    return colors[role];
}
