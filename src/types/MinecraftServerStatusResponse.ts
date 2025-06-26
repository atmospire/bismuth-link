export interface MinecraftServerStatusResponse {
    online: boolean;
    ip?: string; // Could be empty when server is offline
    port?: number; // Could be empty when server is offline
    hostname?: string; // Only included when a hostname is detected
    debug: DebugInfo;
    version?: string; // Could include multiple versions or additional text (only when online)
    protocol?: ProtocolInfo; // Only included when ping is used
    icon?: string; // Only included when an icon is detected (base64 encoded image)
    software?: string; // Only included when software is detected
    map?: MapInfo; // Only included when server is online
    gamemode?: string; // Only included for Bedrock servers
    serverid?: string; // Only included for Bedrock servers
    eula_blocked?: boolean; // Only included for Java servers
    motd?: MotdInfo; // Only included when server is online
    players?: PlayersInfo; // Only included when server is online
    plugins?: PluginInfo[]; // Only included when plugins are detected
    mods?: ModInfo[]; // Only included when mods are detected
    info?: InfoDisplay; // Only included when detecting that the player samples are used for information
}

export interface DebugInfo {
    ping: boolean;
    query: boolean;
    bedrock: boolean;
    srv: boolean;
    querymismatch: boolean;
    ipinsrv: boolean;
    cnameinsrv: boolean;
    animatedmotd: boolean;
    cachehit: boolean;
    cachetime: number;
    cacheexpire: number;
    apiversion: number;
}

export interface ProtocolInfo {
    version: number;
    name?: string; // Only included if a version name is found
}

export interface MapInfo {
    raw: string;
    clean: string;
    html: string;
}

export interface MotdInfo {
    raw: string[];
    clean: string[];
    html: string[];
}

export interface PlayersInfo {
    online: number;
    max: number;
    list?: PlayerInfo[]; // Only included when there are players
}

export interface PlayerInfo {
    name: string;
    uuid: string;
}

export interface PluginInfo {
    name: string;
    version: string;
}

export interface ModInfo {
    name: string;
    version: string;
}

export interface InfoDisplay {
    raw: string[];
    clean: string[];
    html: string[];
}
