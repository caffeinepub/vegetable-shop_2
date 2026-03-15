import { DeleteConfirmDialog } from "@/components/admin/DeleteConfirmDialog";
import { VegetableFormDialog } from "@/components/admin/VegetableFormDialog";
import { VegetablePlaceholder } from "@/components/shop/VegetablePlaceholder";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CATEGORY_COLORS, VEGETABLE_IMAGES } from "@/data/sampleVegetables";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import { useGetAllVegetables, useIsCallerAdmin } from "@/hooks/useQueries";
import { Edit2, Leaf, Loader2, Lock, LogIn, Plus, Trash2 } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import type { Vegetable } from "../backend";

export function AdminPage() {
  const [formOpen, setFormOpen] = useState(false);
  const [editVegetable, setEditVegetable] = useState<Vegetable | null>(null);
  const [deleteVegetable, setDeleteVegetable] = useState<Vegetable | null>(
    null,
  );

  const { identity, login, isLoggingIn } = useInternetIdentity();
  const { data: isAdmin, isLoading: isAdminLoading } = useIsCallerAdmin();
  const { data: vegetables, isLoading: isVegsLoading } = useGetAllVegetables();

  const handleEdit = (veg: Vegetable) => {
    setEditVegetable(veg);
    setFormOpen(true);
  };

  const handleFormClose = (open: boolean) => {
    setFormOpen(open);
    if (!open) setEditVegetable(null);
  };

  // Not logged in
  if (!identity) {
    return (
      <main className="flex-1 flex items-center justify-center py-20 px-4">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-md space-y-6"
        >
          <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
            <Lock className="w-10 h-10 text-primary" />
          </div>
          <div>
            <h1 className="font-heading text-3xl font-bold text-foreground">
              Admin Access Required
            </h1>
            <p className="text-muted-foreground mt-2">
              Please sign in to access the management panel.
            </p>
          </div>
          <Button
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 shadow-green"
            onClick={login}
            disabled={isLoggingIn}
            data-ocid="nav.login_button"
          >
            {isLoggingIn ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <LogIn className="w-4 h-4" />
            )}
            {isLoggingIn ? "Signing in…" : "Sign In to Continue"}
          </Button>
        </motion.div>
      </main>
    );
  }

  // Checking admin status
  if (isAdminLoading) {
    return (
      <main className="flex-1 flex items-center justify-center py-20">
        <div
          className="flex flex-col items-center gap-3"
          data-ocid="admin.loading_state"
        >
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Checking permissions…</p>
        </div>
      </main>
    );
  }

  // Not admin
  if (!isAdmin) {
    return (
      <main className="flex-1 flex items-center justify-center py-20 px-4">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-md space-y-6"
        >
          <div className="w-20 h-20 rounded-2xl bg-destructive/10 flex items-center justify-center mx-auto">
            <Lock className="w-10 h-10 text-destructive" />
          </div>
          <div>
            <h1 className="font-heading text-3xl font-bold text-foreground">
              Access Denied
            </h1>
            <p className="text-muted-foreground mt-2">
              Your account does not have admin privileges. Contact the store
              owner to request access.
            </p>
          </div>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="flex-1 container mx-auto px-4 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8"
      >
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
              <Leaf className="w-3.5 h-3.5 text-primary-foreground" />
            </div>
            <span className="text-xs font-semibold text-primary uppercase tracking-widest">
              Management Panel
            </span>
          </div>
          <h1 className="font-heading text-3xl font-bold text-foreground">
            Manage Vegetables
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Add, edit, or remove items from your store catalog
          </p>
        </div>

        <Button
          className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 shadow-green flex-shrink-0"
          onClick={() => {
            setEditVegetable(null);
            setFormOpen(true);
          }}
          data-ocid="admin.add_vegetable_button"
        >
          <Plus className="w-4 h-4" />
          Add Vegetable
        </Button>
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-card rounded-xl shadow-card overflow-hidden border border-border"
      >
        {isVegsLoading ? (
          <div className="p-6 space-y-4" data-ocid="admin.loading_state">
            {Array.from({ length: 5 }, (_, i) => `skel-admin-${i}`).map(
              (key) => (
                <div key={key} className="flex items-center gap-4">
                  <Skeleton className="w-12 h-12 rounded-lg flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-3 w-1/4" />
                  </div>
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-8 w-16" />
                </div>
              ),
            )}
          </div>
        ) : !vegetables || vegetables.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-16 gap-4"
            data-ocid="admin.empty_state"
          >
            <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center">
              <Leaf className="w-8 h-8 text-muted-foreground" />
            </div>
            <div className="text-center">
              <p className="font-heading font-bold text-lg text-foreground">
                No vegetables yet
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Click "Add Vegetable" to start building your catalog.
              </p>
            </div>
          </div>
        ) : (
          <Table data-ocid="admin.vegetable_table">
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead className="w-[60px]">Image</TableHead>
                <TableHead className="font-semibold text-foreground">
                  Name
                </TableHead>
                <TableHead className="font-semibold text-foreground hidden sm:table-cell">
                  Category
                </TableHead>
                <TableHead className="font-semibold text-foreground">
                  Price
                </TableHead>
                <TableHead className="font-semibold text-foreground hidden md:table-cell">
                  Stock
                </TableHead>
                <TableHead className="text-right font-semibold text-foreground">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vegetables.map((veg, index) => {
                const imageUrl =
                  veg.image?.getDirectURL() ?? VEGETABLE_IMAGES[veg.name];
                const categoryColor =
                  CATEGORY_COLORS[veg.category] ??
                  "bg-secondary text-secondary-foreground";

                return (
                  <TableRow
                    key={veg.id.toString()}
                    className="hover:bg-muted/30 transition-colors"
                    data-ocid={`admin.vegetable_row.${index + 1}`}
                  >
                    <TableCell>
                      <div className="w-11 h-11 rounded-lg overflow-hidden bg-muted flex-shrink-0 border border-border">
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={veg.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <VegetablePlaceholder name={veg.name} />
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-semibold text-foreground text-sm">
                          {veg.name}
                        </p>
                        <p className="text-xs text-muted-foreground line-clamp-1 max-w-[200px] hidden sm:block">
                          {veg.description}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full ${categoryColor}`}
                      >
                        {veg.category}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="font-bold text-primary">
                        £{veg.price.toFixed(2)}
                      </span>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {veg.stockAvailable ? (
                        <Badge
                          variant="outline"
                          className="border-emerald-300 text-emerald-700 bg-emerald-50 text-xs"
                        >
                          In Stock
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="border-red-300 text-red-600 bg-red-50 text-xs"
                        >
                          Out of Stock
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-1.5 h-8 text-xs border-border hover:border-primary/40 hover:text-primary hover:bg-primary/5"
                          onClick={() => handleEdit(veg)}
                          data-ocid={`admin.edit_button.${index + 1}`}
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Edit</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-1.5 h-8 text-xs border-border hover:border-destructive/40 hover:text-destructive hover:bg-destructive/5"
                          onClick={() => setDeleteVegetable(veg)}
                          data-ocid={`admin.delete_button.${index + 1}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Delete</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </motion.div>

      {/* Dialogs */}
      <VegetableFormDialog
        open={formOpen}
        onOpenChange={handleFormClose}
        vegetable={editVegetable}
      />
      <DeleteConfirmDialog
        vegetable={deleteVegetable}
        onClose={() => setDeleteVegetable(null)}
      />
    </main>
  );
}
