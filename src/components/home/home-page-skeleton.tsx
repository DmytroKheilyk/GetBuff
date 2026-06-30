function PulseBlock({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-2xl bg-gray-200 dark:bg-[#23262f] ${className ?? ""}`}
    />
  );
}

export function HomePageSkeleton() {
  return (
    <div className="space-y-7 sm:space-y-9">
      <PulseBlock className="h-[260px] rounded-3xl sm:h-[320px]" />

      <div className="flex gap-3 overflow-hidden sm:gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex shrink-0 flex-col items-center gap-2">
            <PulseBlock className="size-[4.25rem] sm:size-[4.75rem]" />
            <PulseBlock className="h-3 w-14" />
          </div>
        ))}
      </div>

      <section className="space-y-4">
        <PulseBlock className="h-6 w-44" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <PulseBlock key={i} className="aspect-[4/5] sm:aspect-square" />
          ))}
        </div>
      </section>
    </div>
  );
}
