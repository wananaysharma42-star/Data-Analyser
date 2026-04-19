import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../services/supabase";

const DataContext = createContext();

export function DataProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Core State Segments
  const [datasets, setDatasets] = useState([]);
  const [selectedData, setSelectedData] = useState([]);
  const [twoSampleData, setTwoSampleData] = useState({
    datasetA: [],
    datasetB: [],
    sampleColA: "",
    sampleColB: "",
  });
  const [reports, setReports] = useState([]);
  const [compareSettings, setCompareSettings] = useState({ col1: "", col2: "" });
  const [twoSampleReport, setTwoSampleReport] = useState(null);
  const [twoSampleChat, setTwoSampleChat] = useState([]);
  const [aiInsightReport, setAiInsightReport] = useState(null);
  const [aiInsightChat, setAiInsightChat] = useState([]);

  // Utility: Local Storage Kernel
  const saveToBuffer = (key, val) => {
    if (!user) return;
    try {
      localStorage.setItem(`dv_buffer_${user.id}_${key}`, JSON.stringify(val));
    } catch (e) {
      console.error(`KERNEL_EXCEPTION: Buffer_Write_Failure [${key}]`, e);
    }
  };

  const loadFromBuffer = (userId, key, defaultVal) => {
    try {
      const saved = localStorage.getItem(`dv_buffer_${userId}_${key}`);
      return saved ? JSON.parse(saved) : defaultVal;
    } catch (e) {
      return defaultVal;
    }
  };

  useEffect(() => {
    // Initial Session Acquisition Protocol
    const acquireInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
      }
      setLoading(false);
    };

    acquireInitialSession();

    // Auth Listener Protocol
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      const newUser = session?.user ?? null;
      setUser(newUser);
      setLoading(false);

      if (event === 'SIGNED_OUT') {
        // Purge memory only on explicit de-authentication
        setDatasets([]);
        setSelectedData([]);
        setTwoSampleData({ datasetA: [], datasetB: [], sampleColA: "", sampleColB: "" });
        setReports([]);
        setCompareSettings({ col1: "", col2: "" });
        setTwoSampleReport(null);
        setTwoSampleChat([]);
        setAiInsightReport(null);
        setAiInsightChat([]);
        
        // Clear local buffer to prevent identity leakage
        Object.keys(localStorage).forEach(key => {
          if (key.startsWith('dv_buffer_')) localStorage.removeItem(key);
        });
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const [isInitialized, setIsInitialized] = useState(false);

  // Stage 1 Sync: Initialization Protocol
  useEffect(() => {
    if (!user) return;

    const initializeKernel = async () => {
      const uid = user.id;

      // Only load from buffer if the current state is empty/default
      setDatasets(loadFromBuffer(uid, "datasets", []));
      setSelectedData(loadFromBuffer(uid, "selectedData", []));
      setTwoSampleData(loadFromBuffer(uid, "twoSampleData", {
        datasetA: [], datasetB: [], sampleColA: "", sampleColB: ""
      }));
      setReports(loadFromBuffer(uid, "reports", []));
      setCompareSettings(loadFromBuffer(uid, "compareSettings", { col1: "", col2: "" }));
      setTwoSampleReport(loadFromBuffer(uid, "twoSampleReport", null));
      setTwoSampleChat(loadFromBuffer(uid, "twoSampleChat", []));
      setAiInsightReport(loadFromBuffer(uid, "aiInsightReport", null));
      setAiInsightChat(loadFromBuffer(uid, "aiInsightChat", []));

      setIsInitialized(true);

      // Stage 2: Sync from Supabase Cloud (Background Refresh)
      try {
        const [reportsRes, datasetsRes] = await Promise.all([
          supabase.from("reports").select("*").eq("user_id", uid).order("created_at", { ascending: false }),
          supabase.from("datasets").select("*").eq("user_id", uid)
        ]);

        if (reportsRes.data) {
          const formattedReports = reportsRes.data.map(r => ({
            id: r.id,
            type: r.type,
            summary: r.summary,
            timestamp: r.created_at
          }));
          setReports(formattedReports);
          saveToBuffer("reports", formattedReports);
        }

        if (datasetsRes.data) {
          setDatasets(datasetsRes.data);
          saveToBuffer("datasets", datasetsRes.data);
        }
      } catch (err) {
        console.warn("SYNC_EXCEPTION: Cloud_Handshake_Failed. Operating in local buffer mode.");
      }
    };

    initializeKernel();
  }, [user?.id]); // Only re-run if the actual user ID changes

  // Persistence Hooks (Buffer Sync) - ONLY SAVE IF INITIALIZED
  useEffect(() => { if (user && isInitialized) saveToBuffer("datasets", datasets); }, [datasets, user, isInitialized]);
  useEffect(() => { if (user && isInitialized) saveToBuffer("selectedData", selectedData); }, [selectedData, user, isInitialized]);
  useEffect(() => { if (user && isInitialized) saveToBuffer("twoSampleData", twoSampleData); }, [twoSampleData, user, isInitialized]);
  useEffect(() => { if (user && isInitialized) saveToBuffer("reports", reports); }, [reports, user, isInitialized]);
  useEffect(() => { if (user && isInitialized) saveToBuffer("compareSettings", compareSettings); }, [compareSettings, user, isInitialized]);
  useEffect(() => { if (user && isInitialized) saveToBuffer("twoSampleReport", twoSampleReport); }, [twoSampleReport, user, isInitialized]);
  useEffect(() => { if (user && isInitialized) saveToBuffer("twoSampleChat", twoSampleChat); }, [twoSampleChat, user, isInitialized]);
  useEffect(() => { if (user && isInitialized) saveToBuffer("aiInsightReport", aiInsightReport); }, [aiInsightReport, user, isInitialized]);
  useEffect(() => { if (user && isInitialized) saveToBuffer("aiInsightChat", aiInsightChat); }, [aiInsightChat, user, isInitialized]);

  // System Methods
  const addDataset = async (dataset) => {
    setDatasets((prev) => [...prev, dataset]);
    if (user) {
      await supabase.from("datasets").insert({
        user_id: user.id,
        name: dataset.name,
        rows: dataset.rows,
        columns: dataset.columns
      });
    }
  };

  const removeDataset = async (index) => {
    const target = datasets[index];
    setDatasets((prev) => prev.filter((_, i) => i !== index));
    if (user && target) {
      await supabase.from("datasets").delete().eq("user_id", user.id).eq("name", target.name);
    }
  };

  const addReport = async (report) => {
    setReports((prev) => [report, ...prev]);
    if (user) {
      await supabase.from("reports").insert({
        user_id: user.id,
        type: report.type,
        summary: report.summary
      });
    }
  };

  const removeReport = async (reportId) => {
    setReports((prev) => prev.filter(r => (r.id || r.timestamp) !== reportId));
    if (user) {
      await supabase.from("reports").delete().eq("id", reportId);
    }
  };

  const clearReports = async () => {
    setReports([]);
    if (user) {
      await supabase.from("reports").delete().eq("user_id", user.id);
    }
  };

  return (
    <DataContext.Provider
      value={{
        user,
        loading,
        datasets,
        setDatasets,
        selectedData,
        setSelectedData,
        twoSampleData,
        setTwoSampleData,
        addDataset,
        removeDataset,
        reports,
        addReport,
        removeReport,
        clearReports,
        compareSettings,
        setCompareSettings,
        twoSampleReport,
        setTwoSampleReport,
        twoSampleChat,
        setTwoSampleChat,
        aiInsightReport,
        setAiInsightReport,
        aiInsightChat,
        setAiInsightChat,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => useContext(DataContext);