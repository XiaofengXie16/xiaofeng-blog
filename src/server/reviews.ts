import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { prisma } from "~/utils/db";

// Validation schemas for review input - protects against injection
const slugSchema = z.object({ slug: z.string().min(1).max(200) });

const reviewInputSchema = z.object({
  slug: z.string().min(1).max(200),
  name: z
    .string()
    .max(100)
    .optional()
    .transform((val) => (val?.trim() === "" ? undefined : val?.trim())),
  review: z.string().min(1).max(5000).trim(),
  stars: z.number().int().min(1).max(5),
});

export type ReviewInput = z.infer<typeof reviewInputSchema>;

export type Review = {
  id: string;
  slug: string;
  name: string | null;
  review: string;
  stars: number;
  createdAt: Date;
};

// Validator function wrapper for Zod
function zodValidator<T>(schema: z.ZodSchema<T>) {
  return (input: unknown): T => schema.parse(input);
}

// Get reviews for a specific blog post
export const getReviews = createServerFn({ method: "GET" })
  .inputValidator(zodValidator(slugSchema))
  .handler(async ({ data }) => {
    const reviews = await prisma.review.findMany({
      where: { slug: data.slug },
      orderBy: { createdAt: "desc" },
    });

    return reviews;
  });

// Create a new review
export const createReview = createServerFn({ method: "POST" })
  .inputValidator(zodValidator(reviewInputSchema))
  .handler(async ({ data }) => {
    const review = await prisma.review.create({
      data: {
        slug: data.slug,
        name: data.name ?? null,
        review: data.review,
        stars: data.stars,
      },
    });

    return review;
  });

// Get average rating for a blog post
export const getAverageRating = createServerFn({ method: "GET" })
  .inputValidator(zodValidator(slugSchema))
  .handler(async ({ data }) => {
    const result = await prisma.review.aggregate({
      where: { slug: data.slug },
      _avg: { stars: true },
      _count: { stars: true },
    });

    return {
      average: result._avg.stars ?? 0,
      count: result._count.stars,
    };
  });
