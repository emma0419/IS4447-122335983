import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { initDatabase } from "../../src/db/init";
import seedDatabase from "../../src/db/seed";

export default function HomeScreen() {
  useEffect(() => {
    initDatabase();
    seedDatabase();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>DailyQuest</Text>
      <Text style={styles.subtitle}>Habit Tracker App</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
  },
  subtitle: {
    marginTop: 12,
    fontSize: 18,
  },
});