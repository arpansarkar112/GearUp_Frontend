"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";
import { useState, useEffect, useRef } from "react";

export function GearFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const currentSearch = searchParams?.get("search") || "";
  const currentSort = searchParams?.get("sort") || "newest";
  const currentCategory = searchParams?.get("category") || "";

  const [searchTerm, setSearchTerm] = useState(currentSearch);
  const isTyping = useRef(false);

  // Sync from URL to local state (for when user clears filters externally via the 'x' button)
  useEffect(() => {
    if (!isTyping.current) {
      setSearchTerm(currentSearch);
    }
  }, [currentSearch]);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      isTyping.current = false;
      if (searchTerm !== currentSearch) {
        updateFilters({ search: searchTerm });
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm, currentSearch]);

  const handleSearchChange = (val: string) => {
    isTyping.current = true;
    setSearchTerm(val);
  };

  const updateFilters = (updates: { search?: string | null; sort?: string | null }) => {
    const params = new URLSearchParams(searchParams?.toString() || "");
    
    if (updates.search !== undefined) {
      if (updates.search) params.set("search", updates.search);
      else params.delete("search");
    }
    
    if (updates.sort !== undefined) {
      if (updates.sort && updates.sort !== "newest") params.set("sort", updates.sort);
      else params.delete("sort");
    }
    
    router.push(`/gear?${params.toString()}`);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mt-4 sm:mt-0">
      <div className="relative w-full sm:w-64">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400">
          <Search className="h-4 w-4" />
        </div>
        <Input 
          type="text" 
          placeholder="Search gear..." 
          className="pl-9 bg-white border-slate-200 focus-visible:ring-orange-500 rounded-full"
          value={searchTerm}
          onChange={(e) => handleSearchChange(e.target.value)}
        />
      </div>
      
      <div className="w-full sm:w-48">
        <Select 
          value={currentSort} 
          onValueChange={(val) => updateFilters({ sort: val })}
        >
          <SelectTrigger className="bg-white border-slate-200 focus:ring-orange-500 rounded-full">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest Arrivals</SelectItem>
            <SelectItem value="price_asc">Price: Low to High</SelectItem>
            <SelectItem value="price_desc">Price: High to Low</SelectItem>
            <SelectItem value="rating_desc">Highest Rated</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
