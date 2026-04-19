# DataVision KRNL 🤖📊

**DataVision KRNL** is a professional-grade, AI-powered data analytics platform built for high-speed insight generation. It combines robust statistical kernels with the power of Google Gemini to transform raw CSV data into executive-ready printable reports.

### 🎥 [Watch the Project Demo Video](https://drive.google.com/file/d/1rhJ5dPgk8_4PUTeHXdwxJZt10yk36hQu/view?usp=drive_link)

---

## 🚀 Key Features

### 🧠 AI Intelligence Engine
- **Hypothesis Chat**: Interactive REPL to ask natural language questions about your data.
- **Contextual Awareness**: The AI is automatically primed with your dataset's statistical profile and T-Test results.
- **Transcript Archiving**: AI conversations are saved directly into your permanent report history.

### 📈 Statistical Kernels
- **Exploratory Analysis**: Automated null-value audits and frequency distribution maps.
- **Comparative Testing**: Integrated Two-Sample T-Test module for rigorous dataset comparisons.
- **Real-time Visualization**: High-performance SVG charts powered by Recharts.

### 📑 Executive Reporting
- **Print-First Engine**: Optimized HTML layouts specifically designed for A4 paper and PDF export.
- **Audit Trails**: Reports include unique IDs, timestamps, and personalized "Identity Labels."
- **Smart Pagination**: Native browser print handling with automated page breaks for clean sections.

### 🔐 Enterprise-Grade Security
- **Multi-User Isolation**: Each user has a cryptographically isolated workspace.
- **Supabase Integration**: Secure Auth, Database, and Row-Level Security (RLS) policies.
- **Dual Persistence**: Automatic synchronization between cloud storage and user-specific LocalStorage.

---

## 🛠️ Tech Stack
- **UI Framework**: React 19 (Vite)
- **Styling**: Tailwind CSS
- **Backend/Auth**: Supabase
- **AI Core**: Google Gemini SDK (3 Flash)
- **Data Engine**: PapaParse & Custom Statistical Kernels

---

## 📁 Project Architecture
```text
src/
├── components/
│   ├── layout/       # Navigation & Global Wrappers
│   └── reports/      # Printable HTML Report Engine
├── context/
│   └── DataContext   # Global state & Supabase Sync
├── pages/            # Feature-specific view modules
├── services/         # Supabase client initialization
└── utils/            # Statistical & AI Prompt Kernels
```

---

## 📖 Documentation
For the full technical blueprint, functional requirements, and roadmap, please see:
👉 **[Product Requirements Document (PRD)](./PRD.md)**

---

## 🚦 Getting Started
1. **Clone & Install**:
   ```bash
   git clone <repo-url>
   npm install
   ```
2. **Environment Setup**:
   Create a `.env` file in the root:
   ```env
   VITE_SUPABASE_URL=your_url
   VITE_SUPABASE_ANON_KEY=your_key
   VITE_GEMINI_API_KEY=your_key
   ```
3. **Launch**:
   ```bash
   npm run dev
   ```

---
*Built for the future of data-driven decision making.*
