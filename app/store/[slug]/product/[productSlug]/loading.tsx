export default function ProductDetailLoading() {
  return (
    <div className="min-h-screen bg-veal-bg font-sans px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl animate-pulse space-y-6">
        {/* Sub-header Skeleton */}
        <div className="h-8 w-full border-b border-zinc-200/60 pb-4 flex justify-between">
          <div className="h-4 w-48 rounded bg-zinc-200/80" />
          <div className="h-8 w-8 rounded-full bg-zinc-200/80" />
        </div>

        {/* Main Grid Skeleton */}
        <div className="grid gap-8 lg:grid-cols-12">
          {/* Gallery Skeleton */}
          <div className="lg:col-span-7 space-y-4">
            <div className="aspect-square w-full rounded-3xl bg-zinc-200/80" />
            <div className="flex gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-20 w-20 rounded-2xl bg-zinc-200/80" />
              ))}
            </div>
          </div>

          {/* Product Info Skeleton */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-3">
              <div className="h-4 w-24 rounded bg-zinc-200/80" />
              <div className="h-8 w-3/4 rounded-xl bg-zinc-200/80" />
              <div className="h-4 w-32 rounded bg-zinc-200/80" />
            </div>
            <div className="h-20 w-full rounded-3xl bg-zinc-200/80" />
            <div className="h-36 w-full rounded-3xl bg-zinc-200/80" />
            <div className="h-12 w-full rounded-2xl bg-zinc-200/80" />
          </div>
        </div>
      </div>
    </div>
  );
}