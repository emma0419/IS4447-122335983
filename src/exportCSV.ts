// exports habit log data from the app into a CSV file
// Expo File Sharing Documentation: https://docs.expo.dev/versions/latest/sdk/sharing/
import { File, Paths } from "expo-file-system";
import * as Sharing from "expo-sharing"; // So the user can export the CSV file  to another app such as email, files, or cloud storage.

// Defines structure of log records that are exported to CSV file
type ExportRecord = {
  id: number;
  habitName: string;
  categoryName: string;
  logDate: string;
  value: number;
  notes?: string | null;
};
// This helper function ensures values are safely formatted for CSV output.
function escapeCsvValue(value: string | number | null | undefined): string {
  const stringValue = String(value ?? "");
  return `"${stringValue.replace(/"/g, '""')}"`;
}
// converts log data into a CSV file and allows the user to export it from the app.
export async function exportLogsToCsv(records: ExportRecord[]) {
  if (!records.length) { // check if records are available to export
    throw new Error("No records available to export.");
  }
// Column headers for CSV files
  const headers = ["ID", "Habit", "Category", "Date", "Value", "Notes"];

  // I convert each record into a properly formatted CSV row.
  const rows = records.map((record) => [
    escapeCsvValue(record.id),
    escapeCsvValue(record.habitName),
    escapeCsvValue(record.categoryName),
    escapeCsvValue(record.logDate),
    escapeCsvValue(record.value),
    escapeCsvValue(record.notes ?? ""),
  ]);
// Combine headers and rows into one CSV string
  const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");

// Create new file inside apps document storage.
  const file = new File(Paths.document, "dailyquest-logs.csv");

// if file doesnt already exist, create it
  if (!file.exists) {
    file.create();
  }
// Write CSV content into the file
  file.write(csvContent);

  // Check if device supports sharing files.
  const canShare = await Sharing.isAvailableAsync();

  // If sharing is supported, open the share screen so user can export CSV file
  if (canShare) {
    await Sharing.shareAsync(file.uri, {
      mimeType: "text/csv",
      dialogTitle: "Export DailyQuest logs",
      UTI: "public.comma-separated-values-text",
    });
  }

  return file.uri;
}