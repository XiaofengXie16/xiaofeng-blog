import { StarRating } from "./StarRating";
import type { Review } from "~/server/reviews";

type ReviewListProps = {
  reviews: Review[];
  isLoading?: boolean;
};

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date));
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="p-5 bg-surface/30 backdrop-blur-sm rounded-xl border border-gray-700/30 space-y-3">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center text-white font-medium">
            {review.name ? review.name.charAt(0).toUpperCase() : "A"}
          </div>
          <div>
            <p className="font-medium text-text-main">
              {review.name ?? "Anonymous"}
            </p>
            <p className="text-sm text-gray-500">{formatDate(review.createdAt)}</p>
          </div>
        </div>
        <StarRating value={review.stars} readonly size="sm" />
      </div>
      <p className="text-gray-300 leading-relaxed whitespace-pre-wrap break-words">
        {review.review}
      </p>
    </div>
  );
}

export function ReviewList({ reviews, isLoading }: ReviewListProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="p-5 bg-surface/30 rounded-xl border border-gray-700/30 animate-pulse"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-gray-700" />
              <div className="space-y-2">
                <div className="h-4 w-24 bg-gray-700 rounded" />
                <div className="h-3 w-16 bg-gray-700 rounded" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-4 w-full bg-gray-700 rounded" />
              <div className="h-4 w-3/4 bg-gray-700 rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        <p className="text-lg">No reviews yet</p>
        <p className="text-sm mt-1">Be the first to share your thoughts!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <ReviewCard key={review.id} review={review} />
      ))}
    </div>
  );
}
