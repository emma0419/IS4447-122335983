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
import { categories } from "../../src/db/schema";

export default function CategoriesScreen() {
  const [categoryList, setCategoryList] = useState<any[]>([]);
  const router = useRouter();

  const loadCategories = async () => {
    const results = await db.select().from(categories);
    setCategoryList(results);
  };

  const deleteCategory = async (id: number) => {
    Alert.alert("Delete Category", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await db.delete(categories).where(eq(categories.id, id));
            loadCategories();
          } catch (error) {
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
    <View style={styles.container}>
      <Text style={styles.title}>Categories</Text>

      <Button
        title="Add Category"
        onPress={() => router.push("/categories/new")}
      />

      <FlatList
        data={categoryList}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={[styles.colorDot, { backgroundColor: item.color }]} />

            <View style={styles.textBlock}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.icon}>Icon: {item.icon}</Text>
            </View>

            <Button
              title="Edit"
              onPress={() =>
                router.push({
                  pathname: "/categories/edit/[id]",
                  params: { id: item.id.toString() },
                } as any)
              }
            />

            <Button
              title="Delete"
              color="red"
              onPress={() => deleteCategory(item.id)}
            />
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>No categories yet</Text>
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
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 10,
    backgroundColor: "#f2f2f2",
    marginBottom: 12,
    gap: 12,
  },
  colorDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
  },
  textBlock: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: "600",
  },
  icon: {
    marginTop: 4,
    fontSize: 14,
    color: "#666",
  },
  empty: {
    marginTop: 40,
    textAlign: "center",
    color: "#888",
  },
});