"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";
import { submitReview } from "@/lib/api/customer";

const reviewSchema = z.object({
  rating: z.coerce.number().min(1, "Minimum rating is 1").max(5, "Maximum rating is 5"),
  comment: z.string().min(5, "Comment must be at least 5 characters long"),
});

export function ReviewModal({ gearItemIds }: { gearItemIds: string[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const targetGearId = gearItemIds[0] || "";

  const form = useForm<z.infer<typeof reviewSchema>>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: 5,
      comment: "",
    },
  });

  async function onSubmit(values: z.infer<typeof reviewSchema>) {
    if (!targetGearId) {
      toast.add({ type: "error", title: "Error", description: "No gear item found for this order." });
      return;
    }

    setIsLoading(true);
    try {
      await submitReview({
        gearItemId: targetGearId,
        rating: values.rating,
        comment: values.comment,
      });
      toast.add({
        type: "success",
        title: "Review Submitted",
        description: "Thank you for your feedback!",
      });
      setIsOpen(false);
      form.reset();
    } catch (error: any) {
      toast.add({
        type: "error",
        title: "Submission failed",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger render={<Button size="sm" variant="secondary" className="font-medium" />}>
        Leave Review
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Leave a Review</DialogTitle>
          <DialogDescription>
            Share your experience with this outdoor gear.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rating (1-5)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min="1" 
                      max="5" 
                      {...field} 
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Comment</FormLabel>
                  <FormControl>
                    <Input placeholder="How was the gear?" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Submit Review
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
