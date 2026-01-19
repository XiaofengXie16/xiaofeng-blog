import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { useState } from "react";
import { StarRating } from "./StarRating";
import { createReview } from "~/server/reviews";

const reviewSchema = z.object({
  name: z
    .string()
    .max(100, "Name must be less than 100 characters")
    .optional(),
  review: z
    .string()
    .min(1, "Review is required")
    .max(5000, "Review must be less than 5000 characters"),
  stars: z
    .number()
    .int()
    .min(1, "Please select a rating")
    .max(5, "Rating must be between 1 and 5"),
});

type ReviewFormProps = {
  slug: string;
  onSuccess: () => void;
};

export function ReviewForm({ slug, onSuccess }: ReviewFormProps) {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    defaultValues: {
      name: "",
      review: "",
      stars: 0,
    },
    onSubmit: async ({ value }) => {
      setSubmitError(null);
      setIsSubmitting(true);

      try {
        // Validate with Zod before submitting
        const validated = reviewSchema.parse({
          name: value.name || undefined,
          review: value.review,
          stars: value.stars,
        });

        await createReview({
          data: {
            slug,
            name: validated.name,
            review: validated.review,
            stars: validated.stars,
          },
        });

        form.reset();
        onSuccess();
      } catch (error) {
        if (error instanceof z.ZodError) {
          setSubmitError(error.issues[0]?.message ?? "Validation failed");
        } else {
          setSubmitError("Failed to submit review. Please try again.");
        }
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        void form.handleSubmit();
      }}
      className="space-y-6 bg-surface/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50"
    >
      <h3 className="text-xl font-semibold text-pink-200">Leave a Review</h3>

      {submitError && (
        <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
          {submitError}
        </div>
      )}

      <form.Field
        name="name"
        validators={{
          onChange: ({ value }) => {
            if (value && value.length > 100) {
              return "Name must be less than 100 characters";
            }
            return undefined;
          },
        }}
      >
        {(field) => (
          <div className="space-y-2">
            <label
              htmlFor={field.name}
              className="block text-sm font-medium text-gray-300"
            >
              Name (optional)
            </label>
            <input
              id={field.name}
              type="text"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              placeholder="Your name"
              className="w-full px-4 py-2.5 bg-surface border border-gray-700 rounded-lg text-text-main placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-200/50 focus:border-transparent transition-all"
              maxLength={100}
            />
            {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
              <p className="text-red-400 text-sm">
                {field.state.meta.errors[0]}
              </p>
            )}
          </div>
        )}
      </form.Field>

      <form.Field
        name="stars"
        validators={{
          onChange: ({ value }) => {
            if (value < 1) {
              return "Please select a rating";
            }
            return undefined;
          },
        }}
      >
        {(field) => (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              Rating
            </label>
            <StarRating
              value={field.state.value}
              onChange={(value) => field.handleChange(value)}
              size="lg"
            />
            {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
              <p className="text-red-400 text-sm">
                {field.state.meta.errors[0]}
              </p>
            )}
          </div>
        )}
      </form.Field>

      <form.Field
        name="review"
        validators={{
          onChange: ({ value }) => {
            if (!value || value.trim().length === 0) {
              return "Review is required";
            }
            if (value.length > 5000) {
              return "Review must be less than 5000 characters";
            }
            return undefined;
          },
        }}
      >
        {(field) => (
          <div className="space-y-2">
            <label
              htmlFor={field.name}
              className="block text-sm font-medium text-gray-300"
            >
              Review
            </label>
            <textarea
              id={field.name}
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              placeholder="Share your thoughts about this article..."
              rows={4}
              className="w-full px-4 py-2.5 bg-surface border border-gray-700 rounded-lg text-text-main placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-200/50 focus:border-transparent transition-all resize-none"
              maxLength={5000}
            />
            <div className="flex justify-between items-center">
              {field.state.meta.isTouched &&
              field.state.meta.errors.length > 0 ? (
                <p className="text-red-400 text-sm">
                  {field.state.meta.errors[0]}
                </p>
              ) : (
                <span />
              )}
              <span className="text-xs text-gray-500">
                {field.state.value.length}/5000
              </span>
            </div>
          </div>
        )}
      </form.Field>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-3 px-6 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-medium rounded-lg hover:from-pink-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-pink-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  );
}
