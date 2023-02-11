import { Button } from '@akki256/discord-interaction';
import { Colors, EmbedBuilder, PermissionFlagsBits } from 'discord.js';
const publicCoolDown = new Set();

const publicButton = new Button(
  { customId: 'nonick-stats:public' },
  async (interaction) => {

    if (!interaction.inCachedGuild() || !interaction.channel) return;
    const channel = interaction.channel;

    if (!channel?.permissionsFor(interaction.member).has(PermissionFlagsBits.AttachFiles))
      return interaction.reply({ content: '`❌` あなたはこのチャンネルで画像を送信する権限を持っていません。', ephemeral: true });
    if (!interaction.appPermissions?.has(PermissionFlagsBits.EmbedLinks | PermissionFlagsBits.SendMessages))
      return interaction.reply({ content: '`❌` BOTの権限不足により、このチャンネルで埋め込みを送信できません。', ephemeral: true });
    if (publicCoolDown.has(interaction.user.id))
      return interaction.reply({ content: '`⌛` 現在クールダウン中です。時間を置いて再試行してください', ephemeral: true });

    interaction.channel
      .send({ embeds: [
        new EmbedBuilder()
          .setColor(Colors.Orange)
          .setImage(interaction.message.attachments.first()?.url || null)
          .setFooter({ text: `by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() }),
      ] })
      .then(() => {
        interaction.update({ components: [interaction.message.components[0], interaction.message.components[1]] });
        publicCoolDown.add(interaction.user.id);
        setTimeout(() => publicCoolDown.delete(interaction.user.id), 180_000);
      })
      .catch(() => interaction.reply({ content: '`❌` 画像の送信に失敗しました', ephemeral: true }));

  },
);

module.exports = [publicButton];