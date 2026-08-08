"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchMyProfile } from "@/lib/api/user";
import { Loader2 } from "lucide-react";
import { toast } from "@/components/ui/toast";

interface RoleProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

export function RoleProtectedRoute({ children, allowedRoles }: RoleProtectedRouteProps) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    async function checkRole() {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.add({
            type: "warning",
            title: "Authentication Required",
            description: "Please log in to access this page.",
          });
          router.push("/auth/login");
          return;
        }
        
        const res = await fetchMyProfile();
        const role = res.data?.role || res.role;
        
        if (!allowedRoles.includes(role)) {
          toast.add({
            type: "error",
            title: "Access Denied",
            description: "You do not have permission to view this page.",
          });

          if (role === "PROVIDER") router.push("/dashboard/provider");
          else if (role === "ADMIN") router.push("/dashboard/admin");
          else router.push("/dashboard/customer");
        } else {
          setIsAuthorized(true);
        }
      } catch (err) {
  
        localStorage.removeItem("token");
        router.push("/auth/login");
      }
    }
    
    checkRole();
  }, [router, allowedRoles]);

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-orange-500" />
          <p className="text-slate-500 font-medium">Verifying access...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
