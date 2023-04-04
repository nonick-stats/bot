import axios from 'axios';
import { Hive } from '../../../types/responses';
import { canvasHeight, createCard } from '../index';
import { holder, templates } from './holder';

export const games: Record<keyof Hive.Games, string> = {
	wars: 'Treasure Wars',
	dr: 'Death Run',
	hide: 'Hide And Seek',
	sg: 'Survival Games',
	murder: 'Murder Mystery',
	sky: 'Sky Wars',
	ctf: 'Capture The Flag',
	drop: 'Block Drop',
	ground: 'Ground Wars',
	build: 'Just Build',
	party: 'BlockParty',
};

const endpoints = {
	month: 'https://api.playhive.com/v0/game/monthly/player',
	all: 'https://api.playhive.com/v0/game/all',
};

export type timeframe = keyof typeof endpoints;

export async function createHiveCard<T extends keyof Hive.Games>(game: T, timeframe: timeframe, gamertag: string) {
	return await axios.get<Hive.Games[T]>(`${endpoints[timeframe]}/${game}/${gamertag}`, { timeout: 10_000 }).then(({ data }) => {
		if (!data) throw new Error('`❌` 予期しないエラーが発生しました。\n(APIサーバーが落ちている可能性があります)');

		Object.keys(data).map(key => {
			if (!holder.has(key)) holder.register(key, data => String(data[key as keyof Hive.AllGameStats] || 0));
		});
		return createCard(`src/images/hive/stats/${game}.png`,
			{
				height: 125,
				fields: [{ title: gamertag, font: '110px MinecraftTen', color: '#55FF55' }],
			},
			{
				height: 200,
				fields: [{ title: `The Hive - ${games[game]}`, font: '40px Minecraft' }],
			},
			...holder.parse(templates[game], data),
			{
				height: canvasHeight - 40,
				fields: [{ title: `タイムフレーム: ${data.human_index ? `月間 (${data.human_index}位)` : 'すべての期間'}` }],
				font: '40px PixelMPlus',
			},
		);
	}).catch(({ response }) => {
		if (response?.status === 404) throw new Error('`❌` 選択した期間にプレイヤーが一回もこのゲームを遊んでいません');
		throw new Error('`❌` 予期しないエラーが発生しました。\n(APIサーバーが落ちている可能性があります)');
	});
}