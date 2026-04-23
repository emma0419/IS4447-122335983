import { eq } from "drizzle-orm";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
    Alert,
    Button,
    FlatList,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { db } from "../../src/db";
import { categories, habits } from "../../src/db/schema";

export default function HabitsScreen() {
  const [habitList, setHabitList] = useState<any[]>([]);
  const router = useRouter();

  const loadHabits = async () => {
    const habitResults = await db.select().from(habits);
    const categoryResults = await db.select().from(categories);

    const merged = habitResults.map((habit) => {
      const category = categoryResults.find(
        (category) => category.id === habit.categoryId
      );

      return {
        ...habit,
        categoryName: category ? category.name : "Unknown",
      };
    });

    setHabitList(merged);
  };

  const deleteHabit = async (id: number) => {
    Alert.alert("Delete Habit", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await db.delete(habits).where(eq(habits.id, id));
          loadHabits();
        },
      },
    ]);
  };

  useFocusEffect(
    useCallback(() => {
      loadHabits();
    }, [])
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Habits</Text>

      {/* NEW BUTTON */}
      <Button
        title="Manage Categories"
        onPress={() => router.push("/categories")}
      />

      <View style={{ height: 10 }} />

      <Button
        title="Add Habit"
        onPress={() => router.push("/habits/new")}
      />

      <FlatList
        data={habitList}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.habitName}>{item.name}</Text>

            <Text style={styles.category}>
              Category: {item.categoryName}
            </Text>

            {item.description && (
              <Text style={styles.description}>
                {item.description}
              </Text>
            )}

            <Button
              title="Edit"
              onPress={() =>
                router.push({
                  pathname: "/habits/edit/[id]",
                  params: { id: item.id.toString() },
                } as any)
              }
            />

            <Button
              title="Delete"
              color="red"
              onPress={() => deleteHabit(item.id)}
            />
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>No habits yet</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 16,
  },
  card: {
    padding: 16,
    borderRadius: 10,
    backgroundColor: "#f2f2f2",
    marginBottom: 12,
  },
  habitName: {
    fontSize: 18,
    fontWeight: "600",
  },
  category: {
    marginTop: 4,
    fontSize: 14,
    fontWeight: "500",
    color: "#444",
  },
  description: {
    marginTop: 4,
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  empty: {
    marginTop: 40,
    textAlign: "center",
    color: "#888",
  },
});