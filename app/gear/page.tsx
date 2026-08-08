import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import { fetchAllGear, fetchAllReviews, fetchAllCategories } from "@/lib/api/gear";
import { UnifiedNavbar } from "@/components/layout/UnifiedNavbar";
import { GearFilters } from "@/components/pages/gear/GearFilters";
import { InfiniteGearList } from "@/components/pages/gear/InfiniteGearList";

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

        <InfiniteGearList items={displayItems} />
      </main>
    </div>
  );
}
