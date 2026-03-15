import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useDeleteVegetable } from "@/hooks/useQueries";
import { Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { Vegetable } from "../../backend";

interface DeleteConfirmDialogProps {
  vegetable: Vegetable | null;
  onClose: () => void;
}

export function DeleteConfirmDialog({
  vegetable,
  onClose,
}: DeleteConfirmDialogProps) {
  const deleteMutation = useDeleteVegetable();

  const handleDelete = async () => {
    if (!vegetable) return;
    try {
      await deleteMutation.mutateAsync(vegetable.id);
      toast.success(`"${vegetable.name}" has been removed`);
      onClose();
    } catch (err) {
      toast.error("Failed to delete vegetable", {
        description: err instanceof Error ? err.message : "Please try again",
      });
    }
  };

  return (
    <AlertDialog open={!!vegetable} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent data-ocid="admin.delete_dialog">
        <AlertDialogHeader>
          <AlertDialogTitle className="font-heading text-xl">
            Remove from Catalog?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to remove{" "}
            <strong className="text-foreground">"{vegetable?.name}"</strong>{" "}
            from the catalog? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={onClose}
            data-ocid="admin.delete_cancel_button"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive hover:bg-destructive/90 text-destructive-foreground gap-2"
            onClick={() => {
              void handleDelete();
            }}
            disabled={deleteMutation.isPending}
            data-ocid="admin.delete_confirm_button"
          >
            {deleteMutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
            {deleteMutation.isPending ? "Removing…" : "Yes, Remove"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
