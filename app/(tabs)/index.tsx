// Homescreen of the app/welcome dashboard
// Connected to external API that generates random motivational quote
// API Source: https://zenquotes.io/
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Linking,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
// initialise db when application loads
import { initDatabase } from "../../src/db/init";
import seedDatabase from "../../src/db/seed";
// Defines structure of the quote onject returned from ZenQuotesAPI
type ZenQuote = {
  q: string;
  a: string;
  h?: string;
};

export default function HomeScreen() {
  const [quote, setQuote] = useState<ZenQuote | null>(null);
  const [loadingQuote, setLoadingQuote] = useState(true);
  const [quoteError, setQuoteError] = useState(""); // store error message if fails

   // When the screen loads for the first time,
  // I initialise the database and request a quote.
  useEffect(() => {
    initDatabase();
    seedDatabase();
    fetchRandomQuote();
  }, []);
// Fetch motiviation quote
  const fetchRandomQuote = async () => {
    try {
      setLoadingQuote(true); //loading indicator 
      setQuoteError("");

      const response = await fetch("https://zenquotes.io/api/random");
// If response unsuccesful, throw error
      if (!response.ok) {
        throw new Error("Failed to fetch quote");
      }

      const data = await response.json();
// Check API returned a valid quote
      if (!Array.isArray(data) || data.length === 0) {
        throw new Error("No quote returned");
      }

      setQuote(data[0]);
    } catch (error) {
      setQuoteError("Could not load quote right now."); // error message
      setQuote(null);
    } finally {
      setLoadingQuote(false);
    }
  };

  return (
    // Display app name and hsort description 
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.brandBlock}>
          <Text style={styles.kicker}>DAILY</Text>
          <Text style={styles.title}>QUEST</Text>
          <Text style={styles.subtitle}>
            Build better habits, one day at a time.
          </Text>
        </View>
{/* Display motivational quote of the day */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>TODAY&apos;S QUOTE</Text>
{/* If quote still loading, show spinner */}
          {loadingQuote ? (
            <View style={styles.centerBlock}>
              <ActivityIndicator size="small" color="#E6469A" />
              <Text style={styles.helperText}>Loading inspiration...</Text>
            </View>
            // If error, display error message
          ) : quoteError ? (
            <View style={styles.centerBlock}>
              <Text style={styles.errorText}>{quoteError}</Text>
            </View>
          ) : (
            <>
              <Text style={styles.quoteText}>“{quote?.q}”</Text>
              <Text style={styles.authorText}>— {quote?.a}</Text>
            </>
          )}
{/* Load another quote when pressed */}
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={fetchRandomQuote}
          >
            <Text style={styles.primaryButtonText}>New Quote</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => Linking.openURL("https://zenquotes.io/")}
          >
            <Text style={styles.attributionText}>
              Quotes provided by ZenQuotes API
            </Text>
          </TouchableOpacity>
        </View>
{/* Motivational message   */}
        <View style={styles.footerBadge}>
          <View style={styles.dot} />
          <Text style={styles.footerText}>Ready for today&apos;s quest</Text>
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
    fontSize: 18,
    letterSpacing: 4,
    color: "#C72C7C",
    marginBottom: 6,
  },
  title: {
    fontSize: 52,
    lineHeight: 56,
    fontWeight: "800",
    color: "#E6469A",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    lineHeight: 26,
    color: "#6E4258",
    maxWidth: 280,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    padding: 24,
    borderWidth: 1,
    borderColor: "#F2C7DC",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  cardLabel: {
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 2,
    color: "#C72C7C",
    marginBottom: 12,
  },
  quoteText: {
    fontSize: 22,
    lineHeight: 32,
    color: "#2A1721",
    fontWeight: "600",
    marginBottom: 14,
  },
  authorText: {
    fontSize: 16,
    color: "#7A5567",
    marginBottom: 20,
    fontStyle: "italic",
  },
  centerBlock: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
  },
  helperText: {
    marginTop: 10,
    fontSize: 15,
    color: "#7A5567",
  },
  errorText: {
    fontSize: 15,
    color: "#C4455D",
    textAlign: "center",
  },
  primaryButton: {
    minHeight: 52,
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
  attributionText: {
    fontSize: 13,
    color: "#A02063",
    textAlign: "center",
    textDecorationLine: "underline",
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