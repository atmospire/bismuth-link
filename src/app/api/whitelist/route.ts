import { auth } from "~/server/auth";
import { db } from "~/server/db";
import { isNullOrUndefined } from "is-what";

export async function POST() {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userServers = await db.userServer.findMany({
            where: {
                userId: session.user.id,
            },
            include: {
                server: true,
            },
        });

        for (const userver of userServers) {
            const identifier = userver.server.pterodactylIdentifier;

            if (!isNullOrUndefined(session.user.javaName)) {
                await fetch(`https://api.bismuth.win/servers/${identifier}/command`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        command: `whitelist add ${session.user.javaName}`,
                    }),
                });
            }

            if (!isNullOrUndefined(session.user.bedrockName)) {
                await fetch(`https://api.bismuth.win/servers/${identifier}/command`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        command: `fwhitelist add ${session.user.bedrockName}`,
                    }),
                });
            }
        }

        return Response.json({}, { status: 200 });
    } catch (error) {
        console.error("Error whitelisting player:", error);
        return Response.json({ error: "Failed to whitelist player" }, { status: 500 });
    }
}
