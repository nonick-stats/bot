import { Canvas, SKRSContext2D } from '@napi-rs/canvas';
import { CardTextStyle, toRate } from '..';
import { Colors } from '../../../format';

export default function(canvas: Canvas, context: SKRSContext2D, data: GroundWarsStats): void {
  context.fillStyle = Colors.red;
  context.font = CardTextStyle.statsName;
  context.fillText('プレイ数', canvas.width * 0.20 - 10, 300);
  context.fillText('勝利数', canvas.width * 0.40 - 10, 300);
  context.fillText('勝率', canvas.width * 0.60 - 10, 300);

  context.font = CardTextStyle.statsValue;
  context.fillText(String(data.played || 0), canvas.width * 0.20 - 10, 400);
  context.fillText(String(data.victories || 0), canvas.width * 0.40 - 10, 400);
  context.fillText(`${toRate(data.victories, data.played)} %`, canvas.width * 0.60 - 10, 400);

  context.fillStyle = Colors.yellow;
  context.font = CardTextStyle.statsName;
  context.fillText('デス数', canvas.width * 0.20 - 10, 500);
  context.fillText('卵を投げた数', canvas.width * 0.50 - 10, 500);

  context.font = CardTextStyle.statsValue;
  context.fillText(String(data.deaths || 0), canvas.width * 0.20 - 10, 600);
  context.fillText(String(data.projectiles_fired || 0), canvas.width * 0.50 - 10, 600);

  context.fillStyle = Colors.pink;
  context.font = CardTextStyle.statsName;
  context.fillText('ブロック設置数', canvas.width * 0.80 + 10, 300);
  context.fillText('ブロック破壊数', canvas.width * 0.80 + 10, 500);

  context.font = CardTextStyle.statsValue;
  context.fillText(String(data.blocks_placed || 0), canvas.width * 0.80 + 10, 400);
  context.fillText(String(data.blocks_destroyed || 0), canvas.width * 0.80 + 10, 600);
}