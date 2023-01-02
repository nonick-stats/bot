const { PermissionFlagsBits, EmbedBuilder, Colors } = require('discord.js');
const { adminGuild, adminUser } = require('../../config.json');

/** @type {import('@akki256/discord-interaction').ChatInputRegister} */
const commandInteraction = {
  data: {
    name: 'reload',
    description: '[🔧] BOTを再起動',
    defaultMemberPermissions: PermissionFlagsBits.Administrator,
    guildId: adminGuild,
    dmPermission: false,
    type: 'CHAT_INPUT',
  },
  exec: async (interaction) => {
    // PM2環境化でのみ動作

    if (!adminUser.includes(interaction.user.id)) {
      const embed = new EmbedBuilder()
        .setDescription('`❌` 権限がありません')
        .setColor(Colors.Red);

      interaction.reply({ embeds: [embed], ephemeral: true });
    }

    const embed = new EmbedBuilder()
      .setDescription('`🔧` 再起動します...')
      .setColor(Colors.Green);

    await interaction.reply({ embeds: [embed], ephemeral: true });
    process.exit();
  },
};

module.exports = [ commandInteraction ];