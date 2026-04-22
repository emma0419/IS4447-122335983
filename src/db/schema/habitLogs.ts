import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { categories } from "./categories";
import { habits } from "./habits";
import { users } from "./users";

export const habitLogs = sqliteTable("habit_logs", {
  id: integer("id").primaryKey({ autoIncrement: true }),

  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  habitId: integer("habit_id")
    .notNull()
    .references(() => habits.id, { onDelete: "cascade" }),

  categoryId: integer("category_id")
    .notNull()
    .references(() => categories.id, { onDelete: "restrict" }),

  logDate: text("log_date").notNull(),

  value: integer("value").notNull(),

  notes: text("notes"),

  createdAt: text("created_at").notNull(),
});