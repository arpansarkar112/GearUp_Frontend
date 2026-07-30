"use client";

import { useEffect, useState } from "react";
import { fetchAllCategories } from "@/lib/api/gear";
import { Button } from "@/components/ui/button";
import { Plus, AlertCircle, Loader2, Tags, Edit2 } from "lucide-react";
import { CategoryModal } from "@/components/pages/dashboard/CategoryModal";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any | null>(null);

  const loadCategories = async () => {
    try {
      const response = await fetchAllCategories();
      setCategories(response.data || []);
    } catch (err: any) {
      setError(err.message || "Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Category Management</h1>
          <p className="text-muted-foreground mt-2">Create and manage gear categories.</p>
        </div>
        <Button 
          className="bg-orange-600 hover:bg-orange-700 text-white w-full sm:w-auto shadow-sm"
          onClick={() => {
            setEditingCategory(null);
            setIsModalOpen(true);
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Category
        </Button>
      </div>

      {error && (
        <div className="bg-red-500/10 text-red-500 p-4 rounded-lg flex items-center border border-red-500/20">
          <AlertCircle className="h-5 w-5 mr-2" />
          {error}
        </div>
      )}

      {categories.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 bg-card border border-border border-dashed rounded-lg">
          <Tags className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium text-foreground">No categories yet</h3>
          <p className="text-muted-foreground mt-2">Create your first category to organize gear.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <div key={cat.id} className="group relative bg-card border border-border rounded-xl overflow-hidden hover:shadow-md transition-shadow flex flex-col">
              <div className="aspect-[4/3] bg-muted overflow-hidden relative">
                <img 
                  src={cat.image || "https://images.unsplash.com/photo-1521336575822-6da63fb45455?w=500&auto=format&fit=crop&q=60"} 
                  alt={cat.name} 
                  className="w-full h-full object-cover transition-transform group-hover:scale-105" 
                />
              </div>
              <div className="p-4 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-2">
                  <div className="pr-2">
                    <h3 className="font-bold text-lg text-foreground truncate">{cat.name}</h3>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-muted-foreground hover:text-blue-500 hover:bg-blue-500/10"
                      onClick={() => {
                        setEditingCategory(cat);
                        setIsModalOpen(true);
                      }}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">{cat.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <CategoryModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={loadCategories}
        category={editingCategory}
      />
    </div>
  );
}
