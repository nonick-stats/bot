const { ApplicationCommandOptionType, EmbedBuilder, Colors } = require('discord.js');
const mcidSchema = require('../schemas/mcid');

// eslint-disable-next-line no-useless-escape
const beProfileNameRegExp = new RegExp(/(^[\d\s'])|[^a-zA-Z0-9\s']/);

/** @type {import('@akki256/discord-interaction').ChatInputRegister} */
const commandInteraction = {
  data: {
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
    coolTime: 10000,
    type: 'CHAT_INPUT',
  },
  exec: async (interaction) => {
    const beProfileName = interaction.options.getString('be');
    if (beProfileNameRegExp.test(beProfileName)) return interaction.reply({ content: '`❌` 利用できない文字が含まれています', ephemeral: true });

    const UpdatedMcid = await mcidSchema.findOneAndUpdate(
      { userId: interaction.user.id },
      { $set: { be: beProfileName } },
      { upsert: true, new: true },
    );

    const embed = new EmbedBuilder()
      .setDescription([
        '`✅` IDを設定しました。',
        '`/hive stats`等ゲーマータグを入力する場合に省略が可能になります。',
      ].join('\n'))
      .setColor(Colors.Green);

    interaction.reply({ embeds: [embed], ephemeral: true });
    UpdatedMcid.save();
  },
};

module.exports = [ commandInteraction ];