import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { toEmbedUrl, type MediaKind, type MediaPlatform } from "@/lib/gm7-embed";

export type MediaRow = {
  id: string;
  title: string;
  platform: MediaPlatform;
  kind: MediaKind;
  url: string;
  embedUrl: string;
  isLive: boolean;
  createdAt: string;
};

type DbRow = {
  id: string;
  title: string;
  platform: string;
  kind: string;
  url: string;
  embed_url: string;
  is_live: boolean;
  created_at: string;
};

function toDto(r: DbRow): MediaRow {
  return {
    id: r.id,
    title: r.title,
    platform: r.platform as MediaPlatform,
    kind: r.kind as MediaKind,
    url: r.url,
    embedUrl: r.embed_url,
    isLive: r.is_live,
    createdAt: r.created_at,
  };
}

function checkAdmin(code: string) {
  const expected = process.env["GM7_ADMIN_ACCESS_CODE"];
  if (!expected || code.trim() !== expected) throw new Error("Unauthorized");
}

export const listSnnseiMedia = createServerFn({ method: "GET" }).handler(async () => {
  const { publicClient } = await import("@/lib/gm7-public.server");
  const { data } = await publicClient()
    .from("gm7_media")
    .select("*")
    .order("is_live", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(60);
  return ((data ?? []) as DbRow[]).map(toDto);
});

export const adminAddMedia = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) =>
    z
      .object({
        access: z.string().max(64),
        title: z.string().trim().min(2).max(100),
        platform: z.enum(["kick", "youtube", "tiktok", "instagram"]),
        kind: z.enum(["live", "video", "short", "playlist", "clip"]),
        url: z.string().trim().min(3).max(400),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    checkAdmin(data.access);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row, error } = await supabaseAdmin
      .from("gm7_media")
      .insert({
        title: data.title,
        platform: data.platform,
        kind: data.kind,
        url: data.url,
        embed_url: toEmbedUrl(data.platform, data.url),
        is_live: data.kind === "live",
      })
      .select("*")
      .single();
    if (error || !row) throw new Error("تعذر إضافة الوسائط");
    return toDto(row as DbRow);
  });

export const adminToggleLive = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) =>
    z.object({ access: z.string().max(64), id: z.string().uuid(), isLive: z.boolean() }).parse(d),
  )
  .handler(async ({ data }) => {
    checkAdmin(data.access);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await supabaseAdmin.from("gm7_media").update({ is_live: data.isLive }).eq("id", data.id);
    return { ok: true };
  });

export const adminDeleteMedia = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => z.object({ access: z.string().max(64), id: z.string().uuid() }).parse(d))
  .handler(async ({ data }) => {
    checkAdmin(data.access);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await supabaseAdmin.from("gm7_media").delete().eq("id", data.id);
    return { ok: true };
  });

export const adminListMedia = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => z.object({ access: z.string().max(64) }).parse(d))
  .handler(async ({ data }) => {
    checkAdmin(data.access);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: rows } = await supabaseAdmin
      .from("gm7_media")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200);
    return ((rows ?? []) as DbRow[]).map(toDto);
  });
