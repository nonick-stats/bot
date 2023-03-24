import Canvas from '@napi-rs/canvas';
import { AttachmentBuilder } from 'discord.js';
import { Colors } from '../../format';

export async function createHiveStatsCard(data: BaseGameStats, playerName: string, gamePrefix: string): Promise<AttachmentBuilder> {
  Canvas.GlobalFonts.registerFromPath('src/fonts/minecraft.ttf', 'Minecraft');
  Canvas.GlobalFonts.registerFromPath('src/fonts/minecraftTen.ttf', 'MinecraftTen');
  Canvas.GlobalFonts.registerFromPath('src/fonts/pixelMplus12-Regular.ttf', 'PixelMPlus');

  const canvas = Canvas.createCanvas(1280, 720);
  const context = canvas.getContext('2d');

  const Game = new Map([
    ['wars', 'Treasure Wars'],
    ['dr',     'Death Run'],
    ['hide',   'Hide And Seek'],
    ['sg',     'Survival Games'],
    ['murder', 'Murder Mystery'],
    ['sky',    'Sky Wars'],
    ['ctf',    'Capture The Flag'],
    ['drop',   'Block Drop'],
    ['ground', 'Ground Wars'],
    ['build',  'Just Build'],
    ['party',  'BlockParty'],
  ]);

  const backGround = await Canvas.loadImage(`src/images/hive/stats/${gamePrefix}.png`);
  context.drawImage(backGround, 0, 0, canvas.width, canvas.height);

  context.textAlign = 'center';

  // TextShadow
  context.shadowBlur = 2;
  context.shadowColor = Colors.black;
  context.shadowOffsetX = 5;
  context.shadowOffsetY = 5;

  // PlayerName
  context.font = '110px MinecraftTen';
  context.fillStyle = '#55FF55';
  context.fillText(playerName, canvas.width / 2, 125);

  // GameName
  context.font = '40px Minecraft';
  context.fillStyle = Colors.white;
  context.fillText(`The Hive - ${Game.get(gamePrefix)}`, canvas.width / 2, 200);

  const addStatsModule = await import(`./game/${gamePrefix}`);
  addStatsModule.default(canvas, context, data);

  if (data.human_index) {
    context.fillStyle = Colors.white;
    context.font = '40 PixelMPlus';
    context.fillText(`タイムフレーム: 月間 (${data.human_index}位)`, canvas.width * 0.5, canvas.height - 40);
  }
  else {
    context.fillStyle = Colors.white;
    context.font = '40 PixelMPlus';
    context.fillText('タイムフレーム: すべての期間', canvas.width * 0.5, canvas.height - 40);
  }

  context.fillStyle = Colors.gray;
  context.textAlign = 'left';
  context.font = '30 Minecraft';
  context.fillText('NoNICK.stats', 10, canvas.height - 10);

  return new AttachmentBuilder(await canvas.encode('jpeg'), { name: `${playerName}-StatsCard.jpeg` });
}

export const CardTextStyle = {
  statsName: '50px PixelMPlus',
  statsValue: '65px Minecraft',
};

export function toRate(win: number, played: number): number {
  const rate = Math.round((win / played) * 100);
  if (!isFinite(rate)) return 0;
  return rate;
}

// 開発途中 (Javascript)
// async function createHiveLevelsCard(data, playerName, categoryPrefix) {
//   const Category = new Map([
//     ['basic', 'Basic Game'],
//     ['arcade', 'Arcade Game'],
//   ]);

//   const Style = {
//     gameName: 'bold 35px Minecraft',
//     level: '40px Minecraft',
//   };

//   const canvas = Canvas.createCanvas(1280, 720);
//   const context = canvas.getContext('2d');

//   const backGround = await Canvas.loadImage(`images/hive/${categoryPrefix}Hub.png`);
//   context.drawImage(backGround, 0, 0, canvas.width, canvas.height);

//   context.textAlign = 'center';

//   // TextShadow
//   context.shadowBlur = 2;
//   context.shadowcolors = colors.black;
//   context.shadowOffsetX = 5;
//   context.shadowOffsetY = 5;

//   // PlayerName
//   context.font = '110px MinecraftTen';
//   context.fillStyle = '#55FF55';
//   context.fillText(playerName, canvas.width / 2, 125);

//   // Title
//   context.font = '40px Minecraft';
//   context.fillStyle = colors.white;
//   context.fillText(`The Hive - ${Category.get(categoryPrefix)} Levels`, canvas.width / 2, 200);

//   if (categoryPrefix == 'basic') {
//     context.fillStyle = colors.yellow;
//     context.font = Style.gameName;
//     context.fillText('Treasure Wars', canvas.width * 0.20, 300);
//   }

//   context.fillStyle = colors.gray;
//   context.textAlign = 'left';
//   context.font = '30 Minecraft';
//   context.fillText('NoNICK.stats', 10, canvas.height - 10);

//   return new AttachmentBuilder(await canvas.encode('png'), { name: `${playerName}-LevelCard.png` });
// }

// function toRate(win, played) {
//   const rate = Math.round((win / played) * 100);
//   if (!isFinite(rate)) return '0';
//   return rate;
// }

// function getLevel(xp, game) {
//   const xpChart = new Map([
//     ['wars', { inc: 150, cap: 52 }],
//     ['dr', { inc: 200, cap: 42 }],
//     ['hide', { inc: 100, cap: null }],
//     ['murder', { inc: 100, cap: 82 }],
//     ['sg', { inc: 150, cap: null }],
//     ['sky', { inc: 150, cap: 52 }],
//     ['ctf', { inc: 150, cap: null }],
//     ['drop', { inc: 150, cap: 22 }],
//     ['ground', { inc: 150, cap: null }],
//     ['build', { inc: 100, cap: null }],
//   ]);
// }