const { ApplicationCommandOptionType, ActionRowBuilder, SelectMenuBuilder, EmbedBuilder, Colors } = require('discord.js');
const axios = require('axios');
const mcidSchema = require('../../schemas/mcid');
const emojis = require('../../module/emojis');
const { createHiveStatsCard } = require('../../module/stats');
const { lock } = require('../../config.json');

// eslint-disable-next-line no-useless-escape
const gamerTagRegExp = new RegExp(/(^[\d\s'])|[^a-zA-Z0-9\s']/);

const API = new Map([
  [ 'month', 'https://api.playhive.com/v0/game/monthly/player' ],
  [ 'all', 'https://api.playhive.com/v0/game/all' ],
]);

/** @type {import('@akki256/discord-interaction').ChatInputRegister} */
const commandInteraction = {
  data: {
    name: 'hive',
    description: 'HIVEサーバーの統計情報',
    options: [
      {
        name: 'stats',
        description: 'ミニゲームの統計を表示',
        options: [
          {
            name: 'game',
            description: 'ゲーム',
            choices: [
              { name: 'Treasure Wars ', value: 'wars' },
              { name: 'Death Run ', value: 'dr' },
              { name: 'Hide And Seek ', value: 'hide' },
              { name: 'Survival Games ', value: 'sg' },
              { name: 'Murder Mystery ', value: 'murder' },
              { name: 'Sky Wars', value: 'sky' },
              { name: 'Capture The Flag ', value: 'ctf' },
              { name: 'Block Drop ', value: 'drop' },
              { name: 'Ground Wars ', value: 'ground' },
              { name: 'Just Build ', value: 'build' },
            ],
            type: ApplicationCommandOptionType.String,
            required: true,
          },
          {
            name: 'timeframe',
            description: '統計の期間',
            choices: [
              { name: '月間', value: 'month' },
              { name: 'すべての期間', value: 'all' },
            ],
            type: ApplicationCommandOptionType.String,
            required: true,
          },
          {
            name: 'gamertag',
            description: 'ゲーマータグ',
            maxLength: 18,
            minLength: 3,
            type: ApplicationCommandOptionType.String,
          },
        ],
        type: ApplicationCommandOptionType.Subcommand,
      },
    ],
    dmPermission: false,
    coolTime: 15000,
    type: 'CHAT_INPUT',
  },
  exec: async (interaction) => {
    await interaction.deferReply({ ephemeral: true });

    if (lock.hive) return interaction.followUp({ content: '`😖` 現在メンテナンス中です。時間を置いて再試行してください' });

    if (interaction.options.getSubcommand() == 'stats') {
      const game = interaction.options.getString('game');
      const gamerTag = interaction.options.getString('gamertag') ?? (await mcidSchema.findOne({ userId: interaction.user.id }))?.be;
      const timeFrame = interaction.options.getString('timeframe');

      if (!gamerTag) return interaction.followUp({ content: '`❌` ゲーマータグを入力してください。`/myid`コマンドを使用して入力を省略することも出来ます。' });
      if (gamerTagRegExp.test(gamerTag)) return interaction.followUp({ content: '`❌` ゲーマータグの値が不正です' });

      const gameSelect = new ActionRowBuilder().setComponents(
        new SelectMenuBuilder()
          .setCustomId('nonick-stats:stats-game')
          .setOptions(
            { label: 'Treasure Wars', value: 'wars', emoji: emojis.hive.wars, default: game == 'wars' },
            { label: 'Death Run', value: 'dr', emoji: emojis.hive.dr, default: game == 'dr' },
            { label: 'Hide And Seek', value: 'hide', emoji: emojis.hive.hide, default: game == 'hide' },
            { label: 'Survival Games', value: 'sg', emoji: emojis.hive.sg, default: game == 'sg' },
            { label: 'Murder Mystery', value: 'murder', emoji: emojis.hive.murder, default: game == 'murder' },
            { label: 'Sky Wars', value: 'sky', emoji: emojis.hive.sky, default: game == 'sky' },
            { label: 'Capture The Flag', value: 'ctf', emoji: emojis.hive.ctf, default: game == 'ctf' },
            { label: 'Block Drop', value: 'drop', emoji: emojis.hive.drop, default: game == 'drop' },
            { label: 'Ground Wars', value: 'ground', emoji: emojis.hive.ground, default: game == 'ground' },
            { label: 'Just Build', value: 'build', emoji: emojis.hive.build, default: game == 'build' },
          ),
      );

      const timeFrameSelect = new ActionRowBuilder().setComponents(
        new SelectMenuBuilder()
          .setCustomId('nonick-stats:stats-timeFrame')
          .setOptions(
            { label: '月間', value: 'month', default: timeFrame == 'month' },
            { label: 'すべての期間', value: 'all', default: timeFrame == 'all' },
          ),
      );

      axios.get(`${API.get(timeFrame)}/${game}/${gamerTag}`, { timeout: 10000 })
        .then(async res => {
          if (!res.data?.username && !res.data?.UUID) {
            const embed = new EmbedBuilder()
              .setDescription('`❌` 選択した期間にプレイヤーが一回もこのゲームを遊んでいません')
              .setColor(Colors.Red);

            return interaction.followUp({
              content: `${gamerTag}の統計を表示します`,
              embeds: [embed],
              components: [gameSelect, timeFrameSelect],
            });
          }
          else {
            interaction.followUp({
              content: `${gamerTag}の統計を表示します`,
              files: [await createHiveStatsCard(res.data, gamerTag, game)],
              components: [gameSelect, timeFrameSelect],
            });
          }
        })
      .catch(err => {
        if (err.response?.status === 404) {
          const embed = new EmbedBuilder()
            .setDescription('`❌` ゲーマータグが存在しないか、選択した期間にプレイヤーが一回もこのゲームを遊んでいません')
            .setColor(Colors.Red);

          return interaction.followUp({ content: `${gamerTag}の統計を表示します`, embeds: [embed], components: [gameSelect, timeFrameSelect] });
        }
        else {
          const embed = new EmbedBuilder()
            .setDescription('`❌` 何らかの原因でAPIサーバーに接続できませんでした')
            .setColor(Colors.Red);

          return interaction.followUp({ embeds: [embed] });
        }
      });
    }
  },
};

module.exports = [ commandInteraction ];