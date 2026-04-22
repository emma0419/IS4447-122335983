import { db } from "./index";
import { categories, habitLogs, habits, targets, users } from "./schema";

const seedDatabase = async () => {
  const existingUsers = await db.select().from(users);

  if (existingUsers.length > 0) {
    return;
  }

  const now = new Date().toISOString();

  await db.insert(users).values({
    name: "Demo User",
    email: "demo@dailyquest.com",
    password: "password123",
    createdAt: now,
  });

  await db.insert(categories).values([
    {
      userId: 1,
      name: "Health",
      color: "#22c55e",
      icon: "heart",
      createdAt: now,
    },
    {
      userId: 1,
      name: "Study",
      color: "#3b82f6",
      icon: "book",
      createdAt: now,
    },
  ]);

  await db.insert(habits).values([
    {
      userId: 1,
      categoryId: 1,
      name: "Drink Water",
      description: "Track daily glasses of water",
      metricType: "count",
      createdAt: now,
    },
    {
      userId: 1,
      categoryId: 2,
      name: "Read Notes",
      description: "Study each day",
      metricType: "boolean",
      createdAt: now,
    },
  ]);

  await db.insert(habitLogs).values([
    {
      userId: 1,
      habitId: 1,
      categoryId: 1,
      logDate: "2026-04-15",
      value: 6,
      notes: "Good progress",
      createdAt: now,
    },
    {
      userId: 1,
      habitId: 1,
      categoryId: 1,
      logDate: "2026-04-16",
      value: 5,
      notes: "Could drink more",
      createdAt: now,
    },
    {
      userId: 1,
      habitId: 2,
      categoryId: 2,
      logDate: "2026-04-16",
      value: 1,
      notes: "Revised databases",
      createdAt: now,
    },
  ]);

  await db.insert(targets).values([
    {
      userId: 1,
      habitId: 1,
      categoryId: 1,
      periodType: "weekly",
      targetValue: 35,
      createdAt: now,
    },
    {
      userId: 1,
      habitId: 2,
      categoryId: 2,
      periodType: "weekly",
      targetValue: 5,
      createdAt: now,
    },
  ]);
};

export default seedDatabase;