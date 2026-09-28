import { createFileRoute } from "@tanstack/react-router";
import tournamentsBg from "@/assets/tournaments-bg.jpg.asset.json";
import tournamentsLogo from "@/assets/gm7-tournaments-logo.png.asset.json";
import { BrandPage } from "@/components/BrandPage";
import { BrandShell } from "@/components/BrandShell";

export const Route = createFileRoute("/tournaments")({
  head: () => ({
    meta: [
      { title: "GM7 Tournaments — البطولات" },
      { name: "description", content: "قسم بطولات ومسابقات مجتمع GM7." },
      { property: "og:title", content: "GM7 Tournaments — البطولات" },
      { property: "og:description", content: "البطولات والمنافسات الرسمية لمجتمع GM7." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TournamentsPage,
});

function TournamentsPage() {
  return (
    <BrandShell>
      <BrandPage
        eyebrow="COMMUNITY LEAGUE"
        title="GM7 TOURNAMENTS"
        description="ساحة المنافسة الرسمية لمجتمع L'GAMERS LMLA7، بهوية مستقلة للبطولات والمسابقات القادمة."
        logo={tournamentsLogo.url}
        logoAlt="شعار GM7 Tournaments"
        background={tournamentsBg.url}
        accent="tournaments"
      />
    </BrandShell>
  );
}