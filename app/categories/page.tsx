import Link from "next/link";
import Image from "next/image";
import { fetchAllCategories, fetchAllGear } from "@/lib/api/gear";
import { UnifiedNavbar } from "@/components/layout/UnifiedNavbar";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

export const metadata = {
  title: "Categories | GearUp",
  description: "Browse outdoor gear by category.",
};

const defaultImage = "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&auto=format&fit=crop&q=60"; // fallback image

export default async function CategoriesPage() {
  let categories = [];
  let gearItems = [];
  try {
    const [catRes, gearRes] = await Promise.all([
      fetchAllCategories().catch(() => ({ data: [] })),
      fetchAllGear().catch(() => ({ data: [] }))
    ]);
    categories = catRes.data || [];
    gearItems = gearRes.data || [];
  } catch (error) {
    console.error("Failed to load categories or gear:", error);
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <UnifiedNavbar />

      <main className="flex-1 max-w-7xl w-full mx-auto p-6 lg:p-8 space-y-12">
        <div className="text-center sm:text-left space-y-4">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900">
            Explore Categories
          </h1>
          <p className="text-lg sm:text-xl text-slate-600 max-w-2xl font-medium">
            Find the perfect equipment for your specific outdoor adventure. From rugged mountains to serene lakes.
          </p>
        </div>

        {categories.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-slate-200">
            <h3 className="text-xl font-bold text-slate-700">No categories found.</h3>
            <p className="text-slate-500 mt-2">Please check back later.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {categories.map((cat: any) => {
              const imageUrl = cat.imageUrl || cat.image || defaultImage;
              
              const itemCount = gearItems.filter((g: any) => {
                const cName = typeof g.category === 'object' ? g.category?.name : g.category;
                return cName === cat.name || g.categoryId === cat.id;
              }).length;

              return (
                <Link key={cat.id} href={`/gear?category=${encodeURIComponent(cat.name)}`} className="group block h-full">
                  <Card className="relative overflow-hidden h-[300px] rounded-3xl border-none shadow-md transition-all duration-500 hover:shadow-2xl hover:-translate-y-2">
                    <Image 
                      src={imageUrl}
                      alt={cat.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent transition-opacity duration-500 group-hover:opacity-90" />
                    
                    <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 z-10 shadow-sm">
                      <span className="text-white text-xs font-bold tracking-wider uppercase">
                        {itemCount} {itemCount === 1 ? 'Item' : 'Items'}
                      </span>
                    </div>

                    <div className="absolute inset-0 p-8 flex flex-col justify-end">
                      <div className="flex items-end justify-between gap-4">
                        <div className="space-y-1">
                          <h2 className="text-2xl font-black text-white tracking-tight drop-shadow-md">
                            {cat.name}
                          </h2>
                          {cat.description && (
                            <p className="text-slate-300 text-sm font-medium line-clamp-2 drop-shadow-sm transition-all duration-300 group-hover:text-white">
                              {cat.description}
                            </p>
                          )}
                        </div>
                        <div className="h-10 w-10 shrink-0 rounded-full bg-orange-500 text-white flex items-center justify-center opacity-0 -translate-x-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 shadow-lg">
                          <ArrowRight className="h-5 w-5" />
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
