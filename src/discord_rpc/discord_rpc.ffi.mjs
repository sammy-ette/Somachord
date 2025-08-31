import DiscordRPC from 'discord-rpc'

export function new_client() {
    return new DiscordRPC.Client({ transport: 'ipc' })
}

/**
 * 
 * @param {DiscordRPC.Client} client 
 */
export function login(client, clientId) {
    client.login({ clientId })
}
