import { useRouter } from "expo-router";
import { Button, StyleSheet, Text, View } from "react-native";

export default function StartScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>DailyQuest</Text>
      <Text style={styles.subtitle}>Habit Tracker App</Text>

      <View style={styles.buttonContainer}>
        <Button title="Sign In" onPress={() => router.push("/login")} />
      </View>

      <View style={styles.buttonContainer}>
        <Button title="Register" onPress={() => router.push("/register")} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 18,
    textAlign: "center",
    marginTop: 8,
    marginBottom: 32,
    color: "#666",
  },
  buttonContainer: {
    marginBottom: 12,
  },
});