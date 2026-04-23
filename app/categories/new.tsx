// Add new catageory
import { useRouter } from "expo-router";
import { useState } from "react";
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
import { categories } from "../../src/db/schema";

export default function NewCategoryScreen() {
  const [name, setName] = useState("");
  const [color, setColor] = useState("");
  const [icon, setIcon] = useState("");

  const router = useRouter();

  const handleSave = async () => {
    if (!name || !color || !icon) return;

    // Insert neW category record into the DB
    await db.insert(categories).values({
      userId: 1,
      name,
      color,
      icon,
      createdAt: new Date().toISOString(),
    });

    router.back();
  };

  return (
    // Let user input category name
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.kicker}>DAILY QUEST</Text>
        <Text style={styles.title}>New Category</Text>
        <Text style={styles.subtitle}>
          Create a category to organise your habits.
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

          {/* Define cat colour */}
          <TextInput
            placeholder="Color (example: #22c55e)"
            placeholderTextColor="#A07A8D"
            value={color}
            onChangeText={setColor}
            style={styles.input}
          />

          {/* Chose cat icon */}
          <TextInput
            placeholder="Icon (example: heart)"
            placeholderTextColor="#A07A8D"
            value={icon}
            onChangeText={setIcon}
            style={styles.input}
          />

          {/* Live preview of category */}
          <View style={styles.previewBox}>
            <View
              style={[
                styles.previewDot,
                { backgroundColor: color || "#EAC8D8" },
              ]}
            />
            <Text style={styles.previewText}>
               {name || "Category preview"}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSave}
          >
            <Text style={styles.saveButtonText}>Save Category</Text>
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