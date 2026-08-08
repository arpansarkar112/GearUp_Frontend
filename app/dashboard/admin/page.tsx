"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users,
  Package,
  ClipboardList,
  ArrowRight,
  User,
  Mail,
  Shield,
  Activity,
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

import { fetchAllUsers, fetchAllAdminGear, fetchAllOrders } from "@/lib/api/admin";
import { fetchMyProfile } from "@/lib/api/user";
import { toast } from "@/components/ui/toast";

export default function AdminOverviewPage() {
  const [stats, setStats] = useState({
    users: 0,
    gear: 0,
    orders: 0,
  });
  const [userProfile, setUserProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        const [usersRes, gearRes, ordersRes, profileRes] = await Promise.all([
          fetchAllUsers().catch(() => ({ data: [] })),
          fetchAllAdminGear().catch(() => ({ data: [] })),
          fetchAllOrders().catch(() => ({ data: [] })),
          fetchMyProfile().catch(() => ({ data: null })),
        ]);
        
        const allUsers = usersRes.data || [];
        const allOrders = ordersRes.data || [];
        const allGear = gearRes.data || [];
        
        setStats({
          users: allUsers.length,
          gear: allGear.length,
          orders: allOrders.length,
        });
        setUserProfile(profileRes.data);

        // Generate dynamic chart data for the last 6 months
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const last6Months: { monthIndex: number; year: number; name: string; newUsers: number; newOrders: number }[] = [];
        for (let i = 5; i >= 0; i--) {
          const d = new Date();
          d.setMonth(d.getMonth() - i);
          last6Months.push({
            monthIndex: d.getMonth(),
            year: d.getFullYear(),
            name: months[d.getMonth()],
            newUsers: 0,
            newOrders: 0
          });
        }

        allUsers.forEach((u: any) => {
          if (!u.createdAt) return;
          const date = new Date(u.createdAt);
          const m = last6Months.find(lm => lm.monthIndex === date.getMonth() && lm.year === date.getFullYear());
          if (m) m.newUsers += 1;
        });

        allOrders.forEach((o: any) => {
          if (!o.createdAt) return;
          const date = new Date(o.createdAt);
          const m = last6Months.find(lm => lm.monthIndex === date.getMonth() && lm.year === date.getFullYear());
          if (m) m.newOrders += 1;
        });

        const startDate = new Date(last6Months[0].year, last6Months[0].monthIndex, 1);
        let cumulativeUsers = allUsers.filter((u: any) => u.createdAt && new Date(u.createdAt) < startDate).length;
        let cumulativeOrders = allOrders.filter((o: any) => o.createdAt && new Date(o.createdAt) < startDate).length;

        const generatedChartData = last6Months.map(m => {
          cumulativeUsers += m.newUsers;
          cumulativeOrders += m.newOrders;
          return {
            name: m.name,
            users: cumulativeUsers,
            orders: cumulativeOrders
          };
        });

        setChartData(generatedChartData);
      } catch (error: any) {
        toast.add({
          type: "error",
          title: "Failed to load dashboard data",
          description: error.message,
        });
      } finally {
        setIsLoading(false);
      }
    }
    loadData();

    const handleProfileUpdate = () => {
      fetchMyProfile()
        .then((res) => setUserProfile(res.data))
        .catch(console.error);
    };

    window.addEventListener("profileUpdated", handleProfileUpdate);
    return () =>
      window.removeEventListener("profileUpdated", handleProfileUpdate);
  }, []);

  return (
    <div className="space-y-8 pb-10">
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/20 bg-orange-500/10 px-3 py-1.5 text-xs font-semibold tracking-wide text-orange-400 uppercase">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-orange-400" />
          Admin Dashboard
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            {isLoading
              ? "Overview"
              : `Welcome, ${userProfile?.name?.split(" ")[0] || "Admin"}!`}
          </h1>
          <p className="text-muted-foreground mt-2">Manage the platform, monitor users, and oversee transactions.</p>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-card border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
            <Users className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-8 w-16 animate-pulse rounded-md bg-muted" />
            ) : (
              <div className="text-2xl font-bold text-foreground">{stats.users}</div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-card border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Gear Listed</CardTitle>
            <Package className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-8 w-16 animate-pulse rounded-md bg-muted" />
            ) : (
              <div className="text-2xl font-bold text-foreground">{stats.gear}</div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-card border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Orders</CardTitle>
            <ClipboardList className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-8 w-16 animate-pulse rounded-md bg-muted" />
            ) : (
              <div className="text-2xl font-bold text-foreground">{stats.orders}</div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-card border-border shadow-sm flex flex-col justify-between">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Quick Action</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-end">
            <Button
              className="w-full bg-orange-600 text-white hover:bg-orange-700 shadow-sm"
              asChild
            >
              <Link href="/dashboard/admin/users" className="flex items-center justify-center gap-2">
                Manage Users <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Chart */}
      <Card className="bg-card border-border shadow-sm mt-8">
        <CardHeader>
          <CardTitle className="text-lg font-bold">Platform Growth</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData.length > 0 ? chartData : [{ name: "Jan", users: 0, orders: 0 }]}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" opacity={0.1} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                  itemStyle={{ color: 'hsl(var(--foreground))' }}
                />
                <Area type="monotone" dataKey="users" stroke="#f97316" fillOpacity={1} fill="url(#colorUsers)" />
                <Area type="monotone" dataKey="orders" stroke="#3b82f6" fillOpacity={1} fill="url(#colorOrders)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
