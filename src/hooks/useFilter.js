import { useState } from 'react';
import useAsync from './useAsync';

const useFilter = (apiFn, defaultFilters = {}) => {
  const [filters, setFilters] = useState({
    page: 1,
    limit: 20,
    ...defaultFilters,
  });

  const { data, loading, error, refresh } = useAsync(apiFn, filters); // Pass filters directly

  const updateFilter = (newFilters = {}) => {
    const updated = { ...filters, ...newFilters };
    setFilters(updated); // Update filters state, which triggers useAsync to re-fetch
  };

  const resetFilters = () => {
    const defaultState = { page: 1, limit: 20, ...defaultFilters };
    setFilters(defaultState); // Update filters state, which triggers useAsync to re-fetch
  };

  return {
    data,
    loading,
    error,
    filters,
    updateFilter,
    resetFilters,
    refresh
  };
};

export default useFilter;