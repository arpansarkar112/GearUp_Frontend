"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CheckCircle2, ShieldCheck, MapPin, Search, Calendar, Star, Users, Backpack, ArrowRight, Activity, Mail, Tags } from "lucide-react";

export function NewsletterSection() {
  return (
    <section className="py-24 bg-card border-y border-border">
      <div className="container mx-auto px-4 md:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-black mb-4 tracking-tight">Stay in the loop</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter for the latest gear releases, exclusive discounts, and adventure tips straight to your inbox.
          </p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" onSubmit={(e) => { e.preventDefault(); alert('Subscribed successfully!'); }}>
            <input 
              type="email" 
              placeholder="Enter your email" 
              required 
              className="flex-1 h-12 rounded-xl px-4 border border-input bg-background focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <Button type="submit" className="h-12 px-8 font-bold rounded-xl">
              Subscribe
            </Button>
          </form>
          <p className="text-xs text-muted-foreground mt-4">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>
      </div>
    </section>
  );
}

export function HowItWorksSection() {
  const [activeJourney, setActiveJourney] = useState<"customer" | "provider">("customer");

  return (
    <section className="py-24 bg-muted/30 overflow-hidden">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row items-center md:items-end justify-between mb-20 gap-8">
          <div className="text-center md:text-left max-w-xl">
            <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-4 text-foreground">How GearUp Works</h2>
            <p className="text-muted-foreground text-lg">
              Whether you want to rent gear for your next adventure or earn money by listing your own, the process is simple and secure.
            </p>
          </div>
          
          <div className="flex items-center bg-muted/80 p-1.5 rounded-full border border-border shadow-sm">
            <button
              onClick={() => setActiveJourney("customer")}
              className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all ${
                activeJourney === "customer" 
                  ? "bg-background text-foreground shadow-sm" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Renter Journey
            </button>
            <button
              onClick={() => setActiveJourney("provider")}
              className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all ${
                activeJourney === "provider" 
                  ? "bg-background text-foreground shadow-sm" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Provider Journey
            </button>
          </div>
        </div>
        
        <div className="relative max-w-5xl mx-auto">
          {activeJourney === "customer" ? (
            <>
              {/* Step 1 Customer */}
              <div className="relative flex justify-start mb-24 group">
                <div className="w-full md:w-[45%] relative z-10">
                  <Card className="bg-card p-8 rounded-3xl shadow-lg border border-border/60 hover:shadow-xl transition-all duration-300">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="px-3 py-1.5 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 font-black text-sm rounded-lg border border-blue-200 dark:border-blue-800 tracking-wide shadow-sm">
                        Step 01
                      </div>
                      <div className="w-12 h-12 bg-card rounded-xl shadow-sm border border-border flex items-center justify-center">
                        <Search className="w-6 h-6 text-blue-500" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-black mb-4 text-foreground tracking-tight">Find Your Perfect Gear</h3>
                    <ul className="space-y-3 text-muted-foreground font-medium">
                      <li className="flex items-start gap-3">
                        <div className="mt-2 w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                        Browse thousands of outdoor items near you
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="mt-2 w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                        Filter by category, price, and availability dates
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="mt-2 w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                        Compare gear condition and read community reviews
                      </li>
                    </ul>
                  </Card>
                </div>
                {/* Line 1 -> 2 */}
                <div className="hidden md:block absolute top-[50%] left-[45%] w-[32.5%] h-[calc(100%+96px)] border-t-4 border-r-4 border-dashed border-blue-400/40 rounded-tr-[3rem] z-0"></div>
              </div>

              {/* Step 2 Customer */}
              <div className="relative flex justify-end mb-24 group">
                <div className="w-full md:w-[45%] relative z-10">
                  <Card className="bg-card p-8 rounded-3xl shadow-lg border border-border/60 hover:shadow-xl transition-all duration-300">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="px-3 py-1.5 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 font-black text-sm rounded-lg border border-emerald-200 dark:border-emerald-800 tracking-wide shadow-sm">
                        Step 02
                      </div>
                      <div className="w-12 h-12 bg-card rounded-xl shadow-sm border border-border flex items-center justify-center">
                        <ShieldCheck className="w-6 h-6 text-emerald-500" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-black mb-4 text-foreground tracking-tight">Book & Pay Securely</h3>
                    <ul className="space-y-3 text-muted-foreground font-medium">
                      <li className="flex items-start gap-3">
                        <div className="mt-2 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                        Request to book with a single click
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="mt-2 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                        Secure payment processing via platform
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="mt-2 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                        Deposits are safely held until safe return
                      </li>
                    </ul>
                  </Card>
                </div>
                {/* Line 2 -> 3 */}
                <div className="hidden md:block absolute top-[50%] right-[45%] w-[32.5%] h-[calc(100%+96px)] border-t-4 border-l-4 border-dashed border-emerald-400/40 rounded-tl-[3rem] z-0"></div>
              </div>

              {/* Step 3 Customer */}
              <div className="relative flex justify-start group">
                <div className="w-full md:w-[45%] relative z-10">
                  <Card className="bg-card p-8 rounded-3xl shadow-lg border border-border/60 hover:shadow-xl transition-all duration-300">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="px-3 py-1.5 bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 font-black text-sm rounded-lg border border-orange-200 dark:border-orange-800 tracking-wide shadow-sm">
                        Step 03
                      </div>
                      <div className="w-12 h-12 bg-card rounded-xl shadow-sm border border-border flex items-center justify-center">
                        <MapPin className="w-6 h-6 text-orange-500" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-black mb-4 text-foreground tracking-tight">Pick Up & Adventure</h3>
                    <ul className="space-y-3 text-muted-foreground font-medium">
                      <li className="flex items-start gap-3">
                        <div className="mt-2 w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0" />
                        Meet the provider for quick gear hand-off
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="mt-2 w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0" />
                        Inspect and verify gear condition together
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="mt-2 w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0" />
                        Head out on your adventure and return when done
                      </li>
                    </ul>
                  </Card>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Step 1 Provider */}
              <div className="relative flex justify-start mb-24 group">
                <div className="w-full md:w-[45%] relative z-10">
                  <Card className="bg-card p-8 rounded-3xl shadow-lg border border-border/60 hover:shadow-xl transition-all duration-300">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="px-3 py-1.5 bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 font-black text-sm rounded-lg border border-purple-200 dark:border-purple-800 tracking-wide shadow-sm">
                        Step 01
                      </div>
                      <div className="w-12 h-12 bg-card rounded-xl shadow-sm border border-border flex items-center justify-center">
                        <Tags className="w-6 h-6 text-purple-500" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-black mb-4 text-foreground tracking-tight">List Your Gear</h3>
                    <ul className="space-y-3 text-muted-foreground font-medium">
                      <li className="flex items-start gap-3">
                        <div className="mt-2 w-1.5 h-1.5 rounded-full bg-purple-500 shrink-0" />
                        Upload photos and describe your equipment
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="mt-2 w-1.5 h-1.5 rounded-full bg-purple-500 shrink-0" />
                        Set your daily rates and availability calendar
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="mt-2 w-1.5 h-1.5 rounded-full bg-purple-500 shrink-0" />
                        Publish your listing to thousands of renters
                      </li>
                    </ul>
                  </Card>
                </div>
                {/* Line 1 -> 2 */}
                <div className="hidden md:block absolute top-[50%] left-[45%] w-[32.5%] h-[calc(100%+96px)] border-t-4 border-r-4 border-dashed border-purple-400/40 rounded-tr-[3rem] z-0"></div>
              </div>

              {/* Step 2 Provider */}
              <div className="relative flex justify-end mb-24 group">
                <div className="w-full md:w-[45%] relative z-10">
                  <Card className="bg-card p-8 rounded-3xl shadow-lg border border-border/60 hover:shadow-xl transition-all duration-300">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="px-3 py-1.5 bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 font-black text-sm rounded-lg border border-indigo-200 dark:border-indigo-800 tracking-wide shadow-sm">
                        Step 02
                      </div>
                      <div className="w-12 h-12 bg-card rounded-xl shadow-sm border border-border flex items-center justify-center">
                        <Calendar className="w-6 h-6 text-indigo-500" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-black mb-4 text-foreground tracking-tight">Manage Bookings</h3>
                    <ul className="space-y-3 text-muted-foreground font-medium">
                      <li className="flex items-start gap-3">
                        <div className="mt-2 w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                        Receive and review incoming rental requests
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="mt-2 w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                        Message renters directly through the platform
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="mt-2 w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                        Coordinate pickup and drop-off locations
                      </li>
                    </ul>
                  </Card>
                </div>
                {/* Line 2 -> 3 */}
                <div className="hidden md:block absolute top-[50%] right-[45%] w-[32.5%] h-[calc(100%+96px)] border-t-4 border-l-4 border-dashed border-indigo-400/40 rounded-tl-[3rem] z-0"></div>
              </div>

              {/* Step 3 Provider */}
              <div className="relative flex justify-start group">
                <div className="w-full md:w-[45%] relative z-10">
                  <Card className="bg-card p-8 rounded-3xl shadow-lg border border-border/60 hover:shadow-xl transition-all duration-300">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="px-3 py-1.5 bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400 font-black text-sm rounded-lg border border-pink-200 dark:border-pink-800 tracking-wide shadow-sm">
                        Step 03
                      </div>
                      <div className="w-12 h-12 bg-card rounded-xl shadow-sm border border-border flex items-center justify-center">
                        <Activity className="w-6 h-6 text-pink-500" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-black mb-4 text-foreground tracking-tight">Earn Money</h3>
                    <ul className="space-y-3 text-muted-foreground font-medium">
                      <li className="flex items-start gap-3">
                        <div className="mt-2 w-1.5 h-1.5 rounded-full bg-pink-500 shrink-0" />
                        Get paid securely upon successful gear return
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="mt-2 w-1.5 h-1.5 rounded-full bg-pink-500 shrink-0" />
                        Build your reputation with positive reviews
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="mt-2 w-1.5 h-1.5 rounded-full bg-pink-500 shrink-0" />
                        Scale your inventory and increase your income
                      </li>
                    </ul>
                  </Card>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

export function StatsSection({ stats }: { stats?: { gearCount: number; categoryCount: number; reviewCount: number; brandCount: number } }) {
  const gearCount = stats?.gearCount ?? 0;
  const categoryCount = stats?.categoryCount ?? 0;
  const reviewCount = stats?.reviewCount ?? 0;
  const brandCount = stats?.brandCount ?? 0;

  const statItems = [
    {
      icon: Backpack,
      value: gearCount > 0 ? `${gearCount}+` : "0",
      label: "Gear Listings",
    },
    {
      icon: Tags,
      value: categoryCount > 0 ? `${categoryCount}+` : "0",
      label: "Categories",
    },
    {
      icon: Star,
      value: reviewCount > 0 ? `${reviewCount}+` : "0",
      label: "Total Reviews",
    },
    {
      icon: ShieldCheck,
      value: brandCount > 0 ? `${brandCount}+` : "0",
      label: "Trusted Brands",
    },
  ];

  return (
    <section className="py-16 bg-gradient-to-r from-slate-900 to-slate-800 text-white border-y border-slate-700">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {statItems.map((item, idx) => {
            const IconComponent = item.icon;
            return (
              <div key={idx} className="flex flex-col items-center">
                <IconComponent className="w-10 h-10 text-orange-500 mb-4 opacity-80" />
                <div className="text-4xl md:text-5xl font-black mb-2">{item.value}</div>
                <div className="text-slate-300 font-medium">{item.label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function CategoriesPreviewSection({ categories = [] }: { categories?: any[] }) {
  const defaultImage = "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&auto=format&fit=crop&q=60";

  const fallbackCategories = [
    { id: '1', name: 'Tents & Shelters', description: 'Rugged tents & canopies for camping.', image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&auto=format&fit=crop&q=60' },
    { id: '2', name: 'Bikes & Cycling', description: 'Mountain & road bikes for trail lovers.', image: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=800&auto=format&fit=crop&q=60' },
    { id: '3', name: 'Water Sports', description: 'Kayaks, paddleboards, and life jackets.', image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&auto=format&fit=crop&q=60' },
    { id: '4', name: 'Winter Sports', description: 'Snowboards, skis, and thermal gear.', image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&auto=format&fit=crop&q=60' },
  ];

  const displayCategories = categories && categories.length > 0 ? categories.slice(0, 4) : fallbackCategories;

  return (
    <section className="py-24">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
          <div className="space-y-2">
            <h2 className="text-3xl md:text-4xl font-black tracking-tight text-foreground">Explore Categories</h2>
            <p className="text-lg text-muted-foreground">Find exactly what you need for your next activity.</p>
          </div>
          <Button variant="ghost" className="hover:bg-orange-500/10 hover:text-orange-600 font-semibold" asChild>
            <Link href="/categories">All Categories <ArrowRight className="w-4 h-4 ml-2" /></Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {displayCategories.map((cat: any, i: number) => {
            const imageUrl = cat.imageUrl || cat.image || defaultImage;
            return (
              <Link key={cat.id || i} href={`/gear?category=${encodeURIComponent(cat.name)}`} className="group block h-full">
                <Card className="relative overflow-hidden h-[280px] rounded-3xl border-none shadow-md transition-all duration-500 hover:shadow-2xl hover:-translate-y-2">
                  <Image 
                    src={imageUrl}
                    alt={cat.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent transition-opacity duration-500 group-hover:opacity-90" />

                  <div className="absolute inset-0 p-6 flex flex-col justify-end">
                    <div className="flex items-end justify-between gap-4">
                      <div className="space-y-1">
                        <h3 className="text-2xl font-black text-white tracking-tight drop-shadow-md">
                          {cat.name}
                        </h3>
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
      </div>
    </section>
  );
}

export function TestimonialsSection({ reviews = [] }: { reviews?: any[] }) {
  const fallbackTestimonials = [
    {
      id: "1",
      comment: "Rented a mountain bike for the weekend. The process was super smooth, and the gear was in excellent condition. Saved me hundreds of dollars!",
      rating: 5,
      author: "Alex Johnson",
      role: "Customer",
      gearName: "TrailBlazer Mountain Bike"
    },
    {
      id: "2",
      comment: "I've been renting out my camping tent when I'm not using it. It's a fantastic passive income stream and the platform is very secure.",
      rating: 5,
      author: "Maria Sanchez",
      role: "Provider",
      gearName: "4-Person All-Weather Tent"
    },
    {
      id: "3",
      comment: "Customer support is top-notch. I had an issue with a pickup location, and they resolved it within minutes. Highly recommended for outdoor lovers.",
      rating: 5,
      author: "David Lee",
      role: "Customer",
      gearName: "Hydra Kayak 10ft"
    }
  ];

  const displayReviews = reviews && reviews.length > 0
    ? reviews.slice(0, 3).map((r: any) => ({
        id: r.id,
        comment: r.comment || r.content || "Great experience renting through GearUp!",
        rating: r.rating || 5,
        author: r.user?.name || r.customer?.name || r.userName || "Verified Adventurer",
        role: r.user?.role || r.role || "Verified Renter",
        gearName: r.gearName || r.gearItem?.name || r.gear?.name || "Outdoor Equipment"
      }))
    : fallbackTestimonials;

  return (
    <section id="reviews" className="py-24 bg-muted/50">
      <div className="container mx-auto px-4 md:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-4 text-foreground">Trusted by Adventurers</h2>
        <p className="text-muted-foreground text-lg mb-16 max-w-2xl mx-auto">
          See what our community has to say about their GearUp experience.
        </p>

        <div className="grid md:grid-cols-3 gap-8 text-left">
          {displayReviews.map((item: any, idx: number) => {
            const initials = item.author ? item.author.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2) : "VA";
            const bgColors = ["bg-orange-100 text-orange-700", "bg-blue-100 text-blue-700", "bg-emerald-100 text-emerald-700"];
            
            return (
              <Card key={item.id || idx} className="bg-card border-none shadow-sm rounded-3xl flex flex-col justify-between">
                <CardContent className="p-8 flex flex-col justify-between h-full space-y-4">
                  <div>
                    {/* Star Rating */}
                    <div className="flex text-orange-500 mb-4">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-5 h-5 ${i < item.rating ? "fill-current text-orange-500" : "text-muted-foreground opacity-30"}`} 
                        />
                      ))}
                    </div>

                    {/* Review Comment */}
                    <p className="text-foreground italic mb-4 text-base leading-relaxed">
                      "{item.comment}"
                    </p>

                    {/* Gear Name Tag below comment */}
                    {item.gearName && (
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 text-orange-600 border border-orange-500/20 text-xs font-bold tracking-wide">
                        <span className="opacity-70 font-normal">Rented:</span>
                        <span>{item.gearName}</span>
                      </div>
                    )}
                  </div>

                  {/* Reviewer Info */}
                  <div className="flex items-center gap-4 pt-4 border-t border-border/50 mt-auto">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold ${bgColors[idx % bgColors.length]}`}>
                      {initials}
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground">{item.author}</h4>
                      <p className="text-sm text-muted-foreground capitalize">{item.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function FAQSection() {
  return (
    <section id="faqs" className="py-24">
      <div className="container mx-auto px-4 md:px-8 max-w-4xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-4 text-foreground">Frequently Asked Questions</h2>
          <p className="text-muted-foreground text-lg">Everything you need to know about GearUp.</p>
        </div>

        <Accordion type="single" collapsible className="w-full space-y-4">
          <AccordionItem value="item-1" className="bg-card px-6 rounded-2xl border border-border">
            <AccordionTrigger className="text-lg font-bold hover:no-underline hover:text-orange-500">How do deposits work?</AccordionTrigger>
            <AccordionContent className="text-muted-foreground text-base pb-6">
              When you rent an item, a hold is placed on your card for the deposit amount. This is fully refunded once the item is returned in its original condition.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2" className="bg-card px-6 rounded-2xl border border-border">
            <AccordionTrigger className="text-lg font-bold hover:no-underline hover:text-orange-500">Is my gear insured if I rent it out?</AccordionTrigger>
            <AccordionContent className="text-muted-foreground text-base pb-6">
              Yes, GearUp provides a Provider Protection Guarantee up to $1,000 for damages that exceed the renter's deposit.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3" className="bg-card px-6 rounded-2xl border border-border">
            <AccordionTrigger className="text-lg font-bold hover:no-underline hover:text-orange-500">Can I cancel a reservation?</AccordionTrigger>
            <AccordionContent className="text-muted-foreground text-base pb-6">
              Yes. Cancellations made 48 hours prior to the pickup time are fully refunded. Cancellations within 48 hours may be subject to a fee.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-4" className="bg-card px-6 rounded-2xl border border-border">
            <AccordionTrigger className="text-lg font-bold hover:no-underline hover:text-orange-500">How do I get paid as a provider?</AccordionTrigger>
            <AccordionContent className="text-muted-foreground text-base pb-6">
              Payments are processed securely and deposited directly into your linked bank account 24 hours after the successful return of the gear.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </section>
  );
}

export function CTASection() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-orange-500"></div>
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay opacity-20"></div>
      
      <div className="container mx-auto px-4 md:px-8 relative z-10 text-center text-white">
        <h2 className="text-4xl md:text-5xl font-black mb-6 drop-shadow-sm">Ready to explore more?</h2>
        <p className="text-xl md:text-2xl mb-10 max-w-2xl mx-auto font-medium text-orange-50 drop-shadow-sm">
          Join thousands of adventurers and start your journey today.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button size="lg" className="bg-white text-orange-600 hover:bg-orange-50 font-black h-14 px-8 rounded-xl shadow-lg transition-transform hover:-translate-y-1" asChild>
            <Link href="/auth/register">Sign Up Now</Link>
          </Button>
          <Button size="lg" className="border-2 border-white bg-transparent text-white hover:bg-white hover:text-orange-600 font-bold h-14 px-8 rounded-xl shadow-lg transition-transform hover:-translate-y-1" asChild>
            <Link href="/gear">Browse Gear</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

