"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createProviderGear, updateProviderGear } from "@/lib/api/provider";
import { fetchGearById } from "@/lib/api/gear";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Image as ImageIcon, Loader2 } from "lucide-react";
import { toast } from "@/components/ui/toast";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  categoryId: z.string().uuid("Please select a valid category"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  pricePerDay: z.coerce.number().min(1, "Price must be greater than 0"),
  imageUrl: z.string().url("Must be a valid image URL").optional().or(z.literal("")),
  isAvailable: z.boolean(),
});

type GearFormValues = z.infer<typeof formSchema>;

interface GearModalProps {
  isOpen: boolean;
  onClose: () => void;
  gearId?: string | null;
  onSuccess: () => void;
}

export function GearModal({ isOpen, onClose, gearId, onSuccess }: GearModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    import("@/lib/api/gear").then(({ fetchAllCategories }) => {
      fetchAllCategories().then((res) => {
        setCategories(res.data || []);
      }).catch(console.error);
    });
  }, []);
  
  const form = useForm<GearFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      categoryId: "",
      description: "",
      pricePerDay: 0,
      imageUrl: "",
      isAvailable: true,
    },
  });

  const isEditing = !!gearId;

  // Reset form when opened for creation, or load data when opened for editing
  useEffect(() => {
    if (isOpen) {
      if (isEditing) {
        setIsLoading(true);
        fetchGearById(gearId!)
          .then((response) => {
            const data = response.data;
            if (data) {
              form.reset({
                name: data.name || "",
                categoryId: data.categoryId || data.category?.id || "",
                description: data.description || "",
                pricePerDay: data.price || data.pricePerDay || 0,
                imageUrl: data.imageUrl || data.image || "",
                isAvailable: data.isAvailable ?? true,
              });
            }
          })
          .catch((err: any) => {
            toast.add({
              title: "Error",
              description: err.message || "Failed to load gear data",
              type: "error"
            });
            onClose();
          })
          .finally(() => {
            setIsLoading(false);
          });
      } else {
        form.reset({
          name: "",
          categoryId: "",
          description: "",
          pricePerDay: 0,
          imageUrl: "",
          isAvailable: true,
        });
      }
    }
  }, [isOpen, isEditing, gearId, form, onClose]);

  const imageUrl = form.watch("imageUrl");

  const onSubmit = async (data: GearFormValues) => {
    setIsSubmitting(true);
    try {
      const payload: any = {
        name: data.name,
        description: data.description,
        price: data.pricePerDay,
        categoryId: data.categoryId,
        isAvailable: data.isAvailable,
      };

      if (data.imageUrl && data.imageUrl.trim() !== "") {
        payload.imageUrl = data.imageUrl.trim();
      }

      if (isEditing) {
        await updateProviderGear(gearId!, payload);
        toast.add({
          title: "Success",
          description: "Your gear has been updated successfully.",
          type: "success",
        });
      } else {
        await createProviderGear(payload);
        toast.add({
          title: "Success",
          description: "Your gear has been listed successfully.",
          type: "success",
        });
      }
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error("API Error:", error);
      toast.add({
        title: "Error",
        description: error.message || (isEditing ? "Failed to update gear" : "Failed to create gear"),
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (Object.keys(form.formState.errors).length > 0) {
      console.log("Frontend Validation Errors:", form.formState.errors);
    }
  }, [form.formState.errors]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-3xl p-0 overflow-hidden bg-white">
        <DialogHeader className="p-6 pb-2 border-b border-slate-100">
          <DialogTitle className="text-2xl font-bold tracking-tight text-slate-900">
            {isEditing ? "Edit Gear" : "Add New Gear"}
          </DialogTitle>
          <DialogDescription className="text-slate-500">
            {isEditing ? "Update the details of your listing." : "List a new item for customers to rent."}
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex h-64 items-center justify-center bg-slate-50/50">
            <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
          </div>
        ) : (
          <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 space-y-8 max-h-[75vh] overflow-y-auto">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Item Name</Label>
                  <Input id="name" placeholder="e.g. Mountain Bike Pro" {...form.register("name")} className="focus-visible:ring-orange-500" />
                  {form.formState.errors.name && <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="categoryId">Category</Label>
                    <select
                      id="categoryId"
                      {...form.register("categoryId")}
                      className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-orange-500"
                    >
                      <option value="" disabled>Select a category</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                    {form.formState.errors.categoryId && <p className="text-sm text-red-500">{form.formState.errors.categoryId.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pricePerDay">Price Per Day ($)</Label>
                    <Input id="pricePerDay" type="number" min="0" step="0.01" {...form.register("pricePerDay")} className="focus-visible:ring-orange-500" />
                    {form.formState.errors.pricePerDay && <p className="text-sm text-red-500">{form.formState.errors.pricePerDay.message}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <textarea 
                    id="description" 
                    {...form.register("description")}
                    rows={4}
                    className="flex w-full rounded-md border border-slate-200 bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-orange-500 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Describe your item's features, condition, and any rules for renters..."
                  />
                  {form.formState.errors.description && <p className="text-sm text-red-500">{form.formState.errors.description.message}</p>}
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <input 
                    type="checkbox" 
                    id="isAvailable" 
                    {...form.register("isAvailable")} 
                    className="h-5 w-5 rounded border-slate-300 text-orange-600 focus:ring-orange-500"
                  />
                  <Label htmlFor="isAvailable" className="font-medium text-slate-700 cursor-pointer">Available for rent immediately</Label>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="imageUrl">Image URL</Label>
                  <Input id="imageUrl" placeholder="https://example.com/image.jpg" {...form.register("imageUrl")} className="focus-visible:ring-orange-500" />
                  {form.formState.errors.imageUrl && <p className="text-sm text-red-500">{form.formState.errors.imageUrl.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label>Image Preview</Label>
                  <div className="aspect-[4/3] rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 flex items-center justify-center overflow-hidden">
                    {imageUrl && !form.formState.errors.imageUrl ? (
                      <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" onError={(e) => {
                        (e.target as HTMLImageElement).src = "";
                        (e.target as HTMLImageElement).alt = "Invalid image URL";
                      }} />
                    ) : (
                      <div className="text-center text-slate-500">
                        <ImageIcon className="h-10 w-10 mx-auto text-slate-300 mb-2" />
                        <p className="text-sm">Paste a valid URL above to preview</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 flex justify-end gap-4 bg-white">
              <Button type="button" variant="outline" onClick={onClose} className="border-slate-300 hover:bg-slate-50">Cancel</Button>
              <Button type="submit" disabled={isSubmitting} className="bg-orange-600 hover:bg-orange-700 text-white min-w-[120px] shadow-sm">
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                {isSubmitting ? (isEditing ? "Updating..." : "Listing...") : (isEditing ? "Save Changes" : "List Gear")}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
