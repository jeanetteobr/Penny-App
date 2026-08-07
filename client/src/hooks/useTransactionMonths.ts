import { useCallback, useEffect, useState } from "react";
import { getErrorMessage, getTransactionMonths } from "../lib/api";

/**
 * Loads distinct YYYY-MM values from persisted transactions (newest first).
 * Does not invent months — options come only from the API.
 */
export function useTransactionMonths() {
  const [months, setMonths] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getTransactionMonths();
      setMonths(response.months);
    } catch (err) {
      setError(getErrorMessage(err, "Could not load available months."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return {
    months,
    loading,
    error,
    refresh,
  };
}
