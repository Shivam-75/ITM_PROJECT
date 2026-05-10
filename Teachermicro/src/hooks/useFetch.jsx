import { useCallback, useEffect, useState } from "react";
import { authAPI } from "../facality/api/apis";

const cache = new Map();

export const useFetch = ({ url, method = "GET" }) => {
  const [data, setData] = useState(cache.get(url) || null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(!cache.has(url));

  const customFetch = useCallback(async () => {
    try {
      if (cache.has(url)) {
        setData(cache.get(url));
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");

      const response = await authAPI({
        url,
        method,
      });

      setData(response.data);
      cache.set(url, response.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Unexpected error");
    } finally {
      setLoading(false);
    }
  }, [url, method]);

  useEffect(() => {
    customFetch();
  }, [customFetch]);

  return { data, error, loading };
};



