"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { EditProfileModal } from "@/components/pages/dashboard/EditProfileModal";
import { LogOut, Backpack } from "lucide-react";
import { fetchMyProfile } from "@/lib/api/user";
import { useCartStore } from "@/lib/store/cartStore";
import { CartDrawer } from "@/components/layout/CartDrawer";
import { ThemeToggle } from "@/components/ThemeToggle";

export function UnifiedNavbar() {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith("/dashboard");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);
  
  const { items: cartItems, setIsCartOpen } = useCartStore();

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    setIsLoggedIn(!!token);
    
    if (token) {
       fetchMyProfile().then(res => setUser(res.data)).catch(console.error);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/auth/login";
  };

  return (
    <header className="bg-background shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Logo & Branding */}
        <div className="flex items-center gap-4">
          <Link href="/" className="text-2xl font-black text-orange-500 tracking-tight">
            GearUp
          </Link>
          
          {isLoggedIn && user && (
            <>
              <span className="text-muted-foreground">|</span>
              <span className="font-bold text-foreground bg-muted px-3 py-1 rounded-md text-sm tracking-wide capitalize">
                {user.role ? `${user.role.toLowerCase()} Portal` : "Customer Portal"}
              </span>
            </>
          )}
        </div>
        
        {/* Navigation Links & Actions */}
        <nav className="flex items-center gap-6 text-sm font-semibold text-slate-600">
          <Link href="/categories" className={`hover:text-orange-500 transition-colors ${pathname === '/categories' ? 'text-orange-500' : ''}`}>
            Categories
          </Link>

          <Link href="/gear" className={`hover:text-orange-500 transition-colors ${pathname === '/gear' ? 'text-orange-500' : ''}`}>
            Gears
          </Link>

          <Link 
            href={isLoggedIn || isDashboard ? (user?.role === 'PROVIDER' ? "/dashboard/provider" : user?.role === 'ADMIN' ? "/dashboard/admin" : "/dashboard/customer") : "/auth/login"} 
            className={`hover:text-orange-500 transition-colors ${pathname?.startsWith('/dashboard') ? 'text-orange-500' : ''}`}
          >
            Dashboard
          </Link>
          
          {/* Unified Action Cluster */}
          <div className="flex items-center gap-2 ml-2 pl-4 border-l border-border">
            <ThemeToggle />
            {/* Trip Bag Button - Only for Customers */}
            {user && user.role === 'CUSTOMER' && (
              <button 
                onClick={() => setIsCartOpen(true)}
                className="relative flex items-center justify-center p-2 text-slate-500 hover:text-orange-500 hover:bg-orange-50 rounded-full transition-all cursor-pointer group"
                aria-label="Trip Bag"
                title="Trip Bag"
              >
                <Backpack className="w-5 h-5 group-hover:scale-110 transition-transform" />
                {cartItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full shadow-sm ring-2 ring-white">
                    {cartItems.length}
                  </span>
                )}
              </button>
            )}

            {/* User Profile & Logout */}
            {user && (
              <>
                <EditProfileModal user={user} onSuccess={() => fetchMyProfile().then(res => setUser(res.data)).catch(console.error)} />
                <Button variant="ghost" size="icon-sm" onClick={handleLogout} className="text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full h-9 w-9 flex-shrink-0" aria-label="Log Out" title="Log Out">
                  <LogOut className="w-4 h-4" />
                </Button>
              </>
            )}
          </div>
        </nav>
        
      </div>
      <CartDrawer />
    </header>
  );
}
