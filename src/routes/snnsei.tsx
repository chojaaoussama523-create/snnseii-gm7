import { createFileRoute } from "@tanstack/react-router";
import snnseiBg from "@/assets/snnsei-bg.jpg.asset.json";
import snnseiLogo from "@/assets/snnsei-logo.png.asset.json";
import { BrandPage } from "@/components/BrandPage";
import { BrandShell } from "@/components/BrandShell";
import { SnnseiSocial } from "@/components/SnnseiSocial";

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


function SnnseiPage() {
  return (
    <BrandShell>
      <BrandPage
        eyebrow="THE CREATOR"
        title="SNNSEI"
        description="المساحة الرسمية لمحتوى Sensei؛ بث مباشر، فيديوهات ولحظات المجتمع في هوية واحدة لا تختلط بالسوق أو البطولات."
        logo={snnseiLogo.url}
        logoAlt="شعار SNNSEI"
        background={snnseiBg.url}
        accent="snnsei"
      />
      <div className="mx-auto w-full max-w-7xl min-w-0 px-5 py-10 lg:px-8">
        <SnnseiSocial />
      </div>
    </BrandShell>
  );
}
