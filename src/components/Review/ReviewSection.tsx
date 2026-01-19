import { useState, useEffect, useCallback } from "react";
import { ReviewForm } from "./ReviewForm";
import { ReviewList } from "./ReviewList";
import { StarRating } from "./StarRating";
import { getReviews, getAverageRating } from "~/server/reviews";
import type { Review } from "~/server/reviews";

type ReviewSectionProps = {
  slug: string;
};

export function ReviewSection({ slug }: ReviewSectionProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [averageRating, setAverageRating] = useState({ average: 0, count: 0 });

  const fetchReviews = useCallback(async () => {
    try {
      const [reviewsData, ratingData] = await Promise.all([
        getReviews({ data: { slug } }),
        getAverageRating({ data: { slug } }),
      ]);
      setReviews(reviewsData);
      setAverageRating(ratingData);
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
    } finally {
      setIsLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    void fetchReviews();
  }, [fetchReviews]);

  const handleReviewSuccess = () => {
    void fetchReviews();
  };

  return (
    <section className="mt-16 pt-12 border-t border-gray-700/50">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <h2 className="text-2xl font-bold text-pink-200">Reader Reviews</h2>
        {averageRating.count > 0 && (
          <div className="flex items-center gap-3">
            <StarRating value={Math.round(averageRating.average)} readonly />
            <span className="text-gray-400">
              {averageRating.average.toFixed(1)} ({averageRating.count}{" "}
              {averageRating.count === 1 ? "review" : "reviews"})
            </span>
          </div>
        )}
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div>
          <ReviewForm slug={slug} onSuccess={handleReviewSuccess} />
        </div>
        <div>
          <h3 className="text-lg font-medium text-gray-300 mb-4">
            {isLoading
              ? "Loading reviews..."
              : reviews.length > 0
                ? `${reviews.length} ${reviews.length === 1 ? "Review" : "Reviews"}`
                : "Reviews"}
          </h3>
          <ReviewList reviews={reviews} isLoading={isLoading} />
        </div>
      </div>
    </section>
  );
}
