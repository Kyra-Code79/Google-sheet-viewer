"use client";

import { useState, useEffect } from "react";
import SheetChart from "@/app/components/SheetChart";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";

export default function HomePage() {
  const [url, setUrl] = useState("");
  const [submittedUrl, setSubmittedUrl] = useState("");

  // Dark mode
  const [darkMode, setDarkMode] = useState(false);
  // Mounted flag
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
  // eslint-disable-next-line react-hooks/set-state-in-effect
  setMounted(true);
  if (typeof window !== "undefined") {
    setDarkMode(localStorage.getItem("theme") === "dark");
  }
}, []);


  useEffect(() => {
    if (!mounted) return; // don't touch DOM on server
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode, mounted]);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittedUrl(url);
  };

  // **Render nothing until mounted** to prevent hydration mismatch
  if (!mounted) return null;

  return (
    <div
      className={`min-h-screen flex flex-col items-center py-10 px-4 transition-colors duration-500 ${
        darkMode
          ? "bg-gradient-to-b from-gray-900 to-gray-800 text-gray-100"
          : "bg-gradient-to-b from-slate-100 to-white text-gray-900"
      }`}
    >
      <div className="w-full max-w-4xl flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">
          📊 Realtime Google Sheets Dashboard
        </h1>
        <button
          onClick={toggleDarkMode}
          className="text-2xl hover:scale-110 transition"
          title="Toggle Dark Mode"
        >
          {darkMode ? "☀️" : "🌙"}
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-4xl"
      >
        <Card className="shadow-xl border-slate-200 dark:border-gray-700 dark:bg-gray-900">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-2xl font-bold text-slate-800 dark:text-gray-100">
              Realtime Google Sheets Dashboard
            </CardTitle>
            <p className="text-slate-500 dark:text-gray-400 text-sm">
              Enter your public Google Spreadsheet link to visualize your data.
            </p>
          </CardHeader>

          <CardContent>
            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-3 mt-4"
            >
              <Input
                type="url"
                placeholder="Paste your Google Sheets JSON or CSV URL..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="flex-grow dark:bg-gray-800 dark:text-gray-100"
                required
              />
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Load Data
              </Button>
            </form>

            {submittedUrl && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-8"
              >
                <SheetChart sheetUrl={submittedUrl} darkMode={darkMode} />
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      <footer className="mt-10 text-sm text-gray-500 dark:text-gray-400">
        © {new Date().getFullYear()}{" "}
        <a
          href="https://github.com/Kyra-Code79"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 dark:text-blue-400 hover:underline"
        >
          Kyra | M Habibi Siregar
        </a>
      </footer>
    </div>
  );
}
