# NoNICK.stats
NoNICK.statsは、Minecraftサーバーの統計を簡単に表示・共有することができるDiscordBOTです。  
APIを使用して取得した統計データを画像に出力し、コマンド使用者に表示します。

<div align="center">
  <img src="https://media.discordapp.net/attachments/958791423161954445/1059402992702468156/NULL1017-StatsCard.png?width=1191&height=670" alt="sample">
</div>

### 対応サーバー
The HIVE

## 環境変数
```env
BOT_TOKEN="DiscordBOTのトークン"
GUILD_ID="コマンドを登録するサーバーのID (省略した際はグローバルコマンドとして登録)"
MONGODB_URI="mongoDBに接続するためのURI"
MONGODB_DBNAME="データベース名"
```