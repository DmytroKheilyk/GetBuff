import { FreshOfferCard } from "@/components/home/fresh-offer-card";
import type { FreshOffer } from "@/lib/types/fresh-offer";

type FreshOffersSectionProps = {
  offers: FreshOffer[];
};

export function FreshOffersSection({ offers }: FreshOffersSectionProps) {
  if (offers.length === 0) return null;

  return (
    <section className="mt-16 animate-in fade-in duration-500">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black tracking-tight sm:text-3xl">
            <span className="text-white">СВЕЖИЕ </span>
            <span className="text-neon-gradient">ПРЕДЛОЖЕНИЯ</span>
          </h2>
          <p className="mt-2 text-zinc-500">
            Только что добавленные лоты со всего маркетплейса
          </p>
        </div>
        <div className="hidden h-px flex-1 bg-linear-to-r from-green-500/40 to-transparent sm:block" />
      </div>

      <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-4">
        {offers.map((offer, index) => (
          <div
            key={offer.id}
            className="w-[280px] shrink-0 snap-start sm:w-auto sm:shrink animate-in fade-in slide-in-from-bottom-2 fill-mode-both"
            style={{ animationDelay: `${index * 60}ms` }}
          >
            <FreshOfferCard offer={offer} />
          </div>
        ))}
      </div>
    </section>
  );
}
