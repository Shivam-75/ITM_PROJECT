import { useEffect, useState } from "react";

const useDebounce = (value, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Delay ke baad value update hogi
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup: agar value/change hua to purana timer cancel
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
};

export default useDebounce;
