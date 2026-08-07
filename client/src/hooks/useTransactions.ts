import { useCallback, useEffect, useRef, useState } from "react";
import {
  createTransaction,
  deleteTransaction as deleteTransactionRequest,
  getErrorMessage,
  getTransactions,
  updateTransaction as updateTransactionRequest,
  type TransactionFilters,
  type TransactionInput,
} from "../lib/api";
import type { Transaction } from "../types/transaction";

const SEARCH_DEBOUNCE_MS = 250;

export function useTransactions(filters: TransactionFilters) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [debouncedSearch, setDebouncedSearch] = useState(
    filters.search?.trim() ?? "",
  );
  const requestIdRef = useRef(0);

  useEffect(() => {
    const nextSearch = filters.search?.trim() ?? "";
    const timer = window.setTimeout(() => {
      setDebouncedSearch(nextSearch);
    }, SEARCH_DEBOUNCE_MS);
    return () => window.clearTimeout(timer);
  }, [filters.search]);

  const refresh = useCallback(async () => {
    const requestId = ++requestIdRef.current;
    setLoading(true);
    setError(null);

    try {
      const next = await getTransactions({
        type: filters.type,
        category: filters.category,
        search: debouncedSearch,
      });
      if (requestId !== requestIdRef.current) return;
      setTransactions(next);
    } catch (err) {
      if (requestId !== requestIdRef.current) return;
      setError(getErrorMessage(err, "Transactions couldn't be loaded."));
      setTransactions([]);
    } finally {
      if (requestId === requestIdRef.current) {
        setLoading(false);
      }
    }
  }, [debouncedSearch, filters.category, filters.type]);

  useEffect(() => {
    const requestId = ++requestIdRef.current;
    const controller = new AbortController();

    setLoading(true);
    setError(null);

    void (async () => {
      try {
        const next = await getTransactions(
          {
            type: filters.type,
            category: filters.category,
            search: debouncedSearch,
          },
          controller.signal,
        );
        if (requestId !== requestIdRef.current) return;
        setTransactions(next);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        if (requestId !== requestIdRef.current) return;
        setError(getErrorMessage(err, "Transactions couldn't be loaded."));
        setTransactions([]);
      } finally {
        if (requestId === requestIdRef.current) {
          setLoading(false);
        }
      }
    })();

    return () => {
      controller.abort();
    };
  }, [debouncedSearch, filters.category, filters.type]);

  async function addTransaction(data: TransactionInput): Promise<void> {
    await createTransaction(data);
  }

  async function updateTransaction(
    id: string,
    data: TransactionInput,
  ): Promise<void> {
    await updateTransactionRequest(id, data);
  }

  async function deleteTransaction(id: string): Promise<void> {
    await deleteTransactionRequest(id);
  }

  return {
    transactions,
    loading,
    error,
    refresh,
    addTransaction,
    updateTransaction,
    deleteTransaction,
  };
}
