import { ActivityType, Client } from 'discord.js';

export function updateActivity(client: Client): void;
export function updateActivity({ client }: { client: Client }): void;
export function updateActivity(client: { client: Client } | Client) {
  client = 'client' in client ? client['client'] : client;
  client.user?.setActivity({ name: `${client.guilds.cache.size}サーバー`, type: ActivityType.Competing });
}