import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { categories } from "./categories";
import { users } from "./users";

export const habits = sqliteTable("habits", {
  id: integer("id").primaryKey({ autoIncrement: true }),

  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  categoryId: integer("category_id")
    .notNull()
    .references(() => categories.id, { onDelete: "restrict" }),

  name: text("name").notNull(),

  description: text("description"),

  metricType: text("metric_type", {
    enum: ["boolean", "count"],
  }).notNull(),

  createdAt: text("created_at").notNull(),
});