"use client"

import { useEffect, useState } from "react"
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
  CreditCard,
  CheckCircle,
  Loader2,
} from "lucide-react"

import { fetchMyPayments, createCheckout } from "@/lib/api/customer"
import { toast } from "@/components/ui/toast"

export default function CustomerPaymentsPage() {
  const [payments, setPayments] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [payingId, setPayingId] = useState<string | null>(null)

  useEffect(() => {
    async function loadData() {
      try {
        const paymentsRes = await fetchMyPayments()
        setPayments(paymentsRes.data || [])
      } catch (error: any) {
        toast.add({
          type: "error",
          title: "Failed to load payments data",
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
            <CreditCard className="h-6 w-6 text-orange-500" /> My Payments
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Track your transaction history and invoice details.
          </p>
        </div>
      </div>

      <Card className="overflow-hidden border border-slate-200 bg-white/60 shadow-sm backdrop-blur-xl">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center space-y-4 p-10 text-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-orange-500" />
            <p className="font-medium tracking-wide text-slate-500">
              Loading your payments...
            </p>
          </div>
        ) : payments.length === 0 ? (
          <div className="flex flex-col items-center justify-center space-y-5 p-16 text-center">
            <div className="rounded-full border border-slate-100 bg-white p-5 shadow-sm">
              <CreditCard className="h-10 w-10 text-slate-300" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-800">
                No Payments Found
              </h3>
              <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-slate-500">
                You have not made any transactions yet.
              </p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="border-b border-slate-200 bg-white/80">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="h-11 text-xs font-semibold text-slate-500">
                    Transaction ID
                  </TableHead>
                  <TableHead className="h-11 text-xs font-semibold text-slate-500">
                    Date
                  </TableHead>
                  <TableHead className="h-11 text-xs font-semibold text-slate-500">
                    Amount
                  </TableHead>
                  <TableHead className="h-11 text-xs font-semibold text-slate-500">
                    Method
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
                {payments.map((payment, index) => (
                  <TableRow
                    key={payment.id || payment.rentalOrderId}
                    className={`border-b border-slate-100 transition-colors hover:bg-slate-100/50 ${
                      index % 2 === 0 ? "bg-white/80" : "bg-slate-50/80"
                    }`}
                  >
                    <TableCell className="py-3 font-medium text-slate-700">
                      {payment.transactionId ? (
                        <span className="rounded border border-slate-200 bg-white px-2 py-1 font-mono text-xs text-slate-600 shadow-sm" title={payment.transactionId}>
                          {payment.transactionId.length > 12 ? payment.transactionId.substring(0, 12) + "..." : payment.transactionId}
                        </span>
                      ) : (
                        <span className="text-slate-400 text-xs italic">Pending generation</span>
                      )}
                    </TableCell>

                    <TableCell className="py-3 text-sm whitespace-nowrap text-slate-600">
                      {payment.paidAt ? format(new Date(payment.paidAt), "MMM d, yyyy") : "-"}
                    </TableCell>

                    <TableCell className="py-3 font-bold text-slate-800">
                      ${payment.amount.toFixed(2)}
                    </TableCell>
                    
                    <TableCell className="py-3 text-sm font-medium text-slate-600 uppercase">
                      {payment.method}
                    </TableCell>

                    <TableCell className="py-3">
                      <Badge
                        variant={
                          payment.status === "PENDING"
                            ? "outline"
                            : "secondary"
                        }
                        className={`px-2.5 py-0.5 text-xs font-semibold shadow-sm ${payment.status === "PENDING" ? "border-amber-200 bg-amber-50 text-amber-700" : ""} ${payment.status === "COMPLETED" ? "border-emerald-200 bg-emerald-50 text-emerald-700" : ""} `}
                      >
                        {payment.status}
                      </Badge>
                    </TableCell>

                    <TableCell className="py-3 text-right">
                      {payment.status === "PENDING" ? (
                        <Button
                          size="sm"
                          onClick={() => handlePay(payment.rentalOrderId)}
                          disabled={payingId === payment.rentalOrderId}
                          className="rounded-lg bg-orange-500 font-bold text-white shadow-sm transition-all hover:bg-orange-600 active:scale-95"
                        >
                          {payingId === payment.rentalOrderId && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                          Pay Now
                        </Button>
                      ) : (
                        <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-100 flex items-center justify-end w-fit ml-auto gap-1">
                          <CheckCircle className="w-3 h-3" /> Paid
                        </span>
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
