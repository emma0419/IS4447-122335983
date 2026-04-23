import { useRouter } from "expo-router";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function StartScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Branding */}
        <View style={styles.brandBlock}>
          <Text style={styles.kicker}>WELCOME TO</Text>
          <Text style={styles.title}>DAILY QUEST</Text>
          <Text style={styles.subtitle}>
            Track habits, reach targets, and build streaks one day at a time.
          </Text>
        </View>

        {/* Action Card */}
        <View style={styles.card}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => router.push("/login")}
          >
            <Text style={styles.primaryButtonText}>Sign In</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => router.push("/register")}
          >
            <Text style={styles.secondaryButtonText}>Create Account</Text>
          </TouchableOpacity>
        </View>

        {/* Footer badge */}
        <View style={styles.footerBadge}>
          <View style={styles.dot} />
          <Text style={styles.footerText}>Start your habit journey today</Text>
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

  brandBlock: {
    marginBottom: 32,
  },

  kicker: {
    fontSize: 14,
    letterSpacing: 3,
    fontWeight: "700",
    color: "#C72C7C",
    marginBottom: 6,
  },

  title: {
    fontSize: 44,
    fontWeight: "800",
    color: "#E6469A",
    marginBottom: 10,
  },

  subtitle: {
    fontSize: 17,
    lineHeight: 25,
    color: "#6E4258",
    maxWidth: 280,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    padding: 24,
    borderWidth: 1,
    borderColor: "#F2C7DC",
  },

  primaryButton: {
    minHeight: 54,
    borderRadius: 18,
    backgroundColor: "#E6469A",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },

  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },

  secondaryButton: {
    minHeight: 54,
    borderRadius: 18,
    backgroundColor: "#FFF1F3",
    borderWidth: 1,
    borderColor: "#F1B8C0",
    alignItems: "center",
    justifyContent: "center",
  },

  secondaryButtonText: {
    color: "#C4455D",
    fontSize: 16,
    fontWeight: "700",
  },

  footerBadge: {
    marginTop: 28,
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FDE4F0",
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },

  dot: {
    width: 10,
    height: 10,
    borderRadius: 999,
    backgroundColor: "#E6469A",
    marginRight: 10,
  },

  footerText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#A02063",
  },
});