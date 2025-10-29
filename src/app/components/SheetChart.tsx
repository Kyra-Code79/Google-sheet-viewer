"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  Legend,
} from "recharts";

type GoogleSheetCell = { v?: string | number | null };
type GoogleSheetRow = { c: GoogleSheetCell[] };
type GoogleSheetCol = { label?: string };
type SheetData = { [key: string]: string | number | undefined };

export default function SheetChart({
  sheetUrl: defaultUrl = "",
  darkMode,
}: {
  sheetUrl?: string;
  darkMode: boolean;
}) {
  const [sheetUrl, setSheetUrl] = useState(defaultUrl);
  const [data, setData] = useState<SheetData[]>([]);
  const [sheetName, setSheetName] = useState("Sheet1");
  const [search, setSearch] = useState("");
  const [columnFilters, setColumnFilters] = useState<{ [key: string]: string }>({});
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Apply dark mode
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  // Fetch Google Sheet data every 10s
  useEffect(() => {
    if (!sheetUrl) return;

    const fetchData = async () => {
      try {
        const sheetIdMatch = sheetUrl.match(/\/d\/([a-zA-Z0-9-_]+)/);
        const sheetId = sheetIdMatch ? sheetIdMatch[1] : null;
        if (!sheetId) return console.error("Invalid sheet URL");

        const gvizUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json&sheet=${sheetName}`;
        const res = await fetch(gvizUrl);
        const text = await res.text();
        const jsonString = text.substring(text.indexOf("{"), text.lastIndexOf("}") + 1);
        const json = JSON.parse(jsonString);

        const rows = (json.table.rows as GoogleSheetRow[]).map((r) =>
          r.c.map((c) => c?.v ?? "")
        );
        const headers = (json.table.cols as GoogleSheetCol[]).map(
          (c) => c.label || "Column"
        );

        // Convert checkbox values to Yes / No
        const formattedData: SheetData[] = rows.map((row) =>
          Object.fromEntries(
            row.map((val, i) => {
              let v = val ?? "";

              // Handle checkboxes and boolean-like values
              if (v === "TRUE" || v === 1) v = "Yes";
              else if (v === "FALSE" || v === 0) v = "No";

              return [headers[i], v];
            })
          )
        );

        setData(formattedData);
      } catch (err) {
        console.error("Error fetching sheet:", err);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, [sheetUrl, sheetName]);

  // Filter & pagination (merge global search + column filters)
  const headers = data.length ? Object.keys(data[0]) : [];
  const filtered = useMemo(() => {
    const lowerSearch = search.toLowerCase();

    return data.filter((row) => {
      // Check global search
      const matchesGlobal =
        !lowerSearch ||
        Object.values(row).some((val) => String(val).toLowerCase().includes(lowerSearch));

      // Check column filters
      const matchesColumns = headers.every((header) => {
        const filterValue = columnFilters[header]?.toLowerCase() || "";
        if (!filterValue) return true;
        return String(row[header]).toLowerCase().includes(filterValue);
      });

      return matchesGlobal && matchesColumns;
    });
  }, [data, search, columnFilters, headers]);

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  // Chart setup
  const numericColumns = headers.filter((h) =>
    filtered.some((row) => !isNaN(Number(row[h])))
  );
  const firstNumeric = numericColumns[0];
  const secondNumeric = numericColumns[1];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen p-6 max-w-6xl mx-auto bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 transition-colors"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mb-4">
        <h1 className="text-3xl font-bold text-blue-600 dark:text-blue-400 text-center sm:text-left">
          Google Sheet Data Viewer
        </h1>
      </div>

      {/* Inputs */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <input
          type="text"
          placeholder="🔗 Paste Google Sheet URL..."
          value={sheetUrl}
          onChange={(e) => setSheetUrl(e.target.value)}
          className="border dark:border-gray-700 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800"
        />
        <input
          type="text"
          placeholder="🧾 Sheet name (default: Sheet1)"
          value={sheetName}
          onChange={(e) => setSheetName(e.target.value)}
          className="border dark:border-gray-700 rounded-lg px-4 py-2 w-full sm:w-48 focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800"
        />
      </div>

      {/* Search */}
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="🔍 Search data..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border dark:border-gray-700 rounded-full px-4 py-2 w-full sm:w-72 focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
        {data.length ? (
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 sticky top-0">
              <tr>
                {headers.map((header) => (
                  <th key={header} className="px-4 py-3 font-medium border-b">
                    <div className="flex flex-col">
                      <span>{header}</span>
                      <input
                        type="text"
                        placeholder="Filter..."
                        value={columnFilters[header] || ""}
                        onChange={(e) =>
                          setColumnFilters((prev) => ({
                            ...prev,
                            [header]: e.target.value,
                          }))
                        }
                        className="mt-1 px-2 py-1 text-sm rounded border dark:border-gray-700 bg-white dark:bg-gray-800"
                      />
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginated.map((row, i) => (
                <tr
                  key={i}
                  className={`${
                    i % 2 === 0
                      ? "bg-white dark:bg-gray-900"
                      : "bg-gray-50 dark:bg-gray-800"
                  } hover:bg-blue-50 dark:hover:bg-blue-900 transition`}
                >
                  {headers.map((header) => (
                    <td
                      key={header}
                      className="px-4 py-2 border-b text-gray-800 dark:text-gray-200 truncate max-w-[180px]"
                      title={String(row[header])}
                    >
                      {row[header]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400 py-6">
            Paste your Google Sheet URL above 👆
          </p>
        )}
      </div>

      {/* Pagination */}
      {filtered.length > pageSize && (
        <div className="flex justify-center items-center gap-4 mt-6">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          >
            ← Prev
          </button>
          <span className="text-gray-700 dark:text-gray-300 text-sm">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page === totalPages}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
          >
            Next →
          </button>
        </div>
      )}

      {/* Chart */}
      {firstNumeric && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-10"
        >
          <h3 className="text-xl font-semibold mb-3">
            📊 Data Visualization ({firstNumeric}
            {secondNumeric ? ` & ${secondNumeric}` : ""})
          </h3>
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm p-4">
            <ResponsiveContainer width="100%" height={300}>
              {secondNumeric ? (
                <BarChart data={filtered}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey={headers[0]} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey={firstNumeric} fill="#3b82f6" />
                  <Bar dataKey={secondNumeric} fill="#10b981" />
                </BarChart>
              ) : (
                <LineChart data={filtered}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey={headers[0]} />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey={firstNumeric}
                    stroke="#3b82f6"
                    strokeWidth={2}
                  />
                </LineChart>
              )}
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-2">
            Auto-refreshes every 10 seconds 🔄
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}
