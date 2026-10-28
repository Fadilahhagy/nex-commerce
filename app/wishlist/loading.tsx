export default function WishlistLoading() {
  return (
    <div className="min-h-screen bg-veal-bg font-sans px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl animate-pulse space-y-8">

        {/* Banner Header Skeleton */}
        <div className="h-36 w-full rounded-3xl border border-zinc-200/80 bg-white p-6 sm:p-8 shadow-2xs" />

        {/* Product Grid Skeleton */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="flex flex-col overflow-hidden rounded-3xl border border-zinc-200/80 bg-white p-3.5 space-y-3.5 shadow-2xs"
            >
              <div className="aspect-square w-full rounded-2xl bg-zinc-200/80" />
              <div className="space-y-2 p-1">
                <div className="h-3 w-16 rounded bg-zinc-200/80" />
                <div className="h-4 w-full rounded bg-zinc-200/80" />
                <div className="h-5 w-24 rounded bg-zinc-200/80 pt-2" />
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}