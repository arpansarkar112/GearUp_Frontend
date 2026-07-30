"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createCategory, updateCategory } from "@/lib/api/admin";
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
import { Loader2 } from "lucide-react";
import { toast } from "@/components/ui/toast";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().min(5, "Description must be at least 5 characters"),
  image: z.string().url("Must be a valid URL").optional().or(z.literal("")),
});

type CategoryFormValues = z.infer<typeof formSchema>;

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  category?: any | null;
}

export function CategoryModal({ isOpen, onClose, onSuccess, category }: CategoryModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: category?.name || "",
      description: category?.description || "",
      image: category?.image || "",
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (category) {
        form.reset({
          name: category.name,
          description: category.description,
          image: category.image || "",
        });
      } else {
        form.reset({ name: "", description: "", image: "" });
      }
    }
  }, [isOpen, category, form]);

  const onSubmit = async (data: CategoryFormValues) => {
    setIsSubmitting(true);
    try {
      if (category) {
        await updateCategory(category.id, data);
        toast.add({
          title: "Success",
          description: "Category updated successfully.",
          type: "success",
        });
      } else {
        await createCategory(data);
        toast.add({
          title: "Success",
          description: "Category created successfully.",
          type: "success",
        });
      }
      onSuccess();
      onClose();
    } catch (error: any) {
      toast.add({
        title: "Error",
        description: error.message || (category ? "Failed to update category" : "Failed to create category"),
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden bg-background border-border">
        <DialogHeader className="p-6 pb-2 border-b border-border">
          <DialogTitle className="text-xl font-bold tracking-tight text-foreground">
            {category ? "Edit Category" : "Add New Category"}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {category ? "Update the details of this category." : "Create a new category to organize gear on the platform."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Category Name</Label>
              <Input id="name" placeholder="e.g. Winter Sports" {...form.register("name")} className="focus-visible:ring-orange-500 bg-background border-input text-foreground" />
              {form.formState.errors.name && <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Image URL</Label>
              <Input id="image" placeholder="https://example.com/image.jpg" {...form.register("image")} className="focus-visible:ring-orange-500 bg-background border-input text-foreground" />
              {form.formState.errors.image && <p className="text-sm text-red-500">{form.formState.errors.image.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <textarea 
                id="description" 
                {...form.register("description")}
                rows={3}
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-orange-500"
                placeholder="Describe this category..."
              />
              {form.formState.errors.description && <p className="text-sm text-red-500">{form.formState.errors.description.message}</p>}
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onClose} className="border-input hover:bg-muted text-foreground">Cancel</Button>
            <Button type="submit" disabled={isSubmitting} className="bg-orange-600 hover:bg-orange-700 text-white min-w-[100px] shadow-sm">
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              {category ? "Save Changes" : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
