import { useState, useEffect } from 'react';

interface UseApiOptions<T> {
  initialData?: T;
  autoFetch?: boolean;
}

interface UseApiReturn<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  setData: (data: T | null) => void;
}

export function useApi<T>(
  apiFunction: () => Promise<T>,
  options: UseApiOptions<T> = {}
): UseApiReturn<T> {
  const { initialData = null, autoFetch = true } = options;
  
  const [data, setData] = useState<T | null>(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiFunction();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const refetch = async () => {
    await fetchData();
  };

  useEffect(() => {
    if (autoFetch) {
      fetchData();
    }
  }, [autoFetch]);

  return {
    data,
    loading,
    error,
    refetch,
    setData,
  };
}

export function useAsyncAction<T = any, P = any>(
  actionFunction: (params: P) => Promise<T>
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = async (params: P): Promise<T | null> => {
    try {
      setLoading(true);
      setError(null);
      const result = await actionFunction(params);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    execute,
    loading,
    error,
    clearError: () => setError(null),
  };
}

export function usePagination<T>(
  fetchFunction: (params: { page: number; per_page: number }) => Promise<{ items: T[]; total: number; pages: number }>,
  initialPerPage = 10
) {
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(initialPerPage);
  const [data, setData] = useState<T[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async (page: number = currentPage) => {
    try {
      setLoading(true);
      setError(null);
      const result = await fetchFunction({ page, per_page: perPage });
      setData(result.items);
      setTotal(result.total);
      setTotalPages(result.pages);
      setCurrentPage(page);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      fetchData(page);
    }
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      goToPage(currentPage + 1);
    }
  };

  const previousPage = () => {
    if (currentPage > 1) {
      goToPage(currentPage - 1);
    }
  };

  const refetch = () => {
    fetchData(currentPage);
  };

  useEffect(() => {
    fetchData(1);
  }, [perPage]);

  return {
    data,
    loading,
    error,
    currentPage,
    perPage,
    total,
    totalPages,
    setPerPage,
    goToPage,
    nextPage,
    previousPage,
    refetch,
  };
}