import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  imageUrl?: string;
  image?: string;
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
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* CUSTOM HOMEPAGE NAVBAR */}
      <header className="absolute top-0 left-0 right-0 z-50 bg-transparent">
        <div className="container mx-auto px-4 md:px-8 h-20 flex items-center justify-between">
          <Link href="/" className="text-3xl font-black text-orange-500 tracking-tight">
            GearUp
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/auth/login" className="text-sm font-bold text-slate-700 hover:text-orange-500 transition-colors">
              Log In
            </Link>
            <Button asChild className="rounded-full bg-slate-900 text-white hover:bg-slate-800 font-bold px-6">
              <Link href="/auth/register">Sign Up</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        {/* HERO SECTION */}
        <div className="relative overflow-hidden bg-white">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-white to-slate-50" />
          
          <div className="container mx-auto px-4 md:px-8 relative pt-20 pb-24 md:pt-32 md:pb-32">
            <div className="flex flex-col md:flex-row items-center justify-between gap-12 lg:gap-20">
              
              <div className="w-full md:w-1/2 space-y-8 z-10">
                
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">
                  Equip your <br className="hidden md:block"/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500">
                    next adventure.
                  </span>
                </h1>
                
                <p className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-lg">
                  Don't let expensive equipment hold you back. Rent premium outdoor gear from local adventurers, or list your own to earn extra cash.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Button size="lg" className="rounded-xl px-8 text-md h-14 bg-orange-500 hover:bg-orange-600 text-white font-bold shadow-lg shadow-orange-500/20 transition-all hover:-translate-y-1" asChild>
                    <Link href="/gear">Rent Gear Now</Link>
                  </Button>
                  <Button size="lg" variant="outline" className="rounded-xl px-8 text-md h-14 border-2 border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 font-bold transition-all hover:-translate-y-1" asChild>
                    <Link href="/auth/login">List Your Gear</Link>
                  </Button>
                </div>
              </div>

              <div className="w-full md:w-1/2 relative h-[400px] md:h-[600px] z-10">
                <div className="absolute inset-0 bg-gradient-to-tr from-orange-200 to-amber-100 rounded-[2.5rem] transform rotate-3 scale-105 opacity-50 blur-xl"></div>
                <div className="relative w-full h-full rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white">
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
              <h2 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900">Featured Equipment</h2>
              <p className="text-lg text-slate-500">Top-rated gear ready for your weekend getaway.</p>
            </div>
            <Button variant="ghost" className="hover:bg-orange-50 hover:text-orange-600 font-semibold" asChild>
              <Link href="/gear">View all inventory <ArrowRight className="w-4 h-4 ml-2" /></Link>
            </Button>
          </div>

          {featuredGear.length === 0 ? (
            <div className="text-center py-32 bg-slate-100/50 rounded-3xl border-2 border-dashed border-slate-200">
              <p className="text-lg text-slate-500 font-medium">Inventory loading or currently unavailable.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredGear.map((item) => (
                <Link key={item.id} href={`/gear/${item.id}`} className="group block h-full">
                  <Card className="overflow-hidden border border-slate-200 bg-white transition-all duration-300 hover:shadow-2xl hover:shadow-orange-500/10 hover:-translate-y-2 flex flex-col h-full rounded-2xl cursor-pointer">
                    
                    {/* Image Area */}
                    <div className="relative h-60 w-full bg-slate-100 overflow-hidden">
                       <div className="absolute top-4 left-4 z-10">
                        {item.isAvailable ? (
                          <Badge className="bg-white/90 text-slate-900 hover:bg-white backdrop-blur-md shadow-sm border-none font-bold px-3 py-1">Available</Badge>
                        ) : (
                          <Badge variant="destructive" className="font-bold shadow-sm px-3 py-1">Booked</Badge>
                        )}
                      </div>
                      <Image
                        src={item.imageUrl || item.image || `https://images.unsplash.com/photo-1673121414328-52eff37bc6d0?w=500&auto=format&fit=crop&q=60`} 
                        alt={item.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    </div>
                    
                    {/* Content Area */}
                    <CardContent className="p-6 flex-grow">
                      <p className="text-xs font-bold tracking-wider text-orange-500 uppercase mb-2">
                        {item.brand}
                      </p>
                      <h3 className="font-black text-xl text-slate-900 leading-tight line-clamp-2 mb-3 group-hover:text-orange-500 transition-colors">
                        {item.name}
                      </h3>
                      <p className="text-sm text-slate-500 line-clamp-2 mb-4 leading-relaxed">
                        {item.description}
                      </p>
                      
                      <div className="flex items-baseline gap-1 mt-auto pt-4 border-t border-slate-100">
                        <span className="text-3xl font-black text-slate-900">${item.price}</span>
                        <span className="text-sm font-medium text-slate-500">/ day</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </section>

      </main>
    </div>
  );
}