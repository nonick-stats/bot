const Canvas = require('@napi-rs/canvas');
const { AttachmentBuilder } = require('discord.js');
const colors = require('./colors');

Canvas.GlobalFonts.registerFromPath('fonts/minecraft.ttf', 'Minecraft');
Canvas.GlobalFonts.registerFromPath('fonts/minecraftTen.ttf', 'MinecraftTen');
Canvas.GlobalFonts.registerFromPath('fonts/pixelMplus12-Regular.ttf', 'PixelMPlus');

async function createHiveStatsCard(data, playerName, gamePrefix) {
  const Game = new Map([
    ['wars', 'Treasure Wars'],
    ['dr', 'Death Run'],
    ['hide', 'Hide And Seek'],
    ['sg', 'Survival Games'],
    ['murder', 'Murder Mystery'],
    ['sky', 'Sky Wars'],
    ['ctf', 'Capture The Flag'],
    ['drop', 'Block Drop'],
    ['ground', 'Ground Wars'],
    ['build', 'Just Build'],
  ]);

  const Style = {
    statsName: '50px PixelMPlus',
    statsValue: '65px Minecraft',
  };

  const canvas = Canvas.createCanvas(1280, 720);
  const context = canvas.getContext('2d');

  const backGround = await Canvas.loadImage(`images/hive/stats/${gamePrefix}.png`);
  context.drawImage(backGround, 0, 0, canvas.width, canvas.height);

  context.textAlign = 'center';

  // TextShadow
  context.shadowBlur = 2;
  context.shadowcolors = colors.black;
  context.shadowOffsetX = 5;
  context.shadowOffsetY = 5;

  // PlayerName
  context.font = '110px MinecraftTen';
  context.fillStyle = '#55FF55';
  context.fillText(playerName, canvas.width / 2, 125);

  // GameName
  context.font = '40px Minecraft';
  context.fillStyle = colors.white;
  context.fillText(`The Hive - ${Game.get(gamePrefix)}`, canvas.width / 2, 200);

  if (gamePrefix == 'wars') {
    context.fillStyle = colors.red;
    context.font = Style.statsName;
    context.fillText('プレイ数', canvas.width * 0.20 - 10, 300);
    context.fillText('勝利数', canvas.width * 0.40 - 10, 300);
    context.fillText('勝率', canvas.width * 0.60 - 10, 300);

    context.font = Style.statsValue;
    context.fillText(String(data.played || 0), canvas.width * 0.20 - 10, 400);
    context.fillText(String(data.victories || 0), canvas.width * 0.40 - 10, 400);
    context.fillText(`${(toRate(data.victories, data.played)) } %`, canvas.width * 0.60 - 10, 400);

    context.fillStyle = colors.yellow;
    context.font = Style.statsName;
    context.fillText('キル数', canvas.width * 0.20 - 10, 500);
    context.fillText('ﾌｧｲﾅﾙｷﾙ数', canvas.width * 0.40 - 10, 500);
    context.fillText('デス数', canvas.width * 0.60 - 10, 500);

    context.font = Style.statsValue;
    context.fillText(String(data.kills || 0), canvas.width * 0.20 - 10, 600);
    context.fillText(String(data.final_kills || 0), canvas.width * 0.40 - 10, 600);
    context.fillText(String(data.deaths || 0), canvas.width * 0.60 - 10, 600);

    context.font = Style.statsName;
    context.fillStyle = colors.pink;
    context.fillText('宝破壊数', canvas.width * 0.80 + 10, 300);
    context.fillStyle = colors.aqua;
    context.fillText('K/D率', canvas.width * 0.80 + 10, 500);

    context.font = Style.statsValue;
    context.fillStyle = colors.pink;
    context.fillText(String(data.treasure_destroyed || 0), canvas.width * 0.80 + 10, 400);
    context.fillStyle = colors.aqua;
    context.fillText(String(toRate(data.kills, data.deaths) / 100), canvas.width * 0.80 + 10, 600);
  }

  if (gamePrefix == 'dr') {
    context.fillStyle = colors.red;
    context.font = Style.statsName;
    context.fillText('プレイ数', canvas.width * 0.25, 300);
    context.fillText('ゴール数', canvas.width * 0.50, 300);
    context.fillText('ミス数', canvas.width * 0.75, 300);

    context.font = Style.statsValue;
    context.fillText(String(data.played || 0), canvas.width * 0.25, 400);
    context.fillText(String(data.victories || 0), canvas.width * 0.50, 400);
    context.fillText(String(data.deaths || 0), canvas.width * 0.75, 400);

    context.fillStyle = colors.yellow;
    context.font = Style.statsName;
    context.fillText('通過したチェックポイント', canvas.width * 0.40, 500);
    context.fillText('キル数', canvas.width * 0.75, 500);

    context.font = Style.statsValue;
    context.fillText(String(data.checkpoints || 0), canvas.width * 0.40, 600);
    context.fillText(String(data.kills || 0), canvas.width * 0.75, 600);
  }

  if (gamePrefix == 'hide') {
    context.fillStyle = colors.red;
    context.font = Style.statsName;
    context.fillText('プレイ数', canvas.width * 0.25, 300);
    context.fillText('勝利数', canvas.width * 0.50, 300);
    context.fillText('勝率', canvas.width * 0.75, 300);

    context.font = Style.statsValue;
    context.fillText(String(data.played || 0), canvas.width * 0.25, 400);
    context.fillText(String(data.victories || 0), canvas.width * 0.50, 400);
    context.fillText(`${(toRate(data.victories, data.played))} %`, canvas.width * 0.75, 400);

    context.fillStyle = colors.yellow;
    context.font = Style.statsName;
    context.fillText('隠れ側キル数', canvas.width * 0.25, 500);
    context.fillText('鬼側キル数', canvas.width * 0.50, 500);
    context.fillText('デス数', canvas.width * 0.75, 500);

    context.font = Style.statsValue;
    context.fillText(String(data.hider_kills || 0), canvas.width * 0.25, 600);
    context.fillText(String(data.seeker_kills || 0), canvas.width * 0.50, 600);
    context.fillText(String(data.deaths || 0), canvas.width * 0.75, 600);
  }

  if (gamePrefix == 'sg') {
    context.fillStyle = colors.red;
    context.font = Style.statsName;
    context.fillText('プレイ数', canvas.width * 0.20 - 10, 300);
    context.fillText('勝利数', canvas.width * 0.40 - 10, 300);
    context.fillText('勝率', canvas.width * 0.60 - 10, 300);

    context.font = Style.statsValue;
    context.fillText(String(data.played || 0), canvas.width * 0.20 - 10, 400);
    context.fillText(String(data.victories || 0), canvas.width * 0.40 - 10, 400);
    context.fillText(`${(toRate(data.victories, data.played))} %`, canvas.width * 0.60 - 10, 400);

    context.fillStyle = colors.yellow;
    context.font = Style.statsName;
    context.fillText('キル数', canvas.width * 0.20 - 10, 500);
    context.fillText('デスマッチ到達数', canvas.width * 0.50 - 10, 500);

    context.font = Style.statsValue;
    context.fillText(String(data.kills || 0), canvas.width * 0.20 - 10, 600);
    context.fillText(String(data.deathmatches || 0), canvas.width * 0.50 - 10, 600);

    context.fillStyle = colors.pink;
    context.font = Style.statsName;
    context.fillText('牛 解放数', canvas.width * 0.80 + 10, 300);
    context.fillText('チェスト開封数', canvas.width * 0.80 + 10, 500);

    context.font = Style.statsValue;
    context.fillText(String(data.cows || 0), canvas.width * 0.80 + 10, 400);
    context.fillText(String(data.crates || 0), canvas.width * 0.80 + 10, 600);
  }

  if (gamePrefix == 'murder') {
    context.fillStyle = colors.red;
    context.font = Style.statsName;
    context.fillText('プレイ数', canvas.width * 0.20 - 10, 300);
    context.fillText('勝利数', canvas.width * 0.40 - 10, 300);
    context.fillText('勝率', canvas.width * 0.60 - 10, 300);

    context.font = Style.statsValue;
    context.fillText(String(data.played || 0), canvas.width * 0.20 - 10, 400);
    context.fillText(String(data.victories || 0), canvas.width * 0.40 - 10, 400);
    context.fillText(`${(toRate(data.victories, data.played)) } %`, canvas.width * 0.60 - 10, 400);

    context.fillStyle = colors.yellow;
    context.font = Style.statsName;
    context.fillText('キル数', canvas.width * 0.20 - 10, 500);
    context.fillText('デス数', canvas.width * 0.40 - 10, 500);
    context.fillStyle = colors.aqua;
    context.fillText('K/D比', canvas.width * 0.60 - 10, 500);

    context.fillStyle = colors.yellow;
    context.font = Style.statsValue;
    context.fillText(String(data.murders || 0), canvas.width * 0.20 - 10, 600);
    context.fillText(String(data.deaths || 0), canvas.width * 0.40 - 10, 600);
    context.fillStyle = colors.aqua;
    context.fillText(String(toRate(data.murders, data.deaths) / 100), canvas.width * 0.60 - 10, 600);

    context.fillStyle = colors.pink;
    context.font = Style.statsName;
    context.fillText('コイン', canvas.width * 0.80 + 10, 300);
    context.fillText('マーダー退治数', canvas.width * 0.80 + 10, 500);

    context.font = Style.statsValue;
    context.fillText(String(data.coins || 0), canvas.width * 0.80 + 10, 400);
    context.fillText(String(data.murderer_eliminations || 0), canvas.width * 0.80 + 10, 600);
  }

  if (gamePrefix == 'sky') {
    context.fillStyle = colors.red;
    context.font = Style.statsName;
    context.fillText('プレイ数', canvas.width * 0.20 - 10, 300);
    context.fillText('勝利数', canvas.width * 0.40 - 10, 300);
    context.fillText('勝率', canvas.width * 0.60 - 10, 300);

    context.font = Style.statsValue;
    context.fillText(String(data.played || 0), canvas.width * 0.20 - 10, 400);
    context.fillText(String(data.victories || 0), canvas.width * 0.40 - 10, 400);
    context.fillText(`${(toRate(data.victories, data.played)) } %`, canvas.width * 0.60 - 10, 400);

    context.fillStyle = colors.yellow;
    context.font = Style.statsName;
    context.fillText('キル数', canvas.width * 0.20 - 10, 500);
    context.fillText('開けたMysteryChest', canvas.width * 0.50 - 10, 500);

    context.font = Style.statsValue;
    context.fillText(String(data.kills || 0), canvas.width * 0.20 - 10, 600);
    context.fillText(String(data.mystery_chests_destroyed || 0), canvas.width * 0.50 - 10, 600);

    context.fillStyle = colors.pink;
    context.font = Style.statsName;
    context.fillText('掘った鉱石', canvas.width * 0.80 + 10, 300);
    context.fillText('使った呪文', canvas.width * 0.80 + 10, 500);

    context.font = Style.statsValue;
    context.fillText(String(data.ores_mined || 0), canvas.width * 0.80 + 10, 400);
    context.fillText(String(data.spells_used || 0), canvas.width * 0.80 + 10, 600);
  }

  if (gamePrefix == 'ctf') {
    context.fillStyle = colors.red;
    context.font = Style.statsName;
    context.fillText('プレイ数', canvas.width * 0.20 - 10, 300);
    context.fillText('勝利数', canvas.width * 0.40 - 10, 300);
    context.fillText('勝率', canvas.width * 0.60 - 10, 300);

    context.font = Style.statsValue;
    context.fillText(String(data.played || 0), canvas.width * 0.20 - 10, 400);
    context.fillText(String(data.victories || 0), canvas.width * 0.40 - 10, 400);
    context.fillText(`${(toRate(data.victories, data.played)) } %`, canvas.width * 0.60 - 10, 400);

    context.fillStyle = colors.yellow;
    context.font = Style.statsName;
    context.fillText('キル数', canvas.width * 0.20 - 10, 500);
    context.fillText('アシスト数', canvas.width * 0.40 - 10, 500);
    context.fillText('デス数', canvas.width * 0.60 - 10, 500);

    context.font = Style.statsValue;
    context.fillText(String(data.kills || 0), canvas.width * 0.20 - 10, 600);
    context.fillText(String(data.assists || 0), canvas.width * 0.40 - 10, 600);
    context.fillText(String(data.deaths || 0), canvas.width * 0.60 - 10, 600);

    context.fillStyle = colors.pink;
    context.font = Style.statsName;
    context.fillText('旗 取得数', canvas.width * 0.80 + 10, 300);
    context.fillText('旗 奪還数', canvas.width * 0.80 + 10, 500);

    context.font = Style.statsValue;
    context.fillText(String(data.flags_captured || 0), canvas.width * 0.80 + 10, 400);
    context.fillText(String(data.flags_returned || 0), canvas.width * 0.80 + 10, 600);
  }

  if (gamePrefix == 'drop') {
    context.fillStyle = colors.red;
    context.font = Style.statsName;
    context.fillText('プレイ数', canvas.width * 0.20 - 10, 300);
    context.fillText('勝利数', canvas.width * 0.40 - 10, 300);
    context.fillText('勝率', canvas.width * 0.60 - 10, 300);

    context.font = Style.statsValue;
    context.fillText(String(data.played || 0), canvas.width * 0.20 - 10, 400);
    context.fillText(String(data.victories || 0), canvas.width * 0.40 - 10, 400);
    context.fillText(`${(toRate(data.victories, data.played)) } %`, canvas.width * 0.60 - 10, 400);

    context.fillStyle = colors.yellow;
    context.font = Style.statsName;
    context.fillText('デス数', canvas.width * 0.20 - 10, 500);
    context.fillText('ブロック破壊数', canvas.width * 0.50 - 10, 500);

    context.font = Style.statsValue;
    context.fillText(String(data.deaths || 0), canvas.width * 0.20 - 10, 600);
    context.fillText(String(data.blocks_destroyed || 0), canvas.width * 0.50 - 10, 600);

    context.fillStyle = colors.pink;
    context.font = Style.statsName;
    context.fillText('アイテム獲得数', canvas.width * 0.80 + 10, 300);
    context.fillText('アイテム使用数', canvas.width * 0.80 + 10, 500);

    context.font = Style.statsValue;
    context.fillText(String(data.powerups_collected || 0), canvas.width * 0.80 + 10, 400);
    context.fillText(String(data.vaults_used || 0), canvas.width * 0.80 + 10, 600);
  }

  if (gamePrefix == 'ground') {
    context.fillStyle = colors.red;
    context.font = Style.statsName;
    context.fillText('プレイ数', canvas.width * 0.20 - 10, 300);
    context.fillText('勝利数', canvas.width * 0.40 - 10, 300);
    context.fillText('勝率', canvas.width * 0.60 - 10, 300);

    context.font = Style.statsValue;
    context.fillText(String(data.played || 0), canvas.width * 0.20 - 10, 400);
    context.fillText(String(data.victories || 0), canvas.width * 0.40 - 10, 400);
    context.fillText(`${toRate(data.victories, data.played)} %`, canvas.width * 0.60 - 10, 400);

    context.fillStyle = colors.yellow;
    context.font = Style.statsName;
    context.fillText('デス数', canvas.width * 0.20 - 10, 500);
    context.fillText('卵を投げた数', canvas.width * 0.50 - 10, 500);

    context.font = Style.statsValue;
    context.fillText(String(data.deaths || 0), canvas.width * 0.20 - 10, 600);
    context.fillText(String(data.projectiles_fired || 0), canvas.width * 0.50 - 10, 600);

    context.fillStyle = colors.pink;
    context.font = Style.statsName;
    context.fillText('ブロック設置数', canvas.width * 0.80 + 10, 300);
    context.fillText('ブロック破壊数', canvas.width * 0.80 + 10, 500);

    context.font = Style.statsValue;
    context.fillText(String(data.blocks_placed || 0), canvas.width * 0.80 + 10, 400);
    context.fillText(String(data.blocks_destroyed || 0), canvas.width * 0.80 + 10, 600);
  }

  if (gamePrefix == 'build') {
    context.fillStyle = colors.red;
    context.font = Style.statsName;
    context.fillText('プレイ数', canvas.width * 0.25, 300);
    context.fillText('ランクイン数', canvas.width * 0.50, 300);
    context.fillText('ランクイン率', canvas.width * 0.75, 300);

    context.font = Style.statsValue;
    context.fillText(String(data.played || 0), canvas.width * 0.25, 400);
    context.fillText(String(data.victories || 0), canvas.width * 0.50, 400);
    context.fillText(`${toRate(data.victories, data.played) } %`, canvas.width * 0.75 - 10, 400);

    context.fillStyle = colors.yellow;
    context.font = Style.statsName;
    context.fillText('イマイチ', canvas.width * 0.20, 500);
    context.fillText('OK', canvas.width * 0.40, 500);
    context.fillText('いいね', canvas.width * 0.60, 500);
    context.fillText('大好き', canvas.width * 0.80, 500);

    context.font = Style.statsValue;
    context.fillText(String(data.rating_meh_received || 0), canvas.width * 0.20, 600);
    context.fillText(String(data.rating_okay_received || 0), canvas.width * 0.40, 600);
    context.fillText(String(data.rating_good_received || 0), canvas.width * 0.60, 600);
    context.fillText(String(data.rating_love_received || 0), canvas.width * 0.80, 600);
  }

  if (data?.human_index) {
    context.fillStyle = colors.white;
    context.font = '40 PixelMPlus';
    context.fillText(`タイムフレーム: 月間 (${data?.human_index}位)`, canvas.width * 0.5, canvas.height - 40);
  }
  else {
    context.fillStyle = colors.white;
    context.font = '40 PixelMPlus';
    context.fillText('タイムフレーム: すべての期間', canvas.width * 0.5, canvas.height - 40);
  }

  context.fillStyle = colors.gray;
  context.textAlign = 'left';
  context.font = '30 Minecraft';
  context.fillText('NoNICK.stats', 10, canvas.height - 10);

  return new AttachmentBuilder(await canvas.encode('png'), { name: `${playerName}-StatsCard.png` });
}

function toRate(win, played) {
  const rate = Math.round((win / played) * 100);
  if (!isFinite(rate)) return '0';
  return rate;
}

module.exports = { createHiveStatsCard };