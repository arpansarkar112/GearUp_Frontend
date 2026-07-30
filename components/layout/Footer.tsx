import Link from "next/link";
import { Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300 py-16 border-t border-slate-900 mt-auto">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-12">
          
          {/* Brand & Main Info */}
          <div className="lg:col-span-4">
            <Link href="/" className="text-3xl font-black text-orange-500 tracking-tight inline-block mb-4">
              GearUp
            </Link>
            <p className="text-slate-400 leading-relaxed mb-6">
              A modern platform built by Arpan Sarkar to revolutionize how we share and access outdoor equipment.
            </p>
            <div className="flex space-x-4">
              <a href="mailto:arpansarkar112@gmail.com" className="h-10 w-10 rounded-full bg-slate-900 flex items-center justify-center hover:bg-orange-500 hover:text-white transition-colors border border-slate-800">
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* How GearUp Works */}
          <div className="lg:col-span-4">
            <h3 className="text-white font-bold mb-4 uppercase tracking-wider text-sm">How It Works</h3>
            <div className="space-y-4">
              <div>
                <h4 className="text-slate-300 font-semibold text-sm">Provider</h4>
                <p className="text-slate-500 text-xs leading-relaxed mt-1">
                  List high-quality gear, manage inventory, and earn money by renting to adventurers.
                </p>
              </div>
              <div>
                <h4 className="text-slate-300 font-semibold text-sm">Customer</h4>
                <p className="text-slate-500 text-xs leading-relaxed mt-1">
                  Browse the marketplace, rent equipment instantly, and leave reviews.
                </p>
              </div>
            </div>
          </div>
          
          {/* Platform Links */}
          <div className="lg:col-span-2">
            <h3 className="text-white font-bold mb-4 uppercase tracking-wider text-sm">Platform</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/gear" className="text-slate-400 hover:text-orange-400 transition-colors">Browse Gear</Link></li>
              <li><Link href="/categories" className="text-slate-400 hover:text-orange-400 transition-colors">Categories</Link></li>
              <li><Link href="/auth/login" className="text-slate-400 hover:text-orange-400 transition-colors">List Your Gear</Link></li>
              <li><Link href="/auth/login" className="text-slate-400 hover:text-orange-400 transition-colors">Sign In</Link></li>
            </ul>
          </div>

          {/* Project Info */}
          <div className="lg:col-span-2">
            <h3 className="text-white font-bold mb-4 uppercase tracking-wider text-sm">Project</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex flex-col gap-1">
                <span className="text-slate-500 text-xs">Owner</span> 
                <span className="font-semibold text-slate-300">Arpan Sarkar</span>
              </li>
              <li className="flex flex-col gap-1 mt-2">
                <span className="text-slate-500 text-xs">Contact</span> 
                <a href="mailto:arpansarkar112@gmail.com" className="text-orange-400 hover:underline break-all">
                  arpansarkar112@gmail.com
                </a>
              </li>
            </ul>
          </div>

        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-slate-900 text-sm text-slate-500">
          <p>© {new Date().getFullYear()} GearUp. All rights reserved.</p>
          <p className="mt-4 md:mt-0">Built by Arpan Sarkar</p>
        </div>
      </div>
    </footer>
  );
}
