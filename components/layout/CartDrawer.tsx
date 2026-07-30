"use client";

import { useCartStore } from "@/lib/store/cartStore";
import { format } from "date-fns";
import { X, CalendarIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useState } from "react";
import { createRentalOrder } from "@/lib/api/customer";
import { toast } from "@/components/ui/toast";
import { useRouter } from "next/navigation";

export function CartDrawer() {
  const { items, isCartOpen, setIsCartOpen, removeFromCart, clearCart, startDate, endDate, setDates } = useCartStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  if (!isCartOpen) return null;

  const calculateTotal = () => {
    if (!startDate || !endDate || items.length === 0) return 0;
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    const sumPrice = items.reduce((sum, item) => sum + item.price, 0);
    return diffDays * sumPrice;
  };

  const handleCheckout = async () => {
    if (!startDate || !endDate) return;
    
    // Check if token exists
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      toast.add({ type: "error", title: "Authentication Required", description: "Please log in to complete your reservation." });
      setIsCartOpen(false);
      router.push("/auth/login");
      return;
    }

    setIsSubmitting(true);
    try {
      const gearItemIds = items.map(item => item.id);
      await createRentalOrder({
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
        gearItemIds,
      });
      toast.add({
        type: "success",
        title: "Order Placed Successfully",
        description: "Your trip reservation has been created.",
      });
      clearCart();
      setIsCartOpen(false);
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

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />
      
      {/* Drawer */}
      <div className="relative w-full max-w-md bg-background shadow-2xl h-full flex flex-col animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-2xl font-black text-foreground tracking-tight">Your Trip Bag</h2>
          <Button variant="ghost" size="icon" onClick={() => setIsCartOpen(false)} className="rounded-full hover:bg-muted">
            <X className="w-5 h-5 text-muted-foreground" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
              <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center">
                <span className="text-4xl">🎒</span>
              </div>
              <h3 className="text-xl font-bold text-foreground">Your bag is empty</h3>
              <p className="text-muted-foreground max-w-xs">Looks like you haven't added any gear for your trip yet.</p>
              <Button onClick={() => { setIsCartOpen(false); router.push("/gear"); }} className="mt-4 rounded-full font-bold">
                Browse Gear
              </Button>
            </div>
          ) : (
            <>
              {/* Items List */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Gear ({items.length})</h3>
                  <button onClick={clearCart} className="text-xs font-bold text-red-500 hover:text-red-600">Clear All</button>
                </div>
                {items.map((item) => (
                  <div key={item.cartItemId} className="flex gap-4 p-3 bg-muted/50 rounded-2xl border border-border relative group">
                    <div className="w-20 h-20 bg-muted rounded-xl overflow-hidden relative shadow-sm shrink-0">
                      <Image src={item.imageUrl || "https://images.unsplash.com/photo-1504280390267-33106d156ee1?w=800&auto=format&fit=crop&q=80"} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1 flex flex-col justify-center">
                      <h4 className="font-bold text-foreground line-clamp-1 pr-6">{item.name}</h4>
                      <p className="text-xs text-muted-foreground mb-1">{item.brand || "GearUp"}</p>
                      <p className="font-black text-orange-500">${item.price}<span className="text-xs text-muted-foreground font-medium">/day</span></p>
                    </div>
                    <button 
                      onClick={() => removeFromCart(item.cartItemId)}
                      className="absolute top-2 right-2 p-1.5 bg-background text-muted-foreground hover:text-red-500 hover:bg-red-50 rounded-full opacity-100 sm:opacity-0 group-hover:opacity-100 transition-all shadow-sm border border-border"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Trip Dates */}
              <div className="space-y-4 pt-6 border-t border-border">
                <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Trip Dates</h3>
                <div className="space-y-3">
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground font-semibold">Start Date</Label>
                    <Popover>
                      <PopoverTrigger className={cn("inline-flex items-center justify-start text-left font-semibold bg-background border border-border h-11 rounded-xl shadow-sm px-4 hover:bg-muted transition-colors w-full", !startDate && "text-muted-foreground")}>
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {startDate ? format(startDate, "PPP") : "Pick start date"}
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 rounded-2xl border-border shadow-xl bg-card" align="start">
                        <Calendar
                          mode="single"
                          selected={startDate}
                          onSelect={(date) => {
                            if (date && endDate && date > endDate) {
                              setDates(date, date);
                            } else {
                              setDates(date, endDate);
                            }
                          }}
                          disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground font-semibold">End Date</Label>
                    <Popover>
                      <PopoverTrigger className={cn("inline-flex items-center justify-start text-left font-semibold bg-background border border-border h-11 rounded-xl shadow-sm px-4 hover:bg-muted transition-colors w-full", !endDate && "text-muted-foreground")} disabled={!startDate}>
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {endDate ? format(endDate, "PPP") : "Pick end date"}
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 rounded-2xl border-border shadow-xl bg-card" align="start">
                        <Calendar
                          mode="single"
                          selected={endDate}
                          onSelect={(date) => setDates(startDate, date)}
                          disabled={(date) => date < new Date(new Date().setHours(0,0,0,0)) || (startDate ? date < startDate : false)}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer Checkout */}
        {items.length > 0 && (
          <div className="p-6 bg-background border-t border-border shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)]">
            <div className="flex justify-between items-center mb-4">
              <span className="text-muted-foreground font-medium">Estimated Total</span>
              <span className="text-3xl font-black text-foreground">
                ${calculateTotal().toFixed(2)}
              </span>
            </div>
            {(!startDate || !endDate) && (
              <p className="text-xs text-orange-500 font-semibold mb-3 text-center">Select trip dates to view total and checkout</p>
            )}
            <Button 
              className="w-full h-14 rounded-xl text-lg font-bold shadow-md transition-transform active:scale-95 bg-orange-500 hover:bg-orange-600 text-white" 
              onClick={handleCheckout}
              disabled={!startDate || !endDate || isSubmitting}
            >
              {isSubmitting ? <><Loader2 className="mr-2 h-5 w-5 animate-spin"/> Processing...</> : "Complete Reservation"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
