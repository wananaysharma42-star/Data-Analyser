import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../services/supabase";

const DataContext = createContext();

export function DataProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const loadFromStorage = (key, defaultVal) => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : defaultVal;
    } catch (e) {
      return defaultVal;
    }
  };

  const saveToStorage = (key, val) => {
    if (!user) return;
    try {
      localStorage.setItem(`app_${user.id}_${key}`, JSON.stringify(val));
    } catch (e) {
      console.warn(`Could not save ${key} to localStorage:`, e);
    }
  };

  const [datasets, setDatasets] = useState([]);
  const [selectedData, setSelectedData] = useState([]);
  const [twoSampleData, setTwoSampleData] = useState({
    datasetA: [],
    datasetB: [],
    sampleColA: "",
    sampleColB: "",
  });
  const [reports, setReports] = useState([]);

  useEffect(() => {
    // Initial Auth Check
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for Auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const newUser = session?.user ?? null;
      setUser(newUser);
      if (!newUser) {
        // Clear state on logout
        setDatasets([]);
        setSelectedData([]);
        setTwoSampleData({ datasetA: [], datasetB: [], sampleColA: "", sampleColB: "" });
        setReports([]);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Hydrate state from User-Specific LocalStorage and Supabase
  useEffect(() => {
    if (user) {
      const userId = user.id;
      
      const loadUserLocal = (key, defaultVal) => {
        try {
          const saved = localStorage.getItem(`app_${userId}_${key}`);
          return saved ? JSON.parse(saved) : defaultVal;
        } catch (e) { return defaultVal; }
      };

      // 1. Hydrate from Local Storage (Immediate)
      setDatasets(loadUserLocal("datasets", []));
      setSelectedData(loadUserLocal("selectedData", []));
      setTwoSampleData(loadUserLocal("twoSampleData", {
        datasetA: [], datasetB: [], sampleColA: "", sampleColB: ""
      }));
      setReports(loadUserLocal("reports", []));

      // 2. Hydrate from Supabase (Source of truth for history)
      const fetchSupabaseData = async () => {
        // Fetch Reports
        const { data: reportData } = await supabase
          .from("reports")
          .select("*")
          .eq("user_id", userId)
          .order("created_at", { ascending: false });
        
        if (reportData) {
          setReports(reportData.map(r => ({
            id: r.id,
            type: r.type,
            summary: r.summary,
            timestamp: r.created_at
          })));
        }

        // Fetch Mounted Datasets Metadata
        const { data: datasetData } = await supabase
          .from("datasets")
          .select("*")
          .eq("user_id", userId);
        
        if (datasetData) {
          setDatasets(datasetData.map(d => ({
            id: d.id,
            name: d.name,
            rows: d.rows,
            columns: d.columns
          })));
        }
      };
      fetchSupabaseData();
    }
  }, [user]);

  // Persistence Effects (User-Specific)
  useEffect(() => {
    if (user) saveToStorage("datasets", datasets);
  }, [datasets, user]);

  useEffect(() => {
    if (user) saveToStorage("selectedData", selectedData);
  }, [selectedData, user]);

  useEffect(() => {
    if (user) saveToStorage("twoSampleData", twoSampleData);
  }, [twoSampleData, user]);

  useEffect(() => {
    if (user) saveToStorage("reports", reports);
  }, [reports, user]);

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
    const datasetToRemove = datasets[index];
    
    setDatasets((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      if (updated.length === 0) {
        setSelectedData([]);
        localStorage.removeItem(`app_${user.id}_upload_preview`);
      }
      return updated;
    });

    if (user && datasetToRemove) {
      await supabase
        .from("datasets")
        .delete()
        .eq("user_id", user.id)
        .eq("name", datasetToRemove.name);
    }
  };

  const addReport = async (report) => {
    setReports((prev) => [report, ...prev]);

    if (user) {
      const { error } = await supabase.from("reports").insert({
        user_id: user.id,
        type: report.type,
        summary: report.summary
      });
      if (error) console.error("Error syncing report to Supabase:", error);
    }
  };

  const removeReport = async (reportId) => {
    setReports((prev) => prev.filter(r => (r.id || r.timestamp) !== reportId));

    if (user) {
      const { error } = await supabase
        .from("reports")
        .delete()
        .eq("id", reportId);
      
      if (error && typeof reportId === "string" && reportId.includes("-")) {
        console.error("Error deleting report:", error);
      }
    }
  };

  const clearReports = async () => {
    setReports([]);
    saveToStorage("app_reports", []);
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
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => useContext(DataContext);