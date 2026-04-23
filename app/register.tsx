import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { db } from "../src/db";
import { users } from "../src/db/schema";

export default function RegisterScreen() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert("Missing fields", "Please fill in all fields.");
      return;
    }

    try {
      await db.insert(users).values({
        name,
        email,
        password,
        createdAt: new Date().toISOString(),
      });

      Alert.alert("Success", "Account created successfully.");
      router.replace("/login");
    } catch (error) {
      Alert.alert("Error", "Could not create account. Email may already exist.");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.kicker}>DAILY QUEST</Text>
        <Text style={styles.title}>Register</Text>
        <Text style={styles.subtitle}>
          Create your account and start building better habits.
        </Text>

        <View style={styles.card}>
          <TextInput
            placeholder="Name"
            placeholderTextColor="#A07A8D"
            value={name}
            onChangeText={setName}
            style={styles.input}
          />

          <TextInput
            placeholder="Email"
            placeholderTextColor="#A07A8D"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            style={styles.input}
          />

          <TextInput
            placeholder="Password"
            placeholderTextColor="#A07A8D"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
          />

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleRegister}
          >
            <Text style={styles.primaryButtonText}>Create Account</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => router.push("/login")}
        >
          <Text style={styles.secondaryButtonText}>
            Already have an account? Sign In
          </Text>
        </TouchableOpacity>
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
  },
  input: {
    borderWidth: 1,
    borderColor: "#EAC8D8",
    backgroundColor: "#FFF9FB",
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 15,
    marginBottom: 14,
    color: "#24131D",
  },
  primaryButton: {
    marginTop: 4,
    minHeight: 54,
    borderRadius: 18,
    backgroundColor: "#E6469A",
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  secondaryButton: {
    marginTop: 18,
    alignItems: "center",
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#B3236F",
  },
});