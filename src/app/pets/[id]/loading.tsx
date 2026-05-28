import PetDetailSkeleton from "@/components/ui/PetDetailSkeleton";
import Skeleton from "@/components/ui/Skeleton";

export default function PetDetailLoading() {
  return (
    <main className="min-h-screen bg-white">
      <section className="bg-gradient-to-b from-rose-50/60 to-white pb-12 pt-28 sm:pt-32">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-28" />
            <div className="flex gap-2">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
          </div>

          <div className="mt-6">
            <PetDetailSkeleton />
          </div>
        </div>
      </section>
    </main>
  );
}
