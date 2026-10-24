import { useEffect, useState, useRef, useMemo } from "react";
import axios from "axios";

const useAsync = (asyncFunction, params = {}, deps = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const cancelSourceRef = useRef(null);
  const stableParams = useMemo(() => params, [JSON.stringify(params)]);

  const fetchData = async () => {
    if (cancelSourceRef.current) {
      cancelSourceRef.current.cancel("Cancelled previous request");
    }

    const source = axios.CancelToken.source();
    cancelSourceRef.current = source;

    setLoading(true);
    setError(null);

    try {
      const result = await asyncFunction({ ...stableParams });
      setData(result ?? []);
    } catch (err) {
      if (!axios.isCancel(err)) {
        setError(err.message || "Something went wrong");
        setData(null);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    return () => {
      if (cancelSourceRef.current) {
        cancelSourceRef.current.cancel("Component unmounted");
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stableParams, ...deps]); // re-run when params or deps change

  return {
    data,
    loading,
    error,
    refresh: fetchData,
  };
};

export default useAsync;
