export default function Loading() {
  return (
    <div className="min-h-screen bg-veal-bg font-sans px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl animate-pulse space-y-8">
        
        {/* Banner / Hero Skeleton */}
        <div className="h-48 sm:h-64 w-full rounded-3xl bg-zinc-200/80 shadow-2xs" />

        {/* Section Header Skeleton */}
        <div className="space-y-2">
          <div className="h-4 w-32 rounded-lg bg-zinc-200/80" />
          <div className="h-7 w-64 rounded-xl bg-zinc-200/80" />
        </div>

        {/* Product Grid Skeleton */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="flex flex-col overflow-hidden rounded-3xl border border-zinc-200/80 bg-white p-3.5 space-y-3.5 shadow-2xs"
            >
              {/* Image Skeleton */}
              <div className="aspect-4/3 w-full rounded-2xl bg-zinc-200/80" />
              
              {/* Meta Skeleton */}
              <div className="space-y-2.5 p-1">
                <div className="flex justify-between items-center">
                  <div className="h-3 w-20 rounded-md bg-zinc-200/80" />
                  <div className="h-3 w-10 rounded-md bg-zinc-200/80" />
                </div>
                <div className="h-4 w-full rounded-lg bg-zinc-200/80" />
                <div className="h-3 w-24 rounded-md bg-zinc-200/80" />
                <div className="pt-3 flex justify-between items-center border-t border-zinc-100">
                  <div className="h-5 w-24 rounded-lg bg-zinc-200/80" />
                  <div className="h-9 w-9 rounded-xl bg-zinc-200/80" />
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}