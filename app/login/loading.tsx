export default function LoginLoading() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-veal-bg px-4 py-12 font-sans">
      <div className="w-full max-w-md animate-pulse space-y-6 rounded-3xl border border-zinc-200/80 bg-white p-8 shadow-2xs">
        
        {/* Header Skeleton */}
        <div className="space-y-2 text-center">
          <div className="mx-auto h-8 w-28 rounded-xl bg-zinc-200/80" />
          <div className="mx-auto h-4 w-48 rounded-md bg-zinc-200/80" />
        </div>

        {/* Input Fields Skeleton */}
        <div className="space-y-4 pt-2">
          <div className="space-y-2">
            <div className="h-3 w-16 rounded bg-zinc-200/80" />
            <div className="h-11 w-full rounded-2xl bg-zinc-200/80" />
          </div>
          <div className="space-y-2">
            <div className="h-3 w-20 rounded bg-zinc-200/80" />
            <div className="h-11 w-full rounded-2xl bg-zinc-200/80" />
          </div>
        </div>

        {/* Button Skeleton */}
        <div className="h-12 w-full rounded-2xl bg-zinc-200/80 pt-2" />

      </div>
    </div>
  );
}