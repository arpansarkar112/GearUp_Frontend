import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import { fetchAllGear, fetchAllReviews } from "@/lib/api/gear";
import { UnifiedNavbar } from "@/components/layout/UnifiedNavbar";

export const metadata = {
  title: "Browse Gear | GearUp",
  description: "Browse our extensive catalog of outdoor gear.",
};

export default async function GearCatalogPage() {
  let gearItems = [];
  let allReviews = [];
  try {
    const [gearResponse, reviewResponse] = await Promise.all([
      fetchAllGear(),
      fetchAllReviews().catch(() => ({ data: [] }))
    ]);
    gearItems = gearResponse.data || [];
    allReviews = reviewResponse.data || [];
  } catch (error) {
    console.error("Failed to load gear or reviews:", error);
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <UnifiedNavbar />

      <main className="flex-1 max-w-7xl w-full mx-auto p-6 lg:p-8 space-y-8">
        <div className="text-center sm:text-left space-y-4">
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-800">
            Available Gears
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl">
            Find the perfect equipment for your next outdoor journey. From mountain bikes to camping tents, we've got you covered.
          </p>
        </div>

        {gearItems.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm border">
            <h3 className="text-xl font-bold text-slate-700">No gear available at the moment.</h3>
            <p className="text-slate-500 mt-2">Check back later for new arrivals.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {gearItems.map((item: any) => {
              const categoryName = typeof item.category === 'object' ? item.category?.name : item.category;
              const itemReviews = allReviews.filter((r: any) => r.gearItemId === item.id || r.gearId === item.id);
              const averageRating = itemReviews.length > 0 
                ? itemReviews.reduce((sum: number, r: any) => sum + r.rating, 0) / itemReviews.length 
                : 0;
              return (
              <Card key={item.id} className="overflow-hidden border-none shadow-md hover:shadow-xl transition-all hover:-translate-y-1 bg-white flex flex-col h-full">
                <div className="aspect-[4/3] bg-slate-100 relative group overflow-hidden">
                  <Image 
                    src={item.imageUrl || "https://images.unsplash.com/photo-1496150590317-f8d952453f93?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fGN5Y2xlfGVufDB8fDB8fHww?w=500&auto=format&fit=crop&q=60"} 
                    alt={item.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute top-3 right-3 flex gap-2 flex-wrap justify-end">
                    <Badge variant="secondary" className="bg-white/90 text-slate-800 backdrop-blur-sm shadow-sm font-bold border-none">
                      ${item.price}/day
                    </Badge>
                  </div>
                  {!item.isAvailable && (
                     <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-[2px]">
                       <Badge variant="destructive" className="font-bold uppercase tracking-widest px-3 py-1">Unavailable</Badge>
                     </div>
                  )}
                </div>
                
                <CardHeader className="p-5 pb-2">
                  <div className="flex justify-between items-start mb-1">
                    <div className="text-xs font-bold text-orange-500 uppercase tracking-wider">{categoryName || "Gear"}</div>
                    {itemReviews.length > 0 && (
                      <div className="flex items-center gap-1 text-sm font-semibold text-slate-700">
                        <Star className="h-4 w-4 fill-orange-500 text-orange-500" />
                        {averageRating.toFixed(1)} <span className="text-slate-400 font-normal">({itemReviews.length})</span>
                      </div>
                    )}
                  </div>
                  <h3 className="font-bold text-lg text-slate-800 leading-tight line-clamp-1">{item.name}</h3>
                </CardHeader>
                
                <CardContent className="p-5 pt-0 text-slate-500 flex-1">
                  <p className="text-sm line-clamp-2">
                    {item.description || "High-quality outdoor equipment ready for your adventure."}
                  </p>
                </CardContent>
                
                <CardFooter className="p-5 pt-0 mt-auto">
                  <Button 
                    className="w-full font-semibold shadow-sm" 
                    variant={item.isAvailable ? "default" : "secondary"}
                    disabled={!item.isAvailable}
                    asChild={item.isAvailable}
                  >
                    {item.isAvailable ? (
                      <Link href={`/gear/${item.id}`}>View Details</Link>
                    ) : (
                      "Not Available"
                    )}
                  </Button>
                </CardFooter>
              </Card>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
