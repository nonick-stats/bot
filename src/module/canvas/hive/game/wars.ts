import { Canvas, SKRSContext2D } from '@napi-rs/canvas';
import { CardTextStyle, toRate } from '..';
import MinecraftColors from '../../../MinecraftColors';

export default function(canvas: Canvas, context: SKRSContext2D, data: TreasureWarsStats): void {
  context.fillStyle = MinecraftColors.red;
  context.font = CardTextStyle.statsName;
  context.fillText('プレイ数', canvas.width * 0.20 - 10, 300);
  context.fillText('勝利数', canvas.width * 0.40 - 10, 300);
  context.fillText('勝率', canvas.width * 0.60 - 10, 300);

  context.font = CardTextStyle.statsValue;
  context.fillText(String(data.played || 0), canvas.width * 0.20 - 10, 400);
  context.fillText(String(data.victories || 0), canvas.width * 0.40 - 10, 400);
  context.fillText(`${(toRate(data.victories, data.played)) } %`, canvas.width * 0.60 - 10, 400);

  context.fillStyle = MinecraftColors.yellow;
  context.font = CardTextStyle.statsName;
  context.fillText('キル数', canvas.width * 0.20 - 10, 500);
  context.fillText('ﾌｧｲﾅﾙｷﾙ数', canvas.width * 0.40 - 10, 500);
  context.fillText('デス数', canvas.width * 0.60 - 10, 500);

  context.font = CardTextStyle.statsValue;
  context.fillText(String(data.kills || 0), canvas.width * 0.20 - 10, 600);
  context.fillText(String(data.final_kills || 0), canvas.width * 0.40 - 10, 600);
  context.fillText(String(data.deaths || 0), canvas.width * 0.60 - 10, 600);

  context.font = CardTextStyle.statsName;
  context.fillStyle = MinecraftColors.pink;
  context.fillText('宝破壊数', canvas.width * 0.80 + 10, 300);
  context.fillStyle = MinecraftColors.aqua;
  context.fillText('K/D率', canvas.width * 0.80 + 10, 500);

  context.font = CardTextStyle.statsValue;
  context.fillStyle = MinecraftColors.pink;
  context.fillText(String(data.treasure_destroyed || 0), canvas.width * 0.80 + 10, 400);
  context.fillStyle = MinecraftColors.aqua;
  context.fillText(String(toRate(data.kills, data.deaths) / 100), canvas.width * 0.80 + 10, 600);
}