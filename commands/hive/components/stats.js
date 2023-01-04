const { SelectMenuBuilder, EmbedBuilder, Colors, ActionRowBuilder } = require('discord.js');
const axios = require('axios');
const { createHiveStatsCard } = require('../../../module/stats');

const API = new Map([
  [ 'month', 'https://api.playhive.com/v0/game/monthly/player' ],
  [ 'all', 'https://api.playhive.com/v0/game/all' ],
]);

const updatingEmbed = new EmbedBuilder()
  .setTitle('`📷` 画像を作成中...')
  .setDescription('更新が完了するまで数秒お待ち下さい。')
  .setColor(Colors.Green);

/** @type {import('@akki256/discord-interaction').SelectMenuRegister} */
const gameSelectMenuInteraction = {
  data: {
    customId: 'nonick-stats:stats-game',
    type: 'SELECT_MENU',
  },
  exec: async (interaction) => {
    const game = interaction.values[0];
    const gamerTag = interaction.message.content.replace('の統計を表示します', '');
    const timeFrame = interaction.message.components[1].components[0].options.find(v => v.default).value;

    const gameSelect = interaction.message.components[0];

    if (!gamerTag) return;

    /** @type {Array} */
    const options = interaction.component.options;
    options.forEach(v => v.default = false);
    options.find(v => v.value == game).default = true;

    gameSelect.components[0] = SelectMenuBuilder
      .from(gameSelect.components[0])
      .setOptions(options);

    await interaction.update({
      embeds: [updatingEmbed],
      files: [],
      components: [
        changeSelectMenuDisabled(gameSelect, true),
        changeSelectMenuDisabled(interaction.message.components[1], true),
      ],
    });

    axios.get(`${API.get(timeFrame)}/${game}/${gamerTag}`, { timeout: 10000 })
      .then(async res => {
        if (!res.data?.username && !res.data?.UUID) {
          const embed = new EmbedBuilder()
            .setDescription('`❌` 選択した期間にプレイヤーが一回もこのゲームを遊んでいません')
            .setColor(Colors.Red);

          return interaction.editReply({
            embeds: [embed],
            components: [
              changeSelectMenuDisabled(gameSelect, false),
              changeSelectMenuDisabled(interaction.message.components[1], false),
            ],
          });
        }
        else {
          interaction.editReply({
            embeds: [],
            files: [await createHiveStatsCard(res.data, gamerTag, game)],
            components: [
              changeSelectMenuDisabled(gameSelect, false),
              changeSelectMenuDisabled(interaction.message.components[1], false),
            ],
          });
        }
      })
      .catch(err => {
        if (err.response?.status === 404) {
          const embed = new EmbedBuilder()
            .setDescription('`❌` ゲーマータグが存在しないか、選択した期間にプレイヤーが一回もこのゲームを遊んでいません')
            .setColor(Colors.Red);

          return interaction.editReply({
            embeds: [embed],
            components: [
              changeSelectMenuDisabled(gameSelect, false),
              changeSelectMenuDisabled(interaction.message.components[1], false),
            ],
          });
        }
        else {
          const embed = new EmbedBuilder()
            .setDescription('`❌` 何らかの原因でAPIサーバーに接続できませんでした')
            .setColor(Colors.Red);

          return interaction.editReply({ embeds: [embed] });
        }
      });
  },
};

/** @type {import('@akki256/discord-interaction').SelectMenuRegister} */
const timeFrameSelectMenuInteraction = {
  data: {
    customId: 'nonick-stats:stats-timeFrame',
    type: 'SELECT_MENU',
  },
  exec: async (interaction) => {
    const timeFrame = interaction.values[0];
    const gamerTag = interaction.message.content.replace('の統計を表示します', '');
    const game = interaction.message.components[0].components[0].options.find(v => v.default).value;

    if (!gamerTag) return;

    const timeFrameSelect = interaction.message.components[1];

    /** @type {Array} */
    const options = interaction.component.options;
    options.forEach(v => v.default = false);
    options.find(v => v.value == interaction.values).default = true;

    timeFrameSelect.components[0] = SelectMenuBuilder
      .from(timeFrameSelect.components[0])
      .setOptions(options);

    await interaction.update({
      embeds: [updatingEmbed],
      files: [],
      components: [
        changeSelectMenuDisabled(interaction.message.components[0], true),
        changeSelectMenuDisabled(timeFrameSelect, true),
      ],
    });

    axios.get(`${API.get(timeFrame)}/${game}/${gamerTag}`, { timeout: 10000 })
      .then(async res => {
        if (!res.data?.username && !res.data?.UUID) {
          const embed = new EmbedBuilder()
            .setDescription('`❌` 選択した期間にプレイヤーが一回もこのゲームを遊んでいません')
            .setColor(Colors.Red);

          return interaction.editReply({
            embeds: [embed],
            components: [
              changeSelectMenuDisabled(interaction.message.components[0], false),
              changeSelectMenuDisabled(timeFrameSelect, false),
            ],
          });
        }
        else {
          interaction.editReply({
            embeds: [],
            files: [await createHiveStatsCard(res.data, gamerTag, game)],
            components: [
              changeSelectMenuDisabled(interaction.message.components[0], false),
              changeSelectMenuDisabled(timeFrameSelect, false),
            ],
          });
        }
      })
      .catch(err => {
        if (err.response?.status === 404) {
          const embed = new EmbedBuilder()
            .setDescription('`❌` ゲーマータグが存在しないか、選択した期間にプレイヤーが一回もこのゲームを遊んでいません')
            .setColor(Colors.Red);

          return interaction.editReply({
            embeds: [embed],
            components: [
              changeSelectMenuDisabled(interaction.message.components[0], false),
              changeSelectMenuDisabled(timeFrameSelect, false),
            ],
          });
        }
        else {
          const embed = new EmbedBuilder()
            .setDescription('`❌` 何らかの原因でAPIサーバーに接続できませんでした')
            .setColor(Colors.Red);

          return interaction.editReply({ embeds: [embed] });
        }
      });
  },
};

/**
 * @param {import('discord.js').ActionRow} actionRow
 * @param {boolean} disable
 */
function changeSelectMenuDisabled(actionRow, disable) {
  return new ActionRowBuilder().setComponents(
    SelectMenuBuilder
      .from(actionRow.components[0])
      .setDisabled(disable),
  );
}

module.exports = [gameSelectMenuInteraction, timeFrameSelectMenuInteraction];