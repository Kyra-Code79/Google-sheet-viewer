# Realtime Google Sheet Dashboard

A Next.js + TypeScript dashboard that fetches data from Google Sheets in real-time, displays it in a table with global search and per-column filtering, and provides interactive charts (line/bar) for numeric data. Perfect for monitoring spreadsheets without using any backend API.

---

## Table of Contents

- [Demo](#demo)  
- [Features](#features)  
- [Getting Started](#getting-started)  
  - [Prerequisites](#prerequisites)  
  - [Installation](#installation)  
  - [Running Locally](#running-locally)  
  - [Build for Production](#build-for-production)  
- [Usage](#usage)  
- [Contributing](#contributing)  
- [License](#license)  

---

## Demo

A live demo can be deployed using [Vercel](https://vercel.com/) once the repository is connected.  

Access on: [Vercel](https://google-sheet-viewer-lake.vercel.app/)

## Features

- Fetch Google Sheet data in real-time (auto-refresh every 10s)  
- Global search across all columns  
- Per-column filtering  
- Pagination with customizable page size  
- Table with alternating row colors and hover effects  
- Checkbox values automatically converted to "Yes"/"No"  
- Interactive charts:  
  - Line chart for single numeric column  
  - Bar chart for two numeric columns  
- Dark mode support  

---

## Getting Started

### Prerequisites

- Node.js >= 18.x  
- npm >= 9.x  

---

### Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/your-username/realtime-sheet-dashboard.git
cd realtime-sheet-dashboard
npm install
```

### Running Locally

Start the development server:
```bash
npm run dev
```
Open http://localhost:3000 in your browser.

### Build for Production

```bash
npm run build
npm start
```
This will create an optimized production build

### Usage

1. Paste your Google Sheet URL in the input field.
2. Enter the sheet name (default is Sheet1).
3. Use the search box to filter rows globally.
4. Use the per-column filters to narrow down by specific columns.
5. Navigate pages using pagination buttons.
6. View charts for numeric columns automatically generated from your sheet.

Note: Ensure your Google Sheet is published to the web or shared with "Anyone with the link can view".

### Contributing

1. Fork the repository
2. Create a new branch (git checkout -b feature-name)
3. Make your changes
4. Commit (git commit -m "Add feature")
5. Push (git push origin feature-name)
6. Open a Pull Request

### License
This project is licensed under the MIT License © [Kyra-Code79 | M Habibi Siregar] (https://img.shields.io/badge/license-MIT-blue)
