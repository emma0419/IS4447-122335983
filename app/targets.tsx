import { eq } from "drizzle-orm";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  Alert,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { db } from "../src/db";
import { categories, habitLogs, habits, targets } from "../src/db/schema";

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
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={targetList}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        ListHeaderComponent={
          <View>
            <Text style={styles.kicker}>DAILY QUEST</Text>
            <Text style={styles.title}>Targets</Text>
            <Text style={styles.subtitle}>
              Track progress toward your weekly and monthly goals in one place.
            </Text>

            <TouchableOpacity
              style={styles.addButton}
              onPress={() => router.push("/targets/new")}
            >
              <Text style={styles.addButtonText}>Add Target</Text>
            </TouchableOpacity>

            <Text style={styles.sectionTitle}>Your Goals</Text>
          </View>
        }
        renderItem={({ item }) => {
          const progressPercent =
            item.targetValue > 0
              ? Math.min((item.currentTotal / item.targetValue) * 100, 100)
              : 0;

          return (
            <View style={styles.card}>
              <View style={styles.topRow}>
                <View style={styles.periodBadge}>
                  <Text style={styles.periodBadgeText}>
                    {item.periodType.toUpperCase()} TARGET
                  </Text>
                </View>

                <View
                  style={[
                    styles.statusBadge,
                    item.status === "Met"
                      ? styles.statusBadgeMet
                      : styles.statusBadgeUnmet,
                  ]}
                >
                  <Text
                    style={[
                      styles.statusBadgeText,
                      item.status === "Met"
                        ? styles.statusBadgeTextMet
                        : styles.statusBadgeTextUnmet,
                    ]}
                  >
                    {item.status}
                  </Text>
                </View>
              </View>

              <Text style={styles.habitName}>{item.habitName}</Text>
              <Text style={styles.categoryText}>{item.categoryName}</Text>

              <View style={styles.statsBlock}>
                <View style={styles.statRow}>
                  <Text style={styles.statLabel}>Target Value</Text>
                  <Text style={styles.statValue}>{item.targetValue}</Text>
                </View>

                <View style={styles.statRow}>
                  <Text style={styles.statLabel}>Current Progress</Text>
                  <Text style={styles.statValue}>{item.currentTotal}</Text>
                </View>

                <View style={styles.statRow}>
                  <Text style={styles.statLabel}>Remaining</Text>
                  <Text style={styles.statValue}>{item.remaining}</Text>
                </View>
              </View>

              <View style={styles.progressSection}>
                <View style={styles.progressHeader}>
                  <Text style={styles.progressLabel}>Progress</Text>
                  <Text style={styles.progressPercent}>
                    {Math.round(progressPercent)}%
                  </Text>
                </View>

                <View style={styles.progressTrack}>
                  <View
                    style={[
                      styles.progressFill,
                      item.status === "Met"
                        ? styles.progressFillMet
                        : styles.progressFillUnmet,
                      { width: `${progressPercent}%` },
                    ]}
                  />
                </View>
              </View>

              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => deleteTarget(item.id)}
              >
                <Text style={styles.deleteButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          );
        }}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No targets yet</Text>
            <Text style={styles.emptyText}>
              Add a target to start tracking goal progress for your habits.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8F1F4",
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 28,
  },
  kicker: {
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 3,
    color: "#C72C7C",
    marginBottom: 6,
  },
  title: {
    fontSize: 34,
    fontWeight: "800",
    color: "#2A1721",
  },
  subtitle: {
    marginTop: 8,
    marginBottom: 20,
    fontSize: 15,
    lineHeight: 22,
    color: "#7A5567",
  },
  addButton: {
    minHeight: 54,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E6469A",
    marginBottom: 22,
  },
  addButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#2A1721",
    marginBottom: 14,
  },
  card: {
    padding: 18,
    borderRadius: 24,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#F0C9DB",
    marginBottom: 14,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  periodBadge: {
    backgroundColor: "#FDE4F0",
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  periodBadgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#B3236F",
    letterSpacing: 0.5,
  },
  statusBadge: {
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  statusBadgeMet: {
    backgroundColor: "#E8F7EE",
  },
  statusBadgeUnmet: {
    backgroundColor: "#FFF1F3",
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  statusBadgeTextMet: {
    color: "#2F8F57",
  },
  statusBadgeTextUnmet: {
    color: "#C4455D",
  },
  habitName: {
    fontSize: 22,
    fontWeight: "700",
    color: "#24131D",
    marginBottom: 4,
  },
  categoryText: {
    fontSize: 15,
    color: "#7A5567",
    marginBottom: 16,
  },
  statsBlock: {
    backgroundColor: "#FFF9FB",
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: "#F3D7E4",
    marginBottom: 16,
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 14,
    color: "#7A5567",
    fontWeight: "600",
  },
  statValue: {
    fontSize: 14,
    color: "#24131D",
    fontWeight: "700",
  },
  progressSection: {
    marginBottom: 16,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#7A5567",
  },
  progressPercent: {
    fontSize: 14,
    fontWeight: "700",
    color: "#24131D",
  },
  progressTrack: {
    height: 10,
    borderRadius: 999,
    backgroundColor: "#F3D7E4",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 999,
  },
  progressFillMet: {
    backgroundColor: "#43B36B",
  },
  progressFillUnmet: {
    backgroundColor: "#E6469A",
  },
  deleteButton: {
    minHeight: 46,
    borderRadius: 14,
    backgroundColor: "#FFF1F3",
    borderWidth: 1,
    borderColor: "#F1B8C0",
    alignItems: "center",
    justifyContent: "center",
  },
  deleteButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#C4455D",
  },
  emptyState: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: "#F0C9DB",
    alignItems: "center",
    marginTop: 20,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#2A1721",
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 15,
    lineHeight: 22,
    textAlign: "center",
    color: "#7A5567",
  },
});