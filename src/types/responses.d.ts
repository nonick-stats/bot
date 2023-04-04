export namespace Hive {
  interface BaseStats {
    index?: number,
    human_index?: number,
    UUID?: string,
    played: number,
    victories: number,
    xp: number,
    uncapped_xp?: number,
    first_played?: number
  }

  interface TreasureWars extends BaseStats {
    final_kills: number,
    kills: number,
    treasure_destroyed: number,
    deaths: number,
    prestige?: number,
  }

  interface DeathRun extends BaseStats {
    deaths: number,
    checkpoints: number,
    kills: number,
    activated?: number,
  }

  interface HideAndSeek extends BaseStats {
    deaths: number,
    hider_kills: number,
    seeker_kills: number,
  }

  interface SurvivalGames extends BaseStats {
    crates: number,
    deathmatches: number,
    cows: number,
    kills: number,
  }

  interface MurderMystery extends BaseStats {
    deaths: number,
    coins: number,
    murders: number,
    murderer_eliminations: number,
  }

  interface SkyWars extends BaseStats {
    kills: number,
    mystery_chests_destroyed: number,
    ores_mined: number,
    spells_used: number,
  }

  interface CaptureTheFlag extends BaseStats {
    assists: number,
    deaths: number,
    flags_captured: number,
    kills: number,
    flags_returned: number,
  }

  interface BlockDrop extends BaseStats {
    blocks_destroyed: number,
    powerups_collected: number,
    vaults_used: number,
    deaths: number,
  }

  interface GroundWars extends BaseStats {
    blocks_destroyed: number,
    blocks_placed: number,
    deaths: number,
    kills: number,
    projectiles_fired: number,
  }

  interface JustBuild extends BaseStats {
    rating_good_received: number,
    rating_love_received: number,
    rating_meh_received: number,
    rating_okay_received: number,
  }

  interface BlockParty extends BaseStats {
    powerups_collected: number,
    rounds_survived: number,
  }

  interface Games {
    wars: TreasureWars;
    dr: DeathRun;
    hide: HideAndSeek;
    sg: SurvivalGames;
    murder: MurderMystery;
    sky: SkyWars;
    ctf: CaptureTheFlag;
    drop: BlockDrop;
    ground: GroundWars;
    build: JustBuild;
    party: BlockParty;
  }

  interface AllGameStats extends
    TreasureWars,
    DeathRun,
    HideAndSeek,
    SurvivalGames,
    MurderMystery,
    SkyWars,
    CaptureTheFlag,
    BlockDrop,
    GroundWars,
    JustBuild,
    BlockParty {
  }
}