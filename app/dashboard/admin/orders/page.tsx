"use client";

import { useEffect, useState } from "react";
import { fetchAllOrders } from "@/lib/api/admin";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Loader2, ClipboardList, User } from "lucide-react";
import { format } from "date-fns";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadOrders = async () => {
    try {
      const response = await fetchAllOrders();
      setOrders(response.data || []);
    } catch (err: any) {
      setError(err.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

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
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Order Management</h1>
        <p className="text-muted-foreground mt-2">View all rental orders across the platform.</p>
      </div>

      {error && (
        <div className="bg-red-500/10 text-red-500 p-4 rounded-lg flex items-center border border-red-500/20">
          <AlertCircle className="h-5 w-5 mr-2" />
          {error}
        </div>
      )}

      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        {orders.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground">
            <ClipboardList className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium text-foreground">No orders yet</h3>
            <p className="text-muted-foreground mt-2">There are currently no rental orders on the platform.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="font-semibold text-foreground">Order ID</TableHead>
                  <TableHead className="font-semibold text-foreground">Customer</TableHead>
                  <TableHead className="font-semibold text-foreground">Amount</TableHead>
                  <TableHead className="font-semibold text-foreground">Dates</TableHead>
                  <TableHead className="font-semibold text-foreground">Status</TableHead>
                  <TableHead className="font-semibold text-foreground">Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id} className="border-border hover:bg-muted/50 transition-colors">
                    <TableCell className="font-medium text-foreground">{order.id.substring(0, 8)}...</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="text-foreground">{order.customer?.name || "Unknown"}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-bold text-foreground">${order.totalAmount}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {format(new Date(order.startDate), "MMM d")} - {format(new Date(order.endDate), "MMM d")}
                    </TableCell>
                    <TableCell>
                      <Badge className={
                        order.status === "COMPLETED" ? "bg-green-500/10 text-green-600 hover:bg-green-500/20 border-transparent" :
                        order.status === "PENDING" ? "bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 border-transparent" :
                        order.status === "CONFIRMED" ? "bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 border-transparent" :
                        "bg-slate-500/10 text-slate-600 hover:bg-slate-500/20 border-transparent"
                      }>
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {format(new Date(order.createdAt), "MMM d, yyyy")}
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
