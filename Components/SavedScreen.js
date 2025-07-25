// screens/SavedScreen.js
import React, { useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Share,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { SavedContext } from './SavedContext';
import { openMapInBrowser } from '../Components/openMap'; // <── добавили

/* assets */
const ICON_PIN   = require('../assets/pin.png');
const ICON_FISH  = require('../assets/fish2.png');
const ICON_SHARE = require('../assets/share.png');
const BOOKMARK   = require('../assets/bookmark.png');

export default function SavedScreen() {
  const navigation        = useNavigation();
  const { saved, toggle } = useContext(SavedContext);

  // Обновляемся при возврате на экран
  useFocusEffect(React.useCallback(() => {}, [saved]));

  const EmptyState = () => (
    <View style={styles.emptyWrap}>
      <Text style={styles.emptyTxt}>
        You haven’t saved any{'\n'}places yet.
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* ---------- header ---------- */}
      <View style={styles.header}>
        <Text style={styles.h1}>Saved places</Text>
      </View>

      {/* ---------- body ---------- */}
      {saved.length === 0 ? (
        <EmptyState />
      ) : (
        <ScrollView contentContainerStyle={styles.body}>
          {saved.map((spot) => {
            // Открыть координаты в браузерной карте
            const onMap = () => openMapInBrowser(spot.coords.lat, spot.coords.lon, spot.name);

            const onShare = () =>
              Share.share({
                title:   spot.name,
                message: `${spot.name}\n${spot.address}\n${spot.desc}`,
              });

            return (
              <View key={spot.name} style={styles.card}>
                <Image source={spot.img} style={styles.img} />
                <View style={styles.cardBody}>
                  <Text style={styles.title}>{spot.name}</Text>
                  <Text style={styles.desc}>{spot.desc}</Text>

                  <View style={styles.row}>
                    <Image source={ICON_PIN} style={styles.rowIcon} />
                    <Text style={styles.rowTxt}>{spot.address}</Text>
                  </View>
                  <View style={styles.row}>
                    <Image source={ICON_FISH} style={styles.rowIcon} />
                    <Text style={styles.rowTxt}>Fish Types: {spot.fish}</Text>
                  </View>

                  <View style={styles.inlineBtns}>
                    {/* Open on map */}
                    <TouchableOpacity
                      style={styles.mapBtn}
                      onPress={onMap}
                      activeOpacity={0.85}
                    >
                      <Text style={styles.mapTxt}>Open on map</Text>
                    </TouchableOpacity>

                    {/* Save / Unsave */}
                    <TouchableOpacity
                      style={[styles.squareBtn, styles.saveBtn, styles.squareBtnActive]}
                      onPress={() => toggle(spot)}
                      activeOpacity={0.85}
                    >
                      <Image source={BOOKMARK} style={styles.squareIcon} />
                    </TouchableOpacity>

                    {/* Share */}
                    <TouchableOpacity
                      style={styles.squareBtn}
                      onPress={onShare}
                      activeOpacity={0.85}
                    >
                      <Image source={ICON_SHARE} style={styles.squareIcon} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
}

/* ---------- styles ---------- */
const HEADER_H = 120;
const H_PAD    = 20;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#10688D' },
  body:      { padding: 24, paddingBottom: 40 },

  /* header */
  header: {
    height: HEADER_H,
    backgroundColor: '#2A8EB9',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: H_PAD,
    paddingBottom: 32,
  },
  h1: {
    flex: 1,
    textAlign: 'center',
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '700',
    marginBottom: -40,
  },

  /* empty */
  emptyWrap: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyTxt:  { color: '#FFFFFF', fontSize: 20, fontWeight: '600', textAlign: 'center', lineHeight: 28 },

  /* card */
  card:     { backgroundColor: '#FFFFFF', borderRadius: 16, overflow: 'hidden', marginBottom: 24 },
  img:      { width: '100%', height: 160 },
  cardBody: { padding: 20 },
  title:    { fontSize: 18, fontWeight: '700', color: '#00344B', marginBottom: 6 },
  desc:     { fontSize: 15, lineHeight: 20, color: '#00344B', marginBottom: 12 },

  row:     { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 6 },
  rowIcon: { width: 18, height: 18, tintColor: '#00344B', marginRight: 6 },
  rowTxt:  { flex: 1, fontSize: 15, color: '#00344B' },

  /* buttons */
  inlineBtns: { flexDirection: 'row', alignItems: 'center', marginTop: 12 },

  mapBtn: { flex: 1, backgroundColor: '#002C38', paddingVertical: 14, borderRadius: 8, marginRight: 10, alignItems: 'center' },
  mapTxt: { color: '#FFFFFF', fontWeight: '700', fontSize: 16 },

  squareBtn:       { width: 48, height: 48, borderRadius: 8, backgroundColor: '#002C38', alignItems: 'center', justifyContent: 'center' },
  saveBtn:         { marginRight: 12 },
  squareBtnActive: { backgroundColor: '#20769C' },
  squareIcon:      { width: 22, height: 22, tintColor: '#FFFFFF' },
});
