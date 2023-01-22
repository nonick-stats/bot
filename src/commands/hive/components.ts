import axios from 'axios';
import { StringSelectMenuComponent, ActionRowBuilder, StringSelectMenuBuilder, EmbedBuilder, Colors } from 'discord.js';
import { SelectMenu, SelectMenuType } from '@akki256/discord-interaction';
import { createHiveStatsCard } from '../../module/canvas/hive';

const API = new Map([
  [ 'month', 'https://api.playhive.com/v0/game/monthly/player' ],
  [ 'all', 'https://api.playhive.com/v0/game/all' ],
]);

const statsSelect = new SelectMenu(
  {
    customId: /^nonick-stats:hive-stats-(game|timeFrame)/,
    type: SelectMenuType.String,
  },
  async (interaction): Promise<void> => {
    const isGameSelect = interaction.customId == 'nonick-stats:hive-stats-game';

    const minecraftId = interaction.message.content.replace('の統計を表示します', '');
    const game = isGameSelect ? interaction.values[0] : (interaction.message.components[0].components[0] as StringSelectMenuComponent).options.find(v => v.default)?.value;
    const timeFrame = !isGameSelect ? interaction.values[0] : (interaction.message.components[1].components[0] as StringSelectMenuComponent).options.find(v => v.default)?.value;

    const interactionSelect = StringSelectMenuBuilder
      .from(interaction.component)
      .setOptions(interaction.component.options.map(({ label, value, emoji }) => ({ label, value, emoji, default: value == interaction.values[0] })));

    await interaction.update({
      embeds: [
        new EmbedBuilder()
          .setTitle('`📷` 画像を作成中...')
          .setDescription('更新が完了するまで数秒お待ち下さい。')
          .setColor(Colors.Green),
      ],
      files: [],
      components: [
        isGameSelect ? changeSelectMenuDisabled(interactionSelect, true) : changeSelectMenuDisabled(interaction.message.components[0].components[0] as StringSelectMenuComponent, true),
        !isGameSelect ? changeSelectMenuDisabled(interactionSelect, true) : changeSelectMenuDisabled(interaction.message.components[1].components[0] as StringSelectMenuComponent, true),
      ],
    });

    axios.get(`${API.get(timeFrame!)}/${game}/${minecraftId}`, { timeout: 10000 })
      .then(async (res): Promise<void> => {
        interaction.editReply({
          embeds: [],
          files: [await createHiveStatsCard(res.data as BaseGameStats, minecraftId, game!)],
          components: [
            isGameSelect ? changeSelectMenuDisabled(interactionSelect, false) : changeSelectMenuDisabled(interaction.message.components[0].components[0] as StringSelectMenuComponent, false),
            !isGameSelect ? changeSelectMenuDisabled(interactionSelect, false) : changeSelectMenuDisabled(interaction.message.components[1].components[0] as StringSelectMenuComponent, false),
          ],
        });
      })
      .catch((err): void => {
        if (err.response?.status === 404) {
          interaction.followUp({
            content: `${minecraftId}の統計を表示します`,
            embeds: [
              new EmbedBuilder()
              .setDescription('`❌` 選択した期間にプレイヤーが一回もこのゲームを遊んでいません')
              .setColor(Colors.Red),
            ],
            components: [
              isGameSelect ? changeSelectMenuDisabled(interactionSelect, false) : changeSelectMenuDisabled(interaction.message.components[0].components[0] as StringSelectMenuComponent, false),
              !isGameSelect ? changeSelectMenuDisabled(interactionSelect, false) : changeSelectMenuDisabled(interaction.message.components[1].components[0] as StringSelectMenuComponent, false),
            ],
          });
          return;
        }

        interaction.editReply({
          content: '`❌` APIサーバーに接続できませんでした',
          embeds: [],
          components: [],
        });
      });
  },
);

function changeSelectMenuDisabled(targetStringSelectMenu: (StringSelectMenuBuilder | StringSelectMenuComponent), disable: boolean): ActionRowBuilder<StringSelectMenuBuilder> {
  return new ActionRowBuilder<StringSelectMenuBuilder>().setComponents(
    StringSelectMenuBuilder
      .from(targetStringSelectMenu)
      .setDisabled(disable),
  );
}

module.exports = [statsSelect];