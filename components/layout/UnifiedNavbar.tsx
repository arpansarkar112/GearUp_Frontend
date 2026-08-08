"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { EditProfileModal } from "@/components/pages/dashboard/EditProfileModal";
import { LogOut, Backpack, UserCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { fetchMyProfile } from "@/lib/api/user";
import { useCartStore } from "@/lib/store/cartStore";
import { CartDrawer } from "@/components/layout/CartDrawer";
import { ThemeToggle } from "@/components/ThemeToggle";

export function UnifiedNavbar() {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith("/dashboard");
  const [activeHash, setActiveHash] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  
  const { items: cartItems, setIsCartOpen } = useCartStore();

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    setIsLoggedIn(!!token);
    
    if (token) {
       fetchMyProfile().then(res => setUser(res.data)).catch(console.error);
    }

    const handleHash = () => setActiveHash(window.location.hash);
    handleHash();
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/auth/login";
  };

  return (
    <header className="sticky top-0 z-50 bg-background/30 backdrop-blur-xl backdrop-saturate-150 border-b border-white/20 dark:border-white/10 shadow-lg">
      <div className="container mx-auto px-4 md:px-8 h-20 flex items-center justify-between">
        
        {/* Logo & Branding */}
        <div className="flex items-center gap-4">
          <Link href="/" onClick={() => setActiveHash("")} className="text-3xl font-black text-orange-500 tracking-tight">
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
        <nav className="hidden md:flex items-center gap-6 text-sm font-bold text-slate-900 dark:text-slate-200">
          <Link href="/" onClick={() => setActiveHash("")} className={`hover:text-orange-500 transition-colors ${pathname === '/' && !activeHash ? 'text-orange-500 font-bold' : ''}`}>
            Home
          </Link>
          <Link href="/about" onClick={() => setActiveHash("")} className={`hover:text-orange-500 transition-colors ${pathname === '/about' ? 'text-orange-500 font-bold' : ''}`}>
            About
          </Link>

          <Link href="/categories" onClick={() => setActiveHash("")} className={`hover:text-orange-500 transition-colors ${pathname === '/categories' ? 'text-orange-500 font-bold' : ''}`}>
            Categories
          </Link>

          <Link href="/gear" onClick={() => setActiveHash("")} className={`hover:text-orange-500 transition-colors ${pathname === '/gear' ? 'text-orange-500 font-bold' : ''}`}>
            Gears
          </Link>

          {!isLoggedIn && (
            <>
              <Link href="/#reviews" onClick={() => setActiveHash('#reviews')} className={`hover:text-orange-500 transition-colors ${pathname === '/' && activeHash === '#reviews' ? 'text-orange-500 font-bold' : ''}`}>
                Reviews
              </Link>
              
              <Link href="/#faqs" onClick={() => setActiveHash('#faqs')} className={`hover:text-orange-500 transition-colors ${pathname === '/' && activeHash === '#faqs' ? 'text-orange-500 font-bold' : ''}`}>
                FAQs
              </Link>
            </>
          )}

          {isLoggedIn && (
            <Link 
              href={user?.role === 'PROVIDER' ? "/dashboard/provider" : user?.role === 'ADMIN' ? "/dashboard/admin" : "/dashboard/customer"} 
              className={`hover:text-orange-500 transition-colors ${pathname?.startsWith('/dashboard') ? 'text-orange-500' : ''}`}
            >
              Dashboard
            </Link>
          )}
        </nav>
          
        {/* Unified Action Cluster */}
        <div className="flex items-center gap-4">
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
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger render={
                  <Button variant="ghost" size="icon-sm" className="rounded-full h-9 w-9 flex-shrink-0 focus-visible:ring-0">
                    <UserCircle className="w-7 h-7 text-slate-500 hover:text-orange-500 transition-colors" />
                  </Button>
                } />
                <DropdownMenuContent align="end" className="w-56 mt-2 rounded-2xl shadow-xl">
                  <DropdownMenuGroup>
                    <DropdownMenuLabel className="font-black text-foreground">
                      {user.name}
                      <div className="text-xs font-normal text-muted-foreground mt-1">{user.email}</div>
                    </DropdownMenuLabel>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem render={
                    <Link href={user.role === 'PROVIDER' ? "/dashboard/provider" : user.role === 'ADMIN' ? "/dashboard/admin" : "/dashboard/customer"}>
                      Dashboard
                    </Link>
                  } className="cursor-pointer font-semibold" />
                  
                  <DropdownMenuItem render={<div />} onClick={() => setIsEditProfileOpen(true)} className="cursor-pointer font-semibold">
                    Edit Profile
                  </DropdownMenuItem>
                  
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer font-bold text-red-500 focus:text-red-500 focus:bg-red-50 dark:focus:bg-red-950/50">
                    <LogOut className="w-4 h-4 mr-2" />
                    Log Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link href="/auth/login" className="text-sm font-bold text-foreground hover:text-orange-500 transition-colors hidden sm:block">
                  Log In
                </Link>
                <Button asChild className="rounded-full bg-foreground text-background hover:bg-foreground/90 font-bold px-6">
                  <Link href="/auth/register">Sign Up</Link>
                </Button>
              </>
            )}
          </div>
      </div>
      <CartDrawer />
      
      {/* Edit Profile Modal Rendered Independently */}
      {user && (
        <EditProfileModal 
          user={user} 
          open={isEditProfileOpen} 
          onOpenChange={setIsEditProfileOpen} 
          onSuccess={() => fetchMyProfile().then(res => setUser(res.data)).catch(console.error)} 
        >
          <div className="hidden" />
        </EditProfileModal>
      )}
    </header>
  );
}
