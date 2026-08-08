"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UnifiedNavbar } from "@/components/layout/UnifiedNavbar";
import { LayoutDashboard, Package, ClipboardList, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { RoleProtectedRoute } from "@/components/layout/RoleProtectedRoute";

export default function ProviderDashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { name: "Overview", href: "/dashboard/provider", icon: LayoutDashboard },
    { name: "Inventory", href: "/dashboard/provider/gear", icon: Package },
    { name: "Orders", href: "/dashboard/provider/orders", icon: ClipboardList },
    { name: "Reviews", href: "/dashboard/provider/reviews", icon: Star },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <UnifiedNavbar />

      {/* Provider Sub-navigation */}
      <div className="bg-background/30 backdrop-blur-xl backdrop-saturate-150 border-b border-white/20 dark:border-white/10 sticky top-20 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 h-14">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== "/dashboard/provider" && pathname?.startsWith(item.href));
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "inline-flex items-center px-1 border-b-2 text-sm font-bold transition-colors",
                    isActive
                      ? "border-orange-500 text-orange-600"
                      : "border-transparent text-slate-800 dark:text-slate-300 hover:text-orange-500 hover:border-orange-300"
                  )}
                >
                  <Icon className="mr-2 h-4 w-4" />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        <RoleProtectedRoute allowedRoles={["PROVIDER"]}>
          {children}
        </RoleProtectedRoute>
      </main>
    </div>
  );
}
