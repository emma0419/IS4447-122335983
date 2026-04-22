import { eq } from "drizzle-orm";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Button, StyleSheet, TextInput, View } from "react-native";
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
    <View style={styles.container}>
      <TextInput
        placeholder="Category name"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />

      <TextInput
        placeholder="Color"
        value={color}
        onChangeText={setColor}
        style={styles.input}
      />

      <TextInput
        placeholder="Icon"
        value={icon}
        onChangeText={setIcon}
        style={styles.input}
      />

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
});