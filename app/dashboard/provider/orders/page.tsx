"use client";

import { useEffect, useState } from "react";
import { fetchProviderOrders, updateOrderStatus } from "@/lib/api/provider";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, AlertCircle } from "lucide-react";

type Order = {
  id: string;
  orderItems: { gearItem: { name: string; imageUrl?: string } }[];
  customer: { name: string; email: string };
  startDate: string;
  endDate: string;
  totalAmount?: number;
  totalPrice?: number;
  status: "PENDING" | "CONFIRMED" | "PAID" | "PICKED_UP" | "RETURNED" | "CANCELLED";
  paymentStatus?: "PENDING" | "COMPLETED" | "FAILED";
  createdAt: string;
};

export default function ProviderOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    async function loadOrders() {
      try {
        const response = await fetchProviderOrders();
        setOrders(response.data || []);
      } catch (err: any) {
        setError(err.message || "Failed to load orders");
      } finally {
        setLoading(false);
      }
    }
    loadOrders();
  }, []);

  const handleStatusUpdate = async (orderId: string, newStatus: Order["status"]) => {
    setUpdatingId(orderId);
    
  
    const previousOrders = [...orders];
    
 
    setOrders((prev) => 
      prev.map((order) => 
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );

  
    try {
      await updateOrderStatus(orderId, newStatus);
      toast.add({
        title: "Order Updated",
        description: `Order has been marked as ${newStatus.replace("_", " ")}.`,
        type: "success",
      });
    } catch (err: any) {
     
      setOrders(previousOrders);
      toast.add({
        title: "Update Failed",
        description: err.message || "Could not update order status.",
        type: "error",
      });
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusBadge = (status: Order["status"]) => {
    switch (status) {
      case "PENDING": return <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-none">PENDING</Badge>;
      case "CONFIRMED": return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-none">CONFIRMED</Badge>;
      case "PAID": return <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100 border-none">PAID</Badge>;
      case "PICKED_UP": return <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none">PICKED UP</Badge>;
      case "RETURNED": return <Badge className="bg-slate-100 text-slate-700 hover:bg-slate-100 border-none">RETURNED</Badge>;
      case "CANCELLED": return <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-none">CANCELLED</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPaymentBadge = (status: Order["paymentStatus"]) => {
    switch (status) {
      case "COMPLETED": return <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none">COMPLETED</Badge>;
      case "FAILED": return <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-none">FAILED</Badge>;
      case "PENDING":
      default: return <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-none">PENDING</Badge>;
    }
  };

  const renderActionButtons = (order: Order) => {
    const isUpdating = updatingId === order.id;

    if (order.status === "PENDING") {
      return (
        <Button 
          size="sm" 
          className="bg-blue-600 hover:bg-blue-700 text-white w-full"
          disabled={isUpdating}
          onClick={() => handleStatusUpdate(order.id, "CONFIRMED")}
        >
          {isUpdating ? <Loader2 className="h-3 w-3 animate-spin mr-2" /> : null}
          Confirm Order
        </Button>
      );
    }
    
    if (order.status === "PAID" || (order.status === "CONFIRMED" && order.paymentStatus === "COMPLETED")) {
      return (
        <Button 
          size="sm" 
          className="bg-green-600 hover:bg-green-700 text-white w-full"
          disabled={isUpdating}
          onClick={() => handleStatusUpdate(order.id, "PICKED_UP")}
        >
          {isUpdating ? <Loader2 className="h-3 w-3 animate-spin mr-2" /> : null}
          Mark Picked Up
        </Button>
      );
    }

    if (order.status === "CONFIRMED" && order.paymentStatus !== "COMPLETED") {
      return <div className="text-sm text-slate-400 text-center italic">Waiting for Payment</div>;
    }
    
    if (order.status === "PICKED_UP") {
      return (
        <Button 
          size="sm" 
          variant="outline" 
          className="border-slate-300 w-full hover:bg-slate-50"
          disabled={isUpdating}
          onClick={() => handleStatusUpdate(order.id, "RETURNED")}
        >
          {isUpdating ? <Loader2 className="h-3 w-3 animate-spin mr-2" /> : null}
          Mark Returned
        </Button>
      );
    }

    return <div className="text-sm text-slate-400 text-center italic">No action needed</div>;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Order Management</h1>
        <p className="text-slate-500 mt-2">View and update the status of incoming gear rentals.</p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-center">
          <AlertCircle className="h-5 w-5 mr-2" />
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-orange-500"></div>
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-12 text-center">
          <h3 className="text-lg font-medium text-slate-900">No orders yet</h3>
          <p className="text-slate-500 mt-2">When customers rent your gear, they will appear here.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead className="font-semibold text-slate-900">Item</TableHead>
                  <TableHead className="font-semibold text-slate-900">Customer</TableHead>
                  <TableHead className="font-semibold text-slate-900">Dates</TableHead>
                  <TableHead className="font-semibold text-slate-900 text-right">Total</TableHead>
                  <TableHead className="font-semibold text-slate-900 text-center">Status</TableHead>
                  <TableHead className="font-semibold text-slate-900 text-center">Payment</TableHead>
                  <TableHead className="font-semibold text-slate-900 text-center">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id} className="hover:bg-slate-50/50 transition-colors">
                    <TableCell className="font-medium text-slate-900 max-w-[200px]">
                      <div className="truncate" title={order.orderItems?.map(item => item.gearItem?.name).join(", ")}>
                        {order.orderItems?.map(item => item.gearItem?.name).join(", ") || "Unknown Item"}
                      </div>
                      <div className="text-xs font-normal text-slate-400 mt-0.5">ID: {order.id?.slice(-6) || "N/A"}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm font-medium text-slate-900">{order.customer?.name || "Unknown"}</div>
                      <div className="text-xs text-slate-500">{order.customer?.email}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-slate-700">{format(new Date(order.startDate), "MMM d, yyyy")}</div>
                      <div className="text-xs text-slate-500">to {format(new Date(order.endDate), "MMM d, yyyy")}</div>
                    </TableCell>
                    <TableCell className="text-right font-semibold text-slate-900">
                      ${order.totalAmount || order.totalPrice}
                    </TableCell>
                    <TableCell className="text-center">
                      {getStatusBadge(order.status)}
                    </TableCell>
                    <TableCell className="text-center">
                      {getPaymentBadge(order.paymentStatus)}
                    </TableCell>
                    <TableCell className="w-[160px]">
                      {renderActionButtons(order)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  );
}
