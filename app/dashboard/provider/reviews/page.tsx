"use client";

import { useEffect, useState } from "react";
import { fetchProviderReviews } from "@/lib/api/provider";
import { Star, MessageSquare, PackageOpen, AlertCircle } from "lucide-react";
import { format } from "date-fns";

type Review = {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  customer: { id: string; name: string };
  gearItem: { id: string; name: string; brand: string | null; price: number };
};

export default function ProviderReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadReviews = async () => {
      try {
        const response = await fetchProviderReviews();
        setReviews(response.data || []);
      } catch (err: any) {
        setError(err.message || "Failed to load reviews");
      } finally {
        setLoading(false);
      }
    };
    loadReviews();
  }, []);

  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0;
    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    return (total / reviews.length).toFixed(1);
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating ? "fill-orange-400 text-orange-400" : "fill-slate-100 text-slate-200"
            }`}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Customer Reviews</h1>
        <p className="text-slate-500 mt-2">See what customers are saying about your gear.</p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-center">
          <AlertCircle className="h-5 w-5 mr-2" />
          {error}
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex items-center space-x-4">
          <div className="h-12 w-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center">
            <Star className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Average Rating</p>
            <p className="text-2xl font-bold text-slate-900">{calculateAverageRating()} <span className="text-sm font-normal text-slate-500">/ 5.0</span></p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex items-center space-x-4">
          <div className="h-12 w-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
            <MessageSquare className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Total Reviews</p>
            <p className="text-2xl font-bold text-slate-900">{reviews.length}</p>
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {reviews.length === 0 ? (
          <div className="p-12 text-center">
            <div className="mx-auto h-12 w-12 text-slate-300 mb-4">
              <MessageSquare className="h-full w-full" />
            </div>
            <h3 className="text-lg font-medium text-slate-900">No reviews yet</h3>
            <p className="text-slate-500 mt-2">When customers review your gear, their feedback will appear here.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {reviews.map((review) => (
              <div key={review.id} className="p-6 hover:bg-slate-50/50 transition-colors">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                  
                  {/* Left Column: Customer & Rating */}
                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="h-10 w-10 bg-slate-900 rounded-full flex items-center justify-center text-white font-semibold shadow-sm">
                        {review.customer.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{review.customer.name}</p>
                        <p className="text-xs text-slate-400">{format(new Date(review.createdAt), "MMMM d, yyyy")}</p>
                      </div>
                    </div>
                    {renderStars(review.rating)}
                  </div>

                  {/* Right Column: Gear Reference */}
                  <div className="shrink-0 bg-slate-100 rounded-lg p-3 flex items-start space-x-3 sm:w-64">
                    <PackageOpen className="h-5 w-5 text-slate-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-slate-900 leading-tight">{review.gearItem.name}</p>
                      <p className="text-xs text-slate-500 mt-1">${review.gearItem.price}/day</p>
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <p className="text-slate-700 whitespace-pre-wrap">{review.comment || <span className="text-slate-400 italic">No comment provided.</span>}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
