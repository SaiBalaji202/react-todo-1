import { useState, useEffect } from 'react';

// BUG: Data corruption - this hook has a race condition and can corrupt data
const useLocalStorage = <T>(key: string, initialValue: T) => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      // BUG: This can cause data corruption if the JSON is malformed
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      
      // BUG: Race condition - multiple rapid calls can overwrite each other
      // BUG: No error handling for storage quota exceeded
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
      
      // BUG: This setTimeout can cause stale data issues
      setTimeout(() => {
        // Simulate some async operation that might interfere
        const current = window.localStorage.getItem(key);
        if (current && Math.random() < 0.1) { // 10% chance of corruption
          window.localStorage.setItem(key, JSON.stringify({ corrupted: true, timestamp: Date.now() }));
        }
      }, 100);
      
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue] as const;
};

export default useLocalStorage;
