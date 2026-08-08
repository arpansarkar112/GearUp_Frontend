"use client";

import { useState } from "react";
import { UnifiedNavbar } from "@/components/layout/UnifiedNavbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "@/components/ui/toast";
import { MapPin, Mail, Phone, Loader2 } from "lucide-react";

const contactSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  subject: z.string().min(5, { message: "Subject must be at least 5 characters." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
});

export default function ContactPage() {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof contactSchema>>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  async function onSubmit(values: z.infer<typeof contactSchema>) {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast.add({
        type: "success",
        title: "Message Sent",
        description: "We've received your message and will get back to you soon.",
      });
      form.reset();
    }, 1500);
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <UnifiedNavbar />
      
      <main className="flex-grow">
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4 text-center max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-black mb-6 text-foreground">Contact Us</h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="grid md:grid-cols-5 gap-12">
              
              {/* Contact Info */}
              <div className="md:col-span-2 space-y-8">
                <h2 className="text-2xl font-bold text-foreground">Get in Touch</h2>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 text-orange-600">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground">Headquarters</h3>
                      <p className="text-muted-foreground mt-1">123 Adventure Way<br/>Seattle, WA 98101</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 text-orange-600">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground">Email</h3>
                      <p className="text-muted-foreground mt-1">arpansarkar112@gmail.com</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 text-orange-600">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground">Phone</h3>
                      <p className="text-muted-foreground mt-1">+1 (555) 123-4567</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form */}
              <div className="md:col-span-3 bg-card p-8 rounded-3xl shadow-sm border border-border">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem className="col-span-2 sm:col-span-1">
                            <FormLabel className="font-semibold text-foreground">Name</FormLabel>
                            <FormControl>
                              <Input placeholder="John Doe" className="h-12" {...field} disabled={isLoading} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem className="col-span-2 sm:col-span-1">
                            <FormLabel className="font-semibold text-foreground">Email</FormLabel>
                            <FormControl>
                              <Input placeholder="john@example.com" className="h-12" {...field} disabled={isLoading} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-semibold text-foreground">Subject</FormLabel>
                          <FormControl>
                            <Input placeholder="How can we help you?" className="h-12" {...field} disabled={isLoading} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-semibold text-foreground">Message</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Write your message here..." 
                              className="min-h-[150px] resize-none" 
                              {...field} 
                              disabled={isLoading}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button
                      type="submit"
                      className="w-full h-14 text-md font-bold mt-2 shadow-lg bg-orange-500 hover:bg-orange-600 text-white"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        "Send Message"
                      )}
                    </Button>
                  </form>
                </Form>
              </div>

            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
