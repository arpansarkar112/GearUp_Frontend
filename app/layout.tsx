import type { Metadata } from "next"
import { Geist_Mono, Inter } from "next/font/google"
import "./globals.css"
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toast"
import { Footer } from "@/components/layout/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })

export const metadata: Metadata = {
  title: "GearUp | Rent Outdoor Gear",
  description: "Rent Sports & Outdoor Gear Instantly",
}

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("antialiased", fontMono.variable, "font-sans", inter.variable)}
    >
      <body className={cn(inter.className, "min-h-screen flex flex-col")} suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <main className="flex-1 flex flex-col">
            {children}
          </main>
          <Footer />
          <Toaster/>
        </ThemeProvider>
      </body>
    </html>
  )
}
