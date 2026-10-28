export default function AddressesLoading() {
  return (
    <div className="min-h-screen bg-veal-bg font-sans px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl animate-pulse space-y-8">
        
        <div className="h-9 w-36 rounded-xl bg-zinc-200/80" />

        {/* Address Cards List Skeleton */}
        <div className="space-y-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <div
              key={i}
              className="h-40 w-full rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-2xs space-y-3"
            >
              <div className="h-4 w-32 rounded bg-zinc-200/80" />
              <div className="h-4 w-48 rounded bg-zinc-200/80" />
              <div className="h-10 w-full rounded bg-zinc-200/80" />
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}