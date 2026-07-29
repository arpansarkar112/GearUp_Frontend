"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/toast";

const registerSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
  role: z.enum(["CUSTOMER", "PROVIDER"], {
    required_error: "Please select a role.",
  }),
});


const backgroundImages = [
  "https://images.unsplash.com/photo-1526772662000-3f88f10405ff?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fG91dGRvb3J8ZW58MHx8MHx8fDA%3D?auto=format&fit=crop",
  "https://images.unsplash.com/photo-1562388831-a7a060b9c1fe?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGtheWFraW5nfGVufDB8fDB8fHww?auto=format&fit=crop",
  "https://images.unsplash.com/photo-1501555088652-021faa106b9b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8b3V0ZG9vcnxlbnwwfHwwfHx8MA%3D%3D?auto=format&fit=crop"
];


const platformReviews = [
  { quote: "The easiest way to rent premium outdoor gear. Highly recommended!", author: "Alex D." },
  { quote: "Incredible selection and a completely seamless booking process.", author: "Jamie L." },
  { quote: "Saved us so much money on our weekend camping trip.", author: "Taylor S." },
  { quote: "Top-notch equipment quality and fantastic local providers.", author: "Morgan K." }
];

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [activeReviewIndex, setActiveReviewIndex] = useState(0);


  useEffect(() => {
    const imageTimer = setInterval(() => {
      setActiveImageIndex((prev) => (prev + 1) % backgroundImages.length);
    }, 6000);

    const reviewTimer = setInterval(() => {
      setActiveReviewIndex((prev) => (prev + 1) % platformReviews.length);
    }, 4000);

    return () => {
      clearInterval(imageTimer);
      clearInterval(reviewTimer);
    };
  }, []);

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "CUSTOMER", // Default role
    },
  });

  async function onSubmit(values: z.infer<typeof registerSchema>) {
    setIsLoading(true);
    try {
      const res = await fetch("https://gear-up-backend-pi.vercel.app/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Registration failed");
      }

      toast.add({
        type: "success",
        title: "Account Created!",
        description: "You can now log in with your credentials.",
      });

      router.push("/auth/login");
    } catch (error: any) {
      toast.add({
        type: "error",
        title: "Registration Failed",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-slate-900">
      
      {backgroundImages.map((imgSrc, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === activeImageIndex ? "opacity-100 z-0" : "opacity-0 z-0"
          }`}
        >
          <Image
            src={imgSrc}
            alt="Outdoor Adventure"
            fill
            className="object-cover"
            priority={index === 0}
          />
        </div>
      ))}

      <div className="absolute inset-0 z-10 bg-black/50 backdrop-blur-sm" />

      {/* FORM */}
      <div className="relative z-20 w-full max-w-md px-4 py-8 mb-12 mt-8">
        <Card className="w-full border border-white/20 shadow-2xl bg-white/10 backdrop-blur-2xl rounded-3xl overflow-hidden text-white">
          <CardHeader className="space-y-2 text-center pt-8 pb-4">
            <CardTitle className="text-3xl font-extrabold tracking-tight drop-shadow-md">Create an account</CardTitle>
            <CardDescription className="text-white/70 text-base">
              Enter your details below to get started
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-8 px-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold text-white/90">Full Name</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="John Doe" 
                          className="h-11 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus-visible:ring-white/50" 
                          {...field} 
                          disabled={isLoading} 
                        />
                      </FormControl>
                      <FormMessage className="text-red-300" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold text-white/90">Email</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="m@example.com" 
                          className="h-11 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus-visible:ring-white/50" 
                          {...field} 
                          disabled={isLoading} 
                        />
                      </FormControl>
                      <FormMessage className="text-red-300" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold text-white/90">Password</FormLabel>
                      <FormControl>
                        <Input 
                          type="password" 
                          placeholder="••••••••" 
                          className="h-11 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus-visible:ring-white/50" 
                          {...field} 
                          disabled={isLoading} 
                        />
                      </FormControl>
                      <FormMessage className="text-red-300" />
                    </FormItem>
                  )}
                />
                
                {/* Role Selection Field*/}
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold text-white/90">I want to be...</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoading}>
                        <FormControl>
                          <SelectTrigger className="h-11 bg-white/10 border-white/20 text-white focus:ring-white/50">
                            <SelectValue placeholder="Select an account type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-slate-900/95 border-white/20 text-white backdrop-blur-xl">
                          <SelectItem value="CUSTOMER" className="focus:bg-white/10 focus:text-white">Customer</SelectItem>
                          <SelectItem value="PROVIDER" className="focus:bg-white/10 focus:text-white">Provider</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-red-300" />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  className="w-full h-12 text-md font-bold mt-4 shadow-lg transition-transform active:scale-95 bg-orange-500 hover:bg-orange-600 text-white border-none" 
                  disabled={isLoading}
                >
                  {isLoading ? "Creating account..." : "Sign Up"}
                </Button>
              </form>
            </Form>

            <div className="text-center text-sm text-white/70 mt-6">
              Already have an account?{" "}
              <Link href="/auth/login" className="font-semibold text-white underline hover:text-orange-400 transition-colors">
                Log in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* REVIEWS */}
      <div className="absolute bottom-6 w-full z-20 pointer-events-none flex justify-center px-4">
        <div className="relative h-8 w-full max-w-2xl flex items-center justify-center">
          {platformReviews.map((review, index) => (
            <div
              key={index}
              className={`absolute w-full text-center transition-all duration-1000 ease-in-out ${
                index === activeReviewIndex
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
            >
              <p className="text-white/70 text-sm md:text-base italic drop-shadow-md">
                "{review.quote}" 
                <span className="font-semibold text-orange-400 not-italic ml-2 tracking-wide uppercase text-xs md:text-sm">
                  — {review.author}
                </span>
              </p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}