import { Check, Clock, Copy, Download, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { GAMES } from "@/lib/gm7-tournaments";

type Status = "new" | "checked-in" | "accepted" | "waitlist" | "rejected";
type Reg = {
  id: string;
  team: string;
  captain: string;
  whatsapp: string;
  city: string;
  platform: string;
  gameId: string;
  mode: number;
  status: Status;
};

const KEY = "gm7-registrations";
const LABELS: Record<Status, string> = {
  new: "جديد",
  "checked-in": "أكد الحضور",
  accepted: "مقبول",
  waitlist: "قائمة انتظار",
  rejected: "مرفوض",
};

export function RegistrationsAdmin() {
  const [list, setList] = useState<Reg[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setList(JSON.parse(raw) as Reg[]);
    } catch {
      /* ignore */
    }
  }, []);

  function setStatus(id: string, status: Status) {
    const next = list.map((r) => (r.id === id ? { ...r, status } : r));
    setList(next);
    localStorage.setItem(KEY, JSON.stringify(next));
  }

  function exportCsv() {
    const rows = [["ID", "Team", "Captain", "WhatsApp", "City", "Platform", "Game", "Mode", "Status"]];
    list.forEach((r) =>
      rows.push([r.id, r.team, r.captain, r.whatsapp, r.city, r.platform, GAMES.find((g) => g.id === r.gameId)?.name ?? "", `${r.mode}v${r.mode}`, LABELS[r.status]]),
    );
    const csv = "\uFEFF" + rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    a.download = "gm7-registrations.csv";
    a.click();
  }

  if (!list.length)
    return <p className="rounded-xl border border-border bg-card/80 p-6 text-center text-sm text-muted-foreground">ما كاين حتى تسجيل دابا.</p>;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm text-muted-foreground">{list.length} تسجيل · {list.filter((r) => r.status === "checked-in").length} أكدو الحضور</p>
        <Button size="sm" variant="outline" onClick={exportCsv}><Download aria-hidden="true" /> تصدير</Button>
      </div>
      {list.map((r) => (
        <div key={r.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card/80 p-4 text-sm">
          <div className="min-w-0">
            <p className="font-bold text-foreground">{r.team} <span className="text-xs text-muted-foreground">· {r.captain} · {r.city}</span></p>
            <p className="text-xs text-muted-foreground">{GAMES.find((g) => g.id === r.gameId)?.name} · {r.platform} · {r.mode}v{r.mode} · {r.id}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-border px-2 py-0.5 text-xs text-primary">{LABELS[r.status]}</span>
            <Button size="sm" onClick={() => setStatus(r.id, "accepted")} aria-label="قبول"><Check aria-hidden="true" /></Button>
            <Button size="sm" variant="outline" onClick={() => setStatus(r.id, "waitlist")} aria-label="قائمة انتظار"><Clock aria-hidden="true" /></Button>
            <Button size="sm" variant="destructive" onClick={() => setStatus(r.id, "rejected")} aria-label="رفض"><X aria-hidden="true" /></Button>
            <Button size="sm" variant="ghost" onClick={() => void navigator.clipboard.writeText(r.whatsapp)} aria-label="نسخ واتساب"><Copy aria-hidden="true" /></Button>
          </div>
        </div>
      ))}
    </div>
  );
}
