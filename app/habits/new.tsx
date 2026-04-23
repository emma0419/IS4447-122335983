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
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.kicker}>DAILY QUEST</Text>
        <Text style={styles.title}>New Habit</Text>
        <Text style={styles.subtitle}>
          Create a habit and assign it to a category to start tracking it.
        </Text>

        <View style={styles.card}>
          <Text style={styles.sectionLabel}>HABIT DETAILS</Text>

          <TextInput
            placeholder="Habit name"
            placeholderTextColor="#A07A8D"
            value={name}
            onChangeText={setName}
            style={styles.input}
          />

          <TextInput
            placeholder="Description"
            placeholderTextColor="#A07A8D"
            value={description}
            onChangeText={setDescription}
            style={[styles.input, styles.descriptionInput]}
            multiline
          />

          <Text style={[styles.sectionLabel, styles.sectionSpacing]}>
            CHOOSE CATEGORY
          </Text>

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
                <View style={styles.categoryLeft}>
                  <View
                    style={[
                      styles.colorDot,
                      { backgroundColor: category.color || "#999" },
                    ]}
                  />
                  <Text
                    style={[
                      styles.categoryText,
                      isSelected && styles.selectedCategoryText,
                    ]}
                  >
                    {category.name}
                  </Text>
                </View>

                {isSelected ? <View style={styles.selectedDot} /> : null}
              </TouchableOpacity>
            );
          })}

          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSave}
          >
            <Text style={styles.saveButtonText}>Save Habit</Text>
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
  input: {
    borderWidth: 1,
    borderColor: "#EAC8D8",
    backgroundColor: "#FFF9FB",
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 15,
    color: "#24131D",
    marginBottom: 12,
  },
  descriptionInput: {
    minHeight: 92,
    textAlignVertical: "top",
  },
  categoryOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 14,
    borderWidth: 1,
    borderColor: "#EAC8D8",
    borderRadius: 18,
    backgroundColor: "#FFF9FB",
    marginBottom: 10,
  },
  selectedCategoryOption: {
    borderColor: "#E6469A",
    backgroundColor: "#FDE4F0",
  },
  categoryLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  colorDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 10,
  },
  categoryText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#24131D",
  },
  selectedCategoryText: {
    color: "#A91E67",
  },
  selectedDot: {
    width: 12,
    height: 12,
    borderRadius: 999,
    backgroundColor: "#E6469A",
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