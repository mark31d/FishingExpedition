// Components/SavedContext.js
import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = '@saved_spots_v1';

export const SavedContext = createContext({
  saved: [],
  toggle: () => {},
});

export function SavedProvider({ children }) {
  const [saved, setSaved] = useState([]);

  // загрузим из хранилища при старте
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(KEY);
        if (raw) setSaved(JSON.parse(raw));
      } catch (e) {
        console.warn('Failed to load saved spots', e);
      }
    })();
  }, []);

  const persist = async (next) => {
    try {
      await AsyncStorage.setItem(KEY, JSON.stringify(next));
    } catch (e) {
      console.warn('Failed to persist saved spots', e);
    }
  };

  const toggle = (spot) => {
    let next;
    if (saved.some((s) => s.name === spot.name)) {
      next = saved.filter((s) => s.name !== spot.name);
    } else {
      next = [spot, ...saved];
    }
    setSaved(next);
    persist(next);
  };

  return (
    <SavedContext.Provider value={{ saved, toggle }}>
      {children}
    </SavedContext.Provider>
  );
}
