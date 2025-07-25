// Components/DiaryContext.js
import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = '@journal_v1';

export const DiaryContext = createContext({
  entries: [],
  add: () => {},
  remove: () => {},
});

export function DiaryProvider({ children }) {
  const [entries, setEntries] = useState([]);

  // Загрузить из AsyncStorage при старте
  useEffect(() => {
    (async () => {
      const raw = await AsyncStorage.getItem(KEY);
      if (raw) setEntries(JSON.parse(raw));
    })();
  }, []);

  const persist = async (arr) => {
    await AsyncStorage.setItem(KEY, JSON.stringify(arr));
  };

  const add = (entry) => {
    const next = [entry, ...entries];
    setEntries(next);
    persist(next);
  };

  const remove = (id) => {
    const next = entries.filter((e) => e.id !== id);
    setEntries(next);
    persist(next);
  };

  return (
    <DiaryContext.Provider value={{ entries, add, remove }}>
      {children}
    </DiaryContext.Provider>
  );
}
