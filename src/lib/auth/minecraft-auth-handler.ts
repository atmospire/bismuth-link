// https://gist.github.com/Plagiatus/ce5f18bc010395fc45d8553905e10f55

interface AuthorizationTokenResponse {
    token_type: string;
    expires_in: number;
    scope: string;
    access_token: string;
    refresh_token: string;
    user_id: string;
}

interface XboxServiceTokenResponse {
    IssueInstant: string;
    NotAfter: string;
    Token: string;
    DisplayClaims: DisplayClaim;
}

interface MCTokenResponse {
    username: string;
    roles: string[];
    access_token: string;
    token_type: string;
    expires_in: number;
}

interface MinecraftAsset {
    id: string;
    state: "ACTIVE" | "INACTIVE";
    url: string;
}

interface MinecraftSkin extends MinecraftAsset {
    variant: "CLASSIC" | "SLIM";
}

interface MinecraftCape extends MinecraftAsset {
    alias: string;
}
// --- End of new types ---

interface MCUserInfo {
    id: string;
    name: string;
    skins: MinecraftSkin[]; // Replaced any[]
    capes: MinecraftCape[]; // Replaced any[]
}

interface DisplayClaim {
    xui: {
        uhs: string;
        gtg?: string;
    }[];
}

export interface AuthInfo {
    xbox_gamertag: string | null;
    mc_info: MCUserInfo | null;
}

/**
 * A robust, fetch-based implementation of the authentication flow.
 * This class correctly generates separate XSTS tokens for Xbox and Minecraft services.
 */
export default class AuthenticationHandler {
    /**
     * Main orchestration method.
     */
    public static async getAuthInfo(msaToken: string): Promise<AuthInfo> {
        try {
            console.log("Step 1: Getting initial XBL token...");
            const xbl = await this.authTokenToXBL(msaToken);
            console.log("Step 1 SUCCESS.");

            // Step 2: In parallel, attempt to get both Xbox and Minecraft info.
            // This is efficient and allows one to succeed even if the other fails.
            console.log("Step 2: Fetching Xbox and Minecraft info in parallel...");
            const [xboxGamertag, mcInfo] = await Promise.all([this.getXboxGamertag(xbl), this.getMinecraftInfo(xbl)]);

            return {
                xbox_gamertag: xboxGamertag,
                mc_info: mcInfo,
            };
        } catch (error) {
            console.error("A critical error occurred in the initial auth flow:", error);
            return { xbox_gamertag: null, mc_info: null };
        }
    }

    /**
     * Exchanges an MSA token for an Xbox Live (XBL) token. This is common to both flows.
     */
    private static async authTokenToXBL(msaToken: string): Promise<XboxServiceTokenResponse> {
        const response = await fetch("https://user.auth.xboxlive.com/user/authenticate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify({
                Properties: {
                    AuthMethod: "RPS",
                    SiteName: "user.auth.xboxlive.com",
                    RpsTicket: `d=${msaToken}`,
                },
                RelyingParty: "http://auth.xboxlive.com",
                TokenType: "JWT",
            }),
        });
        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`Failed to exchange MSA token for XBL. Status: ${response.status}, Body: ${errorBody}`);
        }
        return response.json();
    }

    /**
     * Helper to get a specific XSTS token based on the target service (Relying Party).
     */
    private static async getXstsToken(
        xblToken: XboxServiceTokenResponse,
        relyingParty: "http://xboxlive.com" | "rp://api.minecraftservices.com/",
    ): Promise<XboxServiceTokenResponse> {
        const response = await fetch("https://xsts.auth.xboxlive.com/xsts/authorize", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify({
                Properties: {
                    SandboxId: "RETAIL",
                    UserTokens: [xblToken.Token],
                },
                RelyingParty: relyingParty,
                TokenType: "JWT",
            }),
        });
        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(
                `Failed to get XSTS token for ${relyingParty}. Status: ${response.status}, Body: ${errorBody}`,
            );
        }
        return response.json();
    }

    /**
     * Gets the Xbox Gamertag.
     */
    private static async getXboxGamertag(xblToken: XboxServiceTokenResponse): Promise<string | null> {
        try {
            console.log("--> Xbox Flow: Getting XSTS token...");
            const xsts = await this.getXstsToken(xblToken, "http://xboxlive.com");
            console.log("--> Xbox Flow: SUCCESS getting XSTS token.");

            console.log("--> Xbox Flow: Getting profile...");
            const response = await fetch("https://profile.xboxlive.com/users/me/profile/settings?settings=Gamertag", {
                headers: {
                    Authorization: `XBL3.0 x=${xsts.DisplayClaims.xui[0].uhs};${xsts.Token}`,
                    "x-xbl-contract-version": "2",
                    Accept: "application/json",
                },
            });
            if (!response.ok) {
                const errorBody = await response.text();
                console.error(`--> Xbox Flow: FAILED to get profile. Status: ${response.status}, Body: ${errorBody}`);
                return null;
            }
            const data = await response.json();
            console.log("--> Xbox Flow: SUCCESS getting profile.");
            return data.profileUsers[0].settings[0].value;
        } catch (error) {
            console.error("--> Xbox Flow: An unexpected error occurred.", error);
            return null;
        }
    }

    /**
     * Gets the full Minecraft profile.
     */
    private static async getMinecraftInfo(xblToken: XboxServiceTokenResponse): Promise<MCUserInfo | null> {
        try {
            console.log("--> Minecraft Flow: Getting XSTS token...");
            const xsts = await this.getXstsToken(xblToken, "rp://api.minecraftservices.com/");
            console.log("--> Minecraft Flow: SUCCESS getting XSTS token.");

            console.log("--> Minecraft Flow: Logging into Minecraft services...");
            const mcAuthResponse = await fetch("https://api.minecraftservices.com/authentication/login_with_xbox", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify({
                    identityToken: `XBL3.0 x=${xsts.DisplayClaims.xui[0].uhs};${xsts.Token}`,
                }),
            });
            if (!mcAuthResponse.ok) {
                const errorBody = await mcAuthResponse.text();
                console.error(
                    `--> Minecraft Flow: FAILED to log in. Status: ${mcAuthResponse.status}, Body: ${errorBody}`,
                );
                return null;
            }
            const mcToken = await mcAuthResponse.json();
            console.log("--> Minecraft Flow: SUCCESS logging in.");

            console.log("--> Minecraft Flow: Getting profile...");
            const mcProfileResponse = await fetch("https://api.minecraftservices.com/minecraft/profile", {
                headers: {
                    Authorization: `Bearer ${mcToken.access_token}`,
                },
            });
            if (!mcProfileResponse.ok) {
                const errorBody = await mcProfileResponse.text();
                console.error(
                    `--> Minecraft Flow: FAILED to get profile. Status: ${mcProfileResponse.status}, Body: ${errorBody}`,
                );
                return null;
            }
            console.log("--> Minecraft Flow: SUCCESS getting profile.");
            return mcProfileResponse.json();
        } catch (error) {
            console.error("--> Minecraft Flow: An unexpected error occurred.", error);
            return null;
        }
    }
}
