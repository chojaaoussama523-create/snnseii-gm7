import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import type { TournamentStatus } from "@/lib/gm7-format";

export type BracketState = {
  teams: string[];
  winners: (string | null)[][];
  third: string | null;
  scores: Record<string, string>;
};

export type ActiveTournament = {
  id: string;
  name: string;
  description: string;
  category: string;
  platform: string;
  gameId: string;
  gameName: string;
  gameLogoUrl: string;
  bannerUrl: string;
  thumbUrl: string;
  format: "knockout" | "double" | "groups";
  teamMode: number;
  prizePool: number;
  maxSlots: number;
  status: TournamentStatus;
  bracketState: BracketState;
  startsAt: string | null;
  createdAt: string;
};

type DbRow = {
  id: string;
  name: string;
  description: string;
  category: string;
  platform: string;
  game_id: string;
  game_name: string;
  game_logo_url: string;
  banner_url: string;
  thumb_url: string;
  format: string;
  team_mode: number;
  prize_pool: number;
  max_slots: number;
  status: string;
  bracket_state: unknown;
  starts_at: string | null;
  created_at: string;
};

const EMPTY_BRACKET: BracketState = { teams: [], winners: [], third: null, scores: {} };

function toBracket(value: unknown): BracketState {
  const v = (value ?? {}) as Partial<BracketState>;
  return {
    teams: Array.isArray(v.teams) ? v.teams : [],
    winners: Array.isArray(v.winners) ? v.winners : [],
    third: typeof v.third === "string" ? v.third : null,
    scores: v.scores && typeof v.scores === "object" ? (v.scores as Record<string, string>) : {},
  };
}

function toDto(r: DbRow): ActiveTournament {
  return {
    id: r.id,
    name: r.name,
    description: r.description,
    category: r.category,
    platform: r.platform,
    gameId: r.game_id,
    gameName: r.game_name,
    gameLogoUrl: r.game_logo_url,
    bannerUrl: r.banner_url,
    thumbUrl: r.thumb_url,
    format: r.format as ActiveTournament["format"],
    teamMode: r.team_mode,
    prizePool: Number(r.prize_pool),
    maxSlots: r.max_slots,
    status: r.status as TournamentStatus,
    bracketState: toBracket(r.bracket_state),
    startsAt: r.starts_at,
    createdAt: r.created_at,
  };
}

function checkAdmin(code: string) {
  const expected = process.env["GM7_ADMIN_ACCESS_CODE"];
  if (!expected || code.trim() !== expected) throw new Error("Unauthorized");
}

const saveSchema = z.object({
  access: z.string().max(64),
  id: z.string().uuid().optional(),
  name: z.string().trim().min(2).max(80),
  description: z.string().trim().max(600).default(""),
  category: z.string().trim().max(40).default("other"),
  platform: z.string().trim().max(20).default("PC"),
  gameId: z.string().trim().max(80).default(""),
  gameName: z.string().trim().max(80).default(""),
  gameLogoUrl: z.string().trim().max(400).default(""),
  bannerUrl: z.string().trim().max(400).default(""),
  thumbUrl: z.string().trim().max(400).default(""),
  format: z.enum(["knockout", "double", "groups"]),
  teamMode: z.number().int().min(1).max(5),
  prizePool: z.number().min(0).max(10_000_000),
  maxSlots: z.number().int().min(2).max(128),
  status: z.enum(["pending", "in_progress", "active", "completed", "cancelled"]),
  startsAt: z.string().max(40).nullable().default(null),
});

export const listActiveTournaments = createServerFn({ method: "GET" }).handler(async () => {
  const { publicClient } = await import("@/lib/gm7-public.server");
  const { data } = await publicClient()
    .from("gm7_active_tournaments")
    .select("*")
    .neq("status", "pending")
    .order("created_at", { ascending: false })
    .limit(50);
  return ((data ?? []) as DbRow[]).map(toDto);
});

export const adminListTournaments = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => z.object({ access: z.string().max(64) }).parse(d))
  .handler(async ({ data }) => {
    checkAdmin(data.access);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: rows } = await supabaseAdmin
      .from("gm7_active_tournaments")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200);
    return ((rows ?? []) as DbRow[]).map(toDto);
  });

export const adminSaveActiveTournament = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => saveSchema.parse(d))
  .handler(async ({ data }) => {
    checkAdmin(data.access);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const payload = {
      name: data.name,
      description: data.description,
      category: data.category,
      platform: data.platform,
      game_id: data.gameId,
      game_name: data.gameName,
      game_logo_url: data.gameLogoUrl,
      banner_url: data.bannerUrl,
      thumb_url: data.thumbUrl,
      format: data.format,
      team_mode: data.teamMode,
      prize_pool: data.prizePool,
      max_slots: data.maxSlots,
      status: data.status,
      starts_at: data.startsAt,
      updated_at: new Date().toISOString(),
    };
    const query = data.id
      ? supabaseAdmin.from("gm7_active_tournaments").update(payload).eq("id", data.id).select("*").single()
      : supabaseAdmin
          .from("gm7_active_tournaments")
          .insert({ ...payload, bracket_state: EMPTY_BRACKET })
          .select("*")
          .single();
    const { data: row, error } = await query;
    if (error || !row) throw new Error("تعذر حفظ البطولة");
    return toDto(row as DbRow);
  });

export const adminSaveBracket = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) =>
    z
      .object({
        access: z.string().max(64),
        id: z.string().uuid(),
        bracketState: z.object({
          teams: z.array(z.string().max(60)).max(128),
          winners: z.array(z.array(z.string().max(60).nullable())).max(10),
          third: z.string().max(60).nullable(),
          scores: z.record(z.string().max(20)),
        }),
        status: z.enum(["pending", "in_progress", "active", "completed", "cancelled"]).optional(),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    checkAdmin(data.access);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await supabaseAdmin
      .from("gm7_active_tournaments")
      .update({
        bracket_state: data.bracketState,
        ...(data.status ? { status: data.status } : {}),
        updated_at: new Date().toISOString(),
      })
      .eq("id", data.id);
    return { ok: true };
  });

export const adminDeleteTournament = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => z.object({ access: z.string().max(64), id: z.string().uuid() }).parse(d))
  .handler(async ({ data }) => {
    checkAdmin(data.access);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await supabaseAdmin.from("gm7_active_tournaments").delete().eq("id", data.id);
    return { ok: true };
  });
