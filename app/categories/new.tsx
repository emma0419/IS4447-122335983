import { useRouter } from "expo-router";
import { useState } from "react";
import { Button, StyleSheet, TextInput, View } from "react-native";
import { db } from "../../src/db";
import { categories } from "../../src/db/schema";

export default function NewCategoryScreen() {
  const [name, setName] = useState("");
  const [color, setColor] = useState("");
  const [icon, setIcon] = useState("");

  const router = useRouter();

  const handleSave = async () => {
    if (!name || !color || !icon) return;

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
    <View style={styles.container}>
      <TextInput
        placeholder="Category name"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />

      <TextInput
        placeholder="Color (example: #22c55e)"
        value={color}
        onChangeText={setColor}
        style={styles.input}
      />

      <TextInput
        placeholder="Icon (example: heart)"
        value={icon}
        onChangeText={setIcon}
        style={styles.input}
      />

      <Button title="Save Category" onPress={handleSave} />
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
});