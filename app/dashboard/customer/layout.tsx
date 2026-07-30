"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UnifiedNavbar } from "@/components/layout/UnifiedNavbar";
import { Activity, ReceiptText, CreditCard, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { RoleProtectedRoute } from "@/components/layout/RoleProtectedRoute";

export default function CustomerDashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { name: "Overview", href: "/dashboard/customer", icon: Activity },
    { name: "My Rentals", href: "/dashboard/customer/rentals", icon: ReceiptText },
    { name: "Payments", href: "/dashboard/customer/payments", icon: CreditCard },
    { name: "Reviews", href: "/dashboard/customer/reviews", icon: Star },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <UnifiedNavbar />

      {/* Customer Sub-navigation */}
      <div className="bg-background border-b border-border sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 h-14 overflow-x-auto no-scrollbar">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== "/dashboard/customer" && pathname?.startsWith(item.href));
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "inline-flex items-center px-1 border-b-2 text-sm font-bold transition-colors whitespace-nowrap",
                    isActive
                      ? "border-orange-500 text-orange-600"
                      : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
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
        <RoleProtectedRoute allowedRoles={["CUSTOMER"]}>
          {children}
        </RoleProtectedRoute>
      </main>
    </div>
  );
}