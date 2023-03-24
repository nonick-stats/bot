import { Canvas, SKRSContext2D } from '@napi-rs/canvas';
import { CardTextStyle, toRate } from '..';
import { Colors } from '../../../format';

export default function(canvas: Canvas, context: SKRSContext2D, data: CaptureTheFlagStats): void {
  context.fillStyle = Colors.red;
  context.font = CardTextStyle.statsName;
  context.fillText('プレイ数', canvas.width * 0.20 - 10, 300);
  context.fillText('勝利数', canvas.width * 0.40 - 10, 300);
  context.fillText('勝率', canvas.width * 0.60 - 10, 300);

  context.font = CardTextStyle.statsValue;
  context.fillText(String(data.played || 0), canvas.width * 0.20 - 10, 400);
  context.fillText(String(data.victories || 0), canvas.width * 0.40 - 10, 400);
  context.fillText(`${(toRate(data.victories, data.played)) } %`, canvas.width * 0.60 - 10, 400);

  context.fillStyle = Colors.yellow;
  context.font = CardTextStyle.statsName;
  context.fillText('キル数', canvas.width * 0.20 - 10, 500);
  context.fillText('アシスト数', canvas.width * 0.40 - 10, 500);
  context.fillText('デス数', canvas.width * 0.60 - 10, 500);

  context.font = CardTextStyle.statsValue;
  context.fillText(String(data.kills || 0), canvas.width * 0.20 - 10, 600);
  context.fillText(String(data.assists || 0), canvas.width * 0.40 - 10, 600);
  context.fillText(String(data.deaths || 0), canvas.width * 0.60 - 10, 600);

  context.fillStyle = Colors.pink;
  context.font = CardTextStyle.statsName;
  context.fillText('旗 取得数', canvas.width * 0.80 + 10, 300);
  context.fillText('旗 奪還数', canvas.width * 0.80 + 10, 500);

  context.font = CardTextStyle.statsValue;
  context.fillText(String(data.flags_captured || 0), canvas.width * 0.80 + 10, 400);
  context.fillText(String(data.flags_returned || 0), canvas.width * 0.80 + 10, 600);
}