// screens/AllSpotsScreen.js
import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  Dimensions,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SPOTS } from '../Components/spots';

const { width } = Dimensions.get('window');
const CARD_W    = width * 0.9;

export default function AllSpotsScreen() {
  const nav = useNavigation();

  const spots = useMemo(
    () =>
      Object.values(SPOTS)
        .flat()
        .map((s, i) => ({ id: i.toString(), ...s })),
    []
  );

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.85}
      onPress={() => nav.navigate('LocationDetails', { spot: item, season: null })}
    >
      <Image source={item.img} style={styles.photo} />
      <View style={styles.body}>
        <Text style={styles.title}>{item.name}</Text>
        <Text style={styles.desc} numberOfLines={3}>{item.desc}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar translucent barStyle="light-content" backgroundColor="transparent" />
      <View style={styles.header}>
        <Text style={styles.h1}>All Spots</Text>
      </View>

      <FlatList
        data={spots}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const HEADER_H = 120;
const H_PAD    = 20;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#10688D' },
  header: {
    height: HEADER_H,
    backgroundColor: '#2A8EB9',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    justifyContent: 'flex-end',
    paddingHorizontal: H_PAD,
    paddingBottom: 32,
  },
  h1: { fontSize: 28, fontWeight: '700', color: '#FFFFFF', textAlign: 'center' },

  list:  { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 140 },
  card:  { width: CARD_W, alignSelf: 'center', backgroundColor: '#FFFFFF', borderRadius: 16, overflow: 'hidden', marginBottom: 16 },
  photo: { width: '100%', height: 160 },
  body:  { padding: 16 },
  title: { fontSize: 18, fontWeight: '700', color: '#00344B', marginBottom: 6 },
  desc:  { fontSize: 14, color: '#00344B', lineHeight: 18 },
});
