// screens/LocationDetails.js
import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Share,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SavedContext } from '../Components/SavedContext';
import { SPOTS } from '../Components/spots';

const PIN   = require('../assets/pin.png');
const FISH  = require('../assets/fish2.png');
const SHARE = require('../assets/share.png');
const BOOK  = require('../assets/bookmark.png');
const ARROW = require('../assets/arrow.png');
const HERO  = require('../assets/loader_logo.png');

export default function LocationDetails() {
  const navigation             = useNavigation();
  const { params }             = useRoute();
  const { spot: initSpot, season } = params;

  const { saved, toggle }      = useContext(SavedContext);

  const [spot, setSpot]        = useState(initSpot);
  const [loading, setLoading]  = useState(true);

  /* имитируем загрузку */
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(t);
  }, []);

  const isSaved = saved.some(s => s.name === spot.name);
  const onSave  = () => toggle(spot);

  /** перейти на карту и сразу открыть именно этот спот  */
  const onOpenMap = () => {
    navigation.navigate('MapScreen', {
      initialSpotName: spot.name,
      initialCoords:   spot.coords,
    });
  };

  const onShare = () =>
    Share.share({
      title:   spot.name,
      message: `${spot.name}\n${spot.address}\n${spot.desc}`,
    });

  const onSearchOther = () => {
    setLoading(true);
    const list = SPOTS[season];
    let next   = spot;
    while (next.name === spot.name && list.length > 1) {
      next = list[Math.floor(Math.random() * list.length)];
    }
    setTimeout(() => {
      setSpot(next);
      setLoading(false);
    }, 900);
  };

  /* ---------- LOADER ---------- */
  if (loading) {
    return (
      <View style={styles.container}>
        <Header title="Loading…" navigation={navigation} />
        <Image source={HERO} style={styles.hero} resizeMode="contain" />
        <TouchableOpacity style={styles.waitBtn} activeOpacity={0.8}>
          <Text style={styles.waitTxt}>Please wait</Text>
        </TouchableOpacity>
      </View>
    );
  }

  /* ---------- MAIN LAYOUT ---------- */
  return (
    <View style={styles.container}>
      <Header title="Result:" navigation={navigation} />

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.card}>
          <Image source={spot.img} style={styles.img} />

          <View style={styles.cardBody}>
            <Text style={styles.title}>{spot.name}</Text>
            <Text style={styles.desc}>{spot.desc}</Text>

            <View style={styles.row}>
              <Image source={PIN} style={styles.icon} />
              <Text style={styles.rowTxt}>{spot.address}</Text>
            </View>

            <View style={styles.row}>
              <Image source={FISH} style={styles.icon} />
              <Text style={styles.rowTxt}>Fish Types: {spot.fish}</Text>
            </View>

            <View style={styles.inlineBtns}>
              <TouchableOpacity
                style={styles.mapBtn}
                onPress={onOpenMap}
                activeOpacity={0.85}
              >
                <Text style={styles.mapTxt}>Open on map</Text>
              </TouchableOpacity>

              {/* Save button with two colour states */}
              <TouchableOpacity
                style={[
                  styles.squareBtn,
                  styles.saveBtn,
                  isSaved && styles.squareBtnActive,
                ]}
                onPress={onSave}
                activeOpacity={0.85}
              >
                <Image
                  source={BOOK}
                  style={[
                    styles.squareIcon,
                    isSaved && styles.squareIconActive, // tint stays white, but kept for parity
                  ]}
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.squareBtn}
                onPress={onShare}
                activeOpacity={0.85}
              >
                <Image source={SHARE} style={styles.squareIcon} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={styles.otherBtn}
          onPress={onSearchOther}
          activeOpacity={0.85}
        >
          <Text style={styles.otherTxt}>Search other</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

/* ---------- HEADER COMPONENT ---------- */
function Header({ title, navigation }) {
  return (
    <View style={styles.header}>
      <TouchableOpacity
        style={styles.back}
        onPress={() => navigation.goBack()}
        activeOpacity={0.7}
      >
        <Image source={ARROW} style={styles.backIcon} resizeMode="contain" />
      </TouchableOpacity>
      <Text style={styles.h1}>{title}</Text>
    </View>
  );
}

/* ---------- STYLES ---------- */
const HEADER_H = 120;
const H_PAD    = 20;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#10688D' },

  /* header */
  header: {
    height: HEADER_H,
    backgroundColor: '#2A8EB9',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    justifyContent: 'flex-end',
    paddingHorizontal: H_PAD,
    paddingBottom: 32,
  },
  back: { position: 'absolute', top: 16, left: H_PAD, width: 32, height: 32, justifyContent: 'center', alignItems: 'center' },
  backIcon: { width: 24, height: 24, tintColor: '#FFFFFF', marginTop: 79 },
  h1: { fontSize: 28, fontWeight: '700', color: '#FFFFFF', textAlign: 'center' },

  /* loader */
  hero:   { width: '100%', height: 260, marginTop: 20 },
  waitBtn:{ alignSelf: 'center', backgroundColor: '#FFFFFF', borderRadius: 10, paddingVertical: 18, paddingHorizontal: 32, marginTop: 24 },
  waitTxt:{ color: '#00344B', fontSize: 18, fontWeight: '700' },

  /* scroll & card */
  scroll:{ paddingHorizontal: 24, paddingTop: 20, paddingBottom: 140 },

  card:   { backgroundColor: '#FFFFFF', borderRadius: 16, overflow: 'hidden', marginBottom: 20 },
  img:    { width: '100%', height: 180 },
  cardBody:{ padding: 20 },
  title:  { fontSize: 20, fontWeight: '700', color: '#00344B', marginBottom: 6 },
  desc:   { fontSize: 15, lineHeight: 20, color: '#00344B', marginBottom: 12 },

  row:    { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 8 },
  icon:   { width: 18, height: 18, marginRight: 6, tintColor: '#00344B' },
  rowTxt: { flex: 1, color: '#00344B', fontSize: 15 },

  /* buttons */
  inlineBtns:{ flexDirection: 'row', alignItems: 'center', marginTop: 14 },
  mapBtn:{ flex: 1, backgroundColor: '#002C38', paddingVertical: 14, borderRadius: 8, marginRight: 10, alignItems: 'center' },
  mapTxt:{ color: '#FFFFFF', fontSize: 16, fontWeight: '700' },

  squareBtn:{ width: 48, height: 48, borderRadius: 8, backgroundColor: '#002C38', alignItems: 'center', justifyContent: 'center' },
  squareBtnActive:{ backgroundColor: '#20769C' },          // сохранён
  saveBtn:{ marginRight: 12 },

  squareIcon:{ width: 22, height: 22, tintColor: '#FFFFFF' },
  squareIconActive:{ tintColor: '#FFFFFF' },                // белая иконка остаётся белой

  /* нижняя кнопка */
  otherBtn:{ backgroundColor: '#FFFFFF', borderRadius: 10, paddingVertical: 18, alignItems: 'center' },
  otherTxt:{ fontSize: 18, fontWeight: '700', color: '#00344B' },
});
