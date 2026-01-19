import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { eq, desc, avg, count } from "drizzle-orm";
import { db, initializeDatabase } from "~/utils/db";
import { reviews } from "../../drizzle/schema";

// Ensure database is initialized
let dbInitialized = false;
async function ensureDbInitialized() {
  if (!dbInitialized) {
    await initializeDatabase();
    dbInitialized = true;
  }
}

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

// Generate a unique ID
function generateId(): string {
  return crypto.randomUUID();
}

// Get reviews for a specific blog post
export const getReviews = createServerFn({ method: "GET" })
  .inputValidator(zodValidator(slugSchema))
  .handler(async ({ data }) => {
    await ensureDbInitialized();
    const result = await db
      .select()
      .from(reviews)
      .where(eq(reviews.slug, data.slug))
      .orderBy(desc(reviews.createdAt));

    return result.map((r) => ({
      ...r,
      createdAt: r.createdAt,
    }));
  });

// Create a new review
export const createReview = createServerFn({ method: "POST" })
  .inputValidator(zodValidator(reviewInputSchema))
  .handler(async ({ data }) => {
    await ensureDbInitialized();
    const id = generateId();
    const now = new Date();

    await db.insert(reviews).values({
      id,
      slug: data.slug,
      name: data.name ?? null,
      review: data.review,
      stars: data.stars,
      createdAt: now,
    });

    return {
      id,
      slug: data.slug,
      name: data.name ?? null,
      review: data.review,
      stars: data.stars,
      createdAt: now,
    };
  });

// Get average rating for a blog post
export const getAverageRating = createServerFn({ method: "GET" })
  .inputValidator(zodValidator(slugSchema))
  .handler(async ({ data }) => {
    await ensureDbInitialized();
    const result = await db
      .select({
        average: avg(reviews.stars),
        count: count(reviews.stars),
      })
      .from(reviews)
      .where(eq(reviews.slug, data.slug));

    const row = result[0];
    return {
      average: row?.average ? Number(row.average) : 0,
      count: row?.count ?? 0,
    };
  });
