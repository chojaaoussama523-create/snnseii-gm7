export type Platform = "PS5" | "PC" | "XBOX" | "SWITCH" | "MOBILE";
export type GameStatus = "live" | "open" | "ready";
export type TeamMode = 1 | 2 | 3 | 4 | 5;
export type Format = "knockout" | "groups";
export type BracketSize = 2 | 4 | 8 | 16 | 32;

export type Game = { id: string; name: string; platforms: Platform[]; status: GameStatus };

export const PLATFORMS: Platform[] = ["PS5", "PC", "XBOX", "SWITCH", "MOBILE"];
export const TEAM_MODES: TeamMode[] = [1, 2, 3, 4, 5];
export const BRACKET_SIZES: BracketSize[] = [32, 16, 8, 4, 2];

export const GAME_STATUS_LABELS: Record<GameStatus, string> = {
  live: "بطولة نشطة",
  open: "مفتوحة للتسجيل",
  ready: "جاهزة للتنظيم",
};

export const GAMES: Game[] = [
  { id: "fc26", name: "EA SPORTS FC 26", platforms: ["PS5", "XBOX", "PC"], status: "live" },
  { id: "fc25", name: "EA SPORTS FC 25", platforms: ["PS5", "XBOX", "PC"], status: "ready" },
  { id: "tekken8", name: "TEKKEN 8", platforms: ["PS5", "XBOX", "PC"], status: "open" },
  { id: "sf6", name: "STREET FIGHTER 6", platforms: ["PS5", "XBOX", "PC"], status: "ready" },
  { id: "mk1", name: "MORTAL KOMBAT 1", platforms: ["PS5", "XBOX", "PC", "SWITCH"], status: "ready" },
  { id: "valorant", name: "VALORANT", platforms: ["PC"], status: "open" },
  { id: "cs2", name: "COUNTER-STRIKE 2", platforms: ["PC"], status: "ready" },
  { id: "cod", name: "CALL OF DUTY", platforms: ["PS5", "XBOX", "PC"], status: "ready" },
  { id: "rl", name: "ROCKET LEAGUE", platforms: ["PS5", "XBOX", "PC", "SWITCH"], status: "open" },
  { id: "lol", name: "LEAGUE OF LEGENDS", platforms: ["PC"], status: "ready" },
  { id: "pubgm", name: "PUBG MOBILE", platforms: ["MOBILE"], status: "live" },
  { id: "ff", name: "FREE FIRE", platforms: ["MOBILE"], status: "open" },
  { id: "smash", name: "SUPER SMASH BROS. ULTIMATE", platforms: ["SWITCH"], status: "ready" },
];

export const PRIZE_SPLIT = [0.6, 0.25, 0.15] as const;
