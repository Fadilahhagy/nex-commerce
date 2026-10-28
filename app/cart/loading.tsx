export default function CartLoading() {
  return (
    <div className="min-h-screen bg-veal-bg font-sans px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl animate-pulse space-y-8">
        
        <div className="h-9 w-36 rounded-xl bg-zinc-200/80" />

        {/* Main Cart Grid */}
        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          
          {/* Cart Items List Skeleton */}
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="flex flex-col sm:flex-row items-center gap-4 rounded-3xl border border-zinc-200/80 bg-white p-5 shadow-2xs"
              >
                <div className="h-24 w-24 rounded-2xl bg-zinc-200/85 shrink-0" />
                <div className="w-full space-y-2.5">
                  <div className="h-3 w-24 rounded bg-zinc-200/80" />
                  <div className="h-4 w-3/4 rounded bg-zinc-200/80" />
                  <div className="h-4 w-28 rounded bg-zinc-200/80" />
                </div>
              </div>
            ))}
          </div>

          {/* Sidebar Summary Skeleton */}
          <div className="h-96 w-full rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-2xs space-y-6" />

        </div>

      </div>
    </div>
  );
}