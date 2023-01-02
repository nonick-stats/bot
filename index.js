const { DiscordInteractions } = require('@akki256/discord-interaction');
const { Client, GatewayIntentBits, Events, version, EmbedBuilder, Colors, ActivityType } = require('discord.js');
const { guildId } = require('./config');
require('dotenv').config();

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

const interactions = new DiscordInteractions(client);
interactions.loadInteractions('./commands');

client.on(Events.ClientReady, () => {
  console.log(`[${new Date().toLocaleString({ timeZone: 'Asia/Tokyo' })}][INFO] BOT ready!`);
  console.table({
    'Bot User': client.user.tag,
    'Guild(s)': `${client.guilds.cache.size} Servers`,
    'Watching': `${client.guilds.cache.reduce((a, b) => a + b.memberCount, 0)} Members`,
    'Discord.js': `v${version}`,
    'Node.js': process.version,
    'Platform': `${process.platform} | ${process.arch}`,
    'Memory': `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB | ${(process.memoryUsage().rss / 1024 / 1024).toFixed(2)}MB`,
  });

  client.user.setActivity({ name: `${client.guilds.cache.size}サーバー`, type: ActivityType.Competing });
  interactions.registerCommands(guildId);
});

client.on(Events.GuildCreate, () => client.user.setActivity({ name: `${client.guilds.cache.size}サーバー`, type: ActivityType.Competing }));
client.on(Events.GuildDelete, () => client.user.setActivity({ name: `${client.guilds.cache.size}サーバー`, type: ActivityType.Competing }));

client.on(Events.InteractionCreate, interaction => {
  interactions.run(interaction)
    .catch(err => {
      if (err.code === 0x0000) return;
      if (err.code === 0x0001) {
        const embed = new EmbedBuilder()
          .setDescription('`⌛` コマンドはクールダウン中です。時間を置いて再試行してください。')
          .setColor(Colors.Green);

        return interaction.reply({ embeds: [embed], ephemeral: true });
      }
      console.log(err);
    });
});

client.login(process.env.BOT_TOKEN);