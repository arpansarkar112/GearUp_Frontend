"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { fetchProviderGear, fetchProviderOrders } from "@/lib/api/provider";
import { fetchMyProfile } from "@/lib/api/user";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { 
  Package, 
  Activity, 
  Clock, 
  User, 
  Mail, 
  Shield, 
  ArrowRight,
  ShoppingBag
} from "lucide-react";

export default function ProviderOverviewPage() {
  const [data, setData] = useState<{ totalGear: number; activeRentals: number; pendingOrders: number } | null>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOverview() {
      try {
        const [gearRes, ordersRes, profileRes] = await Promise.all([
          fetchProviderGear().catch(() => ({ data: [] })),
          fetchProviderOrders().catch(() => ({ data: [] })),
          fetchMyProfile().catch(() => ({ data: null }))
        ]);
        
        const gearList = gearRes.data || [];
        const orderList = ordersRes.data || [];

        const activeRentals = orderList.filter((o: any) => o.status === "PICKED_UP").length;
        const pendingOrders = orderList.filter((o: any) => o.status === "PLACED").length;

        setData({
          totalGear: gearList.length,
          activeRentals: activeRentals,
          pendingOrders: pendingOrders,
        });
        
        setUserProfile(profileRes.data);
      } catch (err: any) {
        toast.add({
          type: "error",
          title: "Failed to load overview",
          description: err.message,
        });
      } finally {
        setLoading(false);
      }
    }

    loadOverview();
  }, []);

  return (
    <div className="space-y-8 pb-20">
      
      {/* Dashboard Command Center */}
      <div className="relative flex flex-col gap-8 overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 p-6 text-white shadow-2xl sm:p-10 mt-2">
        <div className="pointer-events-none absolute -top-24 -right-24 h-[500px] w-[500px] rounded-full bg-orange-500/10 blur-[120px]" />

        <div className="relative z-10 flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/20 bg-orange-500/10 px-3 py-1.5 text-xs font-semibold tracking-wide text-orange-400 uppercase">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-orange-400" />
              Provider Dashboard
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight text-slate-100 drop-shadow-sm sm:text-4xl lg:text-5xl">
              {loading
                ? "Welcome Back!"
                : `Welcome, ${userProfile?.name?.split(" ")[0] || "Provider"}!`}
            </h1>

            <p className="text-base leading-relaxed text-slate-400 sm:text-lg">
              Manage your gear inventory, track active rentals, and fulfill incoming orders seamlessly from your command center.
            </p>
          </div>

          {/* Avatar */}
          <div className="relative hidden h-32 w-32 shrink-0 overflow-hidden rounded-full border-4 border-slate-800 bg-slate-900 shadow-2xl ring-4 ring-slate-900/50 sm:h-40 sm:w-40 md:block">
            <Image
              src="https://images.unsplash.com/photo-1542359649-31e03cd4d909?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8YWR2ZW50dXJlfGVufDB8fDB8fHww?w=500&auto=format&fit=crop&q=60"
              alt="Provider Profile"
              fill
              className="object-cover transition-transform duration-700 hover:scale-110"
            />
          </div>
        </div>

        {/*User Metadata Ribbon */}
        <div className="relative z-10 flex flex-wrap gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md sm:gap-8">
          {loading ? (
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
                Total Gear Listed
              </CardTitle>
              <div className="rounded-xl bg-orange-500/20 p-2.5 text-orange-400">
                <Package className="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="h-9 w-16 animate-pulse rounded-md bg-white/10" />
              ) : (
                <div className="text-3xl font-extrabold tracking-tight text-white">
                  {data?.totalGear}
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
                <Activity className="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="h-9 w-16 animate-pulse rounded-md bg-white/10" />
              ) : (
                <div className="text-3xl font-extrabold tracking-tight text-white">
                  {data?.activeRentals}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border border-white/10 bg-white/5 shadow-none backdrop-blur-md transition-colors hover:bg-white/10">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-bold tracking-wider text-slate-400 uppercase">
                Pending Orders
              </CardTitle>
              <div className="rounded-xl bg-emerald-500/20 p-2.5 text-emerald-400">
                <Clock className="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="h-9 w-16 animate-pulse rounded-md bg-white/10" />
              ) : (
                <div className="text-3xl font-extrabold tracking-tight text-white">
                  {data?.pendingOrders}
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
                  Add New Equipment
                </h3>
              </div>
              <Button
                className="w-full bg-white font-bold text-orange-600 shadow-sm transition-all hover:bg-slate-100"
                asChild
              >
                <Link
                  href="/dashboard/provider/gear/new"
                  className="flex items-center justify-center gap-2"
                >
                  List Gear <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
      
    </div>
  );
}
