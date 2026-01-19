import { pgTable, text, integer, timestamp, index } from "drizzle-orm/pg-core";

export const reviews = pgTable(
  "reviews",
  {
    id: text("id").primaryKey(),
    slug: text("slug").notNull(),
    name: text("name"),
    review: text("review").notNull(),
    stars: integer("stars").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [index("idx_reviews_slug").on(table.slug)]
);

export type Review = typeof reviews.$inferSelect;
export type NewReview = typeof reviews.$inferInsert;
