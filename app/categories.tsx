// Categories screen where userws can view, add, edit and delte habit categories
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
import { categories } from "../src/db/schema";

export default function CategoriesScreen() {
  const [categoryList, setCategoryList] = useState<any[]>([]);
  const router = useRouter();
// Load categories from the DB
  const loadCategories = async () => {
    const results = await db.select().from(categories);
    setCategoryList(results);
  };
// Deletes category once user confirm the action
  const deleteCategory = async (id: number) => {
    Alert.alert("Delete Category", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await db.delete(categories).where(eq(categories.id, id));
            // After successfully deleting, reload categories
            loadCategories();
          } catch {
            // If category still being used by habit, show error message instead of deleting it.
            Alert.alert(
              "Cannot delete category",
              "This category is used by one or more habits."
            );
          }
        },
      },
    ]);
  };

  useFocusEffect(
    useCallback(() => {
      loadCategories();
    }, [])
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={categoryList}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        ListHeaderComponent={
          <View>
            <Text style={styles.kicker}>DAILY QUEST</Text>
            <Text style={styles.title}>Categories</Text>
            <Text style={styles.subtitle}>
              Organise habits using colour coded categories.
            </Text>

            <TouchableOpacity
            // Button to take users to create new category
              style={styles.addButton}
              onPress={() => router.push("/categories/new")}
            >
              <Text style={styles.addButtonText}>Add Category</Text>
            </TouchableOpacity>

            <Text style={styles.sectionTitle}>Your Categories</Text>
          </View>
        }
        // How each category card is displayed
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.leftRow}>
              <View
                style={[
                  styles.colorDot,
                  { backgroundColor: item.color },
                ]}
              />

              <View>
                {/* Display cat name  */}
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.iconText}>
                  Icon: {item.icon}
                </Text>
              </View>
            </View>
         {/* Button to let user edit or delete a category */}
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.smallButton, styles.editButton]}
                onPress={() =>
                  router.push({
                    pathname: "/categories/edit/[id]",
                    params: { id: item.id.toString() },
                  } as any)
                }
              >
                <Text style={styles.editButtonText}>Edit</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.smallButton, styles.deleteButton]}
                onPress={() => deleteCategory(item.id)}
              >
                <Text style={styles.deleteButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        // If no categories yet, display message
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>
              No categories yet
            </Text>
            <Text style={styles.emptyText}>
              Create your first category to organise habits.
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
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: "#F0C9DB",
    marginBottom: 14,
  },

  leftRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginBottom: 16,
  },

  colorDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },

  name: {
    fontSize: 20,
    fontWeight: "700",
    color: "#24131D",
  },

  iconText: {
    marginTop: 4,
    fontSize: 14,
    color: "#7A5567",
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