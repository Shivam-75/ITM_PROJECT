import { useCallback, useEffect, useState } from "react";
import { authAPI } from "../facality/api/apis";

export const useUserFetch = ({ url, method = "GET", deleteLoading }) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const customFetch = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await authAPI({
        url,
        method
      });

      setData(response.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Unexpected error");
    } finally {
      setLoading(false);
    }
  }, [url, deleteLoading, method]);

  useEffect(() => {
    customFetch();
  }, [customFetch, deleteLoading]);

  return { data, error, loading };
};
