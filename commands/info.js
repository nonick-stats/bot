const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, Colors, inlineCode } = require('discord.js');
const supportServers = [
  'The HIVE',
];

/** @type {import('@akki256/discord-interaction').ChatInputRegister} */
const commandInteraction = {
  data: {
    name: 'info',
    description: 'このBOTについて',
    dmPermission: true,
    type: 'CHAT_INPUT',
  },
  exec: async (interaction) => {
    const embed = new EmbedBuilder()
      .setTitle(interaction.client.user.username)
      .setDescription([
        '**Minecraftサーバーの統計を表示するBOT**',
        'ミニゲームの戦績等を画像にして表示します！',
        '',
        '利用規約やプライバシーポリシーは、[NoNICK.js](https://docs.nonick-js.com)と同等のものが適用されるものとします。また、NoNICK.statsはこれらのサーバーおよびMinecraftとは一切関係はありません。',
      ].join('\n'))
      .setColor(Colors.White)
      .setImage('https://cdn.discordapp.com/attachments/958791423161954445/1059392131644543066/bg.png')
      .setFields({ name: '対応サーバー', value: supportServers.map(v => inlineCode(v)).join(' ') })
      .setFooter({ text: '開発者・nonick-mc#1017', iconURL: 'https://media.discordapp.net/attachments/958791423161954445/975266759529623652/-3.png' });

    const button = new ActionRowBuilder().setComponents(
      new ButtonBuilder()
        .setLabel('サポートサーバー')
        .setURL('https://discord.gg/fVcjCNn733')
        .setStyle(ButtonStyle.Link),
      new ButtonBuilder()
        .setLabel('ドキュメント')
        .setURL('https://docs.nonick-js.com/')
        .setStyle(ButtonStyle.Link),
    );

    interaction.reply({ embeds: [embed], components: [button], ephemeral: true });
  },
};

module.exports = [ commandInteraction ];