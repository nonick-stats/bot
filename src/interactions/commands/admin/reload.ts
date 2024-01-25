import { PermissionFlagsBits, EmbedBuilder, Colors } from 'discord.js';
import { ChatInput } from '@akki256/discord-interaction';
import { adminGuild, adminUser } from '../../../../config.json';

const reloadCommand = new ChatInput(
  {
    name: 'reload',
    description: '🔧 BOTを再起動',
    defaultMemberPermissions: PermissionFlagsBits.Administrator,
    dmPermission: false,
  },
  { guildId: adminGuild },
  async (interaction) => {
    // PM2環境化でのみ動作

    if (!adminUser.includes(interaction.user.id))
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription('`❌` 権限がありません')
            .setColor(Colors.Red),
        ],
        ephemeral: true,
      });

    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setDescription('`🔧` 再起動します...')
          .setColor(Colors.Green),
      ],
      ephemeral: true,
    });

    process.exit();
  },
);

module.exports = [reloadCommand];
