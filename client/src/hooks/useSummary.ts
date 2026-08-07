import { useCallback, useEffect, useState } from "react";
import {
  getErrorMessage,
  getSummary,
  type BudgetSummary,
} from "../lib/api";

export function useSummary() {
  const [summary, setSummary] = useState<BudgetSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const next = await getSummary();
      setSummary(next);
    } catch (err) {
      setError(getErrorMessage(err, "Summary couldn't be loaded."));
      setSummary(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return {
    summary,
    loading,
    error,
    refresh,
  };
}
