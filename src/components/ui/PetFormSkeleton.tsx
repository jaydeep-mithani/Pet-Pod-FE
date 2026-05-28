import Skeleton from "./Skeleton";

interface FieldSkeletonProps {
  short?: boolean;
}

const FieldSkeleton: React.FC<FieldSkeletonProps> = ({ short }) => (
  <div className="space-y-2">
    <Skeleton className="h-3.5 w-24" />
    <Skeleton className={short ? "h-10 w-32" : "h-10 w-full"} />
  </div>
);

const PetFormSkeleton: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <FieldSkeleton />
        <div className="sm:col-span-2 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <FieldSkeleton />
          <FieldSkeleton />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <FieldSkeleton short />
        <FieldSkeleton short />
        <FieldSkeleton />
      </div>

      <div className="space-y-2">
        <Skeleton className="h-3.5 w-32" />
        <Skeleton className="h-16 w-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-3.5 w-28" />
        <Skeleton className="h-28 w-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-3.5 w-40" />
        <Skeleton className="h-20 w-full" />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <FieldSkeleton />
        <FieldSkeleton />
        <FieldSkeleton short />
      </div>

      <div className="space-y-2">
        <Skeleton className="h-3.5 w-32" />
        <Skeleton className="h-20 w-full" />
      </div>

      <div className="flex justify-end gap-3">
        <Skeleton className="h-10 w-20" />
        <Skeleton className="h-10 w-36" />
      </div>
    </div>
  );
};

export default PetFormSkeleton;
