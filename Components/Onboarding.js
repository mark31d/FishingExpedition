/**
 * Onboarding.js – 7-шаговая инструкция (см. макеты)
 */
import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');
const LOGO = require('../assets/loader_logo.png'); // иллюстрация c рыбаком

/* ── конфигурация всех слайдов ─────────────────────────────── */
const STEPS = [
  {
    title: 'Welcome to Fishing Expedition!',
    text:  'Your adventure to discover the best fishing spots in the UK starts here. Ready to explore?',
    btn:   "Let's Go",
  },
  {
    title: 'Choose Your Season',
    text:  "Select the season you're fishing in to get the best recommendations for your trip.",
    btn:   'Continue',
  },
  {
    title: 'Find the Perfect Fishing Spot',
    text:  'Use the map to explore the best fishing locations around the UK.',
    btn:   'Next',
  },
  {
    title: 'Track Your Catches',
    text:  'Keep a fishing journal! Log your catches, locations, and techniques.',
    btn:   'Continue',
  },
  {
    title: 'Save Your Favourite Spots',
    text:  'Mark your best fishing locations and always have them on hand.',
    btn:   'Next',
  },
  {
    title: 'Fishing Tips Just For You',
    text:  'Get daily fishing tips to improve your skills and find new methods.',
    btn:   "Let's Start Fishing!",
  },
  {
    title: "You're Ready to Fish",
    text:  'Explore, catch, and enjoy your fishing adventures in the UK. Happy fishing!',
    btn:   'Start Exploring',
  },
];

export default function Onboarding() {
  const nav            = useNavigation();
  const ref            = useRef(null);
  const [index, setIdx] = useState(0);

  /* пролистываем программуно */
  const goNext = () => {
    if (index < STEPS.length - 1) {
      ref.current?.scrollToIndex({ index: index + 1 });
    } else {
      nav.replace('MainTabs', {
               screen : 'Main',          // имя вкладки
               params : { screen: 'MainHome' }, // вложенный экран стака
             });
    }
  };

  /* синхронизируем текущий индекс при свайпе */
  const onViewableItemsChanged = useRef(
    ({ viewableItems }) => {
      if (viewableItems.length) setIdx(viewableItems[0].index);
    }
  ).current;

  return (
    <View style={styles.container}>
      {/* иллюстрация сверху */}
      <Image source={LOGO} style={styles.hero} resizeMode="contain" />

      {/* пейджер */}
      <FlatList
        ref={ref}
        data={STEPS}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, i) => String(i)}
        renderItem={({ item }) => <Step {...item} onPress={goNext} />}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
      />

     
    </View>
  );
}

/* ——— отдельный компонент для слайда ——— */
function Step({ title, text, btn, onPress }) {
  return (
    <View style={styles.cardWrap}>
      <View style={styles.card}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.desc}>{text}</Text>

        <TouchableOpacity style={styles.button} onPress={onPress}>
          <Text style={styles.btnText}>{btn}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

/* ——— стили ——— */
const CARD_RADIUS = 24;
const HERO_H      = height * 0.5;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#006B8F',
    alignItems: 'center',
  },
  hero: {
    marginTop:40,
    marginBottom:-50,
    width: width,
    height: HERO_H,
  },
  /* ——— прогресс ——— */
  progress: {
    position: 'absolute',
    top: HERO_H - 12,
    width: width * 0.4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#C5DDE4',
    alignSelf: 'center',
  },
  progressBar: {
    height: '100%',
    borderRadius: 2,
    backgroundColor: '#7EBACF',
  },
  /* ——— карточка ——— */
  cardWrap: {
    width,
    paddingTop: 52,
  },
  card: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: CARD_RADIUS,
    borderTopRightRadius: CARD_RADIUS,
    paddingHorizontal: 32,
    paddingBottom: 40,
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#00344B',
    textAlign: 'center',
    marginBottom: 20,
    marginTop:40,
  },
  desc: {
    fontSize: 16,
    lineHeight: 22,
    color: '#00344B',
    textAlign: 'center',
    marginBottom: 36,
  },
  button: {
    alignSelf: 'center',
    width: '90%',
    backgroundColor: '#56B9DB',
    paddingVertical: 16,
    borderRadius: 10,
  },
  btnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    textAlign: 'center',
    fontSize: 16,
  },
});
