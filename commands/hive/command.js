const { ApplicationCommandOptionType, ActionRowBuilder, SelectMenuBuilder, EmbedBuilder, Colors } = require('discord.js');
const axios = require('axios');
const emojis = require('../../module/emojis');
const { createHiveStatsCard } = require('../../module/stats');
const { lock } = require('../../config.json');

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
            description: 'プレイヤー名',
            maxLength: 15,
            type: ApplicationCommandOptionType.String,
            required: true,
          },
        ],
        type: ApplicationCommandOptionType.Subcommand,
      },
      {
        name: 'levels',
        description: '全ゲームのレベルを表示',
        options: [
          {
            name: 'gamertag',
            description: 'プレイヤー名',
            maxLength: 15,
            required: true,
            type: ApplicationCommandOptionType.String,
          },
        ],
        type: ApplicationCommandOptionType.Subcommand,
      },
    ],
    dmPermission: false,
    type: 'CHAT_INPUT',
  },
  exec: async (interaction) => {
    await interaction.deferReply({ ephemeral: true });

    if (lock.hive) {
      const embed = new EmbedBuilder()
        .setDescription('`😖` 現在メンテナンス中です。時間を置いて再試行してください')
        .setColor(Colors.Yellow);

      return interaction.followUp({ embeds: [embed], ephemeral: true });
    }

    if (interaction.options.getSubcommand() == 'stats') {
      const game = interaction.options.getString('game');
      const timeFrame = interaction.options.getString('timeframe');
      const playerName = interaction.options.getString('gamertag');

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

      const timeFlameSelect = new ActionRowBuilder().setComponents(
        new SelectMenuBuilder()
          .setCustomId('nonick-stats:stats-timeFlame')
          .setOptions(
            { label: '月間', value: 'month', default: timeFrame == 'month' },
            { label: 'すべての期間', value: 'all', default: timeFrame == 'all' },
          ),
      );

      axios.get(getStatsAPIUrl(game, playerName, timeFrame))
        .then(async res => {
          interaction.followUp({
            content: `${playerName}の統計を表示します`,
            files: [await createHiveStatsCard(res.data, playerName, game)],
            components: [gameSelect, timeFlameSelect],
          });
        })
        .catch(err => {
          if (err.response?.status === 404) {
            const embed = new EmbedBuilder()
              .setDescription('`❌` ゲーマータグが存在しないか、選択した期間にプレイヤーが一回もこのゲームを遊んでいません')
              .setColor(Colors.Red);

            return interaction.followUp({ content: `${playerName}の統計を表示します`, embeds: [embed], components: [gameSelect, timeFlameSelect] });
          }
          console.log(err);
        });
    }
    else {
      const embed = new EmbedBuilder()
        .setDescription('この機能は準備中です。今後のアナウンスをお待ち下さい！')
        .setColor(Colors.Green);

      interaction.followUp({ embeds: [embed], ephemeral: true });
    }
  },
};

function getStatsAPIUrl(game, player, timeFlame) {
  const time = new Map([
    [ 'month', `https://api.playhive.com/v0/game/monthly/player/${game}/${player}` ],
    [ 'all', `https://api.playhive.com/v0/game/all/${game}/${player}` ],
  ]);
  return time.get(timeFlame);
}

module.exports = [ commandInteraction ];