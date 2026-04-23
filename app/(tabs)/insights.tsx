// Insights page allows users to review their habit progress through summary statistics and a bar chart. 
// I added filtering options so the user can switch between daily, weekly, and monthly views.
// I also included a CSV export feature so habit log data can be downloaded and used outside the app if needed.
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  Alert,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { BarChart } from "react-native-chart-kit"; // bar chart library
import { db } from "../../src/db";
import { categories, habitLogs, habits } from "../../src/db/schema";
import { exportLogsToCsv } from "../../src/exportCSV";
// I store the screen width here so the chart can resize properly
// based on the device size.
const screenWidth = Dimensions.get("window").width;
// Defines filter options on screen. 
type FilterType = "daily" | "weekly" | "monthly";

export default function InsightsScreen() {
  const router = useRouter();

  const [selectedFilter, setSelectedFilter] =
    useState<FilterType>("daily");
  const [totalLogs, setTotalLogs] = useState(0);
  const [totalValue, setTotalValue] = useState(0);
  const [chartLabels, setChartLabels] = useState<string[]>([]);
  const [chartValues, setChartValues] = useState<number[]>([]);

// This function checks whether a log date belongs in the current daily, weekly, or monthly filter period
  const isInSelectedPeriod = (
    logDate: string,
    filter: FilterType
  ) => {
    const today = new Date();
    const log = new Date(logDate);
// Only include logs from today
    if (filter === "daily") {
      return log.toDateString() === today.toDateString();
    }
// Only include logs from the past seven days
    if (filter === "weekly") {
      const diffInMs = today.getTime() - log.getTime();
      const diffInDays =
        diffInMs / (1000 * 60 * 60 * 24);
      return diffInDays >= 0 && diffInDays <= 7;
    }
// Only include lomgs from current month and year.
    if (filter === "monthly") {
      return (
        log.getMonth() === today.getMonth() &&
        log.getFullYear() === today.getFullYear()
      );
    }

    return false;
  };
// Load all insight data based on selected filter , prepares value for chart
  const loadInsights = async (filter: FilterType) => {
    const allLogs = await db.select().from(habitLogs);
    const habitResults = await db.select().from(habits);
// Filter logs
    const filteredLogs = allLogs.filter((log) =>
      isInSelectedPeriod(log.logDate, filter)
    );

    setTotalLogs(filteredLogs.length);
// I calculate the total value across all filtered logs.
    const total = filteredLogs.reduce(
      (sum, log) => sum + log.value,
      0
    );
    setTotalValue(total);
// Calculate total value for each habit seperately. 
    const habitTotals = habitResults.map((habit) => {
      const relatedLogs = filteredLogs.filter(
        (log) => log.habitId === habit.id
      );

      const habitTotal = relatedLogs.reduce(
        (sum, log) => sum + log.value,
        0
      );

      return {
        name: habit.name,
        total: habitTotal,
      };
    });

    setChartLabels(habitTotals.map((item) => item.name));
    setChartValues(habitTotals.map((item) => item.total));
  };
// This function exports all habit log data into a CSV file.
  // I merge the logs with their related habit and category names so the exported file is easier to read.
  const handleExportCsv = async () => {
    try {
      const logResults = await db.select().from(habitLogs);
      const habitResults = await db.select().from(habits);
      const categoryResults = await db.select().from(categories);

      const exportData = logResults.map((log) => {
        const habit = habitResults.find((h) => h.id === log.habitId);
        const category = categoryResults.find((c) => c.id === log.categoryId);

        return {
          id: log.id,
          habitName: habit ? habit.name : "Unknown",
          categoryName: category ? category.name : "Unknown",
          logDate: log.logDate,
          value: log.value,
          notes: log.notes ?? "",
        };
      });
// If works, show success message
      await exportLogsToCsv(exportData);
      Alert.alert("Export complete", "CSV exported successfully.");
    } catch (error) {
      Alert.alert("Export failed", "Could not export your logs.");
      console.error(error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadInsights(selectedFilter);
    }, [selectedFilter])
  );

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.kicker}>DAILY QUEST</Text>
      <Text style={styles.title}>Insights</Text>
      <Text style={styles.subtitle}>
        Track your progress over time and see how each habit is performing.
      </Text>
{/* Takes user to targets screen */}
      <TouchableOpacity
        style={styles.targetsButton}
        onPress={() => router.push("/targets")}
      >
        <Text style={styles.targetsButtonText}>View Targets</Text>
      </TouchableOpacity>
{/* Button to export to CSV file */}
      <TouchableOpacity
        style={styles.exportButton}
        onPress={handleExportCsv}
      >
        <Text style={styles.exportButtonText}>Export CSV</Text>
      </TouchableOpacity>
{/* Buttons allow user to switch between daily, weekly, and monthly */}
      <View style={styles.filterRow}>
        {["daily", "weekly", "monthly"].map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[
              styles.filterButton,
              selectedFilter === filter &&
                styles.activeFilterButton,
            ]}
            onPress={() =>
              setSelectedFilter(filter as FilterType)
            }
          >
            <Text
              style={[
                styles.filterText,
                selectedFilter === filter &&
                  styles.activeFilterText,
              ]}
            >
              {filter.toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
{/* Summary statistics */}
      <View style={styles.statsRow}>
        <View style={styles.card}>
          <Text style={styles.cardLabel}>TOTAL LOGS</Text>
          <Text style={styles.cardValue}>{totalLogs}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>TOTAL VALUE</Text>
          <Text style={styles.cardValue}>{totalValue}</Text>
        </View>
      </View>
{/* Display bar chart */}
      <View style={styles.chartCard}>
        <Text style={styles.sectionTitle}>Habit Totals</Text>

        {chartLabels.length > 0 ? (
          <BarChart
            data={{
              labels: chartLabels,
              datasets: [{ data: chartValues }],
            }}
            width={screenWidth - 64}
            height={260}
            fromZero
            showValuesOnTopOfBars
            withInnerLines={false}
            chartConfig={{
              backgroundGradientFrom: "#FFFFFF",
              backgroundGradientTo: "#FFFFFF",
              decimalPlaces: 0,
              color: (opacity = 1) =>
                `rgba(230, 70, 154, ${opacity})`,
              labelColor: (opacity = 1) =>
                `rgba(42, 23, 33, ${opacity})`,
              fillShadowGradient: "#E6469A",
              fillShadowGradientOpacity: 1,
              barPercentage: 0.6,
              propsForBackgroundLines: {
                stroke: "#F3D7E4",
              },
            }}
            style={styles.chart}
            verticalLabelRotation={chartLabels.length > 3 ? 20 : 0}
          />
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No data available</Text>
            <Text style={styles.emptyText}>
              Add some logs in this period to see chart insights here.
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
    backgroundColor: "#F8F1F4",
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
  targetsButton: {
    minHeight: 54,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF7FA",
    borderWidth: 1.5,
    borderColor: "#E7B7CF",
    marginBottom: 12,
  },
  targetsButtonText: {
    color: "#B3236F",
    fontSize: 16,
    fontWeight: "700",
  },
  exportButton: {
    minHeight: 54,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E6469A",
    marginBottom: 18,
  },
  exportButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  filterRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 18,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: "#FFF7FA",
    borderWidth: 1,
    borderColor: "#E8C3D5",
    alignItems: "center",
  },
  activeFilterButton: {
    backgroundColor: "#E6469A",
    borderColor: "#E6469A",
  },
  filterText: {
    color: "#7A5567",
    fontWeight: "700",
    fontSize: 13,
    letterSpacing: 0.5,
  },
  activeFilterText: {
    color: "#FFFFFF",
  },
  statsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  card: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 18,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#F0C9DB",
  },
  cardLabel: {
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 1.5,
    color: "#C72C7C",
    marginBottom: 10,
  },
  cardValue: {
    fontSize: 30,
    fontWeight: "800",
    color: "#24131D",
  },
  chartCard: {
    backgroundColor: "#FFFFFF",
    padding: 18,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#F0C9DB",
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#2A1721",
    marginBottom: 16,
  },
  chart: {
    borderRadius: 18,
    marginTop: 4,
  },
  emptyState: {
    paddingVertical: 30,
    alignItems: "center",
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#2A1721",
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 15,
    lineHeight: 22,
    textAlign: "center",
    color: "#7A5567",
    maxWidth: 260,
  },
});