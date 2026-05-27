import PetCardSkeleton from "@/components/ui/PetCardSkeleton";
import Skeleton from "@/components/ui/Skeleton";

export default function PetsLoading() {
  return (
    <main className="min-h-screen bg-white">
      <section className="bg-gradient-to-b from-rose-50/60 to-white pb-12 pt-32 sm:pt-36">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
            <div className="space-y-3">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-10 w-72" />
              <Skeleton className="h-4 w-96" />
            </div>
            <Skeleton className="h-10 w-32 rounded-full" />
          </div>
        </div>
      </section>

      <section className="pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <PetCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
