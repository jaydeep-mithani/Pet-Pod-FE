"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components";
import { useAuth } from "@/lib/auth/AuthProvider";
import { conversationsService } from "@/lib/services/conversations.service";
import { ApiError } from "@/lib/api/errors";
import { ROUTES } from "@/lib/routes";

interface MessageOwnerButtonProps {
  petId: string;
  ownerId: string;
  ownerFirstName: string;
}

const MessageOwnerButton: React.FC<MessageOwnerButtonProps> = ({
  petId,
  ownerId,
  ownerFirstName,
}) => {
  const { user, status } = useAuth();
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  // Owner can't message themselves about their own pet
  if (user?.id === ownerId) return null;

  const handleClick = async () => {
    if (status !== "authed") {
      router.push(
        `${ROUTES.login}?next=${encodeURIComponent(ROUTES.petDetail(petId))}`,
      );
      return;
    }
    setBusy(true);
    try {
      const conv = await conversationsService.createOrGet(petId);
      router.push(`${ROUTES.chat}/${conv.id}`);
    } catch (err) {
      const msg =
        err instanceof ApiError
          ? err.message
          : "Couldn't start the conversation.";
      toast.error(msg);
      setBusy(false);
    }
  };

  return (
    <Button
      type="button"
      variant="primary"
      size="md"
      icon={<MessageCircle className="h-4 w-4" />}
      onClick={handleClick}
      disabled={busy}
      className="w-full"
    >
      {busy ? "Opening chat…" : `Message ${ownerFirstName}`}
    </Button>
  );
};

export default MessageOwnerButton;
