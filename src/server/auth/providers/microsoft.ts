// src/lib/auth/providers/microsoft.ts

import type { OAuthConfig, OAuthUserConfig } from "next-auth/providers";

// This interface defines the shape of the user profile data we get from Microsoft's userinfo endpoint.
export interface MicrosoftProfile extends Record<string, unknown> {
    id: string;
    name: string;
    emails: {
        preferred: string;
        account: string;
        personal: string;
        business: string;
    };
}

// This is our custom provider function.
export default function Microsoft<P extends MicrosoftProfile>(options: OAuthUserConfig<P>): OAuthConfig<P> {
    return {
        id: "microsoft",
        name: "Microsoft",
        type: "oauth",
        authorization: {
            url: "https://login.live.com/oauth20_authorize.srf",
            params: {
                scope: "XboxLive.signin XboxLive.offline_access",
            },
        },
        token: "https://login.live.com/oauth20_token.srf",
        userinfo: "https://apis.live.net/v5.0/me",
        checks: ["state"],

        // --- THIS IS THE CORRECTED FUNCTION ---
        // It now returns a complete object that matches your custom User type.
        profile(profile) {
            return {
                // Standard properties from the provider
                id: profile.id,
                name: profile.name,
                email: profile.emails?.preferred,
                image: "",

                // Your custom properties with default values
                role: "User", // Set a default role for new users
                javaName: "", // This will be populated later in the signIn callback
                bedrockName: "", // This will also be populated later
            };
        },

        // Spread the options you pass in (clientId and clientSecret)
        ...options,
    } as OAuthConfig<P>;
}
