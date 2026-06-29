function PulseBlock({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-xl bg-zinc-900/80 ring-1 ring-zinc-800/80 ${className ?? ""}`}
    />
  );
}

export function HomePageSkeleton() {
  return (
    <>
      <section className="mb-14 max-w-4xl space-y-4">
        <PulseBlock className="h-7 w-48" />
        <PulseBlock className="h-16 w-full max-w-xl" />
        <PulseBlock className="h-16 w-full max-w-lg" />
        <PulseBlock className="mt-8 h-14 w-full max-w-2xl" />
      </section>

      <section className="space-y-6">
        <PulseBlock className="h-10 w-64" />
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <PulseBlock key={i} className="h-64" />
          ))}
        </div>
      </section>

      <section className="mt-16 space-y-6">
        <PulseBlock className="h-10 w-72" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <PulseBlock key={i} className="h-56" />
          ))}
        </div>
      </section>
    </>
  );
}
