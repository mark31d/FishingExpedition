// MainScreen.js — вкладка «Main» (Explore fishing spots)
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  Dimensions,
  StatusBar,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SPOTS } from '../Components/spots';

/* ---------- размеры ---------- */
const { width } = Dimensions.get('window');
const H_PAD    = 20;
const GAP      = 5;
const CARD_W   = (width - H_PAD * 2 - GAP) / 2;
const HEADER_H = 120;
const CARD_R   = 16;

const SEASONS = [
  { id: 'spring', title: 'Spring Fishing', img: require('../assets/spring.png') },
  { id: 'summer', title: 'Summer Fishing', img: require('../assets/summer.png') },
  { id: 'autumn', title: 'Autumn Fishing', img: require('../assets/autumn.png') },
  { id: 'winter', title: 'Winter Fishing', img: require('../assets/winter.png') },
];

export default function MainScreen() {
  const nav               = useNavigation();
  const [selected, setSel] = useState(null);

  const onExplore = () => {
    if (!selected) return;
    const list = SPOTS[selected];
    const spot = list[Math.floor(Math.random() * list.length)];
    nav.navigate('LocationDetails', { spot, season: selected });
  };

  return (
    <View style={styles.container}>
      <StatusBar translucent barStyle="light-content" backgroundColor="transparent" />

      {/* зафиксированный хедер */}
      <View style={styles.header}>
        <Text style={styles.h1}>Explore fishing spots</Text>
      </View>

      {/* весь остальной контент скроллится */}
      <ScrollView style={styles.scrollArea} contentContainerStyle={styles.scrollContent}>
        {/* грид сезонов */}
        <FlatList
          data={SEASONS}
          keyExtractor={item => item.id}
          numColumns={2}
          columnWrapperStyle={{ gap: GAP }}
          contentContainerStyle={styles.grid}
          scrollEnabled={false}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => {
            const focused = selected === item.id;
            const row = Math.floor(index / 2);
            const col = index % 2;
            const cornerStyle = {};
            if (row === 0 && col === 0) cornerStyle.borderTopLeftRadius = CARD_R;
            if (row === 0 && col === 1) cornerStyle.borderTopRightRadius = CARD_R;
            if (row === 1 && col === 0) cornerStyle.borderBottomLeftRadius = CARD_R;
            if (row === 1 && col === 1) cornerStyle.borderBottomRightRadius = CARD_R;

            return (
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => setSel(focused ? null : item.id)} // toggle selection
                style={[
                  styles.cardWrap,
                  { borderColor: focused ? '#FFFFFF' : 'transparent' },
                  cornerStyle,
                ]}
              >
                <Image source={item.img} style={[styles.cardImg, cornerStyle]} />
                <View style={[styles.overlay, cornerStyle]} />
                <Text style={styles.cardTitle}>{item.title}</Text>
              </TouchableOpacity>
            );
          }}
        />

        {/* кнопка Explore */}
        <TouchableOpacity
          style={[styles.exploreBtn, !selected && styles.exploreBtnDisabled]}
          disabled={!selected}
          activeOpacity={0.85}
          onPress={onExplore}
        >
          <Text style={[styles.exploreTxt, !selected && styles.exploreTxtDisabled]}>
            Explore
          </Text>
        </TouchableOpacity>

        {/* View all spots (если сезон не выбран) */}
        {!selected && (
          <TouchableOpacity style={styles.viewAllBtn} activeOpacity={0.85} onPress={() => nav.navigate('MapScreen')}>
            <Image source={require('../assets/map_icon.png')} style={styles.mapIcon} />
            <Text style={styles.viewAllTxt}>View all spots</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#10688D',
  },
  header: {
    height: HEADER_H,
    backgroundColor: '#2A8EB9',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    justifyContent: 'flex-end',
    paddingHorizontal: H_PAD,
    paddingBottom: 32,
  },
  h1: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 140, // увеличенный отступ внизу
  },
  grid: {
    paddingHorizontal: H_PAD,
    paddingTop: 24,
    paddingBottom: 12,
  },
  cardWrap: {
    width: CARD_W,
    height: CARD_W,
    marginBottom: GAP,
    borderWidth: 2,
    overflow: 'hidden',
  },
  cardImg: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  cardTitle: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    right: 12,
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  exploreBtn: {
    marginHorizontal: H_PAD,
    marginTop: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingVertical: 18,
    alignItems: 'center',
  },
  exploreBtnDisabled: {
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  exploreTxt: {
    fontSize: 18,
    fontWeight: '700',
    color: '#00344B',
  },
  exploreTxtDisabled: {
    opacity: 0.45,
  },
  viewAllBtn: {
    marginHorizontal: H_PAD,
    marginTop: 16,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    justifyContent: 'center',
  },
  mapIcon: {
    width: 20,
    height: 20,
    tintColor: '#00344B',
    marginRight: 8,
  },
  viewAllTxt: {
    fontSize: 18,
    fontWeight: '700',
    color: '#00344B',
  },
});
