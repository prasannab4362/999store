import { Skeleton } from "./skeleton";

export function ProductCardSkeleton() {
  return (
    <div className="rounded-card border border-border-light bg-white overflow-hidden shadow-sm p-4 space-y-4">
      <Skeleton className="aspect-[3/4] w-full rounded-card" />
      <div className="space-y-2">
        <div className="flex justify-between">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-10" />
        </div>
        <Skeleton className="h-4 w-3/4" />
      </div>
      <div className="flex justify-between items-center border-t border-border-light pt-2">
        <Skeleton className="h-4 w-12" />
        <div className="flex gap-2">
          <Skeleton className="h-8 w-8 rounded-md" />
          <Skeleton className="h-8 w-16 rounded-md" />
        </div>
      </div>
    </div>
  );
}

export function ProductGridSkeleton() {
  return (
    <div className="grid gap-6 grid-cols-2 md:grid-cols-3">
      {Array.from({ length: 6 }).map((_, idx) => (
        <ProductCardSkeleton key={idx} />
      ))}
    </div>
  );
}

export function ProductDetailSkeleton() {
  return (
    <div className="grid md:grid-cols-2 gap-10 items-start py-8">
      <div className="space-y-4">
        <Skeleton className="aspect-[3/4] w-full rounded-promo" />
        <div className="flex gap-2.5">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-16 rounded-card" />
          ))}
        </div>
      </div>
      <div className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-40" />
        </div>
        <Skeleton className="h-14 w-full" />
        <Skeleton className="h-20 w-full" />
        <div className="space-y-3">
          <Skeleton className="h-4 w-24" />
          <div className="flex gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-10 rounded-full" />
            ))}
          </div>
        </div>
        <div className="flex gap-3">
          <Skeleton className="h-12 flex-1 rounded-md" />
          <Skeleton className="h-12 w-12 rounded-md" />
        </div>
      </div>
    </div>
  );
}

export function ComboBuilderSkeleton() {
  return (
    <div className="space-y-8 py-8">
      <Skeleton className="h-28 w-full rounded-promo" />
      <div className="grid lg:grid-cols-[1fr_320px] gap-8">
        <div className="space-y-6">
          <Skeleton className="h-16 w-full rounded-card" />
          <ProductGridSkeleton />
        </div>
        <Skeleton className="h-[400px] w-full rounded-card" />
      </div>
    </div>
  );
}

export function OrderSkeleton() {
  return (
    <div className="border border-border-light rounded-promo p-5 bg-white shadow-sm space-y-4">
      <div className="flex justify-between border-b border-border-light pb-3">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-5 w-24" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-1/3" />
      </div>
      <div className="flex justify-end gap-2">
        <Skeleton className="h-8 w-16" />
        <Skeleton className="h-8 w-20" />
      </div>
    </div>
  );
}

export function AccountSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-1/3" />
      <div className="grid gap-4 grid-cols-3">
        <Skeleton className="h-20 w-full rounded-card" />
        <Skeleton className="h-20 w-full rounded-card" />
        <Skeleton className="h-20 w-full rounded-card" />
      </div>
      <div className="space-y-3">
        <Skeleton className="h-6 w-24" />
        <OrderSkeleton />
      </div>
    </div>
  );
}
