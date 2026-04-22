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
import { categories, habitLogs, habits, targets } from "../../src/db/schema";

export default function TargetsScreen() {
  const [targetList, setTargetList] = useState<any[]>([]);
  const router = useRouter();

  const loadTargets = async () => {
    const targetResults = await db.select().from(targets);
    const habitResults = await db.select().from(habits);
    const categoryResults = await db.select().from(categories);
    const logResults = await db.select().from(habitLogs);

    const merged = targetResults.map((target) => {
      const habit = habitResults.find((h) => h.id === target.habitId);
      const category = categoryResults.find((c) => c.id === target.categoryId);

      const relatedLogs = logResults.filter(
        (log) => log.habitId === target.habitId
      );

      const currentTotal = relatedLogs.reduce((sum, log) => sum + log.value, 0);
      const remaining = Math.max(target.targetValue - currentTotal, 0);
      const isMet = currentTotal >= target.targetValue;

      return {
        ...target,
        habitName: habit ? habit.name : "No habit",
        categoryName: category ? category.name : "No category",
        currentTotal,
        remaining,
        status: isMet ? "Met" : "Unmet",
      };
    });

    setTargetList(merged);
  };

  const deleteTarget = async (id: number) => {
    Alert.alert("Delete Target", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await db.delete(targets).where(eq(targets.id, id));
          loadTargets();
        },
      },
    ]);
  };

  useFocusEffect(
    useCallback(() => {
      loadTargets();
    }, [])
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Targets</Text>

      <Button title="Add Target" onPress={() => router.push("/targets/new")} />

      <FlatList
        data={targetList}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.period}>{item.periodType.toUpperCase()} TARGET</Text>
            <Text style={styles.text}>Habit: {item.habitName}</Text>
            <Text style={styles.text}>Category: {item.categoryName}</Text>
            <Text style={styles.value}>Target Value: {item.targetValue}</Text>
            <Text style={styles.text}>Current Progress: {item.currentTotal}</Text>
            <Text style={styles.text}>Remaining: {item.remaining}</Text>
            <Text
              style={[
                styles.status,
                item.status === "Met" ? styles.met : styles.unmet,
              ]}
            >
              Status: {item.status}
            </Text>

            <Button
              title="Delete"
              color="red"
              onPress={() => deleteTarget(item.id)}
            />
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No targets yet</Text>}
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
  period: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 8,
  },
  text: {
    fontSize: 15,
    marginBottom: 4,
  },
  value: {
    marginTop: 6,
    fontSize: 16,
    fontWeight: "600",
  },
  status: {
    marginTop: 8,
    marginBottom: 10,
    fontSize: 15,
    fontWeight: "700",
  },
  met: {
    color: "green",
  },
  unmet: {
    color: "red",
  },
  empty: {
    marginTop: 40,
    textAlign: "center",
    color: "#888",
  },
});