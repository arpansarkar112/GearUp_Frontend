import { ReactNode } from "react";
import { UnifiedNavbar } from "@/components/layout/UnifiedNavbar";

export default function CustomerDashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <UnifiedNavbar />

      <main className="flex-1 max-w-7xl w-full mx-auto p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}