const fs = require('fs');
const { ApplicationCommandOptionType, Colors, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { adminGuild, adminUser } = require('../../config');

/** @type {import('@akki256/discord-interaction').ChatInputRegister} */
const commandInteraction = {
  data: {
    name: 'maintenance',
    description: '[🔧] 各サーバーのメンテナンスモードを設定',
    options: [
      {
        name: 'server',
        description: 'サーバー',
        choices: [
          { name: 'The HIVE', value: 'hive' },
        ],
        type: ApplicationCommandOptionType.String,
        required: true,
      },
      {
        name: 'status',
        description: '有効/無効',
        type: ApplicationCommandOptionType.Boolean,
        required: true,
      },
    ],
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

    const config = JSON.parse(fs.readFileSync('./config.json', 'utf-8'));

    const server = interaction.options.getString('server');
    const status = interaction.options.getBoolean('status');

    config.lock[server] = status;
    fs.writeFileSync('./config.json', JSON.stringify(config, null, 2));

    const embed = new EmbedBuilder()
      .setDescription('`✅` 設定を更新しました')
      .setColor(Colors.Green);

    interaction.reply({ embeds: [embed], ephemeral: true });
  },
};

module.exports = [ commandInteraction ];