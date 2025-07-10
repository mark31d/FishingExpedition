// screens/TipsScreen.js
import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Share,
  Dimensions,
  Platform,
} from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNavigation, useRoute } from '@react-navigation/native';

/* ────────── assets ────────── */
const ICON_TIP    = require('../assets/tip.png');
const ICON_SHARE  = require('../assets/share.png');
const ICON_BACK   = require('../assets/arrow.png');

/* ────────── данные ────────── */
const TIPS = [
  {
    id: 'equipment',
    title: 'Choose the Right Equipment:',
    text:
      'Make sure to use the right rod, reel, and line for the type of fish you\'re targeting. '
      + 'The right gear can make all the difference.',
  },
  {
    id: 'weather',
    title: 'Check the Weather:',
    text:
      'Fish are more active during certain weather conditions. Overcast days and light winds are often best, '
      + 'as fish tend to be closer to the surface.',
  },
  {
    id: 'live_bait',
    title: 'Use Live Bait:',
    text:
      'Live bait (worms, minnows, insects) often attracts fish more effectively than artificial lures. '
      + 'Match the bait to the species you\'re targeting.',
  },
  {
    id: 'seasons',
    title: 'Know the Fishing Seasons:',
    text:
      'Different species are more active at different times of the year. Research the best season for the fish you want to catch.',
  },
  {
    id: 'water_temp',
    title: 'Understand Water Temperature:',
    text:
      'Fish prefer specific temperatures. In warm months they move deeper; in cold months they may cruise nearer the surface.',
  },
  {
    id: 'times',
    title: 'Fish Early or Late in the Day:',
    text:
      'Dawn and dusk are prime times: cooler water and increased feeding activity.',
  },
  {
    id: 'distance',
    title: 'Keep Your Distance:',
    text:
      'Fish spook easily. Stay quiet and limit sudden movement, especially near the shoreline.',
  },
  {
    id: 'observe',
    title: 'Observe the Water:',
    text:
      'Watch for ripples or jumping fish — clear indicators of active feeding zones.',
  },
  {
    id: 'patience',
    title: 'Practice Patience:',
    text:
      'Fishing often involves long waits. Relax and enjoy the process until the fish bite.',
  },
  {
    id: 'regulations',
    title: 'Know the Local Regulations:',
    text:
      'Always confirm local rules on seasons, limits, and protected species before casting.',
  },
];

/* ────────── константы / баннер ────────── */
const { width } = Dimensions.get('window');
const HEADER_H  = 140;
const RADIUS    = 24;
const PAD_TOP   = Platform.OS === 'ios' ? 44 : 24;

/* ---------- общий баннер-хедер ---------- */
function BannerHeader({ title, onBack }) {
  return (
    <View style={b.headerWrap}>
      <View style={b.border} />
      <View style={b.inner}>
        {onBack && (
          <TouchableOpacity style={b.backBtn} onPress={onBack} hitSlop={8}>
            <Image source={ICON_BACK} style={b.backIcon} resizeMode="contain" />
          </TouchableOpacity>
        )}
        <Text style={b.h1}>{title}</Text>
      </View>
    </View>
  );
}

/* ────────── локальный стек ────────── */
const Stack = createNativeStackNavigator();
export default function TipsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="TipsList"   component={TipsList}   />
      <Stack.Screen name="TipArticle" component={TipArticle} />
    </Stack.Navigator>
  );
}

/* ═════════ 1. список советов ════════════ */
function TipsList() {
  const nav = useNavigation();

  const renderCard = ({ item }) => (
    <View style={ls.card}>
      <View style={ls.row}>
        <Image source={ICON_TIP} style={ls.icon} />
        <Text style={ls.title}>{item.title}</Text>
      </View>

      <Text style={ls.preview} numberOfLines={3}>{item.text}</Text>

      <View style={ls.btnRow}>
        <TouchableOpacity
          style={ls.readBtn}
          onPress={() => nav.navigate('TipArticle', { tip: item })}
        >
          <Text style={ls.readTxt}>Read</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={ls.shareBtn}
          onPress={() => nav.navigate('TipArticle', { tip: item, shareImmediately: true })}
        >
          <Image source={ICON_SHARE} style={ls.shareIcon} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={ls.container}>
      <BannerHeader title="Fishing tips" />

      <FlatList
        data={TIPS}
        keyExtractor={(i) => i.id}
        renderItem={renderCard}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: HEADER_H + 24,
          paddingHorizontal: 24,
          paddingBottom: 100,
        }}
        ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
      />
    </View>
  );
}

/* ═════════ 2. статья совета ══════════════ */
function TipArticle() {
  const nav                          = useNavigation();
  const { params }                   = useRoute();
  const { tip, shareImmediately }    = params;

  /* сразу поделиться, если пришли из «share» кнопки списка */
  useEffect(() => { if (shareImmediately) handleShare(); }, []);

  const handleShare = () =>
    Share.share({ title: tip.title, message: `${tip.title}\n\n${tip.text}` });

  return (
    <View style={as.container}>
      <BannerHeader title="Fishing tips" onBack={() => nav.goBack()} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: HEADER_H + 24,
          paddingHorizontal: 24,
          paddingBottom: 100,
        }}
      >
        {/* ───── белая карточка с текстом ───── */}
        <View style={as.card}>
          <View style={as.blockHeader}>
            <Image source={ICON_TIP} style={as.blockIcon} />
            <Text style={as.blockTitle}>{tip.title}</Text>
          </View>

          <Text style={as.text}>{tip.text}</Text>
        </View>

        <TouchableOpacity style={as.shareBtn} onPress={handleShare}>
          <Text style={as.shareTxt}>Share tip</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

/* ────────── стили баннера ────────── */
const b = StyleSheet.create({
  headerWrap: {
    position: 'absolute', top: 0, left: 0, right: 0, height: HEADER_H, zIndex: 10,
  },
  border: {
    ...StyleSheet.absoluteFillObject,
    borderBottomLeftRadius: RADIUS,
    borderBottomRightRadius: RADIUS,
    borderWidth: 1,
    borderColor: '#ffffff80',
  },
  inner: {
    flex: 1,
    borderBottomLeftRadius:  RADIUS,
    borderBottomRightRadius: RADIUS,
    backgroundColor: '#1D7FA8',
    paddingTop: PAD_TOP,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backBtn:   { position: 'absolute', left: 20, top: PAD_TOP + 4, padding: 8  , top:70,},
  backIcon:  { width: 24, height: 24, tintColor: '#FFFFFF' },
  h1:        { width: width * 0.8, textAlign: 'center', color: '#FFFFFF', fontSize: 24, fontWeight: '700' },
});

/* ────────── стили списка (ls) ────────── */
const ls = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#10688D' },

  card:   { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 20 },
  row:    { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  icon:   { width: 26, height: 26, tintColor: '#00344B', marginRight: 10 },
  title:  { fontSize: 18, fontWeight: '700', color: '#00344B', flex: 1 },
  preview:{ fontSize: 15, lineHeight: 20, color: '#00344B', marginBottom: 16 },

  btnRow:  { flexDirection: 'row', justifyContent: 'space-between' },
  readBtn: { flex: 1, backgroundColor: '#002C38', paddingVertical: 12, borderRadius: 8,
             alignItems: 'center', marginRight: 10 },
  readTxt: { color: '#FFFFFF', fontWeight: '700', fontSize: 16 },
  shareBtn:{ width: 48, height: 48, borderRadius: 8, backgroundColor: '#002C38',
             alignItems: 'center', justifyContent: 'center' },
  shareIcon:{ width: 22, height: 22, tintColor: '#FFFFFF' },
});

/* ────────── стили статьи (as) ────────── */
const as = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#10688D' },

  /* белая карточка-контейнер */
  card: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 20, marginBottom: 30 },

  blockHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  blockIcon:   { width: 24, height: 24, tintColor: '#00344B', marginRight: 8 },
  blockTitle:  { fontSize: 20, fontWeight: '700', color: '#00344B', flexShrink: 1 },

  text:       { fontSize: 16, lineHeight: 22, color: '#00344B' },

  shareBtn:   { backgroundColor: '#FFFFFF', borderRadius: 10, paddingVertical: 18, alignItems: 'center' },
  shareTxt:   { fontSize: 18, fontWeight: '700', color: '#00344B' },
});
