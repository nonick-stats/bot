import { Canvas, SKRSContext2D } from '@napi-rs/canvas';
import { CardTextStyle } from '..';
import { Colors } from '../../../format';

export default function(canvas: Canvas, context: SKRSContext2D, data: DeathRunStats): void {
  context.fillStyle = Colors.red;
  context.font = CardTextStyle.statsName;
  context.fillText('プレイ数', canvas.width * 0.25, 300);
  context.fillText('ゴール数', canvas.width * 0.50, 300);
  context.fillText('ミス数', canvas.width * 0.75, 300);

  context.font = CardTextStyle.statsValue;
  context.fillText(String(data.played || 0), canvas.width * 0.25, 400);
  context.fillText(String(data.victories || 0), canvas.width * 0.50, 400);
  context.fillText(String(data.deaths || 0), canvas.width * 0.75, 400);

  context.fillStyle = Colors.yellow;
  context.font = CardTextStyle.statsName;
  context.fillText('通過したチェックポイント', canvas.width * 0.40, 500);
  context.fillText('キル数', canvas.width * 0.75, 500);

  context.font = CardTextStyle.statsValue;
  context.fillText(String(data.checkpoints || 0), canvas.width * 0.40, 600);
  context.fillText(String(data.kills || 0), canvas.width * 0.75, 600);
}