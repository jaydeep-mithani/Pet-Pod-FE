import Image from "next/image";
import { cn } from "@/utils";

interface UserAvatarProps {
  name: string;
  avatarUrl?: string | null;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeMap = {
  sm: { box: "h-8 w-8", text: "text-xs", dim: 32 },
  md: { box: "h-10 w-10", text: "text-sm", dim: 40 },
  lg: { box: "h-14 w-14", text: "text-base", dim: 56 },
} as const;

function initialsFor(name: string): string {
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((p) => p[0]?.toUpperCase()).join("");
}

const UserAvatar: React.FC<UserAvatarProps> = ({
  name,
  avatarUrl,
  size = "md",
  className,
}) => {
  const cfg = sizeMap[size];

  return (
    <div
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-pink-500 to-purple-600 font-semibold text-white",
        cfg.box,
        cfg.text,
        className,
      )}
      aria-label={name}
    >
      {avatarUrl ? (
        <Image
          src={avatarUrl}
          alt={name}
          fill
          sizes={`${cfg.dim}px`}
          className="object-cover"
        />
      ) : (
        <span aria-hidden>{initialsFor(name) || "?"}</span>
      )}
    </div>
  );
};

export default UserAvatar;
