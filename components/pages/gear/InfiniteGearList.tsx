"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface InfiniteGearListProps {
  items: any[];
}

export function InfiniteGearList({ items }: InfiniteGearListProps) {
  const [visibleCount, setVisibleCount] = useState(8);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadingRef = useRef<HTMLDivElement>(null);

  const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
    const target = entries[0];
    if (target.isIntersecting && visibleCount < items.length) {
      // Small timeout to show loading animation naturally
      setTimeout(() => {
        setVisibleCount((prev) => Math.min(prev + 8, items.length));
      }, 500);
    }
  }, [visibleCount, items.length]);

  useEffect(() => {
    const option = {
      root: null,
      rootMargin: "20px",
      threshold: 0
    };
    
    observerRef.current = new IntersectionObserver(handleObserver, option);
    if (loadingRef.current) {
      observerRef.current.observe(loadingRef.current);
    }
    
    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, [handleObserver]);

  // Reset when items change (e.g. filters applied)
  useEffect(() => {
    setVisibleCount(8);
  }, [items]);

  const visibleItems = items.slice(0, visibleCount);

  if (items.length === 0) {
    return (
      <div className="text-center py-20 bg-card rounded-2xl shadow-sm border border-border">
        <h3 className="text-xl font-bold text-foreground">No gear available at the moment.</h3>
        <p className="text-muted-foreground mt-2">Check back later for new arrivals.</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {visibleItems.map((item: any) => {
          const categoryName = typeof item.category === 'object' ? item.category?.name : item.category;
          return (
            <Link key={item.id} href={`/gear/${item.id}`} className="group block h-full">
              <Card className="overflow-hidden border-none shadow-md hover:shadow-xl transition-all hover:-translate-y-1 bg-card flex flex-col h-full cursor-pointer">
                <div className="aspect-[4/3] bg-muted relative group overflow-hidden">
                  <Image 
                    src={item.imageUrl || item.image || "https://images.unsplash.com/photo-1496150590317-f8d952453f93?w=600&auto=format&fit=crop&q=60"} 
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
      
      {/* Loading Trigger Element */}
      {visibleCount < items.length && (
        <div ref={loadingRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
          {[...Array(4)].map((_, i) => (
            <div key={`loading-${i}`} className="flex flex-col h-full overflow-hidden border-none shadow-md rounded-xl bg-card">
              <Skeleton className="aspect-[4/3] w-full rounded-none" />
              <div className="p-5 pb-2 flex-1 flex flex-col gap-3">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-10 w-full mt-auto" />
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
