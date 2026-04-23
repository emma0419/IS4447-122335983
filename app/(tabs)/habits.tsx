// Habit screen where users can view, add, edit, and delete their habits. Data reloads whenever the screen is reopened.
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
import { db } from "../../src/db"; // import database
import { categories, habits } from "../../src/db/schema";

export default function HabitsScreen() {
  const [habitList, setHabitList] = useState<any[]>([]);
  const router = useRouter();
// This function loads habits and categories from the database
// I then combine them so each habit shows the category name instead of only the category ID.
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
// This function deletes a habit, but first I show a confirmation alert so user does not accidentially delete
  const deleteHabit = async (id: number) => {
    Alert.alert("Delete Habit", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await db.delete(habits).where(eq(habits.id, id));
          loadHabits(); // after deleting, reload list
        },
      },
    ]);
  };
// Habits reload everytime user revisits the screen
  useFocusEffect(
    useCallback(() => {
      loadHabits();
    }, [])
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={habitList}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        // Header
        ListHeaderComponent={
          <View>
            <Text style={styles.kicker}>DAILY QUEST</Text>
            <Text style={styles.title}>My Habits</Text>
            <Text style={styles.subtitle}>
              Keep your routines organised and manage each habit in one place.
            </Text>

            <View style={styles.actions}>
              {/* Takes user to catageories page */}
              <TouchableOpacity
                style={[styles.actionButton, styles.secondaryButton]}
                onPress={() => router.push("/categories")}
              >
                <Text style={styles.secondaryButtonText}>Manage Categories</Text>
              </TouchableOpacity>
{/* Takes user to page where they create new habit */}
              <TouchableOpacity
                style={[styles.actionButton, styles.primaryButton]}
                onPress={() => router.push("/habits/new")}
              >
                <Text style={styles.primaryButtonText}>Add Habit</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.sectionTitle}>Your Habits</Text>
          </View>
        }
        // How each habit card is displayed on screen 
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{item.categoryName}</Text>
            </View>

            <Text style={styles.habitName}>{item.name}</Text>
{/* If habit has a description, show it. Otherwise placeholder message */}
            {item.description ? (
              <Text style={styles.description}>{item.description}</Text>
            ) : (
              <Text style={styles.noDescription}>No description added yet</Text>
            )}
           {/* Edit Button */}
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.smallButton, styles.editButton]}
                onPress={() =>
                  router.push({
                    pathname: "/habits/edit/[id]",
                    params: { id: item.id.toString() },
                  } as any)
                }
              >
                <Text style={styles.editButtonText}>Edit</Text>
              </TouchableOpacity>
            {/* Delete button */}
              <TouchableOpacity
                style={[styles.smallButton, styles.deleteButton]}
                onPress={() => deleteHabit(item.id)}
              >
                <Text style={styles.deleteButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        // If there are no habits, guide user to create one 
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No habits yet</Text>
            <Text style={styles.emptyText}>
              Add your first habit to start building your daily routine.
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
  actions: {
    gap: 12,
    marginBottom: 22,
  },
  actionButton: {
    minHeight: 54,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  primaryButton: {
    backgroundColor: "#E6469A",
  },
  secondaryButton: {
    backgroundColor: "#FFF7FA",
    borderWidth: 1.5,
    borderColor: "#E7B7CF",
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  secondaryButtonText: {
    color: "#B3236F",
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
  badge: {
    alignSelf: "flex-start",
    backgroundColor: "#FDE4F0",
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 10,
    marginBottom: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#B3236F",
    letterSpacing: 0.5,
  },
  habitName: {
    fontSize: 22,
    fontWeight: "700",
    color: "#24131D",
    marginBottom: 8,
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    color: "#6E4258",
    marginBottom: 16,
  },
  noDescription: {
    fontSize: 15,
    lineHeight: 22,
    color: "#A07A8D",
    fontStyle: "italic",
    marginBottom: 16,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 10,
  },
  smallButton: {
    flex: 1,
    minHeight: 46,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  editButton: {
    backgroundColor: "#FDE4F0",
    borderWidth: 1,
    borderColor: "#F3BDD7",
  },
  deleteButton: {
    backgroundColor: "#FFF1F3",
    borderWidth: 1,
    borderColor: "#F1B8C0",
  },
  editButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#B3236F",
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