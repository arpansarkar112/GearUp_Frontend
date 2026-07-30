"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createProviderGear } from "@/lib/api/provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Image as ImageIcon, Loader2 } from "lucide-react";
import Link from "next/link";
import { toast } from "@/components/ui/toast";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  category: z.string().min(2, "Category is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  pricePerDay: z.coerce.number().min(1, "Price must be greater than 0"),
  imageUrl: z.string().url("Must be a valid image URL").optional().or(z.literal("")),
  isAvailable: z.boolean(),
});

type GearFormValues = z.infer<typeof formSchema>;

export default function AddGearPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<GearFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      category: "",
      description: "",
      pricePerDay: 0,
      imageUrl: "",
      isAvailable: true,
    },
  });

  const imageUrl = form.watch("imageUrl");

  const onSubmit = async (data: GearFormValues) => {
    setIsSubmitting(true);
    try {
      await createProviderGear(data);
      toast.add({
        title: "Success",
        description: "Your gear has been listed successfully.",
        type: "success",
      });
      router.push("/dashboard/provider/gear");
    } catch (error: any) {
      toast.add({
        title: "Error",
        description: error.message || "Failed to create gear listing",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/provider/gear">
          <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full hover:bg-slate-100">
            <ArrowLeft className="h-5 w-5 text-slate-600" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Add New Gear</h1>
          <p className="text-slate-500 mt-1">List a new item for customers to rent.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 md:p-8 space-y-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Item Name</Label>
                <Input id="name" placeholder="e.g. Mountain Bike Pro" {...form.register("name")} className="focus-visible:ring-orange-500" />
                {form.formState.errors.name && <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Input id="category" placeholder="e.g. Cycling" {...form.register("category")} className="focus-visible:ring-orange-500" />
                  {form.formState.errors.category && <p className="text-sm text-red-500">{form.formState.errors.category.message}</p>}
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

          <div className="pt-6 border-t border-slate-200 flex justify-end gap-4">
            <Link href="/dashboard/provider/gear">
              <Button type="button" variant="outline" className="border-slate-300">Cancel</Button>
            </Link>
            <Button type="submit" disabled={isSubmitting} className="bg-orange-600 hover:bg-orange-700 text-white min-w-[120px]">
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              {isSubmitting ? "Listing..." : "List Gear"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
