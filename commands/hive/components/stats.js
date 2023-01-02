const { SelectMenuBuilder, EmbedBuilder, Colors } = require('discord.js');
const axios = require('axios');
const { createHiveStatsCard } = require('../../../module/stats');

const updatingEmbed = new EmbedBuilder()
  .setTitle('`📷` 画像を作成中...')
  .setDescription('更新が完了するまで数秒お待ち下さい。')
  .setColor(Colors.Green);

const errorEmbed = new EmbedBuilder()
  .setColor(Colors.Red);

/** @type {import('@akki256/discord-interaction').SelectMenuRegister} */
const gameSelectMenuInteraction = {
  data: {
    customId: 'nonick-stats:stats-game',
    type: 'SELECT_MENU',
  },
  exec: async (interaction) => {
    const game = interaction.values[0];
    const player = interaction.message.content.replace('の統計を表示します', '');
    const timeFlame = interaction.message.components[1].components[0].options.find(v => v.default).value;

    const gameSelect = interaction.message.components[0];

    /** @type {Array} */
    const options = interaction.component.options;
    options.forEach(v => v.default = false);
    options.find(v => v.value == interaction.values).default = true;

    gameSelect.components[0] = SelectMenuBuilder
      .from(gameSelect.components[0])
      .setOptions(options);

    await interaction.update({ embeds: [updatingEmbed], files: [], components: [gameSelect, interaction.message.components[1]] });

    await axios.get(getStatsAPI(game, player, timeFlame))
      .then(async res => interaction.editReply({ files: [await createHiveStatsCard(res.data, player, game)], embeds: [] }))
      .catch(err => {
        if (err.response?.status === 404) return interaction.editReply({ embeds: [errorEmbed.setDescription('`❌` ゲーマータグが存在しないか、選択した期間にプレイヤーが一回もこのゲームを遊んでいません')] });
        if (err.response?.status === 522) return interaction.editReply({ embeds: [errorEmbed.setDescription('`❌` 何らかの原因でAPIサーバーに接続できませんでした')] });
        console.log(err);
      });
  },
};

/** @type {import('@akki256/discord-interaction').SelectMenuRegister} */
const timeFrameSelectMenuInteraction = {
  data: {
    customId: 'nonick-stats:stats-timeFlame',
    type: 'SELECT_MENU',
  },
  exec: async (interaction) => {
    const timeFlame = interaction.values[0];
    const player = interaction.message.content.replace('の統計を表示します', '');
    const game = interaction.message.components[0].components[0].options.find(v => v.default).value;

    const timeFlameSelect = interaction.message.components[1];

    /** @type {Array} */
    const options = interaction.component.options;
    options.forEach(v => v.default = false);
    options.find(v => v.value == interaction.values).default = true;

    timeFlameSelect.components[0] = SelectMenuBuilder
      .from(timeFlameSelect.components[0])
      .setOptions(options);

    await interaction.update({ embeds: [updatingEmbed], files: [], components: [interaction.message.components[0], timeFlameSelect] });

    await axios.get(getStatsAPI(game, player, timeFlame))
      .then(async res => interaction.editReply({ files: [await createHiveStatsCard(res.data, player, game)], embeds: [] }))
      .catch(err => {
        if (err.response?.status === 404) return interaction.editReply({ embeds: [errorEmbed.setDescription('`❌` ゲーマータグが存在しないか、選択した期間にプレイヤーが一回もこのゲームを遊んでいません')] });
        if (err.response?.status === 522) return interaction.editReply({ embeds: [errorEmbed.setDescription('`❌` 何らかの原因でAPIサーバーに接続できませんでした')] });
        console.log(err);
      });
  },
};

function getStatsAPI(game, player, timeFlame) {
  const time = new Map([
    [ 'month', `https://api.playhive.com/v0/game/monthly/player/${game}/${player}` ],
    [ 'all', `https://api.playhive.com/v0/game/all/${game}/${player}` ],
  ]);
  return time.get(timeFlame);
}

module.exports = [gameSelectMenuInteraction, timeFrameSelectMenuInteraction];