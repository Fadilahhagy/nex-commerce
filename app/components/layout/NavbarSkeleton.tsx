// app/components/layout/NavbarSkeleton.tsx
export default function NavbarSkeleton() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200/80 bg-white/80 backdrop-blur-md font-sans">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Brand Logo Skeleton */}
        <div className="flex items-center gap-2">
          <div className="h-7 w-20 rounded-xl bg-zinc-200/80 animate-pulse" />
        </div>

        {/* Navigation Links Skeleton (Desktop) */}
        <div className="hidden items-center gap-6 md:flex">
          <div className="h-4 w-16 rounded-md bg-zinc-200/80 animate-pulse" />
          <div className="h-4 w-16 rounded-md bg-zinc-200/80 animate-pulse" />
          <div className="h-4 w-16 rounded-md bg-zinc-200/80 animate-pulse" />
          <div className="h-6 w-20 rounded-full bg-zinc-200/80 animate-pulse" />
        </div>

        {/* Search Bar Skeleton */}
        <div className="hidden sm:block flex-1 max-w-md mx-6">
          <div className="h-10 w-full rounded-2xl bg-zinc-200/70 animate-pulse" />
        </div>

        {/* Right Menu Icons & User Area Skeleton */}
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-zinc-200/80 animate-pulse" />
          <div className="h-9 w-9 rounded-xl bg-zinc-200/80 animate-pulse" />
          <div className="h-9 w-28 rounded-xl bg-zinc-200/80 animate-pulse" />
        </div>

      </div>
    </header>
  );
}