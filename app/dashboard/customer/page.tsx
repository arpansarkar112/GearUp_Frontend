"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { format } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
  CheckCircle,
  ShoppingBag,
  ArrowRight,
  User,
  Mail,
  Shield,
  Activity,
  ReceiptText,
  Loader2,
  Star,
  CreditCard,
} from "lucide-react"

import { fetchMyRentals, createCheckout, fetchMyReviews, fetchMyPayments } from "@/lib/api/customer"
import { fetchMyProfile } from "@/lib/api/user"
import { toast } from "@/components/ui/toast"
import { ReviewModal } from "@/components/pages/dashboard/ReviewModal"

export default function CustomerDashboardPage() {
  const [rentals, setRentals] = useState<any[]>([])
  const [payments, setPayments] = useState<any[]>([])
  const [reviews, setReviews] = useState<any[]>([])
  const [userProfile, setUserProfile] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [payingId, setPayingId] = useState<string | null>(null)

  useEffect(() => {
    async function loadData() {
      try {
        const [rentalsRes, paymentsRes, profileRes] = await Promise.all([
          fetchMyRentals().catch(() => ({ data: [] })),
          fetchMyPayments().catch(() => ({ data: [] })),
          fetchMyProfile().catch(() => ({ data: null })),
        ])
        setRentals(rentalsRes.data || [])
        setPayments(paymentsRes.data || [])
        setUserProfile(profileRes.data)

        if (profileRes.data?.id) {
          const reviewsRes = await fetchMyReviews(profileRes.data.id).catch(() => ({ data: [] }))
          setReviews(reviewsRes.data || [])
        }
      } catch (error: any) {
        toast.add({
          type: "error",
          title: "Failed to load dashboard data",
          description: error.message,
        })
      } finally {
        setIsLoading(false)
      }
    }
    loadData()

    const handleProfileUpdate = () => {
      fetchMyProfile()
        .then((res) => setUserProfile(res.data))
        .catch(console.error)
    }

    window.addEventListener("profileUpdated", handleProfileUpdate)
    return () =>
      window.removeEventListener("profileUpdated", handleProfileUpdate)
  }, [])

  const activeRentals = rentals.filter((r) =>
    ["CONFIRMED", "PAID", "PICKED_UP"].includes(r.status)
  ).length

  const completedOrders = rentals.filter((r) => r.status === "RETURNED").length

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
    <div className="space-y-12 pb-20">
      {/* Dashboard Navigation Tabs */}
      <div className="sticky top-[64px] z-40 bg-white/90 backdrop-blur-xl border-b border-slate-200 py-3 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 shadow-sm -mt-6 mb-2">
        <div className="flex items-center gap-8 overflow-x-auto no-scrollbar">
          <Link 
            href="#" 
            onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }) }} 
            className="text-sm font-bold text-slate-600 hover:text-orange-600 transition-colors whitespace-nowrap flex items-center gap-2"
          >
            <Activity className="h-4 w-4" /> Dashboard Overview
          </Link>
          <Link 
            href="#rentals" 
            className="text-sm font-bold text-slate-600 hover:text-orange-600 transition-colors whitespace-nowrap flex items-center gap-2"
          >
            <ReceiptText className="h-4 w-4" /> My Rentals
          </Link>
          <Link 
            href="#payments" 
            className="text-sm font-bold text-slate-600 hover:text-orange-600 transition-colors whitespace-nowrap flex items-center gap-2"
          >
            <CreditCard className="h-4 w-4" /> My Payments
          </Link>
          <Link 
            href="#reviews" 
            className="text-sm font-bold text-slate-600 hover:text-orange-600 transition-colors whitespace-nowrap flex items-center gap-2"
          >
            <Star className="h-4 w-4" /> My Reviews
          </Link>
        </div>
      </div>

      {/* Dashboard Command Center */}
      <div className="relative flex flex-col gap-8 overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 p-6 text-white shadow-2xl sm:p-10">
        <div className="pointer-events-none absolute -top-24 -right-24 h-[500px] w-[500px] rounded-full bg-orange-500/10 blur-[120px]" />

        <div className="relative z-10 flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/20 bg-orange-500/10 px-3 py-1.5 text-xs font-semibold tracking-wide text-orange-400 uppercase">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-orange-400" />
              Customer Dashboard
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight text-slate-100 drop-shadow-sm sm:text-4xl lg:text-5xl">
              {isLoading
                ? "Welcome Back!"
                : `Welcome, ${userProfile?.name?.split(" ")[0] || "Customer"}!`}
            </h1>

            <p className="text-base leading-relaxed text-slate-400 sm:text-lg">
              Track outdoor gear rentals, complete payments, and manage your
              active orders seamlessly from your command center.
            </p>
          </div>

          {/* Avatar */}
          <div className="relative hidden h-32 w-32 shrink-0 overflow-hidden rounded-full border-4 border-slate-800 bg-slate-900 shadow-2xl ring-4 ring-slate-900/50 sm:h-40 sm:w-40 md:block">
            <Image
              src="https://images.unsplash.com/photo-1501555088652-021faa106b9b?w=500&auto=format&fit=crop&q=60"
              alt="Adventure Profile"
              fill
              className="object-cover transition-transform duration-700 hover:scale-110"
            />
          </div>
        </div>

        {/*User Metadata Ribbon */}
        <div className="relative z-10 flex flex-wrap gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md sm:gap-8">
          {isLoading ? (
            <div className="h-10 w-full animate-pulse rounded-xl bg-white/5" />
          ) : userProfile ? (
            <>
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-orange-500/20 p-2 text-orange-400">
                  <User className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">
                    Name
                  </p>
                  <p className="text-sm font-semibold text-slate-200">
                    {userProfile.name}
                  </p>
                </div>
              </div>
              <div className="hidden h-8 w-px bg-white/10 sm:block" />

              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-blue-500/20 p-2 text-blue-400">
                  <Mail className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">
                    Email
                  </p>
                  <p className="text-sm font-semibold text-slate-200">
                    {userProfile.email}
                  </p>
                </div>
              </div>
              <div className="hidden h-8 w-px bg-white/10 md:block" />

              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-purple-500/20 p-2 text-purple-400">
                  <Shield className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">
                    Role
                  </p>
                  <p className="text-sm font-semibold text-slate-200">
                    {userProfile.role}
                  </p>
                </div>
              </div>
              <div className="hidden h-8 w-px bg-white/10 lg:block" />

              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-emerald-500/20 p-2 text-emerald-400">
                  <Activity className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">
                    Status
                  </p>
                  <p className="text-sm font-semibold text-slate-200">
                    {userProfile.status || "ACTIVE"}
                  </p>
                </div>
              </div>
            </>
          ) : null}
        </div>

        {/* Stats Grid */}
        <div className="relative z-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="border border-white/10 bg-white/5 shadow-none backdrop-blur-md transition-colors hover:bg-white/10">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-bold tracking-wider text-slate-400 uppercase">
                Total Orders
              </CardTitle>
              <div className="rounded-xl bg-orange-500/20 p-2.5 text-orange-400">
                <ShoppingBag className="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="h-9 w-16 animate-pulse rounded-md bg-white/10" />
              ) : (
                <div className="text-3xl font-extrabold tracking-tight text-white">
                  {rentals.length}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border border-white/10 bg-white/5 shadow-none backdrop-blur-md transition-colors hover:bg-white/10">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-bold tracking-wider text-slate-400 uppercase">
                Active Rentals
              </CardTitle>
              <div className="rounded-xl bg-blue-500/20 p-2.5 text-blue-400">
                <Package className="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="h-9 w-16 animate-pulse rounded-md bg-white/10" />
              ) : (
                <div className="text-3xl font-extrabold tracking-tight text-white">
                  {activeRentals}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border border-white/10 bg-white/5 shadow-none backdrop-blur-md transition-colors hover:bg-white/10">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-bold tracking-wider text-slate-400 uppercase">
                Completed
              </CardTitle>
              <div className="rounded-xl bg-emerald-500/20 p-2.5 text-emerald-400">
                <CheckCircle className="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="h-9 w-16 animate-pulse rounded-md bg-white/10" />
              ) : (
                <div className="text-3xl font-extrabold tracking-tight text-white">
                  {completedOrders}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Action Card*/}
          <Card className="flex flex-col justify-between border-none bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-lg transition-transform hover:-translate-y-1 hover:shadow-orange-500/20">
            <CardContent className="flex h-full flex-col items-start justify-between space-y-4 p-5 sm:p-6">
              <div className="space-y-1">
                <p className="text-xs font-bold tracking-wider text-orange-200 uppercase drop-shadow-sm">
                  Quick Link
                </p>
                <h3 className="text-base leading-snug font-bold text-white drop-shadow-sm">
                  Find New Equipment
                </h3>
              </div>
              <Button
                className="w-full bg-white font-bold text-orange-600 shadow-sm transition-all hover:bg-slate-100"
                asChild
              >
                <Link
                  href="/gear"
                  className="flex items-center justify-center gap-2"
                >
                  Browse Gears <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>



      {/* Rental History Table */}
      <div id="rentals" className="scroll-mt-36 space-y-6 pt-2">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="flex items-center gap-2 text-2xl font-black tracking-tight text-slate-900">
              <ReceiptText className="h-6 w-6 text-orange-500" /> My Rental
              History
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

      {/* My Payments Table */}
      <div id="payments" className="scroll-mt-36 space-y-6 pt-12">
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

      {/* My Reviews Section */}
      <div id="reviews" className="scroll-mt-36 space-y-6 pt-12">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="flex items-center gap-2 text-2xl font-black tracking-tight text-slate-900">
              <Star className="h-6 w-6 text-orange-500 fill-orange-500" /> My Reviews
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Feedback and ratings you have submitted for past rentals.
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 w-full animate-pulse rounded-2xl bg-slate-100" />
            ))}
          </div>
        ) : reviews.length === 0 ? (
          <Card className="flex flex-col items-center justify-center space-y-4 p-12 text-center border-dashed border-slate-200">
            <div className="rounded-full bg-slate-50 p-4">
              <Star className="h-8 w-8 text-slate-300" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-700">No Reviews Yet</h3>
              <p className="text-sm text-slate-500 mt-1">
                You haven't left any reviews for your rentals. Return a gear to leave your first review!
              </p>
            </div>
          </Card>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {reviews.map((review) => (
              <Card key={review.id} className="overflow-hidden border border-slate-800 bg-slate-900 text-white shadow-xl transition-all hover:shadow-2xl hover:-translate-y-1">
                <CardContent className="p-6">
                  <div className="flex items-center gap-1 text-orange-400 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`h-4 w-4 ${i < review.rating ? "fill-orange-400 text-orange-400" : "fill-transparent text-slate-700"}`} />
                    ))}
                  </div>
                  <h3 className="font-bold text-white line-clamp-1 mb-1">
                    {review.gearItem?.name || "Outdoor Gear"}
                  </h3>
                  <p className="text-sm text-slate-300 line-clamp-3 mb-4">
                    "{review.comment}"
                  </p>
                  <p className="text-xs text-slate-400">
                    Posted on {format(new Date(review.createdAt), "MMM d, yyyy")}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
