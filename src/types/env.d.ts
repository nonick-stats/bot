declare module 'process' {
  global {
    namespace NodeJS {
      interface ProcessEnv {
        readonly BOT_TOKEN: string;
        readonly MONGODB_URI: string;
        readonly MONGODB_DBNAME: string;
        readonly NETHER_GAMES_API: string;
      }
    }
  }
}