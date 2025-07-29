import { useState } from "react";
import { Star, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Review {
  id: number;
  name: string;
  rating: number;
  comment: string;
  date: string;
}

interface ReviewSectionProps {
  reviews: Review[];
}

type FilterType = "all" | "best" | "worst" | "recent";

export default function ReviewSection({ reviews }: ReviewSectionProps) {
  const [filter, setFilter] = useState<FilterType>("all");

  const filteredReviews = reviews.filter((review) => {
    switch (filter) {
      case "best":
        return review.rating >= 4;
      case "worst":
        return review.rating <= 2;
      case "recent":
        // Filtrer par date récente (dans les 30 derniers jours)
        const reviewDate = new Date(review.date);
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return reviewDate >= thirtyDaysAgo;
      default:
        return true;
    }
  });

  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Avis clients</h2>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star 
                  key={i} 
                  className={`w-4 h-4 ${i < Math.round(averageRating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                />
              ))}
            </div>
            <span className="text-sm text-gray-600">
              {averageRating.toFixed(1)} ({reviews.length} avis)
            </span>
          </div>
        </div>

        {/* Filtres */}
        <div className="flex items-center space-x-2 mt-4 sm:mt-0">
          <Filter className="w-4 h-4 text-gray-500" />
          <div className="flex space-x-1">
            {[
              { key: "all", label: "Tous" },
              { key: "best", label: "Meilleurs" },
              { key: "worst", label: "Moins bons" },
              { key: "recent", label: "Récents" },
            ].map((filterOption) => (
              <Button
                key={filterOption.key}
                variant={filter === filterOption.key ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter(filterOption.key as FilterType)}
                className="text-xs"
              >
                {filterOption.label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {filteredReviews.length > 0 ? (
          filteredReviews.map((review) => (
            <div key={review.id} className="border-b border-gray-100 pb-4 last:border-b-0">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-900">{review.name}</span>
                <div className="flex items-center space-x-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                    />
                  ))}
                </div>
              </div>
              <p className="text-gray-700 mb-2">{review.comment}</p>
              <p className="text-sm text-gray-500">{review.date}</p>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            Aucun avis trouvé avec ce filtre.
          </div>
        )}
      </div>
    </div>
  );
} 