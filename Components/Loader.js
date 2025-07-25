/**
 * Loader.js – стартовый экран-заставка
 * Показывает иллюстрацию рыбака на фирменном фоне,
 * затем автоматически скрывается (таймер в App.js).
 */
import React, { useEffect, useRef } from 'react';
import { View, Animated, Image, StyleSheet, StatusBar } from 'react-native';

/* ── иллюстрация (та же, что на онбординге) ─────────── */
const LOGO = require('../assets/loader_logo.png'); // при необходимости поменяйте путь

export default function Loader() {
  /* плавное появление логотипа */
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <Animated.Image
        source={LOGO}
        style={[styles.logo, { opacity }]}
        resizeMode="contain"
      />
    </View>
  );
}

/* ── стили ──────────────────────────────────────────── */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#20769C',   // фирменный синий
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: '75%',
    height: undefined,            // сохраняем пропорции
    aspectRatio: 0.9,             // подберите под свой файл
  },
});
