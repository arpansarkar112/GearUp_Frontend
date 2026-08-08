import { Skeleton } from "@/components/ui/skeleton";
import { UnifiedNavbar } from "@/components/layout/UnifiedNavbar";

export default function GearLoading() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <UnifiedNavbar />
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 lg:p-8 space-y-8">
        <div className="text-center sm:text-left space-y-6">
          <div>
            <Skeleton className="h-12 w-3/4 sm:w-1/3 mb-4 mx-auto sm:mx-0" />
            <Skeleton className="h-6 w-full sm:w-1/2 mx-auto sm:mx-0" />
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">
          {/* Filters Skeleton */}
          <div className="w-full md:w-64 flex-shrink-0">
            <Skeleton className="h-96 w-full rounded-2xl" />
          </div>

          {/* Grid Skeleton */}
          <div className="flex-1 w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="flex flex-col h-full overflow-hidden border-none shadow-md rounded-xl bg-card">
                  <Skeleton className="aspect-[4/3] w-full rounded-none" />
                  <div className="p-5 pb-2 flex-1 flex flex-col gap-3">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-10 w-full mt-auto" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
