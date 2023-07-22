import { GlobalFonts, createCanvas, Image, loadImage } from '@napi-rs/canvas';
GlobalFonts.registerFromPath('src/fonts/minecraft.ttf', 'mc');
GlobalFonts.registerFromPath('src/fonts/minecraftTen.ttf', 'mcTen');
GlobalFonts.registerFromPath('src/fonts/pixelMplus12-Regular.ttf', 'PixelMPlus');

export const canvasWidth = 1280;
export const canvasHeight = 720;

export async function createCard(bg: string | Image, ...rows: CardRow[]) {
	const canvas = createCanvas(canvasWidth, canvasHeight);
	const ctx = canvas.getContext('2d');

	const background = bg instanceof Image ? bg : await loadImage(bg);
	ctx.drawImage(background, 0, 0, canvasWidth, canvasHeight);

	// #region defaultOption
	ctx.shadowBlur = 2;
	ctx.shadowColor = '#000000';
	ctx.shadowOffsetX = 5;
	ctx.shadowOffsetY = 5;
	ctx.textAlign = 'center';
	ctx.font = '50px PixelMPlus';
	ctx.fillStyle = '#FFFFFF';
	// #endregion

	for (const row of rows) {
		const length = row.fields.length;
		for (const [index, field] of row.fields.entries()) {
			const x = canvasWidth * ((index + 1) / (length + 1));
			const width = canvasWidth / (length + 1);

			// #region title
			ctx.save();

			const titleOption = getOption('title', field, row);
			if (titleOption.color) ctx.fillStyle = titleOption.color;
			if (titleOption.font) ctx.font = titleOption.font;

			const title = typeof field.title === 'string' ? field.title : field.title.text;
			ctx.fillText(title, x, row.height, width);

			ctx.restore();
			// #endregion

			// #region data
			if (field.data) {
				ctx.save();

				const dataOption = getOption('data', field, row);
				if (dataOption.color) ctx.fillStyle = dataOption.color;
				if (dataOption.font) ctx.font = dataOption.font;

				const data = typeof field.data === 'string' ? field.data : field.data.text;
				ctx.fillText(data, x, row.height + 100, width);

				ctx.restore();
			}
			// #endregion
		}
	}

	// #region footer
	ctx.fillStyle = '#AAAAAA';
	ctx.textAlign = 'left';
	ctx.font = '30px mc';
	ctx.fillText('NoNICK.stats', 10, canvasHeight - 10);
	// #endregion

	return canvas.toBuffer('image/png');
}

function getOption(key: Exclude<keyof CardField, keyof CardOption>, field: CardField, row: CardRow) {
	const option: CardOption = {};
	if (row.color) option.color = row.color;
	if (row.font) option.font = row.font;

	const rowOption = row[`${key}Option`];
	if (rowOption?.color) option.color = rowOption.color;
	if (rowOption?.font) option.font = rowOption.font;

	if (field.color) option.color = field.color;
	if (field.font) option.font = field.font;

	const fieldOption = field[key];
	if (typeof fieldOption === 'string') return option;

	if (fieldOption?.color) option.color = fieldOption.color;
	if (fieldOption?.font) option.font = fieldOption.font;

	return option;
}

export interface fieldData extends CardOption {
	text: string;
}

export interface CardField extends CardOption {
	title: fieldData | string;
	data?: fieldData | string;
}

export interface CardRow extends CardOption {
	fields: CardField[];
	height: number;
	titleOption?: CardOption;
	dataOption?: CardOption;
}

export interface CardOption {
	font?: `${number}px ${string}`;
	color?: `#${string}`;
}