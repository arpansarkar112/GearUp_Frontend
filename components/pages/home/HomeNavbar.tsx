"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { fetchMyProfile } from "@/lib/api/user";

export function HomeNavbar() {
  const pathname = usePathname();
  const [activeHash, setActiveHash] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);

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

  const dashboardRoute = user?.role === 'PROVIDER' 
    ? "/dashboard/provider" 
    : user?.role === 'ADMIN' 
      ? "/dashboard/admin" 
      : "/dashboard/customer";

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/30 backdrop-blur-xl backdrop-saturate-150 border-b border-white/20 dark:border-white/10 shadow-lg">
      <div className="container mx-auto px-4 md:px-8 h-20 flex items-center justify-between">
        <Link href="/" onClick={() => setActiveHash("")} className="text-3xl font-black text-orange-500 tracking-tight">
          GearUp
        </Link>
        
        {/* Middle Navigation Links */}
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
        </nav>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          
          {isLoggedIn ? (
            <Button asChild className="rounded-full bg-orange-500 text-white hover:bg-orange-600 font-bold px-6">
              <Link href={dashboardRoute}>Dashboard</Link>
            </Button>
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
    </header>
  );
}
