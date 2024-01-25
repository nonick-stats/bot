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
  bridge: 'TheBridge (Solo)',
  grav: 'Gravity',
};

const xpData: Record<
  keyof Hive.Games,
  { inc: number; cap: number | null; max: number }
> = {
  wars: { inc: 150, cap: 52, max: 100 },
  dr: { inc: 200, cap: 42, max: 75 },
  hide: { inc: 100, cap: null, max: 75 },
  sg: { inc: 150, cap: null, max: 30 },
  murder: { inc: 100, cap: 82, max: 100 },
  sky: { inc: 150, cap: 52, max: 75 },
  ctf: { inc: 150, cap: null, max: 50 },
  drop: { inc: 150, cap: 22, max: 25 },
  build: { inc: 100, cap: null, max: 20 },
  ground: { inc: 150, cap: null, max: 20 },
  party: { inc: 150, cap: null, max: 25 },
  bridge: { inc: 300, cap: null, max: 20 },
  grav: { inc: 150, cap: null, max: 25 },
};

const endpoints = {
  month: 'https://api.playhive.com/v0/game/monthly/player',
  all: 'https://api.playhive.com/v0/game/all',
};

export type timeframe = keyof typeof endpoints;

export async function createHiveCard<T extends keyof Hive.Games>(
  game: T,
  timeframe: timeframe,
  gamertag: string,
) {
  return await axios
    .get<Hive.Games[T]>(`${endpoints[timeframe]}/${game}/${gamertag}`, {
      timeout: 10_000,
    })
    .then(async ({ data }) => {
      if (!data)
        throw new Error(
          '`❌` 予期しないエラーが発生しました。\n(APIサーバーが落ちている可能性があります)',
        );

      Object.keys(data).map((key) => {
        if (!holder.has(key))
          holder.register(key, (v) =>
            String(v[key as keyof Hive.AllGameStats] || 0),
          );
      });
      const { data: allData } =
        timeframe === 'all'
          ? { data }
          : await axios.get<Hive.Games[T]>(
              `${endpoints['all']}/${game}/${gamertag}`,
              { timeout: 10_000 },
            );
      const { lv, xp, need, max } = getLevel(game, allData.xp);
      return createCard(
        `src/images/hive/stats/${game}.png`,
        {
          height: 95,
          fields: [{ title: gamertag, font: '90px mcTen', color: '#55FF55' }],
        },
        {
          height: 145,
          fields: [{ title: `The Hive - ${games[game]}`, font: '35px mc' }],
        },
        {
          height: 205,
          fields: [
            {
              title: `${
                'prestige' in allData && allData.prestige
                  ? `P${allData.prestige}  `
                  : ''
              }Lv.${lv}  ${
                max
                  ? 'MAX'
                  : `  ${xp} / ${need} (${Math.floor((xp / need) * 100)}%)`
              }`,
              font: '35px mc',
              color: '#ccc',
            },
          ],
        },
        ...holder.parse(templates[game], data),
        {
          height: canvasHeight - 40,
          fields: [
            {
              title: `タイムフレーム: ${
                data.human_index
                  ? `月間 (${data.human_index}位)`
                  : 'すべての期間'
              }`,
            },
          ],
          font: '30px PixelMPlus',
        },
      );
    })
    .catch(({ response }) => {
      if (response?.status === 404)
        throw new Error(
          '`❌` 選択した期間にプレイヤーが一回もこのゲームを遊んでいません',
        );
      throw new Error(
        '`❌` 予期しないエラーが発生しました。\n(APIサーバーが落ちている可能性があります)',
      );
    });
}

export function getLevel<T extends keyof Hive.Games>(game: T, xp: number) {
  let lv = 1;
  const data = xpData[game];
  let need = data.inc;
  while (xp >= need) {
    xp -= need;
    lv += 1;
    if (!data.cap || lv < data.cap) need += data.inc;
  }
  return { lv, xp, need, max: data.max === lv };
}
