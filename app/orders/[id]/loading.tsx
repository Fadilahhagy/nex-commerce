export default function OrderDetailLoading() {
  return (
    <div className="min-h-screen bg-veal-bg font-sans px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl animate-pulse space-y-6">

        {/* Header Banner Skeleton */}
        <div className="h-32 w-full rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-2xs" />

        {/* Grid Info Skeleton */}
        <div className="grid gap-6 md:grid-cols-2">
          <div className="h-44 rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-2xs" />
          <div className="h-44 rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-2xs" />
        </div>

        {/* Items List Skeleton */}
        <div className="h-64 w-full rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-2xs" />

      </div>
    </div>
  );
}