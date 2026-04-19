# Product Requirements Document (PRD): DataVision KRNL

## 1. Executive Summary
**DataVision KRNL** is a high-performance, AI-integrated data analytics platform designed for researchers, analysts, and decision-makers. It simplifies the transition from raw CSV data to executive-level insights through automated statistical profiling, comparative hypothesis testing, and a real-time AI analyst.

---

## 2. Target Audience
*   **Business Analysts**: Need quick, printable reports for stakeholders.
*   **Data Scientists**: Require baseline statistical profiling (T-Tests, Null audits).
*   **Executive Leadership**: Need plain-english explanations of complex data trends via AI.

---

## 3. Core Features & Functional Requirements

### 3.1. Authentication & Security
*   **Multi-User Isolation**: Every user must have a private workspace. Data uploaded by User A must be invisible to User B.
*   **Persistence**: User state (mounted datasets, generated reports) must persist across sessions using a combination of Supabase and LocalStorage.
*   **Identity**: Users can set an "Identity Label" (alias) for personalized report headers.

### 3.2. Data Ingestion (Ingress Kernel)
*   **CSV Support**: Support for raw CSV file parsing and browser-side processing.
*   **Dataset Mounting**: Users can mount multiple datasets to their workspace "Kernel."

### 3.3. Exploratory Data Analysis (EDA)
*   **Null Value Audit**: Automatic detection and visualization of missing data across all columns.
*   **Frequency Distribution**: Dynamic Bar/Pie charts for categorical and numeric feature distribution.
*   **Statistical Profiling**: Mean, Range, and Type detection for all variables.

### 3.4. Advanced Statistics (Comparative Kernel)
*   **Two-Sample T-Testing**: Capability to compare two independent datasets (A vs B) across specific features.
*   **T-Statistic Calculation**: Real-time calculation of T-Scores to determine statistical significance.
*   **AI Hypothesis Analyst**: Integrated chat interface to interpret T-Test results in plain English.

### 3.5. AI Intelligence Engine
*   **Contextual Analysis**: Integration with Google Gemini (1.5 Flash/Preview) to provide deep-dive insights.
*   **REPL Analyst**: A chat-based interface where users can ask specific questions about their data trends.
*   **Transcript Syncing**: Chat history must be saved as part of the formal data report.

### 3.6. Executive Reporting (Print Engine)
*   **Printable HTML Layouts**: High-density, professional report layouts optimized for A4 paper.
*   **Smart Pagination**: Automatic page breaks between statistical sections and AI transcripts.
*   **Branding**: Reports include secure IDs and timestamps for auditability.

---

## 4. Technical Stack
*   **Frontend**: React 19 (Vite), Tailwind CSS (Rich Asethetics).
*   **Backend/BaaS**: Supabase (Auth, PostgreSQL, Row-Level Security).
*   **AI Kernel**: Google Generative AI SDK (Gemini API).
*   **Visualization**: Recharts (High-performance SVG charts).
*   **File Handling**: PapaParse (Browser-side CSV parsing).

---

## 5. Security & Privacy
*   **Data Residency**: Raw dataset content is processed in-browser. Only statistical summaries and metadata are stored in the cloud.
*   **RLS (Row Level Security)**: Strict Supabase policies ensure data isolation.

---

## 6. Success Metrics
*   **Speed to Insight**: Reduce time from CSV upload to Printable Report to < 60 seconds.
*   **Accuracy**: AI-generated insights must align with calculated statistical schemas.
*   **Portability**: Reports must be 100% compliant with standard browser print-to-PDF engines.
