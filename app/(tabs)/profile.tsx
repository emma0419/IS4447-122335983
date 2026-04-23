// Basic profile screen where user cn sign out and switch from dark to light mode
import { useRouter } from "expo-router";
import { Alert, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "../../src/theme";

export default function ProfileScreen() {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
// Logout confirmation alert so user doesnt log out accidentally.
  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure?", [
      { text: "Cancel" },
      {
        text: "Logout",
        onPress: () => router.replace("/login"),
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.kicker}>DAILY QUEST</Text>
        <Text style={styles.title}>Profile</Text>
        <Text style={styles.subtitle}>
          Manage your appearance settings and sign out of your account.
        </Text>
        {/* Theme settings */}
        <View style={styles.card}>
          <Text style={styles.sectionLabel}>APPEARANCE</Text>
          <Text style={styles.infoText}>
            Current mode: {theme === "light" ? "Light" : "Dark"}
          </Text>

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={toggleTheme}
          >
            <Text style={styles.primaryButtonText}>
              Switch to {theme === "light" ? "Dark" : "Light"} Mode
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionLabel}>ACCOUNT</Text>
          <Text style={styles.infoText}>
            Sign out when youre finished using Daily Quest.
          </Text>

          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
          >
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8F1F4",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  kicker: {
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 3,
    color: "#C72C7C",
    marginBottom: 6,
  },
  title: {
    fontSize: 36,
    fontWeight: "800",
    color: "#2A1721",
  },
  subtitle: {
    marginTop: 8,
    marginBottom: 24,
    fontSize: 15,
    lineHeight: 22,
    color: "#7A5567",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: "#F0C9DB",
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 2,
    color: "#C72C7C",
    marginBottom: 10,
  },
  infoText: {
    fontSize: 15,
    lineHeight: 22,
    color: "#6E4258",
    marginBottom: 16,
  },
  primaryButton: {
    minHeight: 54,
    borderRadius: 18,
    backgroundColor: "#E6469A",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
  },
  logoutButton: {
    minHeight: 54,
    borderRadius: 18,
    backgroundColor: "#FFF1F3",
    borderWidth: 1,
    borderColor: "#F1B8C0",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  logoutButtonText: {
    color: "#C4455D",
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
  },
});