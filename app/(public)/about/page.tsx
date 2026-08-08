import { UnifiedNavbar } from "@/components/layout/UnifiedNavbar";
import Image from "next/image";

export const metadata = {
  title: "About Us | GearUp",
  description: "Learn more about the GearUp platform and our mission.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <UnifiedNavbar />
      
      <main className="flex-grow">
        {/* Hero */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4 text-center max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-black mb-6 text-foreground">About GearUp</h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              We are on a mission to make outdoor adventures accessible to everyone by creating the world's most trusted peer-to-peer gear rental marketplace.
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
              <div className="relative aspect-square rounded-3xl overflow-hidden shadow-xl border border-border">
                <Image 
                  src="https://images.unsplash.com/photo-1537225228614-56cc3556d7ed?q=80&w=1000&auto=format&fit=crop"
                  alt="Our Story"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-foreground">Our Story</h2>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Founded by outdoor enthusiasts, GearUp was born out of a simple realization: high-quality outdoor gear is expensive, and most of it sits in closets 90% of the year. 
                </p>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  We wanted to create a platform where people could share their unused equipment, make some extra money, and help others experience the great outdoors without breaking the bank.
                </p>
              </div>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 text-center mb-16">
              <div className="p-8 bg-card rounded-3xl shadow-sm border border-border">
                <h3 className="text-xl font-bold text-orange-500 mb-3">Sustainability</h3>
                <p className="text-muted-foreground">Renting gear reduces production waste and encourages a circular economy for outdoor equipment.</p>
              </div>
              <div className="p-8 bg-card rounded-3xl shadow-sm border border-border">
                <h3 className="text-xl font-bold text-orange-500 mb-3">Community</h3>
                <p className="text-muted-foreground">We connect local enthusiasts, fostering a community built on trust and shared passions.</p>
              </div>
              <div className="p-8 bg-card rounded-3xl shadow-sm border border-border">
                <h3 className="text-xl font-bold text-orange-500 mb-3">Accessibility</h3>
                <p className="text-muted-foreground">By lowering the cost barrier, we empower more people to explore nature safely.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
