import { createFileRoute } from "@tanstack/react-router";
import { Instagram, MessageCircle, Play, Radio } from "lucide-react";
import snnseiLogo from "@/assets/snnsei-logo.png.asset.json";
import { BrandPage } from "@/components/BrandPage";
import { BrandShell } from "@/components/BrandShell";

export const Route = createFileRoute("/snnsei")({
  head: () => ({
    meta: [
      { title: "SNNSEI — GM7" },
      { name: "description", content: "تابع محتوى وبث SNNSEI عبر منصاته الرسمية." },
      { property: "og:title", content: "SNNSEI — GM7" },
      { property: "og:description", content: "البث والمحتوى وقنوات SNNSEI الرسمية." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SnnseiPage,
});

const CHANNELS = [
  { label: "KICK", Icon: Radio },
  { label: "YOUTUBE", Icon: Play },
  { label: "INSTAGRAM", Icon: Instagram },
  { label: "DISCORD", Icon: MessageCircle },
] as const;

function SnnseiPage() {
  return (
    <BrandShell>
      <BrandPage
        eyebrow="THE CREATOR"
        title="SNNSEI"
        description="المساحة الرسمية لمحتوى Sensei؛ بث مباشر، فيديوهات ولحظات المجتمع في هوية واحدة لا تختلط بالسوق أو البطولات."
        logo={snnseiLogo.url}
        logoAlt="شعار SNNSEI"
        accent="snnsei"
      >
        <div className="channel-row" aria-label="منصات SNNSEI">
          {CHANNELS.map(({ label, Icon }) => (
            <span key={label} className="channel-chip">
              <Icon aria-hidden="true" /> {label}
            </span>
          ))}
        </div>
      </BrandPage>
    </BrandShell>
  );
}