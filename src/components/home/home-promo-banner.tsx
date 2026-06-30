import Link from "next/link";

import { CatalogImage } from "@/components/home/catalog-image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const BANNER_SRC = "/home/gta-vi-banner.jpg";
const BANNER_FALLBACK =
  "bg-linear-to-r from-[#1e0b36] via-[#9d1c7f] via-[#f03067] to-[#f7941d]";

export function HomePromoBanner() {
  return (
    <Card className="relative h-[300px] overflow-hidden rounded-3xl border-[#2a2d38]/60 p-0 shadow-[0_8px_32px_rgba(0,0,0,0.35)]">
      <CatalogImage
        src={BANNER_SRC}
        alt="GTA VI — Vice City"
        fallbackClass={BANNER_FALLBACK}
        fallbackText="GTA VI"
        className="absolute inset-0"
      />
      <div className="absolute inset-0 bg-linear-to-t from-[#12131a]/70 via-[#12131a]/25 to-[#12131a]/10" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.06),transparent_65%)]" />

      <div className="relative flex h-full flex-col items-center justify-center px-6 text-center">
        <p className="mb-2 inline-flex rounded-full border border-white/20 bg-black/30 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white/95 backdrop-blur-sm">
          VICE CITY VIBES
        </p>
        <h2 className="max-w-xl text-2xl font-extrabold leading-tight text-white drop-shadow-[0_2px_16px_rgba(0,0,0,0.45)] sm:text-4xl">
          GTA VI — Оформляй предзаказ
        </h2>
        <p className="mt-3 max-w-md text-sm text-white/85 sm:text-base">
          Покупай ключи и аккаунты у проверенных продавцов на GetBuff
        </p>
        <Button
          asChild
          size="lg"
          className="mt-6 h-12 rounded-2xl bg-[#4f8cff] px-8 text-sm font-bold text-white shadow-[0_0_32px_rgba(79,140,255,0.45)] transition-all hover:bg-[#6ba1ff] hover:shadow-[0_0_40px_rgba(79,140,255,0.55)]"
        >
          <Link href="/games/gta-v">Выбрать товар</Link>
        </Button>
      </div>
    </Card>
  );
}
