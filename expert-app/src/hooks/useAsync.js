import { useCallback, useState } from "react";

/**
 * @template T
 * @param {() => Promise<T>} fn
 */
export function useAsync(fn) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const run = useCallback(
    async (...args) => {
      setLoading(true);
      setError(null);
      try {
        const result = await fn(...args);
        setData(result);
        return result;
      } catch (e) {
        setError(e.message || "Something went wrong");
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [fn]
  );

  return { data, loading, error, run, setData, setError };
}
