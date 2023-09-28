import dotenv from 'dotenv';
import path from 'path';
import { Client, Events, GatewayIntentBits, version } from 'discord.js';
import { updateActivity } from '@modules/util';
import { DiscordInteractions, ErrorCodes, InteractionsError } from '@akki256/discord-interaction';
import { guildId } from '@config';
import mongoose from 'mongoose';
dotenv.config();

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const interactions = new DiscordInteractions(client);
interactions.loadRegistries(path.resolve(__dirname, './interactions'));

client.once(Events.ClientReady, () => {
  console.info('[INFO] BOT ready!');
  console.table({
    'Bot User': client.user?.tag,
    'Guild(s)': `${client.guilds.cache.size} Servers`,
    'Watching': `${client.guilds.cache.reduce((a, b) => a + b.memberCount, 0)} Members`,
    'Discord.js': `v${version}`,
    'Node.js': process.version,
    'Platform': `${process.platform} | ${process.arch}`,
    'Memory': `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB | ${(process.memoryUsage().rss / 1024 / 1024).toFixed(2)}MB`,
  });

  interactions.registerCommands({ guildId: guildId ?? undefined, syncWithCommand: true });
  updateActivity(client);
});

client.on(Events.GuildCreate, updateActivity);
client.on(Events.GuildDelete, updateActivity);

client.on(Events.InteractionCreate, interaction => {
  if (!interaction.isRepliable()) return;

  interactions.run(interaction)
    .catch(err => {
      if (
        err instanceof InteractionsError &&
        err.code === ErrorCodes.CommandHasCoolTime
      ) return interaction.reply({ content: '`⌛` コマンドはクールダウン中です', ephemeral: true });
      console.error(err);
    });
});

client.login();
mongoose.connect(process.env.DB_URI, { dbName: process.env.DB_NAME });