import type { User } from "@prisma/client";

export interface FunniesResponse {
    id: string;
    funnyText: string;
    submittedByUserId: string;
    submittedByUser: User;
}
