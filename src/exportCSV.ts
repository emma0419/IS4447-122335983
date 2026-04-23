import { File, Paths } from "expo-file-system";
import * as Sharing from "expo-sharing";

type ExportRecord = {
  id: number;
  habitName: string;
  categoryName: string;
  logDate: string;
  value: number;
  notes?: string | null;
};

function escapeCsvValue(value: string | number | null | undefined): string {
  const stringValue = String(value ?? "");
  return `"${stringValue.replace(/"/g, '""')}"`;
}

export async function exportLogsToCsv(records: ExportRecord[]) {
  if (!records.length) {
    throw new Error("No records available to export.");
  }

  const headers = ["ID", "Habit", "Category", "Date", "Value", "Notes"];

  const rows = records.map((record) => [
    escapeCsvValue(record.id),
    escapeCsvValue(record.habitName),
    escapeCsvValue(record.categoryName),
    escapeCsvValue(record.logDate),
    escapeCsvValue(record.value),
    escapeCsvValue(record.notes ?? ""),
  ]);

  const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");

  const file = new File(Paths.document, "dailyquest-logs.csv");

  if (!file.exists) {
    file.create();
  }

  file.write(csvContent);

  const canShare = await Sharing.isAvailableAsync();

  if (canShare) {
    await Sharing.shareAsync(file.uri, {
      mimeType: "text/csv",
      dialogTitle: "Export DailyQuest logs",
      UTI: "public.comma-separated-values-text",
    });
  }

  return file.uri;
}