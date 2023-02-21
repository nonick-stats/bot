import fs from 'fs';
import { ApplicationCommandOptionType, PermissionFlagsBits, EmbedBuilder, Colors } from 'discord.js';
import { ChatInput } from '@akki256/discord-interaction';
import { adminGuild, adminUser } from '../../../../config.json';

const maintenanceCommand = new ChatInput(
  {
    name: 'maintenance',
    description: '🔧 各サーバーのメンテナンスモードを設定',
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
    dmPermission: false,
  },
  { guildId: adminGuild },
  async (interaction): Promise<void> => {
    if (!adminUser.includes(interaction.user.id)) {
      interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription('`❌` 権限がありません')
            .setColor(Colors.Red),
        ],
        ephemeral: true,
      });
      return;
    }

    const config = JSON.parse(fs.readFileSync('./config.json', 'utf-8'));

    const server = interaction.options.getString('server', true);
    const status = interaction.options.getBoolean('status', true);

    config.lock[server] = status;
    fs.writeFileSync('./config.json', JSON.stringify(config, null, 2));

    interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setDescription('`✅` 設定を更新しました')
          .setColor(Colors.Green),
      ],
      ephemeral: true,
    });
  },
);

module.exports = [maintenanceCommand];