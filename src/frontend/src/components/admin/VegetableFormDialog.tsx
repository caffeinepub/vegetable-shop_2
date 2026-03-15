import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { CATEGORIES, VEGETABLE_IMAGES } from "@/data/sampleVegetables";
import { useCreateVegetable, useUpdateVegetable } from "@/hooks/useQueries";
import { Loader2, Upload, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import type { Vegetable } from "../../backend";

interface VegetableFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vegetable?: Vegetable | null;
}

const CATEGORY_OPTIONS = CATEGORIES.filter((c) => c !== "All");

interface FormData {
  name: string;
  price: string;
  description: string;
  category: string;
  stockAvailable: boolean;
}

export function VegetableFormDialog({
  open,
  onOpenChange,
  vegetable,
}: VegetableFormDialogProps) {
  const isEdit = !!vegetable;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<FormData>({
    name: "",
    price: "",
    description: "",
    category: CATEGORY_OPTIONS[0],
    stockAvailable: true,
  });
  const [imageBytes, setImageBytes] = useState<Uint8Array<ArrayBuffer> | null>(
    null,
  );
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<Partial<FormData>>({});

  const createMutation = useCreateVegetable();
  const updateMutation = useUpdateVegetable();
  const isPending = createMutation.isPending || updateMutation.isPending;

  // Populate form when editing - reset form when dialog opens/closes
  // biome-ignore lint/correctness/useExhaustiveDependencies: open prop intentionally triggers form reset
  useEffect(() => {
    if (vegetable) {
      setFormData({
        name: vegetable.name,
        price: vegetable.price.toString(),
        description: vegetable.description,
        category: vegetable.category,
        stockAvailable: vegetable.stockAvailable,
      });
      const existingImage =
        vegetable.image?.getDirectURL() ?? VEGETABLE_IMAGES[vegetable.name];
      setImagePreview(existingImage ?? null);
      setImageBytes(null);
    } else {
      setFormData({
        name: "",
        price: "",
        description: "",
        category: CATEGORY_OPTIONS[0],
        stockAvailable: true,
      });
      setImagePreview(null);
      setImageBytes(null);
    }
    setErrors({});
  }, [vegetable, open]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result;
      if (result instanceof ArrayBuffer) {
        setImageBytes(new Uint8Array(result));
        setImagePreview(URL.createObjectURL(file));
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const validate = (): boolean => {
    const newErrors: Partial<FormData> = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (
      !formData.price ||
      Number.isNaN(Number(formData.price)) ||
      Number(formData.price) < 0
    ) {
      newErrors.price = "Valid price required";
    }
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (!formData.category) newErrors.category = "Category is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const price = Number.parseFloat(formData.price);

    try {
      if (isEdit && vegetable) {
        await updateMutation.mutateAsync({
          id: vegetable.id,
          name: formData.name.trim(),
          price,
          description: formData.description.trim(),
          category: formData.category,
          stockAvailable: formData.stockAvailable,
          imageBytes,
        });
        toast.success(`"${formData.name}" updated successfully`);
      } else {
        await createMutation.mutateAsync({
          name: formData.name.trim(),
          price,
          description: formData.description.trim(),
          category: formData.category,
          stockAvailable: formData.stockAvailable,
          imageBytes,
        });
        toast.success(`"${formData.name}" added to the catalog`);
      }
      onOpenChange(false);
    } catch (err) {
      toast.error(
        isEdit ? "Failed to update vegetable" : "Failed to add vegetable",
        {
          description: err instanceof Error ? err.message : "Please try again",
        },
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-lg max-h-[90vh] overflow-y-auto"
        data-ocid="admin.vegetable_form_dialog"
      >
        <DialogHeader>
          <DialogTitle className="font-heading text-xl">
            {isEdit ? "Edit Vegetable" : "Add New Vegetable"}
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            void handleSubmit(e);
          }}
          className="space-y-5 mt-2"
        >
          {/* Name */}
          <div className="space-y-1.5">
            <Label htmlFor="veg-name">Name</Label>
            <Input
              id="veg-name"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="e.g. Organic Spinach"
              className={errors.name ? "border-destructive" : ""}
              data-ocid="admin.name_input"
            />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name}</p>
            )}
          </div>

          {/* Price */}
          <div className="space-y-1.5">
            <Label htmlFor="veg-price">Price (£)</Label>
            <Input
              id="veg-price"
              type="number"
              step="0.01"
              min="0"
              value={formData.price}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, price: e.target.value }))
              }
              placeholder="0.00"
              className={errors.price ? "border-destructive" : ""}
              data-ocid="admin.price_input"
            />
            {errors.price && (
              <p className="text-xs text-destructive">{errors.price}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label htmlFor="veg-desc">Description</Label>
            <Textarea
              id="veg-desc"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="Describe the vegetable, its taste, and uses…"
              rows={3}
              className={errors.description ? "border-destructive" : ""}
              data-ocid="admin.description_textarea"
            />
            {errors.description && (
              <p className="text-xs text-destructive">{errors.description}</p>
            )}
          </div>

          {/* Category */}
          <div className="space-y-1.5">
            <Label>Category</Label>
            <Select
              value={formData.category}
              onValueChange={(val) =>
                setFormData((prev) => ({ ...prev, category: val }))
              }
            >
              <SelectTrigger data-ocid="admin.category_select">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORY_OPTIONS.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Stock Available */}
          <div className="flex items-center justify-between rounded-lg bg-muted/50 px-4 py-3 border border-border">
            <div>
              <Label
                htmlFor="veg-stock"
                className="font-semibold cursor-pointer"
              >
                In Stock
              </Label>
              <p className="text-xs text-muted-foreground mt-0.5">
                Customers can add this item to their cart
              </p>
            </div>
            <Switch
              id="veg-stock"
              checked={formData.stockAvailable}
              onCheckedChange={(val) =>
                setFormData((prev) => ({ ...prev, stockAvailable: val }))
              }
              data-ocid="admin.stock_switch"
            />
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <Label>Product Image</Label>
            <div className="flex items-start gap-3">
              {/* Preview */}
              <div className="w-20 h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0 border border-border">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Upload className="w-6 h-6 text-muted-foreground" />
                  </div>
                )}
              </div>

              <div className="flex-1 space-y-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="gap-2 w-full"
                  onClick={() => fileInputRef.current?.click()}
                  data-ocid="admin.image_upload_button"
                >
                  <Upload className="w-3.5 h-3.5" />
                  {imagePreview ? "Change Image" : "Upload Image"}
                </Button>
                {imagePreview && imageBytes && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="gap-2 w-full text-muted-foreground hover:text-destructive"
                    onClick={() => {
                      setImageBytes(null);
                      setImagePreview(vegetable?.image?.getDirectURL() ?? null);
                    }}
                  >
                    <X className="w-3 h-3" />
                    Remove new image
                  </Button>
                )}
                <p className="text-xs text-muted-foreground">
                  JPG, PNG or WebP. Max 5MB.
                </p>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
              data-ocid="admin.cancel_button"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
              disabled={isPending}
              data-ocid="admin.save_button"
            >
              {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              {isEdit ? "Save Changes" : "Add Vegetable"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
