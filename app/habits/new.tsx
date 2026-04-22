import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    Button,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { db } from "../../src/db";
import { categories, habits } from "../../src/db/schema";

export default function NewHabitScreen() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [categoryList, setCategoryList] = useState<any[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);

  const router = useRouter();

  useEffect(() => {
    const loadCategories = async () => {
      const results = await db.select().from(categories);
      setCategoryList(results);

      if (results.length > 0) {
        setSelectedCategoryId(results[0].id);
      }
    };

    loadCategories();
  }, []);

  const handleSave = async () => {
    if (!name || !selectedCategoryId) return;

    await db.insert(habits).values({
      userId: 1,
      categoryId: selectedCategoryId,
      name,
      description,
      metricType: "boolean",
      createdAt: new Date().toISOString(),
    });

    router.back();
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Habit name"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />

      <TextInput
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
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

      <Button title="Save Habit" onPress={handleSave} />
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