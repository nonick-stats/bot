import { ActionRowBuilder, ApplicationCommandOptionType, BaseMessageOptions, ButtonBuilder, ButtonStyle, Colors, ComponentType, EmbedBuilder, Interaction, StringSelectMenuBuilder } from 'discord.js';
import { ChatInput } from '@akki256/discord-interaction';
import { Emojies } from '../../module/format';
import { BedrockIdRegExp } from '../../module/regexps';
import { createHiveStatsCard } from '../../module/canvas/hive';
import MinecraftIDs from '../../schemas/MinecraftIDs';
import axios from 'axios';

enum Game {
  TreasureWars = 'wars',
  DeathRun = 'dr',
  HideAndSeek = 'hide',
  MurderMystery = 'murder',
  SurvivalGames = 'sg',
  SkyWars = 'sky',
  JustBuild = 'build',
  GroundWars = 'ground',
  BlockDrop = 'drop',
  CaptureTheFlag = 'ctf',
  BlockParty = 'party'
}

const API = new Map<string, string>([
  [ 'month', 'https://api.playhive.com/v0/game/monthly/player' ],
  [ 'all', 'https://api.playhive.com/v0/game/all' ],
]);

class StatsViewer {
  #id: string;
  #game: Game;
  #timeframe: string;
  #gameSelect: StringSelectMenuBuilder;
  #timeframeSelect: StringSelectMenuBuilder;
  #publicButton: ButtonBuilder;

  constructor(id: string, game: Game, timeframe: string) {
    this.#id = id;
    this.#game = game;
    this.#timeframe = timeframe;

    this.#gameSelect = new StringSelectMenuBuilder()
      .setCustomId('nonick-stats:hive-stats-game')
      .setOptions(
        { label: 'Treasure Wars',    value: Game.TreasureWars,   emoji: Emojies.hive.wars },
        { label: 'Death Run',        value: Game.DeathRun,       emoji: Emojies.hive.dr },
        { label: 'Hide And Seek',    value: Game.HideAndSeek,    emoji: Emojies.hive.hide },
        { label: 'Survival Games',   value: Game.SurvivalGames,  emoji: Emojies.hive.sg },
        { label: 'Murder Mystery',   value: Game.MurderMystery,  emoji: Emojies.hive.murder },
        { label: 'Sky Wars',         value: Game.SkyWars,        emoji: Emojies.hive.sky },
        { label: 'Capture The Flag', value: Game.CaptureTheFlag, emoji: Emojies.hive.ctf },
        { label: 'Block Drop',       value: Game.BlockDrop,      emoji: Emojies.hive.drop },
        { label: 'Ground Wars',      value: Game.GroundWars,     emoji: Emojies.hive.ground },
        { label: 'Just Build',       value: Game.JustBuild,      emoji: Emojies.hive.build },
        { label: 'Block Party',      value: Game.BlockParty,     emoji: Emojies.hive.party },
      );

    this.#timeframeSelect = new StringSelectMenuBuilder()
      .setCustomId('nonick-stats:hive-stats-timeFrame')
      .setOptions(
        { label: '月間',         value: 'month' },
        { label: 'すべての期間', value: 'all' },
      );

    this.#publicButton = new ButtonBuilder()
      .setCustomId('nonick-stats:public')
      .setLabel('公開')
      .setStyle(ButtonStyle.Success)
      .setEmoji('1073880855644225637');
  }

  async reply(interaction: Interaction) {
    if (!interaction.isRepliable()) throw new Error('interaction can\'t reply');
    interaction.deferReply({ ephemeral: true });

    this.#setSelectMenuDefault({});
    const message = await interaction.followUp({ ...(await this.#getMessageOption()), fetchReply: true });

    const interactionCollector = message.createMessageComponentCollector({
      filter: ((v) => [this.#gameSelect.data.custom_id, this.#timeframeSelect.data.custom_id].includes(v.customId)),
      componentType: ComponentType.StringSelect,
      time: 300_000,
    });

    interactionCollector.on('collect', async (resInteraction) => {
      const game = resInteraction.customId === this.#gameSelect.data.custom_id ? resInteraction.values[0] as Game : undefined;
      const timeframe = resInteraction.customId === this.#timeframeSelect.data.custom_id ? resInteraction.values[0] : undefined;

      if (game) this.#game = game;
      if (timeframe) this.#timeframe = timeframe;

      this.#setSelectMenuDefault({ game, timeframe });

      await resInteraction.update({
        embeds: [
          new EmbedBuilder()
            .setTitle('`📷` 画像を作成中...')
            .setDescription('更新が完了するまで数秒お待ち下さい。')
            .setColor(Colors.Green),
        ],
        files: [],
        components: [
          new ActionRowBuilder<StringSelectMenuBuilder>().setComponents(this.#gameSelect.setDisabled(true)),
          new ActionRowBuilder<StringSelectMenuBuilder>().setComponents(this.#timeframeSelect.setDisabled(true)),
        ],
      });

      await interaction.editReply(await this.#getMessageOption());
      interactionCollector.resetTimer();
    });
  }

  async #getMessageOption(): Promise<BaseMessageOptions> {
    const components = [
      new ActionRowBuilder<StringSelectMenuBuilder>().setComponents(this.#gameSelect.setDisabled(false)),
      new ActionRowBuilder<StringSelectMenuBuilder>().setComponents(this.#timeframeSelect.setDisabled(false)),
      new ActionRowBuilder<ButtonBuilder>().setComponents(this.#publicButton),
    ];

    const res = await axios.get(`${API.get(this.#timeframe)}/${this.#game}/${this.#id}`, { timeout: 10_000 }).catch((err) => err);

    if (res.data) return {
      embeds: [],
      files: [await createHiveStatsCard(res?.data as BaseGameStats, this.#id, this.#game)],
      components,
    };
    else if (res.response?.status === 404) return {
      embeds: [new EmbedBuilder().setDescription('`❌` 選択した期間にプレイヤーが一回もこのゲームを遊んでいません').setColor(Colors.Red)],
      components,
    };

    return { embeds: [new EmbedBuilder().setDescription('`❌` 予期しないエラーが発生しました。\n(APIサーバーが落ちている可能性があります)').setColor(Colors.Red)] };
  }

  #setSelectMenuDefault(option: { game?: Game, timeframe?: string }) {
    if (option?.game) this.#game = option.game;
    if (option?.timeframe) this.#timeframe = option.timeframe;

    this.#gameSelect.setOptions(this.#gameSelect.options.map((v) => v.setDefault(v.data.value === this.#game)));
    this.#timeframeSelect.setOptions(this.#timeframeSelect.options.map((v) => v.setDefault(v.data.value === this.#timeframe)));
  }
}

const command = new ChatInput(
  {
    name: 'hive',
    description: 'HIVEサーバーでの統計を表示',
    options: [
      {
        name: 'stats',
        description: 'HIVEサーバーでのミニゲームの統計を表示',
        options: [
          {
            name: 'game',
            description: 'ゲーム',
            choices: [
              { name: 'Treasure Wars',    value: Game.TreasureWars },
              { name: 'Death Run',        value: Game.DeathRun },
              { name: 'Hide And Seek',    value: Game.HideAndSeek },
              { name: 'Survival Games',   value: Game.SurvivalGames },
              { name: 'Murder Mystery',   value: Game.MurderMystery },
              { name: 'Sky Wars',         value: Game.SkyWars },
              { name: 'Capture The Flag', value: Game.CaptureTheFlag },
              { name: 'Block Drop',       value: Game.BlockDrop },
              { name: 'Ground Wars',      value: Game.GroundWars },
              { name: 'Just Build',       value: Game.JustBuild },
              { name: 'Block Party',      value: Game.BlockDrop },
            ],
            type: ApplicationCommandOptionType.String,
            required: true,
          },
          {
            name: 'timeframe',
            description: '統計の期間',
            choices: [
              { name: '月間',         value: 'month' },
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
  },
  { coolTime: 15_000 },
  async (interaction) => {
    const subcommand = interaction.options.getSubcommand();

    if (subcommand === 'stats') {
      const game = interaction.options.getString('game', true) as Game;
      const timeframe = interaction.options.getString('timeframe', true);
      const id = interaction.options.getString('gamertag') ?? await MinecraftIDs.findOne({ be: interaction.user.id });

      if (!id)
        return interaction.reply({ content: '`❌` ゲーマータグを入力してください。`/myid`コマンドを使用して入力を省略することも出来ます。', ephemeral: true });
      if (BedrockIdRegExp.test(id))
        return interaction.reply({ content: '`❌` 無効なゲーマータグが入力されました。', ephemeral: true });

      new StatsViewer(id, game, timeframe).reply(interaction);
    }
  },
);

module.exports = [command];