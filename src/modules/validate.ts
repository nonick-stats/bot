export type Edition =
  | 'be'
  | 'je';

export const GAMERTAG: Record<Edition, RegExp> = {
  be: /^(?!\d)(?:[a-zA-Z0-9 ]){3,18}/,
  je: /^[a-zA-Z0-9_]{2,16}$/,
};