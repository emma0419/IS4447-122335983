import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
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
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.kicker}>DAILY QUEST</Text>
        <Text style={styles.title}>New Target</Text>
        <Text style={styles.subtitle}>
          Set a weekly or monthly goal for one of your habits.
        </Text>

        <View style={styles.card}>
          <Text style={styles.sectionLabel}>CHOOSE HABIT</Text>
          {habitList.map((habit) => {
            const isSelected = selectedHabitId === habit.id;

            return (
              <TouchableOpacity
                key={habit.id}
                style={[
                  styles.option,
                  isSelected && styles.selectedOption,
                ]}
                onPress={() => setSelectedHabitId(habit.id)}
              >
                <View style={styles.optionTopRow}>
                  <Text
                    style={[
                      styles.optionText,
                      isSelected && styles.selectedOptionText,
                    ]}
                  >
                    {habit.name}
                  </Text>
                  {isSelected ? <View style={styles.selectedDot} /> : null}
                </View>
              </TouchableOpacity>
            );
          })}

          <Text style={[styles.sectionLabel, styles.sectionSpacing]}>
            CHOOSE CATEGORY
          </Text>
          {categoryList.map((category) => {
            const isSelected = selectedCategoryId === category.id;

            return (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.option,
                  isSelected && styles.selectedOption,
                ]}
                onPress={() => setSelectedCategoryId(category.id)}
              >
                <View style={styles.optionTopRow}>
                  <Text
                    style={[
                      styles.optionText,
                      isSelected && styles.selectedOptionText,
                    ]}
                  >
                    {category.name}
                  </Text>
                  {isSelected ? <View style={styles.selectedDot} /> : null}
                </View>
              </TouchableOpacity>
            );
          })}

          <Text style={[styles.sectionLabel, styles.sectionSpacing]}>
            CHOOSE PERIOD
          </Text>
          <View style={styles.periodRow}>
            <TouchableOpacity
              style={[
                styles.periodButton,
                periodType === "weekly" && styles.selectedPeriodButton,
              ]}
              onPress={() => setPeriodType("weekly")}
            >
              <Text
                style={[
                  styles.periodButtonText,
                  periodType === "weekly" && styles.selectedPeriodButtonText,
                ]}
              >
                Weekly
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.periodButton,
                periodType === "monthly" && styles.selectedPeriodButton,
              ]}
              onPress={() => setPeriodType("monthly")}
            >
              <Text
                style={[
                  styles.periodButtonText,
                  periodType === "monthly" && styles.selectedPeriodButtonText,
                ]}
              >
                Monthly
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={[styles.sectionLabel, styles.sectionSpacing]}>
            TARGET VALUE
          </Text>
          <TextInput
            placeholder="Enter target value"
            placeholderTextColor="#A07A8D"
            value={targetValue}
            onChangeText={setTargetValue}
            keyboardType="numeric"
            style={styles.input}
          />

          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSave}
          >
            <Text style={styles.saveButtonText}>Save Target</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8F1F4",
  },
  container: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 28,
    flexGrow: 1,
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
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: "#F0C9DB",
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 2,
    color: "#C72C7C",
    marginBottom: 12,
  },
  sectionSpacing: {
    marginTop: 18,
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
  optionText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#24131D",
  },
  selectedOptionText: {
    color: "#A91E67",
  },
  selectedDot: {
    width: 12,
    height: 12,
    borderRadius: 999,
    backgroundColor: "#E6469A",
  },
  periodRow: {
    flexDirection: "row",
    gap: 10,
  },
  periodButton: {
    flex: 1,
    minHeight: 50,
    borderRadius: 16,
    backgroundColor: "#FFF7FA",
    borderWidth: 1,
    borderColor: "#E8C3D5",
    alignItems: "center",
    justifyContent: "center",
  },
  selectedPeriodButton: {
    backgroundColor: "#E6469A",
    borderColor: "#E6469A",
  },
  periodButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#7A5567",
  },
  selectedPeriodButtonText: {
    color: "#FFFFFF",
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
  },
  saveButton: {
    marginTop: 18,
    minHeight: 54,
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
});