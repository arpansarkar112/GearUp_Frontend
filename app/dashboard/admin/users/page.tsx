"use client";

import { useEffect, useState } from "react";
import { fetchAllUsers, updateUserStatus } from "@/lib/api/admin";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { Loader2, ShieldCheck, UserX, UserCheck, AlertCircle } from "lucide-react";
import { format } from "date-fns";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const loadUsers = async () => {
    try {
      const response = await fetchAllUsers();
      setUsers(response.data || []);
    } catch (err: any) {
      setError(err.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleStatusChange = async (userId: string, currentStatus: string, role: string) => {
    if (role === "ADMIN") {
      toast.add({ type: "error", title: "Action Denied", description: "You cannot change the status of an Admin account." });
      return;
    }

    const newStatus = currentStatus === "ACTIVE" ? "SUSPENDED" : "ACTIVE";
    setProcessingId(userId);

    try {
      await updateUserStatus(userId, newStatus);
      toast.add({ type: "success", title: "Success", description: `User status updated to ${newStatus}` });
      setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, status: newStatus } : u)));
    } catch (err: any) {
      toast.add({ type: "error", title: "Error", description: err.message || "Failed to update status" });
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">User Management</h1>
        <p className="text-muted-foreground mt-2">View and manage all registered users on the platform.</p>
      </div>

      {error && (
        <div className="bg-red-500/10 text-red-500 p-4 rounded-lg flex items-center border border-red-500/20">
          <AlertCircle className="h-5 w-5 mr-2" />
          {error}
        </div>
      )}

      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        {users.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground">
            No users found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="font-semibold text-foreground">Name</TableHead>
                  <TableHead className="font-semibold text-foreground">Email</TableHead>
                  <TableHead className="font-semibold text-foreground">Role</TableHead>
                  <TableHead className="font-semibold text-foreground">Status</TableHead>
                  <TableHead className="font-semibold text-foreground">Joined</TableHead>
                  <TableHead className="font-semibold text-foreground text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id} className="border-border hover:bg-muted/50 transition-colors">
                    <TableCell className="font-medium text-foreground">{user.name}</TableCell>
                    <TableCell className="text-muted-foreground">{user.email}</TableCell>
                    <TableCell>
                      <Badge className={
                        user.role === "ADMIN" ? "bg-purple-500/10 text-purple-600 hover:bg-purple-500/20 border-transparent" :
                        user.role === "PROVIDER" ? "bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 border-transparent" :
                        "bg-slate-500/10 text-slate-600 hover:bg-slate-500/20 border-transparent dark:text-slate-400"
                      }>
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={
                        user.status === "ACTIVE" 
                          ? "bg-green-500/10 text-green-600 hover:bg-green-500/20 border-transparent"
                          : "bg-red-500/10 text-red-600 hover:bg-red-500/20 border-transparent"
                      }>
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {user.createdAt ? format(new Date(user.createdAt), "MMM d, yyyy") : "N/A"}
                    </TableCell>
                    <TableCell className="text-right">
                      {user.role !== "ADMIN" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleStatusChange(user.id, user.status, user.role)}
                          disabled={processingId === user.id}
                          className={user.status === "ACTIVE" ? "text-red-500 hover:text-red-600 hover:bg-red-500/10" : "text-green-500 hover:text-green-600 hover:bg-green-500/10"}
                        >
                          {processingId === user.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : user.status === "ACTIVE" ? (
                            <><UserX className="h-4 w-4 mr-2" /> Suspend</>
                          ) : (
                            <><UserCheck className="h-4 w-4 mr-2" /> Activate</>
                          )}
                        </Button>
                      )}
                      {user.role === "ADMIN" && (
                        <span className="text-xs text-muted-foreground flex items-center justify-end">
                          <ShieldCheck className="h-4 w-4 mr-1" /> Protected
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}
