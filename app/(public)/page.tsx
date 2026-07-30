import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ShieldCheck, Zap, HandCoins, ArrowRight } from "lucide-react";

interface Gear {
  id: string;
  name: string;
  description: string;
  price: number;
  brand: string;
  stock: number;
  isAvailable: boolean;
  categoryId: string;
  category?: { name: string };
  imageUrl?: string;
  image?: string;
  reviews?: { rating: number }[];
}

// Fetch gear data
async function getGear(): Promise<Gear[]> {
  try {
    const response = await fetch("https://gear-up-backend-pi.vercel.app/api/gear", {
      cache: "no-store", 
    });
    
    if (!response.ok) return [];
    
    const data = await response.json();
  
    if (Array.isArray(data)) return data;
    if (data.data && Array.isArray(data.data)) return data.data;
    if (data.data && data.data.result && Array.isArray(data.data.result)) return data.data.result;
    if (data.result && Array.isArray(data.result)) return data.result;

    return [];
  } catch (error) {
    return [];
  }
}

export default async function HomePage() {
  const gearList = await getGear();
  const featuredGear = gearList.slice(0, 8);

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      {/* CUSTOM HOMEPAGE NAVBAR */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border shadow-sm">
        <div className="container mx-auto px-4 md:px-8 h-20 flex items-center justify-between">
          <Link href="/" className="text-3xl font-black text-orange-500 tracking-tight">
            GearUp
          </Link>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link href="/auth/login" className="text-sm font-bold text-foreground hover:text-orange-500 transition-colors">
              Log In
            </Link>
            <Button asChild className="rounded-full bg-foreground text-background hover:bg-foreground/90 font-bold px-6">
              <Link href="/auth/register">Sign Up</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        {/* HERO SECTION */}
        <div className="relative overflow-hidden bg-background">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-background to-muted/30" />
          
          <div className="container mx-auto px-4 md:px-8 relative pt-20 pb-24 md:pt-32 md:pb-32">
            <div className="flex flex-col md:flex-row items-center justify-between gap-12 lg:gap-20">
              
              <div className="w-full md:w-1/2 space-y-8 z-10">
                
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground leading-[1.1]">
                  Equip your <br className="hidden md:block"/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500">
                    next adventure.
                  </span>
                </h1>
                
                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-lg">
                  Don't let expensive equipment hold you back. Rent premium outdoor gear from local adventurers, or list your own to earn extra cash.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Button size="lg" className="rounded-xl px-8 text-md h-14 bg-orange-500 hover:bg-orange-600 text-white font-bold shadow-lg shadow-orange-500/20 transition-all hover:-translate-y-1" asChild>
                    <Link href="/gear">Rent Gear Now</Link>
                  </Button>
                  <Button size="lg" variant="outline" className="rounded-xl px-8 text-md h-14 border-2 border-border text-foreground hover:bg-muted font-bold transition-all hover:-translate-y-1" asChild>
                    <Link href="/auth/login">List Your Gear</Link>
                  </Button>
                </div>
              </div>

              <div className="w-full md:w-1/2 relative h-[400px] md:h-[600px] z-10">
                <div className="absolute inset-0 bg-gradient-to-tr from-orange-200 to-amber-100 rounded-[2.5rem] transform rotate-3 opacity-30 blur-lg"></div>
                <div className="relative w-full h-full rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-border">
                  <Image
                    src="https://images.unsplash.com/photo-1594951478387-1628a69602a3?q=80&w=1331&auto=format&fit=crop&ixlib=rb-4.1.0"
                    alt="Outdoor Sports Gear"
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent" />
                </div>
              </div>
              
            </div>
          </div>
        </div>



        {/* FEATURED GEAR GRID */}
        <section className="py-24 container mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
            <div className="space-y-2">
              <h2 className="text-3xl md:text-4xl font-black tracking-tight text-foreground">Featured Equipment</h2>
              <p className="text-lg text-muted-foreground">Top-rated gear ready for your weekend getaway.</p>
            </div>
            <Button variant="ghost" className="hover:bg-orange-500/10 hover:text-orange-600 font-semibold" asChild>
              <Link href="/gear">View all inventory <ArrowRight className="w-4 h-4 ml-2" /></Link>
            </Button>
          </div>

          {featuredGear.length === 0 ? (
            <div className="text-center py-32 bg-muted/50 rounded-3xl border-2 border-dashed border-border">
              <p className="text-lg text-muted-foreground font-medium">Inventory loading or currently unavailable.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredGear.map((item) => (
                <div key={item.id} className="group block h-full">
                  <Card className="overflow-hidden border border-border bg-card transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col h-full rounded-2xl cursor-pointer">
                    
                    {/* Image Area */}
                    <div className="relative h-56 w-full bg-muted overflow-hidden">
                      {/* Price Badge */}
                      <div className="absolute top-3 right-3 z-10">
                        <Badge className="bg-background/90 backdrop-blur-sm text-foreground hover:bg-background shadow-sm border border-border font-bold px-3 py-1.5 rounded-full text-sm">
                          ${item.price}/day
                        </Badge>
                      </div>
                      
                      <Image
                        src={item.imageUrl || item.image || `https://images.unsplash.com/photo-1673121414328-52eff37bc6d0?w=500&auto=format&fit=crop&q=60`} 
                        alt={item.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                    
                    {/* Content Area */}
                    <CardContent className="p-5 flex-grow flex flex-col">
                      <div className="flex justify-between items-center mb-2">
                        {/* Category */}
                        <p className="text-xs font-bold tracking-wider text-orange-500 uppercase">
                          {item.category?.name || "VEHICLES"}
                        </p>
                        
                        {/* Reviews */}
                        <div className="flex items-center gap-1">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-orange-500">
                            <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                          </svg>
                          <span className="text-sm font-bold text-foreground">
                            {item.reviews && item.reviews.length > 0 
                              ? (item.reviews.reduce((acc, curr) => acc + curr.rating, 0) / item.reviews.length).toFixed(1) 
                              : "0.0"}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            ({item.reviews ? item.reviews.length : 0})
                          </span>
                        </div>
                      </div>
                      
                      {/* Title */}
                      <h3 className="font-bold text-lg text-black dark:text-white leading-tight line-clamp-1 mb-2">
                        {item.name}
                      </h3>
                      
                      {/* Description */}
                      <p className="text-sm text-muted-foreground line-clamp-1 mb-4">
                        {item.description}
                      </p>
                      
                      {/* View Details Button */}
                      <div className="mt-auto pt-2">
                        <Button className="w-full bg-[#8b4513] hover:bg-[#6b340e] dark:bg-orange-600 dark:hover:bg-orange-700 text-white font-bold rounded-lg h-11" asChild>
                          <Link href={`/gear/${item.id}`}>View Details</Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          )}
        </section>

      </main>
    </div>
  );
}