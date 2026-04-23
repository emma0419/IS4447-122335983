import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
    Button,
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { BarChart } from "react-native-chart-kit";
import { db } from "../../src/db";
import { habitLogs, habits } from "../../src/db/schema";

const screenWidth = Dimensions.get("window").width;

type FilterType = "daily" | "weekly" | "monthly";

export default function InsightsScreen() {
  const router = useRouter();

  const [selectedFilter, setSelectedFilter] =
    useState<FilterType>("daily");
  const [totalLogs, setTotalLogs] = useState(0);
  const [totalValue, setTotalValue] = useState(0);
  const [chartLabels, setChartLabels] = useState<string[]>([]);
  const [chartValues, setChartValues] = useState<number[]>([]);

  const isInSelectedPeriod = (
    logDate: string,
    filter: FilterType
  ) => {
    const today = new Date();
    const log = new Date(logDate);

    if (filter === "daily") {
      return log.toDateString() === today.toDateString();
    }

    if (filter === "weekly") {
      const diffInMs = today.getTime() - log.getTime();
      const diffInDays =
        diffInMs / (1000 * 60 * 60 * 24);
      return diffInDays >= 0 && diffInDays <= 7;
    }

    if (filter === "monthly") {
      return (
        log.getMonth() === today.getMonth() &&
        log.getFullYear() === today.getFullYear()
      );
    }

    return false;
  };

  const loadInsights = async (filter: FilterType) => {
    const allLogs = await db.select().from(habitLogs);
    const habitResults = await db.select().from(habits);

    const filteredLogs = allLogs.filter((log) =>
      isInSelectedPeriod(log.logDate, filter)
    );

    setTotalLogs(filteredLogs.length);

    const total = filteredLogs.reduce(
      (sum, log) => sum + log.value,
      0
    );
    setTotalValue(total);

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

  useFocusEffect(
    useCallback(() => {
      loadInsights(selectedFilter);
    }, [selectedFilter])
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Insights</Text>

      {/* NEW BUTTON */}
      <Button
        title="View Targets"
        onPress={() => router.push("/targets")}
      />

      <View style={{ height: 16 }} />

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

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Total Logs</Text>
        <Text style={styles.cardValue}>{totalLogs}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>
          Total Logged Value
        </Text>
        <Text style={styles.cardValue}>{totalValue}</Text>
      </View>

      <Text style={styles.sectionTitle}>
        Habit Totals
      </Text>

      {chartLabels.length > 0 ? (
        <BarChart
          data={{
            labels: chartLabels,
            datasets: [{ data: chartValues }],
          }}
          width={screenWidth - 32}
          height={260}
          fromZero
          chartConfig={{
            backgroundGradientFrom: "#ffffff",
            backgroundGradientTo: "#ffffff",
            decimalPlaces: 0,
            color: (opacity = 1) =>
              `rgba(0, 122, 255, ${opacity})`,
            labelColor: (opacity = 1) =>
              `rgba(0, 0, 0, ${opacity})`,
          }}
          style={styles.chart}
        />
      ) : (
        <Text style={styles.empty}>
          No data available for chart
        </Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 16,
  },
  filterRow: {
    flexDirection: "row",
    marginBottom: 16,
    gap: 8,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    backgroundColor: "#e5e5e5",
  },
  activeFilterButton: {
    backgroundColor: "#007AFF",
  },
  filterText: {
    color: "#333",
    fontWeight: "600",
  },
  activeFilterText: {
    color: "#fff",
  },
  card: {
    backgroundColor: "#f2f2f2",
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    color: "#666",
  },
  cardValue: {
    fontSize: 28,
    fontWeight: "700",
    marginTop: 6,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginTop: 16,
    marginBottom: 12,
  },
  chart: {
    borderRadius: 16,
  },
  empty: {
    marginTop: 20,
    color: "#888",
  },
});