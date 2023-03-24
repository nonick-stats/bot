import { Canvas, SKRSContext2D } from '@napi-rs/canvas';
import { CardTextStyle, toRate } from '..';
import { Colors } from '../../../format';

export default function(canvas: Canvas, context: SKRSContext2D, data: JustBuildStats): void {
  context.fillStyle = Colors.red;
  context.font = CardTextStyle.statsName;
  context.fillText('プレイ数', canvas.width * 0.25, 300);
  context.fillText('ランクイン数', canvas.width * 0.50, 300);
  context.fillText('ランクイン率', canvas.width * 0.75, 300);

  context.font = CardTextStyle.statsValue;
  context.fillText(String(data.played || 0), canvas.width * 0.25, 400);
  context.fillText(String(data.victories || 0), canvas.width * 0.50, 400);
  context.fillText(`${toRate(data.victories, data.played) } %`, canvas.width * 0.75 - 10, 400);

  context.fillStyle = Colors.yellow;
  context.font = CardTextStyle.statsName;
  context.fillText('イマイチ', canvas.width * 0.20, 500);
  context.fillText('OK', canvas.width * 0.40, 500);
  context.fillText('いいね', canvas.width * 0.60, 500);
  context.fillText('大好き', canvas.width * 0.80, 500);

  context.font = CardTextStyle.statsValue;
  context.fillText(String(data.rating_meh_received || 0), canvas.width * 0.20, 600);
  context.fillText(String(data.rating_okay_received || 0), canvas.width * 0.40, 600);
  context.fillText(String(data.rating_good_received || 0), canvas.width * 0.60, 600);
  context.fillText(String(data.rating_love_received || 0), canvas.width * 0.80, 600);
}