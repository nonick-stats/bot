import { Button, ChatInput, SelectMenu, SelectMenuType } from '@akki256/discord-interaction';
import { ActionRow, ActionRowBuilder, ApplicationCommandOptionType, AttachmentBuilder, ButtonBuilder, ButtonStyle, Colors, ComponentType, EmbedBuilder, MessageActionRowComponent, PermissionFlagsBits, resolveColor, StringSelectMenuBuilder } from 'discord.js';
import { createHiveCard, games, timeframe } from '../../module/canvas/hive';
import { Emojis } from '../../module/constant';
import { Gamertag } from '../../module/validate';
import MinecraftIDs from '../../schemas/MinecraftIDs';
import { Hive } from '../../types/responses';

const publicCoolDown = new Set();
const timeframeName: Record<timeframe, string> = {
	all: '全ての期間',
	month: '月間',
};
const hive = new ChatInput(
	{
		name: 'hive',
		description: 'HIVEサーバーでのミニゲームの統計を表示',
		options: [
			{
				name: 'stats',
				description: 'HIVEサーバーでのミニゲームの統計を表示',
				options: [
					{
						name: 'game',
						description: 'ゲーム',
						type: ApplicationCommandOptionType.String,
						choices: Object.entries(games).map(([value, name]) => ({ name, value })),
						required: true,
					},
					{
						name: 'timeframe',
						description: '統計の期間',
						type: ApplicationCommandOptionType.String,
						choices: Object.entries(timeframeName).map(([value, name]) => ({ name, value })),
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
			await interaction.deferReply({ ephemeral: true });
			const gamertag = interaction.options.getString('gamertag') ?? (await MinecraftIDs.findOne({ userId: interaction.user.id }))?.be;

			if (!gamertag)
				return interaction.followUp({ content: '`❌` ゲーマータグを入力してください。`/myid`コマンドを使用して入力を省略することも出来ます。', ephemeral: true });
			if (!Gamertag.Bedrock.test(gamertag))
				return interaction.followUp({ content: '`❌` 無効なゲーマータグが入力されました。', ephemeral: true });

			const game = interaction.options.getString('game', true) as keyof Hive.Games;
			const frame = (interaction.options.getString('timeframe') || 'all') as timeframe;

			const buffer = await createHiveCard(game, frame, gamertag).catch(error => {
				interaction.followUp({
					embeds: [new EmbedBuilder().setDescription(error.toString()).setColor(Colors.Red)],
					components: createComponents(game, frame, gamertag, 'button'),
				});
			});

			if (!buffer) return;

			interaction.followUp({
				files: [
					new AttachmentBuilder(buffer, { name: `${gamertag}-StatsCard.png` }),
				],
				components: createComponents(game, frame, gamertag),
			});
		}
	},
);

const gameSelect = new SelectMenu(
	{
		customId: 'nonick-stats:hive-stats-game',
		type: SelectMenuType.String,
	},
	async (interaction) => {
		const game = interaction.values[0] as keyof Hive.Games;
		const frame = getSelectData(interaction.message.components, 'nonick-stats:hive-stats-timeframe')[0] as timeframe;
		const gamertag = getGamertag(interaction.message.components);

		if (!(gamertag && frame)) return;

		await interaction.update({
			embeds: [
				new EmbedBuilder()
					.setTitle('`📷` 画像を作成中...')
					.setDescription('更新が完了するまで数秒お待ち下さい。')
					.setColor(Colors.Green),
			],
			files: [],
			components: createComponents(game, frame, gamertag, 'all'),
		});

		const buffer = await createHiveCard(game, frame, gamertag).catch(error => {
			interaction.editReply({
				embeds: [new EmbedBuilder().setDescription(error.toString()).setColor(Colors.Red)],
				components: createComponents(game, frame, gamertag, 'button'),
			});
		});

		if (!buffer) return;

		interaction.editReply({
			embeds: [],
			files: [
				new AttachmentBuilder(buffer, { name: `${gamertag}-StatsCard.jpeg` }),
			],
			components: createComponents(game, frame, gamertag),
		});
	},
);

const timeframeSelect = new SelectMenu(
	{
		customId: 'nonick-stats:hive-stats-timeframe',
		type: SelectMenuType.String,
	},
	async (interaction) => {
		const game = getSelectData(interaction.message.components, 'nonick-stats:hive-stats-game')[0] as keyof Hive.Games;
		const frame = interaction.values[0] as timeframe;
		const gamertag = getGamertag(interaction.message.components);

		if (!(gamertag && frame)) return;

		await interaction.update({
			embeds: [
				new EmbedBuilder()
					.setTitle('`📷` 画像を作成中...')
					.setDescription('更新が完了するまで数秒お待ち下さい。')
					.setColor(Colors.Green),
			],
			files: [],
			components: createComponents(game, frame, gamertag, 'all'),
		});

		const buffer = await createHiveCard(game, frame, gamertag).catch(error => {
			interaction.editReply({
				embeds: [new EmbedBuilder().setDescription(error.toString()).setColor(Colors.Red)],
				components: createComponents(game, frame, gamertag, 'button'),
			});
		});

		if (!buffer) return;

		interaction.editReply({
			embeds: [],
			files: [
				new AttachmentBuilder(buffer, { name: `${gamertag}-StatsCard.jpeg` }),
			],
			components: createComponents(game, frame, gamertag),
		});
	},
);

const publishButton = new Button(
	{ customId: /nonick-stats:public-.*/ },
	(interaction) => {
		if (!interaction.inCachedGuild() || !interaction.channel || !interaction.guild.members.me) return;
		if (publicCoolDown.has(interaction.user.id))
			return interaction.reply({ content: '`⌛` 現在クールダウン中です。時間を置いて再試行してください', ephemeral: true });
		if (!interaction.channel?.permissionsFor(interaction.member).has(PermissionFlagsBits.AttachFiles))
			return interaction.reply({ content: '`❌` あなたはこのチャンネルで画像を送信する権限を持っていません。', ephemeral: true });

		if (interaction.channel.isThread()) {
			if (!interaction.channel.sendable)
				return interaction.reply({ content: '`❌` このスレッドではメッセージを送信できません。', ephemeral: true });
			if (!interaction.channel.parent?.permissionsFor(interaction.guild.members.me)?.has(PermissionFlagsBits.EmbedLinks | PermissionFlagsBits.SendMessagesInThreads))
				return interaction.reply({ content: '`❌` BOTの権限不足により、このスレッドで埋め込みを送信できません。' });
		}
		else if (!interaction.appPermissions?.has(PermissionFlagsBits.EmbedLinks | PermissionFlagsBits.SendMessages))
			return interaction.reply({ content: '`❌` BOTの権限不足により、このチャンネルで埋め込みを送信できません。', ephemeral: true });

		interaction.channel
			.send({
				embeds: [
					new EmbedBuilder()
						.setColor(resolveColor('#2f3136'))
						.setImage(interaction.message.attachments.first()?.url || null)
						.setFooter({ text: `by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() }),
				],
			})
			.then(() => {
				interaction.update({
					embeds: [
						new EmbedBuilder()
							.setTitle('`✅` 公開しました')
							.setColor(Colors.Green),
					],
					components: [],
					files: [],
				});
				publicCoolDown.add(interaction.user.id);
				setTimeout(() => publicCoolDown.delete(interaction.user.id), 30_000);
			})
			.catch(() => interaction.reply({ content: '`❌` 画像の送信に失敗しました', ephemeral: true }));
	},
);

function createComponents(game: keyof Hive.Games, timeframe: timeframe, gamertag: string, disabled?: 'button' | 'all') {
	return [
		new ActionRowBuilder<StringSelectMenuBuilder>().setComponents(
			new StringSelectMenuBuilder()
				.setCustomId('nonick-stats:hive-stats-game')
				.setOptions(Object.entries(games).map(([value, label]) => ({ label, value, emoji: Emojis.hive[value as keyof Hive.Games], default: value === game })))
				.setDisabled(disabled === 'all'),
		),
		new ActionRowBuilder<StringSelectMenuBuilder>().setComponents(
			new StringSelectMenuBuilder()
				.setCustomId('nonick-stats:hive-stats-timeframe')
				.setOptions(Object.entries(timeframeName).map(([value, label]) => ({ label, value, default: value === timeframe })))
				.setDisabled(disabled === 'all'),
		),
		new ActionRowBuilder<ButtonBuilder>().setComponents(
			new ButtonBuilder()
				.setCustomId(`nonick-stats:public-${gamertag}`)
				.setLabel('公開')
				.setStyle(ButtonStyle.Success)
				.setEmoji('1073880855644225637')
				.setDisabled(typeof disabled === 'string'),
		),
	];
}

function getGamertag(components: ActionRow<MessageActionRowComponent>[]) {
	const button = components?.[2].components[0];
	const gamertag = button.customId?.replace(/^nonick-stats:public-/, '');
	if (gamertag && Gamertag.Bedrock.test(gamertag)) return gamertag;
	return null;
}

function getSelectData(components: ActionRow<MessageActionRowComponent>[], id: string) {
	for (const row of components) {
		const component = row.components.find(component => component.customId === id);
		if (component?.type !== ComponentType.StringSelect) continue;
		return component.options.flatMap(option => option.default ? option.value : []);
	}
	return [];
}

module.exports = [hive, gameSelect, timeframeSelect, publishButton];