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
        <div className="flex gap-4 overflow-hidden pb-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <PulseBlock
              key={i}
              className="h-52 w-[180px] shrink-0 rounded-2xl sm:w-[220px]"
            />
          ))}
        </div>
      </section>
    </div>
  );
}
