import { useRouter } from "expo-router";
import { Alert, Button, StyleSheet, Text, View } from "react-native";
import { useTheme } from "../../src/theme";

export default function ProfileScreen() {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure?", [
      { text: "Cancel" },
      {
        text: "Logout",
        onPress: () => router.replace("/"),
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>

      <Button
        title={`Switch to ${theme === "light" ? "Dark" : "Light"} Mode`}
        onPress={toggleTheme}
      />

      <View style={{ height: 20 }} />

      <Button title="Logout" onPress={handleLogout} />
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
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 20,
    textAlign: "center",
  },
});