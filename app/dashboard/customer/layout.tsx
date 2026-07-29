import { ReactNode } from "react";
import Link from "next/link";

export default function CustomerDashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white shadow-sm border-b px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-2xl font-black text-orange-500 tracking-tight">
            GearUp
          </Link>
          <span className="text-slate-300">|</span>
          <span className="font-semibold text-slate-700">Customer Portal</span>
        </div>
        
        <nav className="flex gap-6 text-sm font-medium text-slate-600">
          <Link href="/dashboard/customer" className="hover:text-orange-500 transition-colors">Overview</Link>
          <Link href="/dashboard/customer/orders" className="hover:text-orange-500 transition-colors">My Rentals</Link>
        </nav>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}