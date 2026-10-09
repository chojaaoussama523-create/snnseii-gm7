import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export type YtVideo = { videoId: string; title: string; thumbnail: string; views: number; short: boolean };
export type YtPlaylist = { id: string; title: string; thumbnail: string; count: number };
export type YtItem = { videoId: string; title: string; thumbnail: string };

const API = "https://www.googleapis.com/youtube/v3";
const HANDLE = "snnsei";

async function yt<T>(path: string, params: Record<string, string>): Promise<T> {
  const key = process.env.YOUTUBE_API_KEY;
  if (!key) throw new Error("YouTube غير مهيأ");
  const qs = new URLSearchParams({ ...params, key });
  const res = await fetch(`${API}/${path}?${qs}`);
  if (!res.ok) throw new Error("تعذر تحميل YouTube");
  return (await res.json()) as T;
}

type Thumbs = { high?: { url: string }; medium?: { url: string }; default?: { url: string } };
const thumb = (t?: Thumbs) => t?.high?.url ?? t?.medium?.url ?? t?.default?.url ?? "";

const isoSeconds = (d: string) => {
  const m = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/.exec(d) ?? [];
  return Number(m[1] ?? 0) * 3600 + Number(m[2] ?? 0) * 60 + Number(m[3] ?? 0);
};

export const getYoutubeFeed = createServerFn({ method: "GET" }).handler(async () => {
  const ch = await yt<{ items?: { id: string; contentDetails: { relatedPlaylists: { uploads: string } } }[] }>(
    "channels",
    { part: "contentDetails", forHandle: HANDLE },
  );
  const c = ch.items?.[0];
  if (!c) return { videos: [] as YtVideo[], playlists: [] as YtPlaylist[] };
  const up = await yt<{ items: { contentDetails: { videoId: string } }[] }>("playlistItems", {
    part: "contentDetails",
    playlistId: c.contentDetails.relatedPlaylists.uploads,
    maxResults: "40",
  });
  const ids = up.items.map((i) => i.contentDetails.videoId).join(",");
  const [vids, pls] = await Promise.all([
    ids
      ? yt<{ items: { id: string; snippet: { title: string; thumbnails: Thumbs }; statistics: { viewCount?: string }; contentDetails: { duration: string } }[] }>(
          "videos",
          { part: "snippet,statistics,contentDetails", id: ids },
        )
      : Promise.resolve({ items: [] }),
    yt<{ items: { id: string; snippet: { title: string; thumbnails: Thumbs }; contentDetails: { itemCount: number } }[] }>(
      "playlists",
      { part: "snippet,contentDetails", channelId: c.id, maxResults: "25" },
    ),
  ]);
  const videos: YtVideo[] = vids.items.map((v) => ({
    videoId: v.id,
    title: v.snippet.title,
    thumbnail: thumb(v.snippet.thumbnails),
    views: Number(v.statistics.viewCount ?? 0),
    short: isoSeconds(v.contentDetails.duration) <= 180,
  }));
  const playlists: YtPlaylist[] = pls.items.map((p) => ({
    id: p.id,
    title: p.snippet.title,
    thumbnail: thumb(p.snippet.thumbnails),
    count: p.contentDetails.itemCount,
  }));
  return { videos, playlists };
});

export const getPlaylistVideos = createServerFn({ method: "GET" })
  .inputValidator((d: unknown) => z.object({ id: z.string().min(1).max(64) }).parse(d))
  .handler(async ({ data }): Promise<YtItem[]> => {
    const r = await yt<{ items: { snippet: { title: string; thumbnails: Thumbs; resourceId: { videoId: string } } }[] }>(
      "playlistItems",
      { part: "snippet", playlistId: data.id, maxResults: "50" },
    );
    return r.items.map((i) => ({ videoId: i.snippet.resourceId.videoId, title: i.snippet.title, thumbnail: thumb(i.snippet.thumbnails) }));
  });
