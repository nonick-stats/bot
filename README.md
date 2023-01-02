# NoNICK.stats
Minecraftサーバーの統計を表示するBOT  
__このBOTは対応サーバー、およびMinecraftとは一切関係ありません__

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