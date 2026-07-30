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

  useEffect(() => {
    async function loadData() {
      try {
        const [usersRes, gearRes, ordersRes, profileRes] = await Promise.all([
          fetchAllUsers().catch(() => ({ data: [] })),
          fetchAllAdminGear().catch(() => ({ data: [] })),
          fetchAllOrders().catch(() => ({ data: [] })),
          fetchMyProfile().catch(() => ({ data: null })),
        ]);
        
        setStats({
          users: usersRes.data?.length || 0,
          gear: gearRes.data?.length || 0,
          orders: ordersRes.data?.length || 0,
        });
        setUserProfile(profileRes.data);
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
    </div>
  );
}
