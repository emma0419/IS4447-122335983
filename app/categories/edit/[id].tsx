import { eq } from "drizzle-orm";
import { useLocalSearchParams, useRouter } from "expo-router";
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
import { db } from "../../../src/db";
import { categories } from "../../../src/db/schema";

export default function EditCategoryScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [name, setName] = useState("");
  const [color, setColor] = useState("");
  const [icon, setIcon] = useState("");

  useEffect(() => {
    const loadCategory = async () => {
      const result = await db
        .select()
        .from(categories)
        .where(eq(categories.id, Number(id)));

      if (result.length > 0) {
        setName(result[0].name);
        setColor(result[0].color);
        setIcon(result[0].icon);
      }
    };

    loadCategory();
  }, [id]);

  const handleSave = async () => {
    if (!name || !color || !icon) return;

    await db
      .update(categories)
      .set({
        name,
        color,
        icon,
      })
      .where(eq(categories.id, Number(id)));

    router.back();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.kicker}>DAILY QUEST</Text>
        <Text style={styles.title}>Edit Category</Text>
        <Text style={styles.subtitle}>
          Update the category name, color, or icon used for your habits.
        </Text>

        <View style={styles.card}>
          <Text style={styles.sectionLabel}>CATEGORY DETAILS</Text>

          <TextInput
            placeholder="Category name"
            placeholderTextColor="#A07A8D"
            value={name}
            onChangeText={setName}
            style={styles.input}
          />

          <TextInput
            placeholder="Color (e.g. #E6469A)"
            placeholderTextColor="#A07A8D"
            value={color}
            onChangeText={setColor}
            style={styles.input}
          />

          <TextInput
            placeholder="Icon (e.g. ⭐)"
            placeholderTextColor="#A07A8D"
            value={icon}
            onChangeText={setIcon}
            style={styles.input}
          />

          {/* Live preview */}
          <View style={styles.previewBox}>
            <View
              style={[
                styles.previewDot,
                { backgroundColor: color || "#EAC8D8" },
              ]}
            />
            <Text style={styles.previewText}>
              {icon || "⭐"} {name || "Category preview"}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSave}
          >
            <Text style={styles.saveButtonText}>Save Changes</Text>
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
  previewBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF7FA",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "#EAC8D8",
    marginTop: 8,
  },
  previewDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 10,
  },
  previewText: {
    fontSize: 16,
    fontWeight: "700",
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