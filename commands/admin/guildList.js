const { PermissionFlagsBits, EmbedBuilder, Colors } = require('discord.js');
const { adminGuild, adminUser } = require('../../config.json');

/** @type {import('@akki256/discord-interaction').ChatInputRegister} */
const commandInteraction = {
  data: {
    name: 'guildlist',
    description: '🔧 導入されたサーバーの一覧を表示',
    defaultMemberPermissions: PermissionFlagsBits.Administrator,
    guildId: adminGuild,
    dmPermission: false,
    type: 'CHAT_INPUT',
  },
  exec: async (interaction) => {
    if (!adminUser.includes(interaction.user.id)) {
      const embed = new EmbedBuilder()
        .setDescription('`❌` 権限がありません')
        .setColor(Colors.Red);

      interaction.reply({ embeds: [embed], ephemeral: true });
    }

    await interaction.deferReply({ ephemeral: true });

    const guilds = await Promise.all(interaction.client.guilds.cache
      .map(async guild => `**${guild.name}** | ${(await interaction.client.users.fetch(guild.ownerId)).tag} \`${guild.ownerId}\``));

    const embed = new EmbedBuilder()
      .setTitle('サーバーリスト')
      .setDescription(guilds.join('\n'))
      .setColor(Colors.Green);

    interaction.followUp({ embeds: [embed] });
  },
};

module.exports = [ commandInteraction ];