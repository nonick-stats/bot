import { CardRow } from '../index';
import { PlaceHolder } from '../../format';
import { Hive } from '../../../types/responses';
import { CardTextStyle, Colors } from '../../constant';

export const templates: { [K in keyof Hive.Games]: CardRow[] } = {
	build: [
		{
			height: 300,
			fields: [
				{ title: 'プレイ数', data: '![played]' },
				{ title: 'ランクイン数', data: '![victories]' },
				{ title: 'ランクイン率', data: '![victoryRate]' },
			],
			color: Colors.red,
			titleOption: { font: CardTextStyle.statsName },
			dataOption: { font: CardTextStyle.statsValue },
		},
		{
			height: 500,
			fields: [
				{ title: 'イマイチ', data: '![rating_good_received]' },
				{ title: 'OK', data: '![rating_love_received]' },
				{ title: 'いいね', data: '![rating_meh_received]' },
				{ title: '大好き', data: '![rating_okay_received]' },
			],
			color: Colors.yellow,
			titleOption: { font: CardTextStyle.statsName },
			dataOption: { font: CardTextStyle.statsValue },
		},
	],
	ctf: [
		{
			height: 300,
			fields: [
				{ title: 'プレイ数', data: '![played]' },
				{ title: '勝利数', data: '![victories]' },
				{ title: '勝率', data: '![victoryRate]' },
				{ title: '旗 取得数', data: '![flags_captured]', color: Colors.pink },
			],
			color: Colors.red,
			titleOption: { font: CardTextStyle.statsName },
			dataOption: { font: CardTextStyle.statsValue },
		},
		{
			height: 500,
			fields: [
				{ title: 'キル数', data: '![kills]' },
				{ title: 'アシスト数', data: '![assists]' },
				{ title: 'デス数', data: '![deaths]' },
				{ title: '旗 奪還数', data: '![flags_returned]', color: Colors.pink },
			],
			color: Colors.yellow,
			titleOption: { font: CardTextStyle.statsName },
			dataOption: { font: CardTextStyle.statsValue },
		},
	],
	dr: [
		{
			height: 300,
			fields: [
				{ title: 'プレイ数', data: '![played]' },
				{ title: 'ゴール数', data: '![victories]' },
				{ title: 'ミス数', data: '![deaths]' },
			],
			color: Colors.red,
			titleOption: { font: CardTextStyle.statsName },
			dataOption: { font: CardTextStyle.statsValue },
		},
		{
			height: 500,
			fields: [
				{ title: '通過したチェックポイント', data: '![checkpoints]' },
				{ title: 'キル数', data: '![kills]' },
			],
			color: Colors.yellow,
			titleOption: { font: CardTextStyle.statsName },
			dataOption: { font: CardTextStyle.statsValue },
		},
	],
	drop: [
		{
			height: 300,
			fields: [
				{ title: 'プレイ数', data: '![played]' },
				{ title: '勝利数', data: '![victories]' },
				{ title: '勝率', data: '![victoryRate]' },
				{ title: 'アイテム獲得数', data: '![powerups_collected]', color: Colors.pink },
			],
			color: Colors.red,
			titleOption: { font: CardTextStyle.statsName },
			dataOption: { font: CardTextStyle.statsValue },
		},
		{
			height: 500,
			fields: [
				{ title: 'デス数', data: '![deaths]' },
				{ title: 'ブロック破壊数', data: '![blocks_destroyed]' },
				{ title: '羽使用数', data: '![vaults_used]', color: Colors.pink },
			],
			color: Colors.yellow,
			titleOption: { font: CardTextStyle.statsName },
			dataOption: { font: CardTextStyle.statsValue },
		},
	],
	ground: [
		{
			height: 300,
			fields: [
				{ title: 'プレイ数', data: '![played]' },
				{ title: '勝利数', data: '![victories]' },
				{ title: '勝率', data: '![victoryRate]' },
				{ title: '設置数', data: '![blocks_placed]', color: Colors.pink },
			],
			color: Colors.red,
			titleOption: { font: CardTextStyle.statsName },
			dataOption: { font: CardTextStyle.statsValue },
		},
		{
			height: 500,
			fields: [
				{ title: 'キル数', data: '![kills]' },
				{ title: 'デス数', data: '![deaths]' },
				{ title: '投げた数', data: '![projectiles_fired]' },
				{ title: '破壊数', data: '![blocks_destroyed]', color: Colors.pink },
			],
			color: Colors.yellow,
			titleOption: { font: CardTextStyle.statsName },
			dataOption: { font: CardTextStyle.statsValue },
		},
	],
	hide: [
		{
			height: 300,
			fields: [
				{ title: 'プレイ数', data: '![played]' },
				{ title: '勝利数', data: '![victories]' },
				{ title: '勝率', data: '![victoryRate]' },
			],
			color: Colors.red,
			titleOption: { font: CardTextStyle.statsName },
			dataOption: { font: CardTextStyle.statsValue },
		},
		{
			height: 500,
			fields: [
				{ title: '隠れ側キル数', data: '![hider_kills]' },
				{ title: '鬼側キル数', data: '![seeker_kills]' },
				{ title: 'デス数', data: '![deaths]' },
			],
			color: Colors.yellow,
			titleOption: { font: CardTextStyle.statsName },
			dataOption: { font: CardTextStyle.statsValue },
		},
	],
	murder: [
		{
			height: 300,
			fields: [
				{ title: 'プレイ数', data: '![played]' },
				{ title: '勝利数', data: '![victories]' },
				{ title: '勝率', data: '![victoryRate]' },
				{ title: 'コイン', data: '![coins]', color: Colors.pink },
			],
			color: Colors.red,
			titleOption: { font: CardTextStyle.statsName },
			dataOption: { font: CardTextStyle.statsValue },
		},
		{
			height: 500,
			fields: [
				{ title: 'キル数', data: '![murders]' },
				{ title: 'デス数', data: '![deaths]' },
				{ title: 'K/D比', data: '![killRate]' },
				{ title: 'マーダー退治数', data: '![murderer_eliminations]', color: Colors.pink },
			],
			color: Colors.yellow,
			titleOption: { font: CardTextStyle.statsName },
			dataOption: { font: CardTextStyle.statsValue },
		},
	],
	party: [
		{
			height: 300,
			fields: [
				{ title: 'プレイ数', data: '![played]' },
				{ title: '勝利数', data: '![victories]' },
				{ title: '勝率', data: '![victoryRate]' },
			],
			color: Colors.red,
			titleOption: { font: CardTextStyle.statsName },
			dataOption: { font: CardTextStyle.statsValue },
		},
		{
			height: 500,
			fields: [
				{ title: 'アイテム獲得数', data: '![powerups_collected]' },
				{ title: 'ラウンドクリア数', data: '![rounds_survived]' },
			],
			color: Colors.pink,
			titleOption: { font: CardTextStyle.statsName },
			dataOption: { font: CardTextStyle.statsValue },
		},
	],
	sg: [
		{
			height: 300,
			fields: [
				{ title: 'プレイ数', data: '![played]' },
				{ title: '勝利数', data: '![victories]' },
				{ title: '勝率', data: '![victoryRate]' },
				{ title: '牛 解放数', data: '![cows]', color: Colors.pink },
			],
			color: Colors.red,
			titleOption: { font: CardTextStyle.statsName },
			dataOption: { font: CardTextStyle.statsValue },
		},
		{
			height: 500,
			fields: [
				{ title: 'キル数', data: '![kills]' },
				{ title: 'デスマッチ到達数', data: '![deathmatches]' },
				{ title: 'チェスト開封数', data: '![crates]', color: Colors.pink },
			],
			color: Colors.yellow,
			titleOption: { font: CardTextStyle.statsName },
			dataOption: { font: CardTextStyle.statsValue },
		},
	],
	sky: [
		{
			height: 300,
			fields: [
				{ title: 'プレイ数', data: '![played]' },
				{ title: '勝利数', data: '![victories]' },
				{ title: '勝率', data: '![victoryRate]' },
				{ title: '掘った鉱石', data: '![ores_mined]', color: Colors.pink },
			],
			color: Colors.red,
			titleOption: { font: CardTextStyle.statsName },
			dataOption: { font: CardTextStyle.statsValue },
		},
		{
			height: 500,
			fields: [
				{ title: 'キル数', data: '![kills]' },
				{ title: '開けたMysteryChest', data: '![mystery_chests_destroyed]' },
				{ title: '使った呪文', data: '![spells_used]', color: Colors.pink },
			],
			color: Colors.yellow,
			titleOption: { font: CardTextStyle.statsName },
			dataOption: { font: CardTextStyle.statsValue },
		},
	],
	wars: [
		{
			height: 300,
			fields: [
				{ title: 'プレイ数', data: '![played]' },
				{ title: '勝利数', data: '![victories]' },
				{ title: '勝率', data: '![victoryRate]' },
				{ title: '宝破壊数', data: '![treasure_destroyed]', color: Colors.pink },
			],
			color: Colors.red,
			titleOption: { font: CardTextStyle.statsName },
			dataOption: { font: CardTextStyle.statsValue },
		},
		{
			height: 500,
			fields: [
				{ title: 'キル数', data: '![kills]' },
				{ title: 'ﾌｧｲﾅﾙｷﾙ数', data: '![final_kills]' },
				{ title: 'デス数', data: '![deaths]' },
				{ title: 'K/D率', data: '![killRate]', color: Colors.aqua },
			],
			color: Colors.yellow,
			titleOption: { font: CardTextStyle.statsName },
			dataOption: { font: CardTextStyle.statsValue },
		},
	],
};

const rate = (win?: number, play?: number) => (win || 0) / (play || 1);

export const holder = new PlaceHolder<Hive.AllGameStats>()
	.register('victoryRate', ({ played, victories }) => `${Math.round(rate(victories, played) * 100)} %`)
	.register('killRate', ({ deaths, kills, murders }) => rate(kills || murders, deaths).toFixed(2));