import React, { useMemo, useState, useContext, useRef, useEffect } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Image,
  StyleSheet,
  Share,
  Dimensions,
  Platform,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useNavigation, useRoute } from '@react-navigation/native';

import { SavedContext } from '../Components/SavedContext';
import { SPOTS } from '../Components/spots';

const { width } = Dimensions.get('window');
const CARD_W        = width * 0.85;
const HEADER_H      = 140;
const H_PAD         = 20;
const ICON_SIZE     = 46;

const BACK   = require('../assets/arrow.png');
const PIN    = require('../assets/pin.png');
const SAVE   = require('../assets/bookmark.png');
const SHARE  = require('../assets/share.png');
const FISH   = require('../assets/fish2.png');

/* ---------- карточка ---------- */
function SpotCard({ spot, onNext, onSave, saved, onShare, onClose }) {
  return (
    <View style={styles.cardWrap}>
      <View style={styles.frame} />
      <View style={styles.card}>
        <Image source={spot.img} style={styles.photo} />
        <View style={styles.cardBody}>
          <Text style={styles.name}>{spot.name}</Text>
          <Text style={styles.desc}>{spot.desc}</Text>

          <View style={styles.row}>
            <Image source={PIN} style={styles.symbol} />
            <Text style={styles.rowTxt}>{spot.address}</Text>
          </View>
          <View style={styles.row}>
            <Image source={FISH} style={styles.symbol} />
            <Text style={styles.rowTxt}>Fish Types: {spot.fish}</Text>
          </View>

          <View style={[styles.row, { marginTop: 14 }]}>
            <TouchableOpacity style={styles.nextBtn} onPress={onNext}>
              <Text style={styles.nextTxt}>Next</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={onSave}>
              <View style={[styles.iconBtn, saved && styles.iconBtnActive]}>
                <Image source={SAVE} style={[styles.iconImg, saved && styles.iconImgActive]} />
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={onShare}>
              <View style={styles.iconBtn}>
                <Image source={SHARE} style={styles.iconImg} />
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeTxt}>×</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

export default function MapScreen() {
  const nav        = useNavigation();
  const route      = useRoute();
  const mapRef     = useRef(null);
  const { saved, toggle } = useContext(SavedContext);

  /* плоский список + фиктивный id */
  const spots = useMemo(
    () =>
      Object.values(SPOTS)
        .flat()
        .map((s, i) => ({ id: i, ...s })),
    [],
  );

  const { initialSpotId, initialSpotName, initialCoords } = route.params || {};

  /* стартовый индекс */
  const startIdx =
    initialSpotId != null
      ? spots.findIndex(s => s.id === initialSpotId)
      : initialSpotName != null
      ? spots.findIndex(s => s.name === initialSpotName)
      : -1;

  /* выбранный спот */
  const [currentIdx, setCurrentIdx] = useState(startIdx);
  const [current, setCurrent]       = useState(startIdx >= 0 ? spots[startIdx] : null);

  /* регион, который постоянно обновляем (нужен для зума) */
  const [viewRegion, setViewRegion] = useState({
    latitude:       initialCoords?.lat ?? spots[0].coords.lat,
    longitude:      initialCoords?.lon ?? spots[0].coords.lon,
    latitudeDelta:  10,
    longitudeDelta: 10,
  });

  /** открыть спот + анимация */
  const openSpot = (spot, idx) => {
    setCurrent(spot);
    setCurrentIdx(idx);
    const r = {
      latitude:       spot.coords.lat,
      longitude:      spot.coords.lon,
      latitudeDelta:  0.05,
      longitudeDelta: 0.05,
    };
    setViewRegion(r);
    mapRef.current?.animateToRegion(r, 450);
  };

  /* при первом рендере открываем стартовый */
  useEffect(() => {
    if (startIdx >= 0) {
      requestAnimationFrame(() => openSpot(spots[startIdx], startIdx));
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const nextSpot = () => {
    if (currentIdx < 0) return;
    const next = (currentIdx + 1) % spots.length;
    openSpot(spots[next], next);
  };

  const share = spot =>
    Share.share({ title: spot.name, message: `${spot.name}\n${spot.address}` });

  /* zoom helper */
  const zoom = factor => {
    const r = {
      ...viewRegion,
      latitudeDelta:  viewRegion.latitudeDelta * factor,
      longitudeDelta: viewRegion.longitudeDelta * factor,
    };
    setViewRegion(r);
    mapRef.current?.animateToRegion(r, 300);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={viewRegion}
        onRegionChangeComplete={setViewRegion}
        showsCompass
      >
        {spots.map((s, idx) => (
          <Marker
            key={s.id}
            image={PIN}
            coordinate={{ latitude: s.coords.lat, longitude: s.coords.lon }}
            onPress={e => {
              e.stopPropagation();
              openSpot(s, idx);
            }}
          />
        ))}
      </MapView>

      {current && (
        <>
          <TouchableWithoutFeedback
            onPress={() => {
              setCurrent(null);
              setCurrentIdx(-1);
            }}
          >
            <View style={styles.overlay} />
          </TouchableWithoutFeedback>

          <View style={styles.callout}>
            <SpotCard
              spot={current}
              onNext={nextSpot}
              onSave={() => toggle(current)}
              saved={saved.some(s => s.name === current.name)}
              onShare={() => share(current)}
              onClose={() => {
                setCurrent(null);
                setCurrentIdx(-1);
              }}
            />
          </View>
        </>
      )}

      {/* header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => nav.goBack()}>
          <Image source={BACK} style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.h1}>Explore fishing spots</Text>
      </View>

      {/* zoom buttons */}
      <View style={styles.zoomControls}>
        <TouchableOpacity style={styles.zoomBtn} onPress={() => zoom(0.5)}>
          <Text style={styles.zoomTxt}>＋</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.zoomBtn} onPress={() => zoom(2)}>
          <Text style={styles.zoomTxt}>－</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
/* ---------- Стили MapScreen ---------- */
const styles = StyleSheet.create({
    /* базовое */
    safeArea: { flex: 1, backgroundColor: '#2A8EB9' },
    map:      { ...StyleSheet.absoluteFillObject },
  
    /* ---------------- Header ---------------- */
    header: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: HEADER_H,
      backgroundColor: '#2A8EB9',
      borderBottomLeftRadius: 24,
      borderBottomRightRadius: 24,
      paddingHorizontal: H_PAD,
      paddingBottom: 32,
      flexDirection: 'row',
      alignItems: 'center',
      zIndex: 30,
    },
    backBtn:  { padding: 8, marginBottom: -40 },
    backIcon: { width: 24, height: 24, tintColor: '#FFFFFF' ,resizeMode:'contain' },
    h1: {
      flex: 1,
      textAlign: 'center',
      color: '#FFFFFF',
      fontSize: 28,
      fontWeight: '700',
      marginBottom: -40,
    },
  
    /* ----- затемнённая подложка + карточка ----- */
    overlay: { position: 'absolute', top: HEADER_H, left: 0, right: 0, bottom: 0, zIndex: 10 },
    callout: { position: 'absolute', bottom: Platform.OS === 'ios' ? 130 : 100, left: (width - CARD_W) / 2, width: CARD_W, zIndex: 20 },
  
    /* ---------------- Card ---------------- */
    cardWrap: { width: CARD_W, height: 400 },
    frame:    { ...StyleSheet.absoluteFillObject, borderRadius: 16, borderWidth: 4, borderColor: '#0080c0' },
    card:     { flex: 1, borderRadius: 12, overflow: 'hidden', backgroundColor: '#FFFFFF' },
    photo:    { width: '100%', height: 145 },
    cardBody: { flex: 1, padding: 14 },
  
    name: { fontSize: 20, fontWeight: '700', color: '#003D4D', marginBottom: 4 },
    desc: { color: '#003D4D', marginBottom: 10, lineHeight: 18 },
  
    row:     { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
    symbol:  { width: 18, height: 18, marginRight: 6 },
    rowTxt:  { color: '#003D4D', flexShrink: 1 },
  
    nextBtn: {
      width: 190,
      backgroundColor: '#002C38',
      borderRadius: 10,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: -2,
    },
    nextTxt: { color: '#FFFFFF', fontWeight: '700', fontSize: 16, paddingVertical: 12 },
  
    /* -------- Кнопка «Save» с двумя состояниями -------- */
    iconBtn:       { width: ICON_SIZE, height: ICON_SIZE, borderRadius: 10, backgroundColor: '#002C38', justifyContent: 'center', alignItems: 'center', marginLeft: 8 },
    iconBtnActive: { backgroundColor: '#20769C' },
    iconImg:       { width: 22, height: 22, tintColor: '#FFFFFF' },
    iconImgActive: { tintColor: '#FFFFFF' },
  
    /* крестик закрытия */
    closeBtn: { marginLeft: 8, width: ICON_SIZE, height: ICON_SIZE, justifyContent: 'center', alignItems: 'center' },
    closeTxt: { fontSize: 24, color: '#888888' },
  
    /* ---------------- Zoom ---------------- */
    zoomControls: {
      position: 'absolute',
      bottom:   Platform.OS === 'ios' ? 10 : 20,
      right:    20,
      justifyContent: 'space-between',
      height:   100,
      zIndex:   30,
    },
    zoomBtn: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: 'rgba(0,0,0,0.4)',
      justifyContent: 'center',
      alignItems: 'center',
      marginVertical: 4,
    },
    zoomTxt: { color: '#FFFFFF', fontSize: 24, fontWeight: '700', lineHeight: 26 },
  });
  