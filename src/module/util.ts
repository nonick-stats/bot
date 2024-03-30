export function rate(count?: number, whole?: number, digit?: null): number;
export function rate(count?: number, whole?: number, digit?: number): string;
export function rate(count: number = 0, whole: number = 1, digit: number | null = null) {
  const result = count / whole;
  return digit == null ? result : result.toFixed(digit);
}

export function per(count?: number, whole?: number, digit?: null): number;
export function per(count?: number, whole?: number, digit?: number): string;
export function per(count: number = 0, whole: number = 1, digit: number | null = null) {
  const mag = Math.pow(10, digit ?? 0);
  const result = Math.round(rate(count, whole) * 100 * mag) / mag;
  return digit == null ? result : `${result}%`;
}