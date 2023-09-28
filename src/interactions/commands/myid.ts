import { ChatInput } from '@akki256/discord-interaction';
import { ApplicationCommandOptionType, Colors, EmbedBuilder } from 'discord.js';
import { Edition, GAMERTAG } from '@modules/validate';
import MinecraftIDs from '@models/Minecraft';
import { Duration } from '@modules/format';

export default new ChatInput({
  name: 'myid',
  description: 'マイクラIDを登録',
  options: [
    {
      name: 'je',
      description: 'java',
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: 'gamertag',
          description: 'gamertag',
          minLength: 2,
          maxLength: 16,
          type: ApplicationCommandOptionType.String,
          required: true,
        },
      ],
    },
    {
      name: 'be',
      description: 'bedrock',
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: 'gamertag',
          description: 'gamertag',
          minLength: 3,
          maxLength: 18,
          type: ApplicationCommandOptionType.String,
          required: true,
        },
      ],
    },
  ],
  dmPermission: false,
}, { coolTime: Duration.toMS('30s') }, async interaction => {
  const edition = interaction.options.getSubcommand(true) as Edition;
  const gamertag = interaction.options.getString('gamertag', true);

  if (!GAMERTAG[edition].test(gamertag)) return interaction.reply({ content: '`❌` 利用できない文字が含まれています', ephemeral: true });

  const UpdatedMCID = await MinecraftIDs.findOneAndUpdate(
    { userId: interaction.user.id },
    { $set: { [edition]: gamertag } },
    { upsert: true, new: true },
  );

  interaction.reply({
    embeds: [
      new EmbedBuilder()
        .setDescription([
          `\`✅\` ${edition}のIDを\`${UpdatedMCID[edition]}\`に設定しました。`,
          '`/hive stats`等ゲーマータグを入力するコマンドでゲーマタグを省略する事ができます。',
        ].join('\n'))
        .setColor(Colors.Green),
    ],
    ephemeral: true,
  });

  UpdatedMCID.save({ wtimeout: 1500 });
});