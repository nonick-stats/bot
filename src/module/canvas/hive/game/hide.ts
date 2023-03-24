import { Canvas, SKRSContext2D } from '@napi-rs/canvas';
import { CardTextStyle, toRate } from '..';
import { Colors } from '../../../format';

export default function(canvas: Canvas, context: SKRSContext2D, data: HideAndSeekStats): void {
  context.fillStyle = Colors.red;
  context.font = CardTextStyle.statsName;
  context.fillText('プレイ数', canvas.width * 0.25, 300);
  context.fillText('勝利数', canvas.width * 0.50, 300);
  context.fillText('勝率', canvas.width * 0.75, 300);

  context.font = CardTextStyle.statsValue;
  context.fillText(String(data.played || 0), canvas.width * 0.25, 400);
  context.fillText(String(data.victories || 0), canvas.width * 0.50, 400);
  context.fillText(`${(toRate(data.victories, data.played))} %`, canvas.width * 0.75, 400);

  context.fillStyle = Colors.yellow;
  context.font = CardTextStyle.statsName;
  context.fillText('隠れ側キル数', canvas.width * 0.25, 500);
  context.fillText('鬼側キル数', canvas.width * 0.50, 500);
  context.fillText('デス数', canvas.width * 0.75, 500);

  context.font = CardTextStyle.statsValue;
  context.fillText(String(data.hider_kills || 0), canvas.width * 0.25, 600);
  context.fillText(String(data.seeker_kills || 0), canvas.width * 0.50, 600);
  context.fillText(String(data.deaths || 0), canvas.width * 0.75, 600);
}