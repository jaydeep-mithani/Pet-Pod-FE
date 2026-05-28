"use client";

import { useRouter } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import IconButton from "@/components/ui/IconButton";
import { useAuth } from "@/lib/auth/AuthProvider";
import { petsService } from "@/lib/services";
import { ApiError } from "@/lib/api/errors";
import { ROUTES } from "@/lib/routes";

interface PetOwnerActionsProps {
  petId: string;
  ownerId: string;
}

const PetOwnerActions: React.FC<PetOwnerActionsProps> = ({
  petId,
  ownerId,
}) => {
  const { user } = useAuth();
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  if (!user || user.id !== ownerId) return null;

  const handleDelete = async () => {
    if (!confirm("Delete this listing? This cannot be undone.")) return;
    setDeleting(true);
    try {
      await petsService.remove(petId);
      toast.success("Listing deleted.");
      router.push(ROUTES.pets);
      router.refresh();
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "Failed to delete.";
      toast.error(msg);
      setDeleting(false);
    }
  };

  const handleEdit = () => {
    router.push(`${ROUTES.petDetail(petId)}/edit`);
  };

  return (
    <div className="flex items-center gap-2">
      <IconButton
        icon={Pencil}
        label="Edit"
        variant="primary"
        size="sm"
        onClick={handleEdit}
        disabled={deleting}
      />
      <IconButton
        icon={Trash2}
        label="Delete"
        variant="danger"
        size="sm"
        onClick={handleDelete}
        disabled={deleting}
      />
    </div>
  );
};

export default PetOwnerActions;
