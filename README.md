# NoNICK.stats
NoNICK.statsは、Minecraftサーバーの統計を簡単に表示・共有することができるDiscordBOTです。  
APIを使用して取得した統計データを画像に出力し、コマンド使用者に表示します。

<div align="center">
  <img src="https://media.discordapp.net/attachments/958791423161954445/1059402992702468156/NULL1017-StatsCard.png?width=1191&height=670" alt="sample">
</div>

### 対応サーバー
The HIVE

### config.json (index.jsと同階層に配置)
```json
{
  "clientId": "ClientID",
  "guildId": "コマンドを登録するサーバーID (undefinedでグローバルコマンドで登録)",

  "adminGuild": "管理コマンドを登録するサーバーID",
  "adminUser": ["adminGuild内で管理コマンドを使用できるユーザーのID"],

  "lock": {
    "hive": false
  },
}
```