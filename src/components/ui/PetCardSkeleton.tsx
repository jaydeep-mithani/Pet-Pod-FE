import Skeleton from "./Skeleton";
import { cn } from "@/utils";

interface PetCardSkeletonProps {
  className?: string;
}

const PetCardSkeleton: React.FC<PetCardSkeletonProps> = ({ className }) => {
  return (
    <div
      className={cn(
        "flex h-full flex-col overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-gray-200/70",
        className,
      )}
    >
      <Skeleton className="aspect-[4/5] w-full rounded-none" />
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-baseline justify-between gap-3">
          <Skeleton className="h-5 w-1/2" />
          <Skeleton className="h-4 w-12" />
        </div>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="mt-auto h-3 w-20" />
      </div>
    </div>
  );
};

export default PetCardSkeleton;
