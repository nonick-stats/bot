import { ChatInput } from '@akki256/discord-interaction';
import { ApplicationCommandOptionType, Colors, EmbedBuilder } from 'discord.js';
import { beMinecraftIdRegExp } from '../module/Regexps';
import MinecraftIDs from '../schemas/MinecraftIDs';

const myidCommand = new ChatInput(
  {
    name: 'myid',
    description: 'マイクラIDを登録',
    options: [
      // {
      //   name: 'java',
      //   description: 'java版ID',
      //   minLength: 3,
      //   maxLength: 16,
      //   type: ApplicationCommandOptionType.String,
      // },
      {
        name: 'be',
        description: 'be版ID',
        minLength: 3,
        maxLength: 18,
        type: ApplicationCommandOptionType.String,
        required: true,
      },
    ],
    dmPermission: false,
  },
  { coolTime: 30_000 },
  async (interaction): Promise<void> => {
    const beMinecraftId = interaction.options.getString('be', true);

    if (beMinecraftIdRegExp.test(beMinecraftId)) {
      interaction.reply({ content: '`❌` 利用できない文字が含まれています', ephemeral: true });
      return;
    }

    const UpdatedMCID = await MinecraftIDs.findOneAndUpdate(
      { userId: interaction.user.id },
      { $set: { be: beMinecraftId } },
      { upsert: true, new: true },
    );

    interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setDescription([
            `\`✅\` IDを\`${UpdatedMCID.be}\`に設定しました。`,
            '`/hive stats`等ゲーマータグを入力するコマンドでゲーマタグを省略する事ができます。',
          ].join('\n'))
          .setColor(Colors.Green),
      ],
      ephemeral: true,
    });
    UpdatedMCID.save();
  },
);

module.exports = [myidCommand];