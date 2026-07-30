"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { EditProfileModal } from "@/components/pages/dashboard/EditProfileModal";
import { LogOut } from "lucide-react";
import { fetchMyProfile } from "@/lib/api/user";

export function UnifiedNavbar() {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith("/dashboard");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);

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
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Logo & Branding */}
        <div className="flex items-center gap-4">
          <Link href="/" className="text-2xl font-black text-orange-500 tracking-tight">
            GearUp
          </Link>
          
          {isLoggedIn && (
            <>
              <span className="text-slate-300">|</span>
              <span className="font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-md text-sm tracking-wide">
                Customer Portal
              </span>
            </>
          )}
        </div>
        
        {/* Navigation Links */}
        <nav className="flex items-center gap-6 text-sm font-semibold text-slate-600">
          <Link href="/" className="hover:text-orange-500 transition-colors hidden sm:block">Home</Link>
          
          <Link href="/gear" className={`hover:text-orange-500 transition-colors ${pathname === '/gear' ? 'text-orange-500' : ''}`}>
            Gears
          </Link>

          <Link href={isLoggedIn || isDashboard ? "/dashboard/customer" : "/auth/login"} className={`hover:text-orange-500 transition-colors ${pathname === '/dashboard/customer' ? 'text-orange-500' : ''}`}>
            Dashboard
          </Link>
          
          {/* Dashboard Actions */}
          {user && (
            <div className="flex items-center gap-3 ml-2 pl-4 border-l border-slate-200">
              <EditProfileModal user={user} onSuccess={() => fetchMyProfile().then(res => setUser(res.data)).catch(console.error)} />
              <Button variant="ghost" size="icon-sm" onClick={handleLogout} className="text-slate-400 hover:text-red-500 hover:bg-red-50">
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          )}
        </nav>
        
      </div>
    </header>
  );
}
