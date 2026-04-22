import { eq } from "drizzle-orm";
import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
    Alert,
    Button,
    FlatList,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { db } from "../../src/db";
import { categories, habitLogs, habits } from "../../src/db/schema";

export default function LogScreen() {
  const [habitList, setHabitList] = useState<any[]>([]);
  const [categoryList, setCategoryList] = useState<any[]>([]);
  const [logList, setLogList] = useState<any[]>([]);
  const [selectedHabitId, setSelectedHabitId] = useState<number | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [value, setValue] = useState("");
  const [notes, setNotes] = useState("");
  const [filterHabitId, setFilterHabitId] = useState<number | null>(null);
  const [filterCategoryId, setFilterCategoryId] = useState<number | null>(null);
  const [searchText, setSearchText] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  const loadData = async () => {
    const habitResults = await db.select().from(habits);
    const categoryResults = await db.select().from(categories);
    const logResults = await db.select().from(habitLogs);

    const mergedHabits = habitResults.map((habit) => {
      const category = categoryResults.find((c) => c.id === habit.categoryId);

      return {
        ...habit,
        categoryName: category ? category.name : "Unknown",
      };
    });

    const mergedLogs = logResults.map((log) => {
      const habit = habitResults.find((h) => h.id === log.habitId);
      const category = categoryResults.find((c) => c.id === log.categoryId);

      return {
        ...log,
        habitName: habit ? habit.name : "Unknown",
        categoryName: category ? category.name : "Unknown",
      };
    });

    let filteredLogs = mergedLogs;

    if (filterHabitId !== null) {
      filteredLogs = filteredLogs.filter((log) => log.habitId === filterHabitId);
    }

    if (filterCategoryId !== null) {
      filteredLogs = filteredLogs.filter(
        (log) => log.categoryId === filterCategoryId
      );
    }

    if (searchText.trim() !== "") {
      const lowerSearch = searchText.toLowerCase();
      filteredLogs = filteredLogs.filter((log) =>
        (log.notes || "").toLowerCase().includes(lowerSearch)
      );
    }

    if (dateFilter.trim() !== "") {
      filteredLogs = filteredLogs.filter((log) => log.logDate === dateFilter);
    }

    setHabitList(mergedHabits);
    setCategoryList(categoryResults);
    setLogList(filteredLogs);

    if (mergedHabits.length > 0 && !selectedHabitId) {
      setSelectedHabitId(mergedHabits[0].id);
      setSelectedCategoryId(mergedHabits[0].categoryId);
    }
  };

  useEffect(() => {
    loadData();
  }, [filterHabitId, filterCategoryId, searchText, dateFilter]);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [filterHabitId, filterCategoryId, searchText, dateFilter])
  );

  const handleSelectHabit = (habit: any) => {
    setSelectedHabitId(habit.id);
    setSelectedCategoryId(habit.categoryId);
  };

  const handleSave = async () => {
    if (!selectedHabitId || !selectedCategoryId || !value) {
      Alert.alert("Missing fields", "Please choose a habit and enter a value.");
      return;
    }

    await db.insert(habitLogs).values({
      userId: 1,
      habitId: selectedHabitId,
      categoryId: selectedCategoryId,
      logDate: new Date().toISOString().split("T")[0],
      value: Number(value),
      notes,
      createdAt: new Date().toISOString(),
    });

    setValue("");
    setNotes("");
    loadData();
  };

  const deleteLog = async (id: number) => {
    Alert.alert("Delete Log", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await db.delete(habitLogs).where(eq(habitLogs.id, id));
          loadData();
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Log Activity</Text>

      <Text style={styles.label}>Choose Habit</Text>
      {habitList.map((habit) => {
        const isSelected = selectedHabitId === habit.id;

        return (
          <TouchableOpacity
            key={habit.id}
            style={[styles.option, isSelected && styles.selectedOption]}
            onPress={() => handleSelectHabit(habit)}
          >
            <Text style={styles.optionTitle}>{habit.name}</Text>
            <Text style={styles.optionSubtitle}>
              Category: {habit.categoryName}
            </Text>
          </TouchableOpacity>
        );
      })}

      <TextInput
        placeholder="Value"
        value={value}
        onChangeText={setValue}
        keyboardType="numeric"
        style={styles.input}
      />

      <TextInput
        placeholder="Notes (optional)"
        value={notes}
        onChangeText={setNotes}
        style={styles.input}
      />

      <Button title="Save Log" onPress={handleSave} />

      <Text style={styles.sectionTitle}>Filter Logs by Habit</Text>

      <TouchableOpacity
        style={[
          styles.filterOption,
          filterHabitId === null && styles.selectedOption,
        ]}
        onPress={() => setFilterHabitId(null)}
      >
        <Text style={styles.optionTitle}>All Habits</Text>
      </TouchableOpacity>

      {habitList.map((habit) => {
        const isSelected = filterHabitId === habit.id;

        return (
          <TouchableOpacity
            key={`filter-habit-${habit.id}`}
            style={[styles.filterOption, isSelected && styles.selectedOption]}
            onPress={() => setFilterHabitId(habit.id)}
          >
            <Text style={styles.optionTitle}>{habit.name}</Text>
          </TouchableOpacity>
        );
      })}

      <Text style={styles.sectionTitle}>Filter Logs by Category</Text>

      <TouchableOpacity
        style={[
          styles.filterOption,
          filterCategoryId === null && styles.selectedOption,
        ]}
        onPress={() => setFilterCategoryId(null)}
      >
        <Text style={styles.optionTitle}>All Categories</Text>
      </TouchableOpacity>

      {categoryList.map((category) => {
        const isSelected = filterCategoryId === category.id;

        return (
          <TouchableOpacity
            key={`filter-category-${category.id}`}
            style={[styles.filterOption, isSelected && styles.selectedOption]}
            onPress={() => setFilterCategoryId(category.id)}
          >
            <Text style={styles.optionTitle}>{category.name}</Text>
          </TouchableOpacity>
        );
      })}

      <Text style={styles.sectionTitle}>Search Notes</Text>

      <TextInput
        placeholder="Search notes..."
        value={searchText}
        onChangeText={setSearchText}
        style={styles.input}
      />

      <Text style={styles.sectionTitle}>Filter by Date</Text>

      <TextInput
        placeholder="YYYY-MM-DD"
        value={dateFilter}
        onChangeText={setDateFilter}
        style={styles.input}
      />

      <Text style={styles.sectionTitle}>Recent Logs</Text>

      <FlatList
        data={logList}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.logTitle}>{item.habitName}</Text>
            <Text>Category: {item.categoryName}</Text>
            <Text>Date: {item.logDate}</Text>
            <Text>Value: {item.value}</Text>
            {item.notes ? <Text>Notes: {item.notes}</Text> : null}

            <Button
              title="Delete"
              color="red"
              onPress={() => deleteLog(item.id)}
            />
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No logs yet</Text>}
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
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginTop: 24,
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
  },
  option: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 10,
  },
  filterOption: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 8,
  },
  selectedOption: {
    borderColor: "#007AFF",
    backgroundColor: "#eef6ff",
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  optionSubtitle: {
    marginTop: 4,
    fontSize: 14,
    color: "#666",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    marginTop: 12,
    marginBottom: 12,
    padding: 10,
    borderRadius: 6,
  },
  card: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#f2f2f2",
    marginBottom: 10,
  },
  logTitle: {
    fontWeight: "600",
    marginBottom: 4,
  },
  empty: {
    marginTop: 40,
    textAlign: "center",
    color: "#888",
  },
});