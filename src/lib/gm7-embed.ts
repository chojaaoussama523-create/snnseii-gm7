export type MediaPlatform = "kick" | "youtube" | "tiktok" | "instagram";
export type MediaKind = "live" | "video" | "short" | "playlist" | "clip";

export const MEDIA_PLATFORMS: MediaPlatform[] = ["kick", "youtube", "tiktok", "instagram"];
export const MEDIA_KINDS: MediaKind[] = ["live", "video", "short", "playlist", "clip"];

export const MEDIA_PLATFORM_LABELS: Record<MediaPlatform, string> = {
  kick: "KICK",
  youtube: "YOUTUBE",
  tiktok: "TIKTOK",
  instagram: "INSTAGRAM",
};

export const MEDIA_KIND_LABELS: Record<MediaKind, string> = {
  live: "بث مباشر",
  video: "فيديو",
  short: "شورت",
  playlist: "قائمة تشغيل",
  clip: "مقطع",
};

function youtubeEmbed(url: string): string {
  const list = /[?&]list=([\w-]+)/.exec(url)?.[1];
  if (list && !/\/(watch|shorts)/.test(url)) return `https://www.youtube.com/embed/videoseries?list=${list}`;
  const id =
    /[?&]v=([\w-]{6,})/.exec(url)?.[1] ??
    /youtu\.be\/([\w-]{6,})/.exec(url)?.[1] ??
    /shorts\/([\w-]{6,})/.exec(url)?.[1] ??
    /embed\/([\w-]{6,})/.exec(url)?.[1];
  if (!id) return "";
  return list
    ? `https://www.youtube.com/embed/${id}?list=${list}`
    : `https://www.youtube.com/embed/${id}`;
}

export function toEmbedUrl(platform: MediaPlatform, url: string): string {
  const clean = url.trim();
  if (!clean) return "";
  if (platform === "kick") {
    const channel = /kick\.com\/([\w-]+)/.exec(clean)?.[1] ?? clean.replace(/^@/, "");
    return `https://player.kick.com/${channel}`;
  }
  if (platform === "youtube") return youtubeEmbed(clean);
  if (platform === "tiktok") {
    const id = /video\/(\d+)/.exec(clean)?.[1];
    return id ? `https://www.tiktok.com/embed/v2/${id}` : "";
  }
  const code = /instagram\.com\/(?:reel|reels|p|tv)\/([\w-]+)/.exec(clean)?.[1];
  return code ? `https://www.instagram.com/reel/${code}/embed` : "";
}
