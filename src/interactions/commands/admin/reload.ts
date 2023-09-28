import { ChatInput } from '@akki256/discord-interaction';
import { admin } from '@config';
import { Colors, EmbedBuilder, PermissionFlagsBits } from 'discord.js';

export default new ChatInput({
  name: 'reload',
  description: '🔧 BOTを再起動',
  defaultMemberPermissions: PermissionFlagsBits.Administrator,
  dmPermission: false,
}, { guildId: admin.guild }, async interaction => {
  if (!admin.users.includes(interaction.user.id)) return interaction.reply({
    embeds: [new EmbedBuilder().setDescription('`❌` 権限がありません').setColor(Colors.Red)],
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
});