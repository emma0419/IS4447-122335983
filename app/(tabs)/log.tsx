// Log screen where users can record habit activity, add optional notes, and review their previous entries.
import { eq } from "drizzle-orm";
import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  SafeAreaView,
  ScrollView,
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

// Loads all habits, categories, and logs from the database.
  // I also merge related data together so the screen can show names instead of only IDs.
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
// Here I attach the habit name and category name to each log  so the log cards are easier to read.
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
// Filters log by habit
    if (filterHabitId !== null) {
      filteredLogs = filteredLogs.filter((log) => log.habitId === filterHabitId);
    }
// Filters log by category.
    if (filterCategoryId !== null) {
      filteredLogs = filteredLogs.filter((log) => log.categoryId === filterCategoryId);
    }
// // This lets the user search log notes using text.
    if (searchText.trim() !== "") {
      const lowerSearch = searchText.toLowerCase();
      filteredLogs = filteredLogs.filter((log) =>
        (log.notes || "").toLowerCase().includes(lowerSearch)
      );
    }
// Filters log by date.
    if (dateFilter.trim() !== "") {
      filteredLogs = filteredLogs.filter((log) => log.logDate === dateFilter);
    }

    setHabitList(mergedHabits);
    setCategoryList(categoryResults);
    setLogList(filteredLogs);
// If habits available but none are selected yet, automatically choose the first one
    if (mergedHabits.length > 0 && !selectedHabitId) {
      setSelectedHabitId(mergedHabits[0].id);
      setSelectedCategoryId(mergedHabits[0].categoryId);
    }
  };
// reload data if filter changes
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
// Saves new log entry to DB
// User cannot save incomplete log. 
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
// After saving clear input fields
    setValue("");
    setNotes("");
    loadData();
  };
// Deletes log after user vconfirms
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
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={logList}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false} // hide vertical scroll 
        contentContainerStyle={styles.pageContent}
        // Header
        ListHeaderComponent={
          <View>
            <Text style={styles.kicker}>DAILY QUEST</Text>
            <Text style={styles.title}>Log Activity</Text>
            <Text style={styles.subtitle}>
              Record your progress, add notes, and filter past entries quickly.
            </Text>
           {/* Create new log entry */}
            <View style={styles.panel}>
              <Text style={styles.sectionLabel}>CHOOSE HABIT</Text>

              {habitList.map((habit) => {
                const isSelected = selectedHabitId === habit.id; //indicator dot

                return (
                  <TouchableOpacity
                    key={habit.id}
                    style={[styles.option, isSelected && styles.selectedOption]}
                    onPress={() => handleSelectHabit(habit)}
                  >
                    <View style={styles.optionTopRow}>
                      <Text
                        style={[
                          styles.optionTitle,
                          isSelected && styles.selectedOptionTitle,
                        ]}
                      >
                        {habit.name}
                      </Text>
                      {isSelected ? <View style={styles.selectedDot} /> : null}
                    </View>

                    <Text
                      style={[
                        styles.optionSubtitle,
                        isSelected && styles.selectedOptionSubtitle,
                      ]}
                    >
                      Category: {habit.categoryName}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            {/* Stores numeric value for log entry */}
              <TextInput
                placeholder="Value"
                placeholderTextColor="#A07A8D"
                value={value}
                onChangeText={setValue}
                keyboardType="numeric"
                style={styles.input}
              />
            {/* Allows users to add notes */}
              <TextInput
                placeholder="Notes (optional)"
                placeholderTextColor="#A07A8D"
                value={notes}
                onChangeText={setNotes}
                style={[styles.input, styles.notesInput]}
                multiline
              />
            {/* Button to save entry */}
              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>Save Log</Text>
              </TouchableOpacity>
            </View>
           {/* Filtering Pannel */}
            <View style={styles.panel}>
              <Text style={styles.sectionLabel}>FILTER BY HABIT</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.chipRow}
              >
                <TouchableOpacity
                  style={[
                    styles.filterChip,
                    filterHabitId === null && styles.filterChipSelected,
                  ]}
                  onPress={() => setFilterHabitId(null)}
                >
                  <Text
                    style={[
                      styles.filterChipText,
                      filterHabitId === null && styles.filterChipTextSelected,
                    ]}
                  >
                    All Habits
                  </Text>
                </TouchableOpacity>

                {habitList.map((habit) => {
                  const isSelected = filterHabitId === habit.id;

                  return (
                    <TouchableOpacity
                      key={`filter-habit-${habit.id}`}
                      style={[
                        styles.filterChip,
                        isSelected && styles.filterChipSelected,
                      ]}
                      onPress={() => setFilterHabitId(habit.id)}
                    >
                      <Text
                        style={[
                          styles.filterChipText,
                          isSelected && styles.filterChipTextSelected,
                        ]}
                      >
                        {habit.name}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>

              <Text style={[styles.sectionLabel, styles.filterSpacing]}>
                FILTER BY CATEGORY
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.chipRow}
              >
                <TouchableOpacity
                  style={[
                    styles.filterChip,
                    filterCategoryId === null && styles.filterChipSelected,
                  ]}
                  onPress={() => setFilterCategoryId(null)}
                >
                  <Text
                    style={[
                      styles.filterChipText,
                      filterCategoryId === null && styles.filterChipTextSelected,
                    ]}
                  >
                    All Categories
                  </Text>
                </TouchableOpacity>

                {categoryList.map((category) => {
                  const isSelected = filterCategoryId === category.id;

                  return (
                    <TouchableOpacity
                      key={`filter-category-${category.id}`}
                      style={[
                        styles.filterChip,
                        isSelected && styles.filterChipSelected,
                      ]}
                      onPress={() => setFilterCategoryId(category.id)}
                    >
                      <Text
                        style={[
                          styles.filterChipText,
                          isSelected && styles.filterChipTextSelected,
                        ]}
                      >
                        {category.name}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>

              <Text style={[styles.sectionLabel, styles.filterSpacing]}>
                SEARCH NOTES
              </Text>
              <TextInput
                placeholder="Search notes..."
                placeholderTextColor="#A07A8D"
                value={searchText}
                onChangeText={setSearchText}
                style={styles.input}
              />

              <Text style={[styles.sectionLabel, styles.filterSpacing]}>
                FILTER BY DATE
              </Text>
              <TextInput
                placeholder="YYYY-MM-DD"
                placeholderTextColor="#A07A8D"
                value={dateFilter}
                onChangeText={setDateFilter}
                style={styles.input}
              />
            </View>

            <Text style={styles.logsTitle}>Recent Logs</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{item.categoryName}</Text>
            </View>

            <Text style={styles.logTitle}>{item.habitName}</Text>

            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Date</Text>
              <Text style={styles.metaValue}>{item.logDate}</Text>
            </View>

            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Value</Text>
              <Text style={styles.metaValue}>{item.value}</Text>
            </View>

            {item.notes ? (
              <View style={styles.notesBlock}>
                <Text style={styles.notesLabel}>Notes</Text>
                <Text style={styles.notesText}>{item.notes}</Text>
              </View>
            ) : null}
{/* Delets selected log entry */}
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => deleteLog(item.id)}
            >
              <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
        // If no saved logs, show helpful message
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No logs yet</Text>
            <Text style={styles.emptyText}>
              Your logged activity will appear here once you save your first entry.
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
  pageContent: {
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
  panel: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: "#F0C9DB",
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 2,
    color: "#C72C7C",
    marginBottom: 12,
  },
  option: {
    padding: 14,
    borderWidth: 1,
    borderColor: "#EAC8D8",
    borderRadius: 18,
    backgroundColor: "#FFF9FB",
    marginBottom: 10,
  },
  selectedOption: {
    borderColor: "#E6469A",
    backgroundColor: "#FDE4F0",
  },
  optionTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  optionTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#24131D",
  },
  selectedOptionTitle: {
    color: "#A91E67",
  },
  optionSubtitle: {
    marginTop: 5,
    fontSize: 14,
    color: "#7A5567",
  },
  selectedOptionSubtitle: {
    color: "#B3236F",
  },
  selectedDot: {
    width: 12,
    height: 12,
    borderRadius: 999,
    backgroundColor: "#E6469A",
  },
  input: {
    borderWidth: 1,
    borderColor: "#EAC8D8",
    backgroundColor: "#FFF9FB",
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 15,
    color: "#24131D",
    marginTop: 10,
  },
  notesInput: {
    minHeight: 92,
    textAlignVertical: "top",
  },
  saveButton: {
    marginTop: 14,
    minHeight: 52,
    borderRadius: 18,
    backgroundColor: "#E6469A",
    alignItems: "center",
    justifyContent: "center",
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  chipRow: {
    gap: 10,
    paddingRight: 6,
  },
  filterSpacing: {
    marginTop: 18,
  },
  filterChip: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 999,
    backgroundColor: "#FFF7FA",
    borderWidth: 1,
    borderColor: "#E8C3D5",
  },
  filterChipSelected: {
    backgroundColor: "#FDE4F0",
    borderColor: "#E6469A",
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#7A5567",
  },
  filterChipTextSelected: {
    color: "#B3236F",
  },
  logsTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#2A1721",
    marginTop: 6,
    marginBottom: 14,
  },
  card: {
    padding: 18,
    borderRadius: 24,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#F0C9DB",
    marginBottom: 12,
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
  },
  logTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#24131D",
    marginBottom: 12,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  metaLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#7A5567",
  },
  metaValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#24131D",
  },
  notesBlock: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#F3D7E4",
  },
  notesLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#C72C7C",
    letterSpacing: 1,
    marginBottom: 6,
  },
  notesText: {
    fontSize: 15,
    lineHeight: 22,
    color: "#6E4258",
  },
  deleteButton: {
    marginTop: 16,
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