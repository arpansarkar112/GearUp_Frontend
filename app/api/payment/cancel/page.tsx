"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { XCircle, ArrowLeft, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { UnifiedNavbar } from "@/components/layout/UnifiedNavbar";

function PaymentCancelContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <UnifiedNavbar />

      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <Card className="max-w-md w-full border-none shadow-2xl bg-white overflow-hidden rounded-3xl">
          <CardContent className="p-10 flex flex-col items-center text-center">
            
            {/* Cancel Animation/Icon */}
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-red-500/20 rounded-full animate-ping" />
              <div className="relative bg-red-100 p-4 rounded-full">
                <XCircle className="w-16 h-16 text-red-500" />
              </div>
            </div>

            <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-4">
              Payment Cancelled
            </h1>
            
            <p className="text-slate-500 mb-8 leading-relaxed">
              Your transaction was not completed. No charges were made. You can try checking out again from your dashboard.
            </p>

            {sessionId && (
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 w-full mb-8">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Session ID</p>
                <p className="text-sm text-slate-600 font-mono truncate">{sessionId}</p>
              </div>
            )}

            <div className="w-full space-y-4">
              <Button asChild className="w-full h-12 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl shadow-md transition-all active:scale-95">
                <Link href="/dashboard/customer/rentals">
                  <RefreshCcw className="mr-2 w-4 h-4" /> Try Again
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full h-12 border-slate-200 text-slate-600 hover:text-slate-900 font-bold rounded-xl transition-all">
                <Link href="/dashboard/customer">
                  <ArrowLeft className="mr-2 w-4 h-4" /> Back to Dashboard
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

export default function PaymentCancelPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-red-500" />
      </div>
    }>
      <PaymentCancelContent />
    </Suspense>
  );
}
