"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { format } from "date-fns"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Package,
  ReceiptText,
  Loader2,
} from "lucide-react"

import { fetchMyRentals, createCheckout } from "@/lib/api/customer"
import { toast } from "@/components/ui/toast"
import { ReviewModal } from "@/components/pages/dashboard/ReviewModal"

export default function CustomerRentalsPage() {
  const [rentals, setRentals] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [payingId, setPayingId] = useState<string | null>(null)

  useEffect(() => {
    async function loadData() {
      try {
        const rentalsRes = await fetchMyRentals()
        setRentals(rentalsRes.data || [])
      } catch (error: any) {
        toast.add({
          type: "error",
          title: "Failed to load rentals data",
          description: error.message,
        })
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [])

  const handlePay = async (rentalId: string) => {
    setPayingId(rentalId);
    try {
      const data = await createCheckout(rentalId);
      if (data.data?.checkoutUrl) {
        window.location.href = data.data.checkoutUrl;
      } else if (data.data?.url) {
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="flex items-center gap-2 text-2xl font-black tracking-tight text-foreground">
            <ReceiptText className="h-6 w-6 text-orange-500" /> My Rental History
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            View and manage all your past and current rentals.
          </p>
        </div>
      </div>

      <Card className="overflow-hidden border border-border bg-card shadow-sm backdrop-blur-xl">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center space-y-4 p-10 text-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-orange-500" />
            <p className="font-medium tracking-wide text-slate-500">
              Loading your rentals...
            </p>
          </div>
        ) : rentals.length === 0 ? (
          <div className="flex flex-col items-center justify-center space-y-5 p-16 text-center">
            <div className="rounded-full border border-border bg-background p-5 shadow-sm">
              <Package className="h-10 w-10 text-muted-foreground" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground">
                No Rentals Found
              </h3>
              <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
                You haven't rented any gear yet. Check out our catalog to
                start your first adventure!
              </p>
            </div>
            <Button
              asChild
              className="mt-4 rounded-xl bg-orange-500 font-bold text-white shadow-md transition-transform hover:bg-orange-600 active:scale-95"
            >
              <Link href="/gear">Browse Catalog</Link>
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="border-b border-border bg-muted/50">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="h-11 text-xs font-semibold text-muted-foreground">
                    Item
                  </TableHead>
                  <TableHead className="h-11 text-xs font-semibold text-muted-foreground">
                    Dates
                  </TableHead>
                  <TableHead className="h-11 text-xs font-semibold text-muted-foreground">
                    Total Price
                  </TableHead>
                  <TableHead className="h-11 text-xs font-semibold text-muted-foreground">
                    Status
                  </TableHead>
                  <TableHead className="h-11 text-xs font-semibold text-muted-foreground">
                    Payment
                  </TableHead>
                  <TableHead className="h-11 text-right text-xs font-semibold text-muted-foreground">
                    Action
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rentals.map((rental, index) => (
                  <TableRow
                    key={rental.id}
                    className={`border-b border-border transition-colors hover:bg-muted/50 ${
                      index % 2 === 0 ? "bg-background" : "bg-muted/20"
                    }`}
                  >
                    {/* Item */}
                    <TableCell className="py-3 font-medium text-foreground">
                      <div className="flex flex-col gap-1">
                        {rental.orderItems && rental.orderItems.length > 0 ? (
                          rental.orderItems.map((item: any) => (
                            <span key={item.id} className="text-sm font-semibold truncate max-w-[200px]" title={item.gearItem?.name}>
                              {item.gearItem?.name || "Unknown Item"}
                            </span>
                          ))
                        ) : (
                          <span className="text-sm font-semibold truncate max-w-[200px]">Unknown Item</span>
                        )}
                        <span className="text-xs text-muted-foreground font-mono">
                          ID: {rental.id.split("-")[0]}
                        </span>
                      </div>
                    </TableCell>

                    {/* Dates */}
                    <TableCell className="py-3 text-sm whitespace-nowrap text-muted-foreground">
                      {format(new Date(rental.startDate), "MMM d")} -{" "}
                      {format(new Date(rental.endDate), "MMM d, yyyy")}
                    </TableCell>

                    {/* Price */}
                    <TableCell className="py-3 font-bold text-foreground">
                      ${rental.totalAmount.toFixed(2)}
                    </TableCell>

                    {/* Status */}
                    <TableCell className="py-3">
                      <Badge
                        variant={
                          rental.status === "PENDING"
                            ? "outline"
                            : "secondary"
                        }
                        className={`px-2.5 py-0.5 text-xs font-semibold shadow-sm ${rental.status === "PENDING" ? "border-amber-200 bg-amber-50 text-amber-700" : ""} ${rental.status === "PAID" ? "border border-blue-200 bg-blue-50 text-blue-700" : ""} ${rental.status === "RETURNED" ? "border border-emerald-200 bg-emerald-50 text-emerald-700" : ""} `}
                      >
                        {rental.status}
                      </Badge>
                    </TableCell>

                    {/* Payment Status */}
                    <TableCell className="py-3">
                      {rental.paymentStatus === "COMPLETED" || rental.paymentStatus === "PAID" ? (
                        <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-none font-semibold">PAID</Badge>
                      ) : (
                        <Badge variant="outline" className="text-muted-foreground font-semibold">PENDING</Badge>
                      )}
                    </TableCell>

                    <TableCell className="py-3 text-right space-x-2">
                      {rental.status === "CONFIRMED" && rental.paymentStatus !== "COMPLETED" && rental.paymentStatus !== "PAID" ? (
                        <Button
                          size="sm"
                          onClick={() => handlePay(rental.id)}
                          disabled={payingId === rental.id}
                          className="rounded-lg bg-orange-500 font-bold text-white shadow-sm transition-all hover:bg-orange-600 active:scale-95"
                        >
                          {payingId === rental.id && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                          Pay Now
                        </Button>
                      ) : rental.status === "RETURNED" ? (
                        <ReviewModal 
                          gearItemIds={
                            rental.orderItems?.length ? rental.orderItems.map((item: any) => item.gearItemId || item.gearId) :
                            rental.gearItemIds ? rental.gearItemIds :
                            rental.gearItemId ? [rental.gearItemId] :
                            rental.gearId ? [rental.gearId] :
                            rental.gear?.id ? [rental.gear.id] :
                            []
                          } 
                        />
                      ) : (
                        <span className="text-xs font-medium text-muted-foreground italic">No action needed</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>
    </div>
  )
}
