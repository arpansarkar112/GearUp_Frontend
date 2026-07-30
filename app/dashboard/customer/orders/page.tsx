"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2, Package, CheckCircle, Clock, ShoppingBag } from "lucide-react";

import { fetchMyRentals, createCheckout } from "@/lib/api/customer";
import { toast } from "@/components/ui/toast";
import { ReviewModal } from "@/components/pages/dashboard/ReviewModal";

export default function CustomerOrdersPage() {
  const [rentals, setRentals] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [payingId, setPayingId] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await fetchMyRentals();
        setRentals(data.data || []);
      } catch (error: any) {
        toast.add({
          type: "error",
          title: "Failed to load rentals",
          description: error.message,
        });
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const handlePay = async (rentalId: string) => {
    setPayingId(rentalId);
    try {
      const data = await createCheckout(rentalId);
      if (data.data?.url) {
        window.location.href = data.data.url;
      } else if (data.url) {
        window.location.href = data.url;
      } else if (data.data?.success_url) {
        window.location.href = data.data.success_url;
      } else {
        toast.add({ type: "error", title: "Error", description: "Payment URL not found in response." });
      }
    } catch (error: any) {
      toast.add({
        type: "error",
        title: "Payment initiation failed",
        description: error.message,
      });
    } finally {
      setPayingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status?.toUpperCase()) {
      case "PENDING":
      case "PLACED":
        return <Badge className="bg-amber-500 hover:bg-amber-600 text-white border-none shadow-sm"><Clock className="w-3 h-3 mr-1" /> {status.toUpperCase()}</Badge>;
      case "CONFIRMED":
        return <Badge className="bg-blue-500 hover:bg-blue-600 text-white border-none shadow-sm"><CheckCircle className="w-3 h-3 mr-1" /> CONFIRMED</Badge>;
      case "PAID":
        return <Badge className="bg-indigo-500 hover:bg-indigo-600 text-white border-none shadow-sm"><CheckCircle className="w-3 h-3 mr-1" /> PAID</Badge>;
      case "PICKED_UP":
        return <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white border-none shadow-sm"><Package className="w-3 h-3 mr-1" /> PICKED UP</Badge>;
      case "RETURNED":
        return <Badge className="bg-slate-500 hover:bg-slate-600 text-white border-none shadow-sm">RETURNED</Badge>;
      case "CANCELLED":
        return <Badge variant="destructive" className="shadow-sm">CANCELLED</Badge>;
      default:
        return <Badge variant="outline" className="text-slate-700 border-slate-300">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-none shadow-xl bg-white overflow-hidden rounded-2xl">
        <CardHeader className="border-b bg-slate-50/50 pb-6">
          <CardTitle className="text-2xl font-bold text-slate-800">My Rentals</CardTitle>
          <CardDescription className="text-base">
            Detailed view of your past and current outdoor gear rentals.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50/80">
              <TableRow className="hover:bg-transparent">
                <TableHead className="font-semibold text-slate-600 py-4 px-6">Order ID</TableHead>
                <TableHead className="font-semibold text-slate-600 py-4">Rental Period</TableHead>
                <TableHead className="font-semibold text-slate-600 py-4">Status</TableHead>
                <TableHead className="font-semibold text-slate-600 py-4">Amount</TableHead>
                <TableHead className="font-semibold text-slate-600 py-4 text-right px-6">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-16">
                    <Loader2 className="mx-auto h-8 w-8 animate-spin text-orange-500" />
                    <p className="text-slate-500 mt-4 font-medium">Loading your rentals...</p>
                  </TableCell>
                </TableRow>
              ) : rentals.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-20 text-muted-foreground">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-24 h-24 mb-4 rounded-full bg-orange-100 flex items-center justify-center">
                        <ShoppingBag className="w-10 h-10 text-orange-500" />
                      </div>
                      <h3 className="text-lg font-bold text-slate-800 mb-1">No rentals found</h3>
                      <p className="text-slate-500">You haven't rented any gear yet.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                rentals.map((rental) => (
                  <TableRow key={rental.id} className="hover:bg-slate-50/80 transition-colors">
                    <TableCell className="font-bold text-sm text-slate-700 px-6">
                      #{rental.id.slice(0, 8).toUpperCase()}
                    </TableCell>
                    <TableCell className="font-medium text-slate-600">
                      {new Date(rental.startDate).toLocaleDateString()} <span className="text-slate-300 mx-1">→</span> {new Date(rental.endDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{getStatusBadge(rental.status)}</TableCell>
                    <TableCell className="font-bold text-slate-700">
                      ${rental.totalAmount?.toFixed(2) || "0.00"}
                    </TableCell>
                    <TableCell className="text-right px-6 space-x-3">
                      {rental.status === "CONFIRMED" && (
                        <Button
                          size="sm"
                          onClick={() => handlePay(rental.id)}
                          disabled={payingId === rental.id}
                          className="bg-indigo-600 hover:bg-indigo-700 shadow-md transition-transform active:scale-95"
                        >
                          {payingId === rental.id && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                          Pay Now
                        </Button>
                      )}
                      {rental.status === "RETURNED" && (
                        <ReviewModal gearItemIds={rental.gearItemIds || []} />
                      )}
                      {rental.status !== "CONFIRMED" && rental.status !== "RETURNED" && (
                         <span className="text-xs font-medium text-slate-400 italic">No action needed</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
