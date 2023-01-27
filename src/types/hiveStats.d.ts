interface BaseGameStats {
  index?: number,
  human_index?: number,
  UUID?: string,
  played: number,
  victories: number,
  xp: number,
  uncapped_xp?: number,
  first_played?: number
}

interface TreasureWarsStats extends BaseGameStats {
  final_kills: number,
  kills: number,
  treasure_destroyed: number,
  deaths: number,
  prestige?: number,
}

interface DeathRunStats extends BaseGameStats {
  deaths: number,
  checkpoints: number,
  kills: number,
  activated?: number,
}

interface HideAndSeekStats extends BaseGameStats {
  deaths: number,
  hider_kills: number,
  seeker_kills: number,
}

interface SurvivalGamesStats extends BaseGameStats {
  crates: number,
  deathmatches: number,
  cows: number,
  kills: number,
}

interface MurderMysteryStats extends BaseGameStats {
  deaths: number,
  coins: number,
  murders: number,
  murderer_eliminations: number,
}

interface SkyWarsStats extends BaseGameStats {
  kills: number,
  mystery_chests_destroyed: number,
  ores_mined: number,
  spells_used: number,
}

interface CaptureTheFlagStats extends BaseGameStats {
  assists: number,
  deaths: number,
  flags_captured: number,
  kills: number,
  flags_returned: number,
}

interface BlockDropStats extends BaseGameStats {
  blocks_destroyed: number,
  powerups_collected: number,
  vaults_used: number,
  deaths: number,
}

interface GroundWarsStats extends BaseGameStats {
  blocks_destroyed: number,
  blocks_placed: number,
  deaths: number,
  projectiles_fired: number,
}

interface JustBuildStats extends BaseGameStats {
  rating_good_received: number,
  rating_love_received: number,
  rating_meh_received: number,
  rating_okay_received: number,
}

interface BlockPartyStats extends BaseGameStats {
  powerups_collected: number,
  rounds_survived: number,
}