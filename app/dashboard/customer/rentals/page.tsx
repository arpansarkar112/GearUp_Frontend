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
          <h2 className="flex items-center gap-2 text-2xl font-black tracking-tight text-slate-900">
            <ReceiptText className="h-6 w-6 text-orange-500" /> My Rental History
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            View and manage all your past and current rentals.
          </p>
        </div>
      </div>

      <Card className="overflow-hidden border border-slate-200 bg-white/60 shadow-sm backdrop-blur-xl">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center space-y-4 p-10 text-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-orange-500" />
            <p className="font-medium tracking-wide text-slate-500">
              Loading your rentals...
            </p>
          </div>
        ) : rentals.length === 0 ? (
          <div className="flex flex-col items-center justify-center space-y-5 p-16 text-center">
            <div className="rounded-full border border-slate-100 bg-white p-5 shadow-sm">
              <Package className="h-10 w-10 text-slate-300" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-800">
                No Rentals Found
              </h3>
              <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-slate-500">
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
              <TableHeader className="border-b border-slate-200 bg-white/80">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="h-11 text-xs font-semibold text-slate-500">
                    Order ID
                  </TableHead>
                  <TableHead className="h-11 text-xs font-semibold text-slate-500">
                    Dates
                  </TableHead>
                  <TableHead className="h-11 text-xs font-semibold text-slate-500">
                    Total Price
                  </TableHead>
                  <TableHead className="h-11 text-xs font-semibold text-slate-500">
                    Status
                  </TableHead>
                  <TableHead className="h-11 text-right text-xs font-semibold text-slate-500">
                    Action
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rentals.map((rental, index) => (
                  <TableRow
                    key={rental.id}
                    className={`border-b border-slate-100 transition-colors hover:bg-slate-100/50 ${
                      index % 2 === 0 ? "bg-white/80" : "bg-slate-50/80"
                    }`}
                  >
                    {/* Order ID */}
                    <TableCell className="py-3 font-medium text-slate-700">
                      <span className="rounded border border-slate-200 bg-white px-2 py-1 font-mono text-xs text-slate-600 shadow-sm">
                        {rental.id.split("-")[0]}
                      </span>
                    </TableCell>

                    {/* Dates */}
                    <TableCell className="py-3 text-sm whitespace-nowrap text-slate-600">
                      {format(new Date(rental.startDate), "MMM d")} -{" "}
                      {format(new Date(rental.endDate), "MMM d, yyyy")}
                    </TableCell>

                    {/* Price */}
                    <TableCell className="py-3 font-bold text-slate-800">
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

                    <TableCell className="py-3 text-right space-x-2">
                      {rental.status === "CONFIRMED" ? (
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
                        <span className="text-xs font-medium text-slate-400 italic">No action needed</span>
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
