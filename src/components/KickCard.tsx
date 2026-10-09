import { useState } from "react";
import { Play, MessageSquare, Video, Scissors, Radio, ExternalLink } from "lucide-react";

interface Clip {
  id: string;
  title: string;
  views: number;
  duration: string;
  thumbnail: string;
}

interface VOD {
  id: string;
  title: string;
  date: string;
  duration: string;
  thumbnail: string;
}

export function KickPlayerCard() {
  const [activeTab, setActiveTab] = useState<"CHAT" | "VODS" | "CLIPS">("CHAT");

  // بيانات افتراضية للعرض
  const username = "snnseii";
  const channelName = "SNNSEI GAMING";
  const isLive = true;
  const viewerCount = 1420;

  const mockClips: Clip[] = [
    {
      id: "1",
      title: "لقطة قضاء على التيم بالكامل 🔥",
      views: 12500,
      duration: "0:30",
      thumbnail: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=600",
    },
    {
      id: "2",
      title: "ردة فعل مجنونة في آخر ثانية 😱",
      views: 8900,
      duration: "0:45",
      thumbnail: "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=600",
    },
  ];

  const mockVODs: VOD[] = [
    {
      id: "101",
      title: "بث كامل: بطولات نهاية الأسبوع | GM7",
      date: "أمس",
      duration: "4h 12m",
      thumbnail: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?q=80&w=600",
    },
    {
      id: "102",
      title: "تختيم الأحداث الجديدة وتجربة التحديث",
      date: "قبل 3 أيام",
      duration: "3h 45m",
      thumbnail: "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=600",
    },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto p-4 space-y-6">
      {/* Container الرئيسي: الشاشة الكبيرة والإطار */}
      <div className="relative rounded-3xl overflow-hidden bg-zinc-950 border-2 border-zinc-800 shadow-[0_0_50px_rgba(83,252,24,0.1)] flex flex-col lg:flex-row">
        
        {/* قسم الشاشة الرئيسية للبث (Left Main Player) */}
        <div className="relative flex-1 aspect-video bg-black flex flex-col justify-between group">
          <img
            src="https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1200"
            alt="Kick Live Stream"
            className="absolute inset-0 w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/60" />

          {/* الجزء العلوي: شارات البث والمشاهدين */}
          <div className="relative z-10 p-4 flex justify-between items-center">
            {isLive ? (
              <div className="bg-red-600/90 text-white text-xs font-black px-3 py-1.5 rounded-lg flex items-center gap-2 backdrop-blur-md animate-pulse">
                <Radio className="w-4 h-4" />
                <span>مباشر الآن</span>
              </div>
            ) : (
              <div className="bg-zinc-800/80 text-zinc-400 text-xs font-bold px-3 py-1.5 rounded-lg">
                غير مباشر
              </div>
            )}

            <div className="bg-black/70 text-zinc-200 text-xs font-bold px-3 py-1.5 rounded-lg border border-white/10 backdrop-blur-md">
              {viewerCount.toLocaleString()} مشاهد
            </div>
          </div>

          {/* زر تشغيل كبير في الوسط */}
          <div className="relative z-10 flex items-center justify-center my-auto">
            <a
              href={`https://kick.com/${username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-20 h-20 rounded-full bg-[#53FC18] text-black flex items-center justify-center pl-1 shadow-[0_0_30px_#53FC18] group-hover:scale-110 transition-transform duration-300"
            >
              <Play className="w-10 h-10 fill-black" />
            </a>
          </div>

          {/* الشريط السفلي: الشعار واسم القناة */}
          <div className="relative z-10 bg-zinc-900/95 border-t border-zinc-800 p-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-zinc-400 text-xs font-semibold">
              <span className="w-2.5 h-2.5 rounded-full bg-[#53FC18]" />
              <span>KICK STREAM</span>
            </div>

            <div className="flex items-center gap-3 bg-black/60 px-5 py-2 rounded-2xl border border-zinc-800">
              <div className="w-9 h-9 rounded-xl bg-[#53FC18] text-black flex items-center justify-center font-black text-lg shadow-[0_0_15px_#53FC18]">
                K
              </div>
              <div className="text-right">
                <h3 className="text-sm font-black text-white tracking-wide">{channelName}</h3>
                <p className="text-[10px] font-bold text-[#53FC18]">@{username}</p>
              </div>
            </div>

            <a
              href={`https://kick.com/${username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-400 hover:text-[#53FC18] transition-colors p-2"
            >
              <ExternalLink className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* القسم الجانبي: الشات / المقاطع / التسجيلات */}
        <div className="w-full lg:w-80 bg-zinc-900/90 border-t lg:border-t-0 lg:border-r border-zinc-800 flex flex-col h-[480px] lg:h-auto">
          {/* أزرار التبديل */}
          <div className="flex bg-black/50 p-2 border-b border-zinc-800 gap-1">
            <button
              onClick={() => setActiveTab("CHAT")}
              className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                activeTab === "CHAT" ? "bg-[#53FC18] text-black shadow-md" : "text-zinc-400 hover:text-white"
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>الشات</span>
            </button>

            <button
              onClick={() => setActiveTab("CLIPS")}
              className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                activeTab === "CLIPS" ? "bg-[#53FC18] text-black shadow-md" : "text-zinc-400 hover:text-white"
              }`}
            >
              <Scissors className="w-3.5 h-3.5" />
              <span>CLIPS</span>
            </button>

            <button
              onClick={() => setActiveTab("VODS")}
              className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                activeTab === "VODS" ? "bg-[#53FC18] text-black shadow-md" : "text-zinc-400 hover:text-white"
              }`}
            >
              <Video className="w-3.5 h-3.5" />
              <span>تسجيلات</span>
            </button>
          </div>

          {/* محتوى الشات */}
          {activeTab === "CHAT" && (
            <div className="flex-1 p-4 flex flex-col justify-between overflow-hidden">
              <div className="space-y-3 overflow-y-auto pr-1 text-xs">
                <div className="bg-zinc-800/40 p-2.5 rounded-xl border border-zinc-700/50">
                  <span className="font-bold text-[#53FC18] block mb-0.5">Gamer_Pro:</span>
                  <span className="text-zinc-200">أداء اسطوري اليوم! 🔥</span>
                </div>
                <div className="bg-zinc-800/40 p-2.5 rounded-xl border border-zinc-700/50">
                  <span className="font-bold text-cyan-400 block mb-0.5">SNNSEI_Fan:</span>
                  <span className="text-zinc-200">متى الروم القادم؟</span>
                </div>
                <div className="bg-zinc-800/40 p-2.5 rounded-xl border border-zinc-700/50">
                  <span className="font-bold text-amber-400 block mb-0.5">VIP_Player:</span>
                  <span className="text-zinc-200">GG WP!! 👏</span>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-zinc-800 flex gap-2">
                <input
                  type="text"
                  placeholder="اكتب في الشات..."
                  className="flex-1 bg-black border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#53FC18]"
                />
                <button className="bg-[#53FC18] text-black text-xs font-bold px-3 rounded-xl hover:bg-[#45d813] transition-colors">
                  إرسال
                </button>
              </div>
            </div>
          )}

          {/* محتوى المقاطع القصيرة (Clips) */}
          {activeTab === "CLIPS" && (
            <div className="flex-1 p-3 overflow-y-auto space-y-3">
              {mockClips.map((clip) => (
                <a
                  key={clip.id}
                  href={`https://kick.com/${username}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex gap-3 bg-black/40 p-2 rounded-xl border border-zinc-800 hover:border-[#53FC18]/50 transition-all"
                >
                  <div className="relative w-24 h-16 rounded-lg overflow-hidden shrink-0">
                    <img src={clip.thumbnail} alt={clip.title} className="w-full h-full object-cover" />
                    <span className="absolute bottom-1 right-1 bg-black/80 text-[10px] font-bold text-zinc-200 px-1 rounded">
                      {clip.duration}
                    </span>
                  </div>
                  <div className="flex flex-col justify-between py-0.5">
                    <h4 className="text-xs font-bold text-white line-clamp-2 group-hover:text-[#53FC18] transition-colors">
                      {clip.title}
                    </h4>
                    <span className="text-[10px] text-zinc-400">{clip.views.toLocaleString()} مشاهدة</span>
                  </div>
                </a>
              ))}
            </div>
          )}

          {/* محتوى التسجيلات السابقة (VODs) */}
          {activeTab === "VODS" && (
            <div className="flex-1 p-3 overflow-y-auto space-y-3">
              {mockVODs.map((vod) => (
                <a
                  key={vod.id}
                  href={`https://kick.com/${username}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex gap-3 bg-black/40 p-2 rounded-xl border border-zinc-800 hover:border-[#53FC18]/50 transition-all"
                >
                  <div className="relative w-24 h-16 rounded-lg overflow-hidden shrink-0">
                    <img src={vod.thumbnail} alt={vod.title} className="w-full h-full object-cover" />
                    <span className="absolute bottom-1 right-1 bg-black/80 text-[10px] font-bold text-zinc-200 px-1 rounded">
                      {vod.duration}
                    </span>
                  </div>
                  <div className="flex flex-col justify-between py-0.5">
                    <h4 className="text-xs font-bold text-white line-clamp-2 group-hover:text-[#53FC18] transition-colors">
                      {vod.title}
                    </h4>
                    <span className="text-[10px] text-zinc-400">{vod.date}</span>
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
