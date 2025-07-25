// utils/openMap.js
import { Linking } from 'react-native';

/**
 * Открыть координаты в браузере (Google Maps).
 * Можно использовать и в iOS, и в Android — всегда откроется веб.
 */
export const openMapInBrowser = (lat, lon, label = '') => {
  const query = `${lat},${lon}`;
  // Через google.com/maps — 100% веб
  const url = `https://www.google.com/maps?q=${query}${label ? `(${encodeURIComponent(label)})` : ''}`;
  Linking.openURL(url).catch(() => {
    // запасной вариант (почти не понадобится)
    Linking.openURL(`https://maps.google.com/?q=${query}`);
  });
};
