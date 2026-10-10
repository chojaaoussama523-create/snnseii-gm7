import { useEffect, useRef, useState } from "react";
import { MessageSquare, Video, Scissors, Radio, ExternalLink, Play } from "lucide-react";
import kickStreamBg from "@/assets/kick-stream-bg.jpg.asset.json";

interface Clip {
  id: string;
  title: string;
  views: number;
  duration: string;
  thumbnail: string;
  url: string;
}

interface VOD {
  id: string;
  title: string;
  date: string;
  duration: string;
  thumbnail: string;
  url: string;
}

export function KickPlayerCard() {
  const [activeTab, setActiveTab] = useState<"CHAT" | "VODS" | "CLIPS">("CHAT");
  const playerRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const onBlur = () => {
      if (document.activeElement === playerRef.current) window.dispatchEvent(new Event("gm7-media-play"));
    };
    window.addEventListener("blur", onBlur);
    return () => window.removeEventListener("blur", onBlur);
  }, []);

  const channel = "snnsei";
  const channelName = "SNNSEI";

  const mockClips: Clip[] = [
    {
      id: "c1",
      title: "لقطة كلاش اسطوري في آخر الزون 🔥",
      views: 14200,
      duration: "0:45",
      thumbnail: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=600",
      url: `https://kick.com/${channel}/clips`,
    },
    {
      id: "c2",
      title: "ردة فعل مجنونة وضحك هستيري 🤣",
      views: 9800,
      duration: "0:30",
      thumbnail: "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=600",
      url: `https://kick.com/${channel}/clips`,
    },
    {
      id: "c3",
      title: "أفضل وان تاب مع التيم كامل 🎯",
      views: 8300,
      duration: "0:50",
      thumbnail: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?q=80&w=600",
      url: `https://kick.com/${channel}/clips`,
    },
  ];

  const mockVODs: VOD[] = [
    {
      id: "v1",
      title: "بث كامل: سهرات سكريمات وبطولات GM7 الكبرى",
      date: "منذ يومين",
      duration: "4h 15m",
      thumbnail: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?q=80&w=600",
      url: `https://kick.com/${channel}/videos`,
    },
    {
      id: "v2",
      title: "تختيم لعبة وتحديات مع المتابعين في الديسكورد",
      date: "منذ 4 أيام",
      duration: "3h 50m",
      thumbnail: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=600",
      url: `https://kick.com/${channel}/videos`,
    },
    {
      id: "v3",
      title: "سهرة رومات ورانكد مفتوح مع الدردشة",
      date: "الأسبوع الماضي",
      duration: "5h 10m",
      thumbnail: "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=600",
      url: `https://kick.com/${channel}/videos`,
    },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto space-y-4">
      {/* إطار البث والشات المتجاوب */}
      <div
        className="rounded-2xl lg:rounded-3xl overflow-hidden bg-zinc-950 bg-cover bg-center border border-zinc-800 shadow-2xl flex flex-col lg:flex-row"
        style={{ backgroundImage: `url(${kickStreamBg.url})` }}
      >
        
        {/* قسم البث المباشر الحي */}
        <div className="flex-1 flex flex-col bg-black/80">
          {/* شريط حالة البث */}
          <div className="bg-zinc-900/90 px-4 py-2.5 border-b border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex size-2.5 rounded-full bg-[#53FC18] animate-pulse" />
              <span className="text-xs font-black text-white">KICK LIVE STREAM</span>
            </div>
            <a
              href={`https://kick.com/${channel}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#53FC18] hover:underline"
            >
              <span>فتح على Kick</span>
              <ExternalLink className="size-3.5" />
            </a>
          </div>

          {/* مشغل البث الفعلي */}
          <div className="relative aspect-video w-full bg-black">
            <iframe
              ref={playerRef}
              src={`https://player.kick.com/${channel}?autoplay=true&muted=true`}
              title="SNNSEI Kick Live Stream"
              className="absolute inset-0 h-full w-full border-0"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
            />
          </div>

          {/* شريط اسم القناة والتعريف */}
          <div className="p-3 bg-zinc-900/70 border-t border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="size-9 rounded-xl bg-[#53FC18] text-black font-black flex items-center justify-center text-base shadow-[0_0_12px_rgba(83,252,24,0.4)]">
                K
              </div>
              <div>
                <h3 className="text-sm font-black text-white">{channelName}</h3>
                <p className="text-[11px] text-[#53FC18]">@{channel}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 rounded-lg bg-red-600/20 border border-red-500/30 px-2.5 py-1 text-[11px] font-black text-red-400">
                <Radio className="size-3 animate-pulse" />
                <span>LIVE</span>
              </div>
              <a
                href={`https://kick.com/${channel}`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg bg-[#53FC18] px-3 py-1.5 text-[11px] font-black text-black shadow-[0_0_12px_rgba(83,252,24,0.4)] transition hover:scale-105"
              >
                Follow on Kick
              </a>
            </div>
          </div>
        </div>

        {/* قسم التبويبات الجانبية (الشات / VODs / Clips) */}
        <div className="w-full lg:w-84 xl:w-96 bg-zinc-900/85 border-t lg:border-t-0 lg:border-r border-zinc-800 flex flex-col h-[480px] lg:h-auto">
          
          {/* أزرار التبديل */}
          <div className="grid grid-cols-3 p-2 bg-black/60 border-b border-zinc-800 gap-1.5">
            <button
              type="button"
              onClick={() => setActiveTab("CHAT")}
              className={`py-2 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all ${
                activeTab === "CHAT"
                  ? "bg-[#53FC18] text-black shadow-lg shadow-[#53FC18]/20"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
              }`}
            >
              <MessageSquare className="size-3.5" />
              <span>الشات</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("VODS")}
              className={`py-2 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all ${
                activeTab === "VODS"
                  ? "bg-[#53FC18] text-black shadow-lg shadow-[#53FC18]/20"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
              }`}
            >
              <Video className="size-3.5" />
              <span>البثوث (VODs)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("CLIPS")}
              className={`py-2 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all ${
                activeTab === "CLIPS"
                  ? "bg-[#53FC18] text-black shadow-lg shadow-[#53FC18]/20"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
              }`}
            >
              <Scissors className="size-3.5" />
              <span>المقاطع</span>
            </button>
          </div>

          {/* محتوى الشات المباشر الفعلي من Kick */}
          {activeTab === "CHAT" && (
            <div className="flex-1 relative bg-black flex flex-col overflow-hidden">
              <iframe
                src={`https://kick.com/popout/${channel}/chat`}
                title="SNNSEI Kick Chat"
                className="w-full flex-1 border-0"
              />
              <div className="p-2 bg-zinc-950 border-t border-zinc-800 text-center">
                <a
                  href={`https://kick.com/popout/${channel}/chat`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] text-zinc-400 hover:text-[#53FC18] transition"
                >
                  إذا لم يظهر الشات، اضغط هنا لفتحه مباشرة على Kick ↗
                </a>
              </div>
            </div>
          )}

          {/* محتوى التسجيلات السابقة VODs */}
          {activeTab === "VODS" && (
            <div className="flex-1 p-3 overflow-y-auto space-y-2.5">
              <div className="mb-2 text-xs font-bold text-zinc-400 flex items-center justify-between">
                <span>آخر البثوث المسجلة</span>
                <a
                  href={`https://kick.com/${channel}/videos`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#53FC18] text-[11px] hover:underline"
                >
                  عرض الكل
                </a>
              </div>
              {mockVODs.map((vod) => (
                <a
                  key={vod.id}
                  href={vod.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex gap-2.5 bg-zinc-950/70 p-2 rounded-xl border border-zinc-800 hover:border-[#53FC18]/60 transition-all text-right"
                >
                  <div className="relative w-28 h-16 rounded-lg overflow-hidden shrink-0 bg-zinc-900">
                    <img src={vod.thumbnail} alt={vod.title} className="w-full h-full object-cover group-hover:scale-105 transition" />
                    <span className="absolute bottom-1 right-1 bg-black/85 text-[10px] font-bold text-zinc-200 px-1.5 py-0.5 rounded">
                      {vod.duration}
                    </span>
                    <span className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition">
                      <Play className="size-5 fill-white text-white" />
                    </span>
                  </div>
                  <div className="flex flex-col justify-between py-0.5 flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-white line-clamp-2 group-hover:text-[#53FC18] transition">
                      {vod.title}
                    </h4>
                    <span className="text-[10px] text-zinc-400">{vod.date}</span>
                  </div>
                </a>
              ))}
            </div>
          )}

          {/* محتوى المقاطع القصيرة Clips */}
          {activeTab === "CLIPS" && (
            <div className="flex-1 p-3 overflow-y-auto space-y-2.5">
              <div className="mb-2 text-xs font-bold text-zinc-400 flex items-center justify-between">
                <span>أبرز اللقطات والمقاطع</span>
                <a
                  href={`https://kick.com/${channel}/clips`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#53FC18] text-[11px] hover:underline"
                >
                  عرض الكل
                </a>
              </div>
              {mockClips.map((clip) => (
                <a
                  key={clip.id}
                  href={clip.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex gap-2.5 bg-zinc-950/70 p-2 rounded-xl border border-zinc-800 hover:border-[#53FC18]/60 transition-all text-right"
                >
                  <div className="relative w-28 h-16 rounded-lg overflow-hidden shrink-0 bg-zinc-900">
                    <img src={clip.thumbnail} alt={clip.title} className="w-full h-full object-cover group-hover:scale-105 transition" />
                    <span className="absolute bottom-1 right-1 bg-black/85 text-[10px] font-bold text-zinc-200 px-1.5 py-0.5 rounded">
                      {clip.duration}
                    </span>
                    <span className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition">
                      <Play className="size-5 fill-white text-white" />
                    </span>
                  </div>
                  <div className="flex flex-col justify-between py-0.5 flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-white line-clamp-2 group-hover:text-[#53FC18] transition">
                      {clip.title}
                    </h4>
                    <span className="text-[10px] text-[#53FC18] font-bold">
                      {clip.views.toLocaleString()} مشاهدة
                    </span>
                  </div>
                </a>
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  );
          }
            
