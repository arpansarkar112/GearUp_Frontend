"use client"

import { useEffect, useState } from "react"
import { format } from "date-fns"
import { Star, MessageSquare, PackageOpen, AlertCircle } from "lucide-react"

import { fetchMyReviews } from "@/lib/api/customer"
import { fetchMyProfile } from "@/lib/api/user"
import { toast } from "@/components/ui/toast"

export default function CustomerReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [userProfile, setUserProfile] = useState<any>(null)

  useEffect(() => {
    async function loadData() {
      try {
        const profileRes = await fetchMyProfile().catch(() => ({ data: null }))
        setUserProfile(profileRes.data)
        
        if (profileRes.data?.id) {
          const reviewsRes = await fetchMyReviews(profileRes.data.id).catch(() => ({ data: [] }))
          setReviews(reviewsRes.data || [])
        }
      } catch (error: any) {
        setError(error.message || "Failed to load reviews data")
        toast.add({
          type: "error",
          title: "Failed to load reviews data",
          description: error.message,
        })
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

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
        <h2 className="flex items-center gap-2 text-3xl font-black tracking-tight text-slate-900">
          <Star className="h-7 w-7 text-orange-500 fill-orange-500" /> My Reviews
        </h2>
        <p className="mt-2 text-slate-500">
          Feedback and ratings you have submitted for past rentals.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-center">
          <AlertCircle className="h-5 w-5 mr-2" />
          {error}
        </div>
      )}

      {/* Reviews List */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {reviews.length === 0 ? (
          <div className="p-12 text-center">
            <div className="mx-auto h-12 w-12 text-slate-300 mb-4">
              <MessageSquare className="h-full w-full" />
            </div>
            <h3 className="text-lg font-medium text-slate-900">No reviews yet</h3>
            <p className="text-slate-500 mt-2">You haven't left any reviews for your rentals. Return a gear to leave your first review!</p>
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
                        {userProfile?.name?.charAt(0).toUpperCase() || "C"}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{userProfile?.name || "Customer"}</p>
                        <p className="text-xs text-slate-400">{format(new Date(review.createdAt), "MMMM d, yyyy")}</p>
                      </div>
                    </div>
                    {renderStars(review.rating)}
                  </div>

                  {/* Right Column: Gear Reference */}
                  <div className="shrink-0 bg-slate-100 rounded-lg p-3 flex items-start space-x-3 sm:w-64">
                    <PackageOpen className="h-5 w-5 text-slate-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-slate-900 leading-tight">{review.gearItem?.name || "Outdoor Gear"}</p>
                      <p className="text-xs text-slate-500 mt-1">${review.gearItem?.price || 0}/day</p>
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
  )
}
