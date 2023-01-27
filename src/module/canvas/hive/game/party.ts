import { Canvas, SKRSContext2D } from '@napi-rs/canvas';
import { CardTextStyle, toRate } from '..';
import MinecraftColors from '../../../MinecraftColors';

export default function(canvas: Canvas, context: SKRSContext2D, data: BlockPartyStats): void {
  context.fillStyle = MinecraftColors.red;
  context.font = CardTextStyle.statsName;
  context.fillText('プレイ数', canvas.width * 0.25, 300);
  context.fillText('勝利数', canvas.width * 0.50, 300);
  context.fillText('勝率', canvas.width * 0.75, 300);

  context.font = CardTextStyle.statsValue;
  context.fillText(String(data.played || 0), canvas.width * 0.25, 400);
  context.fillText(String(data.victories || 0), canvas.width * 0.50, 400);
  context.fillText(`${(toRate(data.victories, data.played))} %`, canvas.width * 0.75, 400);

  context.fillStyle = MinecraftColors.pink;
  context.font = CardTextStyle.statsName;
  context.fillText('アイテム獲得数', canvas.width * 0.30, 500);
  context.fillText('ラウンドクリア数', canvas.width * 0.70, 500);

  context.font = CardTextStyle.statsValue;
  context.fillText(String(data.powerups_collected || 0), canvas.width * 0.30, 600);
  context.fillText(String(data.rounds_survived || 0), canvas.width * 0.70, 600);
}