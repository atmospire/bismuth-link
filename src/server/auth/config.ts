import { PrismaAdapter } from "@auth/prisma-adapter";
import type { User, UserRole } from "@prisma/client";
import { Routes } from "~/constants/routes";
import { env } from "~/env";
import AuthenticationHandler from "~/lib/auth/minecraft-auth-handler";
import { db } from "~/server/db";
import { type DefaultSession, type NextAuthConfig } from "next-auth";
import DiscordProvider, { type DiscordProfile } from "next-auth/providers/discord";

import Microsoft from "./providers/microsoft";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
    interface Session extends DefaultSession {
        user: User;
    }

    // Only wanted properties from schema.prisma User model
    interface User {
        id: string;
        name: string;
        image: string;
        role: UserRole;
        javaName: string;
        bedrockName: string;
    }
}

// Custom adapter, because i dont want email verification
const prismaAdapter = PrismaAdapter(db);

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
prismaAdapter.createUser = (data: User) => {
    return db.user.create({
        data: {
            name: data.name,
            image: data.image,
            role: data.role,
            javaName: data.javaName,
            bedrockName: data.bedrockName,
        },
    });
};

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authConfig = {
    providers: [
        DiscordProvider({
            authorization: "https://discord.com/oauth2/authorize?scope=identify+guilds",
            profile: (profile: DiscordProfile) => {
                return {
                    id: profile.id,
                    name: profile.global_name ?? profile.username,
                    image: `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png`,
                    role: "User" as UserRole,
                    javaName: "",
                    bedrockName: "",
                };
            },
        }),
        Microsoft({
            clientId: env.AUTH_MICROSOFT_ENTRA_ID_ID,
            clientSecret: env.AUTH_MICROSOFT_ENTRA_ID_SECRET,
        }),
        // MicrosoftEntraID({
        //     clientId: env.AUTH_MICROSOFT_ENTRA_ID_ID,
        //     clientSecret: env.AUTH_MICROSOFT_ENTRA_ID_SECRET,
        //     issuer: "https://login.microsoftonline.com/consumers/v2.0",
        //     token: "https://login.live.com/oauth20_token.srf",
        //     authorization: {
        //         url: "https://login.live.com/oauth20_authorize.srf",
        //         params: {
        //             scope: "openid XboxLive.signin XboxLive.offline_access",
        //         },
        //     },
        // }),
    ],
    adapter: prismaAdapter,
    events: {
        signIn: async ({ user, account }) => {
            const existingUser = await db.user.findUnique({
                where: { id: user.id },
            });

            if (account?.provider === "discord" && account?.access_token && existingUser) {
                try {
                    const response = await fetch("https://discord.com/api/v10/users/@me/guilds", {
                        headers: {
                            Authorization: `Bearer ${account.access_token}`,
                        },
                    });

                    if (response.ok) {
                        const guilds = (await response.json()) as { id: string; name: string }[];
                        const userGuildIds = guilds.map((guild) => guild.id);

                        // Check if any of the user's guild IDs are in the AllowedServers table
                        const allowedServers = await db.allowedServer.findMany({
                            where: {
                                discordServerId: {
                                    in: userGuildIds,
                                },
                            },
                        });

                        // Add user to UserServer table for each allowed server if not already exists
                        for (const server of allowedServers) {
                            await db.userServer.upsert({
                                where: {
                                    userId_serverId: {
                                        userId: user.id,
                                        serverId: server.id,
                                    },
                                },
                                update: {},
                                create: {
                                    userId: user.id,
                                    serverId: server.id,
                                },
                            });
                        }
                    }
                } catch (error) {
                    console.error("Error processing server membership in signIn event:", error);
                }
            }

            if (account?.provider === "microsoft" && account?.access_token) {
                console.log("Starting Microsoft profile fetch using AuthenticationHandler...");

                // Takes the MSA token from the account object and returns all the info.
                const authInfo = await AuthenticationHandler.getAuthInfo(account.access_token);
                console.log(authInfo);

                const updateData: {
                    bedrockName?: string;
                    javaName?: string;
                } = {};

                if (authInfo.xbox_gamertag) {
                    updateData.bedrockName = authInfo.xbox_gamertag;
                }
                if (authInfo.mc_info?.name) {
                    // Assuming your DB field is `minecraftUsername` or similar
                    updateData.javaName = authInfo.mc_info.name;
                }

                if (Object.keys(updateData).length > 0) {
                    await db.user.update({ where: { id: user.id }, data: updateData });
                }
            }
        },
        updateUser: async ({ user }) => {
            // Update user
            await db.user.update({
                where: { id: user.id },
                data: {
                    ...user,
                },
            });

            return;
        },
    },
    callbacks: {
        session: ({ session, user }) => ({
            ...session,
            user: {
                ...session.user,
                id: user.id,
            },
        }),
        async signIn({ profile: _profile, account, user: _user }) {
            // Only check Discord provider
            if (account?.provider !== "discord") {
                return true;
            }

            // Ensure we have a valid access token
            if (!account?.access_token) {
                console.error("No access token available for Discord provider");
                return false;
            }

            try {
                const response = await fetch("https://discord.com/api/v10/users/@me/guilds", {
                    headers: {
                        Authorization: `Bearer ${account.access_token}`,
                    },
                });

                if (!response.ok) {
                    console.error("Failed to fetch Discord guilds:", response.statusText);
                    return false;
                }

                const guilds = (await response.json()) as { id: string; name: string }[];
                const userGuildIds = guilds.map((guild) => guild.id);

                // Check if any of the user's guild IDs are in the AllowedServers table
                const allowedServers = await db.allowedServer.findMany({
                    where: {
                        discordServerId: {
                            in: userGuildIds,
                        },
                    },
                });

                // If user is not in any allowed servers, deny sign in
                if (allowedServers.length === 0) {
                    return false;
                }

                return true;
            } catch (error) {
                console.error("Error checking allowed servers:", error);
                return false;
            }
        },
    },
    pages: {
        error: Routes.HOME,
    },
} satisfies NextAuthConfig;
