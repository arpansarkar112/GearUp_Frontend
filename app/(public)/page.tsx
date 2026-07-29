import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Gear {
  id: string;
  name: string;
  description: string;
  price: number;
  brand: string;
  stock: number;
  isAvailable: boolean;
  categoryId: string;
}

// Fetch gear data
async function getGear(): Promise<Gear[]> {
  try {
   
    const response = await fetch("https://gear-up-backend-pi.vercel.app/api/gear", {
      cache: "no-store", 
    });
    
    if (!response.ok) {
      console.error(" API Fetch Failed. Status:", response.status);
      return [];
    }
    
    const data = await response.json();
    
    console.log("RAW BACKEND RESPONSE:", JSON.stringify(data, null, 2));

  
    if (Array.isArray(data)) return data;
    if (data.data && Array.isArray(data.data)) return data.data;
    if (data.data && data.data.result && Array.isArray(data.data.result)) return data.data.result;
    if (data.result && Array.isArray(data.result)) return data.result;

    console.log(" Data fetched, but couldn't find an array inside it.");
    return [];
  } catch (error) {
    console.error(" Network or Parsing Error:", error);
    return [];
  }
}

export default async function HomePage() {
  const gearList = await getGear();
  const featuredGear = gearList.slice(0, 8);

  return (
    <div className="container mx-auto px-4 md:px-8">
      {/* HERO SECTION */}
      <div className="min-h-[80vh] flex items-center py-12 md:py-0">
        <Card className="border-none bg-transparent shadow-none w-full">
          <CardContent className="flex flex-col-reverse md:flex-row items-center justify-between p-0 gap-12">
            
            {/* Left Column: Text & CTA */}
            <div className="w-full md:w-1/2 space-y-6">
              <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-foreground leading-[1.1]">
                Gear Up for Your Next <span className="text-orange-500">Adventure</span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed max-w-lg">
                Find your ideal equipment for any outdoor journey with our diverse range of affordable, high-quality sports rentals.
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <Button size="lg" className="rounded-full px-8 text-md h-14" asChild>
                  <Link href="/gear">Rent Gear Now</Link>
                </Button>
                <Button size="lg" variant="outline" className="rounded-full px-8 text-md h-14 border-2" asChild>
                  <Link href="/auth/register">List Your Gear</Link>
                </Button>
              </div>
            </div>

            {/* Right Column: Image */}
            <div className="w-full md:w-1/2 flex justify-center md:justify-end relative h-[300px] md:h-[500px]">
              <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1594951478387-1628a69602a3?q=80&w=1331&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="Outdoor Sports Gear"
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </div>
            </div>
            
          </CardContent>
        </Card>
      </div>

      {/* FEATURED GEAR GRID*/}
      <section className="py-16 md:py-24">
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">Featured Equipment</h2>
            <p className="text-muted-foreground">Top-rated gear ready for your weekend getaway.</p>
          </div>
          <Button variant="ghost" className="hover:bg-transparent hover:text-orange-500" asChild>
            <Link href="/gear">View all inventory &rarr;</Link>
          </Button>
        </div>

        {featuredGear.length === 0 ? (
          <div className="text-center py-20 bg-muted/30 rounded-2xl border border-dashed">
            <p className="text-muted-foreground">Inventory loading or currently unavailable.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {featuredGear.map((item) => (
              <Card key={item.id} className="group overflow-hidden border bg-card transition-all hover:shadow-xl hover:-translate-y-1 flex flex-col">
                {/* Image Area */}
                <div className="relative h-56 w-full bg-muted overflow-hidden">
                   <div className="absolute top-3 left-3 z-10">
                    {item.isAvailable ? (
                      <Badge className="bg-white text-black hover:bg-gray-100 font-semibold shadow-sm">Available</Badge>
                    ) : (
                      <Badge variant="destructive" className="font-semibold shadow-sm">Booked</Badge>
                    )}
                  </div>
                  {/* Fallback image if backend doesn't provide one yet */}
                  <Image
                    src={`https://images.unsplash.com/photo-1673121414328-52eff37bc6d0?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8bW91bnRhaW4lMjBiaWtlc3xlbnwwfHwwfHx8MA%3D%3D`} 
                    alt={item.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                
                {/* Content Area */}
                <CardContent className="p-5 flex-grow">
                  <div className="flex justify-between items-start mb-2 gap-2">
                    <h3 className="font-bold text-lg line-clamp-1">{item.name}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                    {item.description}
                  </p>
                  <p className="text-sm font-medium text-orange-500 mb-2">
                    {item.brand}
                  </p>
                  <div className="flex items-baseline gap-1 mt-auto">
                    <span className="text-2xl font-black">${item.price}</span>
                    <span className="text-sm text-muted-foreground">/ day</span>
                  </div>
                </CardContent>
                
                {/* Action Area */}
                <CardFooter className="p-5 pt-0 mt-auto">
                  <Button 
                    className="w-full rounded-xl font-semibold" 
                    variant={item.isAvailable ? "default" : "secondary"}
                    disabled={!item.isAvailable}
                    asChild
                  >
                    <Link href={`/gear/${item.id}`}>
                      {item.isAvailable ? "View Details" : "Currently Unavailable"}
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}