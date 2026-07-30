"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { fetchGearById, fetchReviewsByGearId } from "@/lib/api/gear";
import { createRentalOrder } from "@/lib/api/customer";
import { toast } from "@/components/ui/toast";
import { ArrowLeft, Loader2, CheckCircle, ShieldAlert, Calendar as CalendarIcon, Star } from "lucide-react";
import { UnifiedNavbar } from "@/components/layout/UnifiedNavbar";
import { cn } from "@/lib/utils";

export default function GearDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const router = useRouter();
  
  const [gear, setGear] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / reviews.length 
    : 0;
  
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);

  useEffect(() => {
    async function loadGear() {
      try {
        const [gearRes, reviewsRes] = await Promise.all([
          fetchGearById(unwrappedParams.id),
          fetchReviewsByGearId(unwrappedParams.id).catch(() => ({ data: [] }))
        ]);
        setGear(gearRes.data);
        setReviews(reviewsRes.data || []);
      } catch (error) {
        toast.add({
          type: "error",
          title: "Failed to load gear",
          description: "This item might not exist or is currently unavailable.",
        });
      } finally {
        setIsLoading(false);
      }
    }
    loadGear();
  }, [unwrappedParams.id]);

  const calculateTotal = () => {
    if (!startDate || !endDate || !gear) return 0;
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return (diffDays + 1) * gear.price; 
  };

  const handleRent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || !endDate) {
      toast.add({ type: "error", title: "Missing Dates", description: "Please select both start and end dates." });
      return;
    }
    
    if (startDate > endDate) {
      toast.add({ type: "error", title: "Invalid Dates", description: "End date cannot be before start date." });
      return;
    }

    setIsSubmitting(true);
    try {
      await createRentalOrder({
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
        gearItemIds: [gear.id],
      });
      toast.add({
        type: "success",
        title: "Order Placed Successfully",
        description: "Your rental order has been created. Redirecting to payment...",
      });
      router.push("/dashboard/customer/orders");
    } catch (error: any) {
      toast.add({
        type: "error",
        title: "Failed to place order",
        description: error.message || "An unexpected error occurred.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-12 h-12 animate-spin text-orange-500" />
      </div>
    );
  }

  if (!gear) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 space-y-4">
        <h1 className="text-2xl font-bold text-slate-800">Gear Not Found</h1>
        <Button asChild>
          <Link href="/gear">Back to Gears</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <UnifiedNavbar />

      <main className="max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 mt-6">
        <div className="grid lg:grid-cols-2 gap-10">
          
          {/* Image & Gallery */}
          <div className="space-y-4">
            <div className="aspect-square bg-white rounded-3xl overflow-hidden shadow-md relative border border-slate-100">
              <Image 
                src={gear.imageUrl || "https://images.unsplash.com/photo-1504280390267-33106d156ee1?w=800&auto=format&fit=crop&q=80"}
                alt={gear.name}
                fill
                className="object-cover"
              />
              {!gear.isAvailable && (
                 <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm">
                   <Badge variant="destructive" className="text-lg px-6 py-2 shadow-xl">CURRENTLY UNAVAILABLE</Badge>
                 </div>
              )}
            </div>
          </div>

          {/* Details & Checkout */}
          <div className="flex flex-col space-y-8">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-200 border-none px-3 py-1 font-bold tracking-wide uppercase">
                  {typeof gear.category === 'object' ? gear.category?.name : gear.category}
                </Badge>
                {gear.isAvailable && (
                  <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-none px-3 py-1 font-bold flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" /> Available Now
                  </Badge>
                )}
              </div>
              <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight mb-2">
                {gear.name}
              </h1>
              <p className="text-lg font-medium text-slate-500 mb-2">by {gear.brand || "GearUp"}</p>
              
              <div className="flex items-center gap-2 mb-6">
                <div className="flex items-center gap-1 text-orange-500">
                  <Star className="h-5 w-5 fill-orange-500" />
                  <span className="font-bold text-slate-800 text-lg">{averageRating > 0 ? averageRating.toFixed(1) : "New"}</span>
                </div>
                {reviews.length > 0 && (
                  <>
                    <span className="text-slate-300">•</span>
                    <Link href="#reviews" onClick={(e) => {
                      e.preventDefault();
                      document.getElementById('reviews')?.scrollIntoView({ behavior: 'smooth' });
                    }} className="text-sm font-medium text-slate-500 hover:text-orange-500 underline underline-offset-4 transition-colors">
                      See all {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
                    </Link>
                  </>
                )}
                {reviews.length === 0 && (
                  <>
                    <span className="text-slate-300">•</span>
                    <span className="text-sm font-medium text-slate-400">No reviews yet</span>
                  </>
                )}
              </div>
              
              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-4xl font-black text-orange-500">${gear.price}</span>
                <span className="text-slate-500 font-medium">/ day</span>
              </div>
              
              <p className="text-slate-600 leading-relaxed text-lg mb-8">
                {gear.description}
              </p>
              
              <div className="flex items-center gap-2 text-sm text-slate-500 bg-slate-100 p-4 rounded-xl">
                <ShieldAlert className="w-5 h-5 text-slate-400" />
                <span>A refundable deposit will be required upon pickup.</span>
              </div>
            </div>

            <Card className="border-none shadow-xl bg-white overflow-hidden rounded-3xl">
              <CardContent className="p-6 sm:p-8">
                <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                  <CalendarIcon className="w-6 h-6 text-orange-500" /> Select Rental Dates
                </h3>
                
                <form onSubmit={handleRent} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-2 flex flex-col">
                      <Label className="text-slate-600 font-semibold">Start Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "h-12 w-full justify-start text-left font-normal rounded-xl bg-slate-50 border-slate-200 hover:text-slate-900",
                              !startDate ? "text-slate-400" : "text-slate-900 font-semibold"
                            )}
                            disabled={!gear.isAvailable || isSubmitting}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 rounded-2xl border-slate-200 shadow-xl" align="start">
                          <Calendar
                            mode="single"
                            selected={startDate}
                            onSelect={(date) => {
                              setStartDate(date);
                              if (date && endDate && date > endDate) {
                                setEndDate(date);
                              }
                            }}
                            disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    
                    <div className="space-y-2 flex flex-col">
                      <Label className="text-slate-600 font-semibold">End Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "h-12 w-full justify-start text-left font-normal rounded-xl bg-slate-50 border-slate-200 hover:text-slate-900",
                              !endDate ? "text-slate-400" : "text-slate-900 font-semibold"
                            )}
                            disabled={!gear.isAvailable || isSubmitting || !startDate}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 rounded-2xl border-slate-200 shadow-xl" align="start">
                          <Calendar
                            mode="single"
                            selected={endDate}
                            onSelect={setEndDate}
                            disabled={(date) => 
                              date < new Date(new Date().setHours(0,0,0,0)) || 
                              (startDate ? date < startDate : false)
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  {startDate && endDate && (
                    <div className="bg-orange-50 p-6 rounded-2xl border border-orange-100 flex justify-between items-center animate-in fade-in zoom-in-95 duration-300">
                      <div>
                        <p className="text-sm font-semibold text-orange-800 mb-1">Estimated Total</p>
                        <p className="text-xs text-orange-600/80">Excluding deposit & fees</p>
                      </div>
                      <div className="text-3xl font-black text-orange-600">
                        ${calculateTotal().toFixed(2)}
                      </div>
                    </div>
                  )}

                  <Button 
                    type="submit" 
                    size="lg" 
                    className="w-full h-14 rounded-xl text-lg font-bold shadow-lg transition-transform active:scale-95 bg-orange-500 hover:bg-orange-600 text-white"
                    disabled={!gear.isAvailable || isSubmitting || !startDate || !endDate}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      "Rent Now"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

          </div>
        </div>

        {/* Customer Reviews Section */}
        <div id="reviews" className="scroll-mt-24 mt-16 pt-16 border-t border-slate-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <h2 className="text-3xl font-black text-slate-900 flex items-center gap-2">
              <Star className="h-8 w-8 text-orange-500 fill-orange-500" /> Customer Reviews
            </h2>
            <div className="inline-flex items-center justify-center px-4 py-2 bg-slate-100 rounded-full text-sm font-bold text-slate-700">
              {reviews.length} {reviews.length === 1 ? 'Review' : 'Reviews'}
            </div>
          </div>

          {reviews.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border-dashed border-2 border-slate-200">
              <Star className="h-12 w-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-700">No reviews yet</h3>
              <p className="text-slate-500 mt-2">Be the first to review this gear after your rental!</p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {reviews.map((review) => (
                <Card key={review.id} className="overflow-hidden border-slate-200 shadow-sm transition-all hover:shadow-md bg-white">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-1 text-orange-500 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`h-4 w-4 ${i < review.rating ? "fill-orange-500" : "fill-transparent text-slate-300"}`} />
                      ))}
                    </div>
                    <div className="flex items-center gap-3 mb-4">
                       <div className="h-10 w-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold text-sm shadow-sm uppercase">
                         {review.customer?.name?.[0] || "C"}
                       </div>
                       <div>
                         <p className="text-sm font-bold text-slate-800">{review.customer?.name || "Customer"}</p>
                         <p className="text-xs text-slate-400 font-medium">{format(new Date(review.createdAt), "MMM d, yyyy")}</p>
                       </div>
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed italic">
                      "{review.comment}"
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
