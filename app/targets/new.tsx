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
import { categories, habits, targets } from "../../src/db/schema";

export default function NewTargetScreen() {
  const router = useRouter();

  const [habitList, setHabitList] = useState<any[]>([]);
  const [categoryList, setCategoryList] = useState<any[]>([]);
  const [selectedHabitId, setSelectedHabitId] = useState<number | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [periodType, setPeriodType] = useState<"weekly" | "monthly">("weekly");
  const [targetValue, setTargetValue] = useState("");

  useEffect(() => {
    const loadData = async () => {
      const habitsResult = await db.select().from(habits);
      const categoriesResult = await db.select().from(categories);

      setHabitList(habitsResult);
      setCategoryList(categoriesResult);

      if (habitsResult.length > 0) {
        setSelectedHabitId(habitsResult[0].id);
      }

      if (categoriesResult.length > 0) {
        setSelectedCategoryId(categoriesResult[0].id);
      }
    };

    loadData();
  }, []);

  const handleSave = async () => {
    if (!selectedHabitId || !selectedCategoryId || !targetValue) return;

    await db.insert(targets).values({
      userId: 1,
      habitId: selectedHabitId,
      categoryId: selectedCategoryId,
      periodType,
      targetValue: Number(targetValue),
      createdAt: new Date().toISOString(),
    });

    router.back();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Choose Habit</Text>
      {habitList.map((habit) => {
        const isSelected = selectedHabitId === habit.id;

        return (
          <TouchableOpacity
            key={habit.id}
            style={[styles.option, isSelected && styles.selectedOption]}
            onPress={() => setSelectedHabitId(habit.id)}
          >
            <Text style={styles.optionText}>{habit.name}</Text>
          </TouchableOpacity>
        );
      })}

      <Text style={styles.label}>Choose Category</Text>
      {categoryList.map((category) => {
        const isSelected = selectedCategoryId === category.id;

        return (
          <TouchableOpacity
            key={category.id}
            style={[styles.option, isSelected && styles.selectedOption]}
            onPress={() => setSelectedCategoryId(category.id)}
          >
            <Text style={styles.optionText}>{category.name}</Text>
          </TouchableOpacity>
        );
      })}

      <Text style={styles.label}>Choose Period</Text>
      <TouchableOpacity
        style={[styles.option, periodType === "weekly" && styles.selectedOption]}
        onPress={() => setPeriodType("weekly")}
      >
        <Text style={styles.optionText}>Weekly</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.option, periodType === "monthly" && styles.selectedOption]}
        onPress={() => setPeriodType("monthly")}
      >
        <Text style={styles.optionText}>Monthly</Text>
      </TouchableOpacity>

      <TextInput
        placeholder="Target value"
        value={targetValue}
        onChangeText={setTargetValue}
        keyboardType="numeric"
        style={styles.input}
      />

      <Button title="Save Target" onPress={handleSave} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 12,
    marginBottom: 8,
  },
  option: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 10,
  },
  selectedOption: {
    borderColor: "#007AFF",
    backgroundColor: "#eef6ff",
  },
  optionText: {
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    marginTop: 12,
    marginBottom: 12,
    padding: 10,
    borderRadius: 6,
  },
});