import { ReactNode } from "react";
import { RoleProtectedRoute } from "@/components/layout/RoleProtectedRoute";

export default function AdminDashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 lg:p-8">
        <RoleProtectedRoute allowedRoles={["ADMIN"]}>
          {children}
        </RoleProtectedRoute>
      </main>
    </div>
  );
}
