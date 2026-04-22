import { eq } from "drizzle-orm";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    Button,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { db } from "../../../src/db";
import { categories, habits } from "../../../src/db/schema";

export default function EditHabitScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [categoryList, setCategoryList] = useState<any[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);

  useEffect(() => {
    const loadData = async () => {
      const habitResult = await db
        .select()
        .from(habits)
        .where(eq(habits.id, Number(id)));

      const categoryResults = await db.select().from(categories);
      setCategoryList(categoryResults);

      if (habitResult.length > 0) {
        const habit = habitResult[0];
        setName(habit.name);
        setDescription(habit.description || "");
        setSelectedCategoryId(habit.categoryId);
      }
    };

    loadData();
  }, [id]);

  const handleSave = async () => {
    if (!name || !selectedCategoryId) return;

    await db
      .update(habits)
      .set({
        name,
        description,
        categoryId: selectedCategoryId,
      })
      .where(eq(habits.id, Number(id)));

    router.back();
  };

  return (
    <View style={styles.container}>
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="Habit name"
        style={styles.input}
      />

      <TextInput
        value={description}
        onChangeText={setDescription}
        placeholder="Description"
        style={styles.input}
      />

      <Text style={styles.label}>Choose Category</Text>

      {categoryList.map((category) => {
        const isSelected = selectedCategoryId === category.id;

        return (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryOption,
              isSelected && styles.selectedCategoryOption,
            ]}
            onPress={() => setSelectedCategoryId(category.id)}
          >
            <View
              style={[
                styles.colorDot,
                { backgroundColor: category.color || "#999" },
              ]}
            />
            <Text style={styles.categoryText}>{category.name}</Text>
          </TouchableOpacity>
        );
      })}

      <Button title="Save Changes" onPress={handleSave} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 12,
    padding: 10,
    borderRadius: 6,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
  },
  categoryOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 10,
  },
  selectedCategoryOption: {
    borderColor: "#007AFF",
    backgroundColor: "#eef6ff",
  },
  colorDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 10,
  },
  categoryText: {
    fontSize: 16,
  },
});