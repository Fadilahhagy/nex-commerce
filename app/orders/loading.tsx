export default function OrdersLoading() {
  return (
    <div className="min-h-screen bg-veal-bg font-sans px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl animate-pulse space-y-6">
        
        {/* Back Link Skeleton */}
        <div className="h-9 w-36 rounded-xl bg-zinc-200/80" />

        {/* Page Banner Skeleton */}
        <div className="h-36 w-full rounded-3xl border border-zinc-200/80 bg-white p-6 sm:p-8 shadow-2xs" />

        {/* Order Cards List Skeleton */}
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-32 w-full rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-2xs space-y-3"
            >
              <div className="flex justify-between items-center">
                <div className="h-4 w-32 rounded bg-zinc-200/80" />
                <div className="h-6 w-20 rounded-full bg-zinc-200/80" />
              </div>
              <div className="h-3 w-48 rounded bg-zinc-200/80" />
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}