"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Package,
  CheckCircle,
  ShoppingBag,
  ArrowRight,
  User,
  Mail,
  Shield,
  Activity,
} from "lucide-react"

import { fetchMyRentals } from "@/lib/api/customer"
import { fetchMyProfile } from "@/lib/api/user"
import { toast } from "@/components/ui/toast"

export default function CustomerDashboardPage() {
  const [rentals, setRentals] = useState<any[]>([])
  const [userProfile, setUserProfile] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const [rentalsRes, profileRes] = await Promise.all([
          fetchMyRentals().catch(() => ({ data: [] })),
          fetchMyProfile().catch(() => ({ data: null })),
        ])
        setRentals(rentalsRes.data || [])
        setUserProfile(profileRes.data)
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

  return (
    <div className="space-y-12 pb-10">
      {/* Dashboard Command Center */}
      <div className="relative flex flex-col gap-8 overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 p-6 text-white shadow-2xl sm:p-10 mt-2">
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
    </div>
  )
}
