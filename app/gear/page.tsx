import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import { fetchAllGear, fetchAllReviews, fetchAllCategories } from "@/lib/api/gear";
import { UnifiedNavbar } from "@/components/layout/UnifiedNavbar";
import { GearFilters } from "@/components/pages/gear/GearFilters";

export const metadata = {
  title: "Browse Gear | GearUp",
  description: "Browse our extensive catalog of outdoor gear.",
};

export default async function GearCatalogPage(props: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = props.searchParams ? await props.searchParams : {};
  const categoryFilter = typeof searchParams.category === 'string' ? searchParams.category : null;
  const searchFilter = typeof searchParams.search === 'string' ? searchParams.search : null;
  const sortFilter = typeof searchParams.sort === 'string' ? searchParams.sort : "newest";

  let gearItems = [];
  let allReviews = [];
  let categories = [];
  try {
    const [gearResponse, reviewResponse, categoryResponse] = await Promise.all([
      fetchAllGear(),
      fetchAllReviews().catch(() => ({ data: [] })),
      fetchAllCategories().catch(() => ({ data: [] }))
    ]);
    gearItems = gearResponse.data || [];
    allReviews = reviewResponse.data || [];
    categories = categoryResponse.data || [];
  } catch (error) {
    console.error("Failed to load gear, reviews, or categories:", error);
  }

  // Pre-calculate ratings for sorting
  gearItems = gearItems.map((item: any) => {
    const itemReviews = allReviews.filter((r: any) => r.gearItemId === item.id || r.gearId === item.id);
    const averageRating = itemReviews.length > 0 
      ? itemReviews.reduce((sum: number, r: any) => sum + r.rating, 0) / itemReviews.length 
      : 0;
    return { ...item, averageRating, reviewCount: itemReviews.length };
  });

  let displayItems = gearItems;
  
  // Apply Category Filter
  if (categoryFilter) {
    displayItems = displayItems.filter((item: any) => {
      const catName = typeof item.category === 'object' ? item.category?.name : item.category;
      return catName?.toLowerCase() === categoryFilter.toLowerCase();
    });
  }

  // Apply Search Filter
  if (searchFilter) {
    const query = searchFilter.toLowerCase();
    displayItems = displayItems.filter((item: any) => 
      item.name.toLowerCase().includes(query) || 
      (item.description && item.description.toLowerCase().includes(query))
    );
  }

  // Apply Sort
  if (sortFilter === "price_asc") {
    displayItems.sort((a: any, b: any) => a.price - b.price);
  } else if (sortFilter === "price_desc") {
    displayItems.sort((a: any, b: any) => b.price - a.price);
  } else if (sortFilter === "rating_desc") {
    displayItems.sort((a: any, b: any) => b.averageRating - a.averageRating);
  } else {
    // newest
    displayItems.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  const getClearUrl = (keyToRemove: string) => {
    const params = new URLSearchParams();
    Object.entries(searchParams).forEach(([k, v]) => {
      if (typeof v === 'string' && k !== keyToRemove) params.set(k, v);
    });
    const qs = params.toString();
    return qs ? `/gear?${qs}` : `/gear`;
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <UnifiedNavbar />

      <main className="flex-1 max-w-7xl w-full mx-auto p-6 lg:p-8 space-y-8">
        <div className="text-center sm:text-left space-y-6">
          <div>
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-foreground">
              Available Gears
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mt-4">
              Find the perfect equipment for your next outdoor journey. From mountain bikes to camping tents, we've got you covered.
            </p>
          </div>

          {/* Category Filters */}
          <div className="flex items-center gap-3 overflow-x-auto pb-2 pt-2 no-scrollbar">
            <Link 
              href="/gear" 
              className={`whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-bold transition-all shadow-sm ${!categoryFilter ? 'bg-orange-500 text-white' : 'bg-card text-muted-foreground hover:bg-muted hover:text-foreground border border-border'}`}
            >
              All Gear
            </Link>
            {categories.map((cat: any) => {
              const isActive = categoryFilter?.toLowerCase() === cat.name.toLowerCase();
              return (
                <Link 
                  key={cat.id} 
                  href={`/gear?category=${encodeURIComponent(cat.name)}`}
                  className={`whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-bold transition-all shadow-sm ${isActive ? 'bg-orange-500 text-white' : 'bg-card text-muted-foreground hover:bg-muted hover:text-foreground border border-border'}`}
                >
                  {cat.name}
                </Link>
              );
            })}
          </div>

          {/* Search, Sort & Active Filter Tags Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-2 border-t border-border/80">
            <GearFilters />

            {/* Active Filters Display & Individual Clear Buttons */}
            {(searchFilter || categoryFilter || sortFilter !== "newest") && (
              <div className="flex items-center gap-2 flex-wrap">
                {categoryFilter && (
                  <Link href={getClearUrl("category")}>
                    <Badge className="bg-orange-100 text-orange-800 hover:bg-red-100 hover:text-red-700 border-none px-3 py-1.5 text-sm shadow-sm font-bold flex items-center gap-2 cursor-pointer transition-colors group">
                      <span><span className="text-orange-500/70 mr-1 group-hover:text-red-500/70 transition-colors">Category:</span> {categoryFilter}</span>
                      <span className="text-lg leading-none">&times;</span>
                    </Badge>
                  </Link>
                )}
                {searchFilter && (
                  <Link href={getClearUrl("search")}>
                    <Badge className="bg-orange-100 text-orange-800 hover:bg-red-100 hover:text-red-700 border-none px-3 py-1.5 text-sm shadow-sm font-bold flex items-center gap-2 cursor-pointer transition-colors group">
                      <span><span className="text-orange-500/70 mr-1 group-hover:text-red-500/70 transition-colors">Search:</span> {searchFilter}</span>
                      <span className="text-lg leading-none">&times;</span>
                    </Badge>
                  </Link>
                )}
                {sortFilter !== "newest" && (
                  <Link href={getClearUrl("sort")}>
                    <Badge className="bg-orange-100 text-orange-800 hover:bg-red-100 hover:text-red-700 border-none px-3 py-1.5 text-sm shadow-sm font-bold flex items-center gap-2 cursor-pointer transition-colors group">
                      <span><span className="text-orange-500/70 mr-1 group-hover:text-red-500/70 transition-colors">Sort:</span> {sortFilter === 'price_asc' ? 'Low to High' : sortFilter === 'price_desc' ? 'High to Low' : 'Highest Rated'}</span>
                      <span className="text-lg leading-none">&times;</span>
                    </Badge>
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>

        {displayItems.length === 0 ? (
          <div className="text-center py-20 bg-card rounded-2xl shadow-sm border border-border">
            <h3 className="text-xl font-bold text-foreground">No gear available at the moment.</h3>
            <p className="text-muted-foreground mt-2">Check back later for new arrivals.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayItems.map((item: any) => {
              const categoryName = typeof item.category === 'object' ? item.category?.name : item.category;
              return (
                <Link key={item.id} href={`/gear/${item.id}`} className="group block h-full">
                  <Card className="overflow-hidden border-none shadow-md hover:shadow-xl transition-all hover:-translate-y-1 bg-card flex flex-col h-full cursor-pointer">
                    <div className="aspect-[4/3] bg-muted relative group overflow-hidden">
                      <Image 
                        src={item.imageUrl || "https://images.unsplash.com/photo-1496150590317-f8d952453f93?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fGN5Y2xlfGVufDB8fDB8fHww?w=500&auto=format&fit=crop&q=60"} 
                        alt={item.name}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute top-3 right-3 flex gap-2 flex-wrap justify-end">
                        <Badge variant="secondary" className="bg-background/90 text-foreground backdrop-blur-sm shadow-sm font-bold border-none">
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
                        {item.reviewCount > 0 && (
                          <div className="flex items-center gap-1 text-sm font-semibold text-foreground">
                            <Star className="h-4 w-4 fill-orange-500 text-orange-500" />
                            {item.averageRating.toFixed(1)} <span className="text-muted-foreground font-normal">({item.reviewCount})</span>
                          </div>
                        )}
                      </div>
                      <h3 className="font-bold text-lg text-foreground leading-tight line-clamp-1 group-hover:text-orange-500 transition-colors">{item.name}</h3>
                    </CardHeader>
                    
                    <CardContent className="p-5 pt-0 text-muted-foreground flex-1">
                      <p className="text-sm line-clamp-2">
                        {item.description || "High-quality outdoor equipment ready for your adventure."}
                      </p>
                    </CardContent>
                    
                    <CardFooter className="p-5 pt-0 mt-auto">
                      <Button 
                        className="w-full font-semibold shadow-sm group-hover:bg-orange-600 transition-colors" 
                        variant={item.isAvailable ? "default" : "secondary"}
                        disabled={!item.isAvailable}
                      >
                        {item.isAvailable ? "View Details" : "Not Available"}
                      </Button>
                    </CardFooter>
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
