import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { categories } from "./categories";
import { habits } from "./habits";
import { users } from "./users";

export const targets = sqliteTable("targets", {
  id: integer("id").primaryKey({ autoIncrement: true }),

  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  habitId: integer("habit_id").references(() => habits.id, {
    onDelete: "cascade",
  }),

  categoryId: integer("category_id").references(() => categories.id, {
    onDelete: "cascade",
  }),

  periodType: text("period_type", {
    enum: ["weekly", "monthly"],
  }).notNull(),

  targetValue: integer("target_value").notNull(),

  createdAt: text("created_at").notNull(),
});