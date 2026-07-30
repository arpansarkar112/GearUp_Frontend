"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchProviderGear, deleteProviderGear } from "@/lib/api/provider";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { Plus, AlertCircle, Edit2, PackageOpen, Trash2, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { GearModal } from "@/components/pages/dashboard/GearModal";

export default function ProviderGearPage() {
  const [gear, setGear] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGearId, setEditingGearId] = useState<string | null>(null);

  const loadGear = async () => {
    try {
      const response = await fetchProviderGear();
      setGear(response.data || []);
    } catch (err: any) {
      setError(err.message || "Failed to load gear inventory");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGear();
  }, []);

  const handleDelete = async (gearId: string) => {
    if (!window.confirm("Are you sure you want to delete this gear? This action cannot be undone.")) {
      return;
    }

    setIsDeletingId(gearId);
    try {
      await deleteProviderGear(gearId);
      setGear((prev) => prev.filter((item) => item.id !== gearId));
      toast.add({
        title: "Success",
        description: "Gear deleted successfully.",
        type: "success",
      });
    } catch (err: any) {
      toast.add({
        title: "Error",
        description: err.message || "Failed to delete gear.",
        type: "error",
      });
    } finally {
      setIsDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Inventory Management</h1>
          <p className="text-slate-500 mt-2">Manage your gear listings, pricing, and availability.</p>
        </div>
        <Button 
          className="bg-orange-600 hover:bg-orange-700 text-white w-full sm:w-auto"
          onClick={() => { setEditingGearId(null); setIsModalOpen(true); }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add New Gear
        </Button>
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
      ) : gear.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 bg-card border border-border border-dashed rounded-lg">
          <PackageOpen className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium text-foreground">No gear listed yet</h3>
          <p className="text-muted-foreground mb-4">Start earning by listing your first item.</p>
          <Button 
            variant="outline" 
            className="border-orange-500/20 text-orange-500 hover:bg-orange-500/10"
            onClick={() => { setEditingGearId(null); setIsModalOpen(true); }}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Gear
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {gear.map((item) => (
            <div key={item.id} className="group relative bg-card border border-border rounded-xl overflow-hidden hover:shadow-md transition-shadow">
              <div className="aspect-[4/3] bg-muted overflow-hidden relative">
                <img src={item.imageUrl || item.image || "https://images.unsplash.com/photo-1521336575822-6da63fb45455?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGFkdmVudHVyZXxlbnwwfHwwfHx8MA%3D%3D"} alt={item.name} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                <div className="absolute top-3 right-3 flex gap-2">
                  <Badge className={item.isAvailable ? "bg-green-100 text-green-700 hover:bg-green-100" : "bg-muted text-muted-foreground hover:bg-muted"}>
                    {item.isAvailable ? "Available" : "Unavailable"}
                  </Badge>
                </div>
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-foreground truncate">{item.name}</h3>
                    <p className="text-sm text-muted-foreground">{item.category?.name || item.category}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-slate-400 hover:text-blue-500 hover:bg-blue-50"
                      onClick={() => { setEditingGearId(item.id); setIsModalOpen(true); }}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleDelete(item.id)}
                      disabled={isDeletingId === item.id}
                      className="h-8 w-8 text-slate-400 hover:text-red-500 hover:bg-red-50"
                    >
                      {isDeletingId === item.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className="font-bold text-lg text-foreground">${item.pricePerDay || item.price}<span className="text-sm font-normal text-muted-foreground">/day</span></span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <GearModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        gearId={editingGearId}
        onSuccess={loadGear}
      />
    </div>
  );
}
