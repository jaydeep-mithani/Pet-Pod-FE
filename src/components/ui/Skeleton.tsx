import { cn } from "@/utils";

type SkeletonProps = React.HTMLAttributes<HTMLDivElement>;

const Skeleton: React.FC<SkeletonProps> = ({ className, ...rest }) => {
  return (
    <div
      aria-hidden
      className={cn(
        "shimmer animate-pulse rounded-md bg-gradient-to-r from-gray-100 via-gray-200/80 to-gray-100",
        className,
      )}
      {...rest}
    />
  );
};

export default Skeleton;
