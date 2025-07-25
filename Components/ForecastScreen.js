// screens/ForecastScreen.js
import React, { useEffect, useContext } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Share,
  Dimensions,
  Platform,
} from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNavigation, useRoute } from '@react-navigation/native';

import { FORECASTS }    from '../Components/forecasts';
import { SavedContext } from '../Components/SavedContext';

/* ─── assets ─── */
const ICON_BACK  = require('../assets/arrow.png');
const ICON_FC    = require('../assets/forecast.png');
const ICON_SHARE = require('../assets/share.png');
const ICON_PIN   = require('../assets/pin.png');
const ICON_FISH  = require('../assets/fish2.png');
const ICON_SAVE  = require('../assets/bookmark.png');

/* ─── local stack ─── */
const Stack = createNativeStackNavigator();

/* ---------- common banner-header ---------- */
const { width } = Dimensions.get('window');
const HEADER_H  = 140;
const RADIUS    = 24;
const PAD_TOP   = Platform.OS === 'ios' ? 44 : 24;

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

/* ═══════════ 1. list screen ═══════════ */
function ForecastList() {
  const nav = useNavigation();

  const renderCard = ({ item }) => (
    <View style={fs.card}>
      <View style={fs.row}>
        <Image source={ICON_FC} style={fs.icon} />
        <Text style={fs.title}>{item.title}</Text>
      </View>

      <View style={fs.btnRow}>
        <TouchableOpacity
          style={fs.readBtn}
          onPress={() => nav.navigate('ForecastArticle', { fc: item })}
        >
          <Text style={fs.readTxt}>Read</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={fs.shareBtn}
          onPress={() =>
            nav.navigate('ForecastArticle', { fc: item, shareImmediately: true })
          }
        >
          <Image source={ICON_SHARE} style={fs.shareIcon} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={fs.container}>
      <BannerHeader title="The Ultimate Fishing Forecast" />

      <FlatList
        data={FORECASTS}
        keyExtractor={(i) => i.id}
        renderItem={renderCard}
        contentContainerStyle={{
          paddingTop: HEADER_H + 24,
          paddingHorizontal: 24,
          paddingBottom: 40,
        }}
        ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

/* ═══════════ 2. article screen ═══════════ */
function ForecastArticle() {
  const nav = useNavigation();
  const { params } = useRoute();
  const { fc, shareImmediately } = params;
  const { saved, toggle } = useContext(SavedContext);

  useEffect(() => {
    if (shareImmediately) handleShare();
  }, []);

  const handleShare = () =>
    Share.share({ title: fc.title, message: `${fc.title}\n\n${fc.text}` });

  const best    = fc.best;
  const isSaved = saved.some((p) => p.name === best.name);   // ← сравниваем по name
  const save    = () => toggle(best);

  const openMap = () =>
    nav.navigate('MapScreen', {
      initialSpotName: best.name,
      initialCoords:   best.coords,
    });

  return (
    <View style={fa.container}>
      <BannerHeader title="The Ultimate Fishing Forecast" onBack={() => nav.goBack()} />

      <ScrollView
        contentContainerStyle={{
          paddingTop: HEADER_H + 24,
          paddingHorizontal: 24,
          paddingBottom: 130,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* title card */}
        <View style={fa.titleCard}>
          <View style={fa.blockHeader}>
            <Image source={ICON_FC} style={fa.blockIcon} />
            <Text style={fa.blockTitle}>{fc.title}</Text>
          </View>
        </View>

        {/* main text card */}
        <View style={fa.textCard}>
          <Text style={fa.text}>{fc.text}</Text>
        </View>

        {/* Best Location card */}
        <View style={fa.locCard}>
          <Text style={fa.subH}>Best Location:</Text>

          <Image source={best.img} style={fa.locImg} />
          <View style={fa.locBody}>
            <Text style={fa.locName}>{best.name}</Text>
            <Text style={fa.locDesc}>{best.desc}</Text>

            <View style={fa.row}>
              <Image source={ICON_PIN} style={fa.rowIcon} />
              <Text style={fa.rowTxt}>{best.address}</Text>
            </View>
            <View style={fa.row}>
              <Image source={ICON_FISH} style={fa.rowIcon} />
              <Text style={fa.rowTxt}>Fish Types: {best.fish}</Text>
            </View>

            <View style={fa.inlineBtns}>
              <TouchableOpacity style={fa.mapBtn} onPress={openMap}>
                <Text style={fa.mapTxt}>Open on map</Text>
              </TouchableOpacity>

              {/* Save / Un-save */}
              <TouchableOpacity
                style={[fa.squareBtn, fa.saveBtn, isSaved && fa.squareBtnActive]}
                onPress={save}
              >
                <Image
                  source={ICON_SAVE}
                  style={[fa.squareIcon, isSaved && fa.squareIconActive]}
                />
              </TouchableOpacity>

              <TouchableOpacity style={fa.squareBtn} onPress={handleShare}>
                <Image source={ICON_SHARE} style={fa.squareIcon} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <TouchableOpacity style={fa.shareBtn} onPress={handleShare}>
          <Text style={fa.shareTxt}>Share forecast</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

/* ── local stack export ── */
export default function ForecastStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ForecastList"    component={ForecastList}   />
      <Stack.Screen name="ForecastArticle" component={ForecastArticle}/>
    </Stack.Navigator>
  );
}

/* ---------- styles ---------- */
/* баннер */
const b = StyleSheet.create({
  headerWrap:{ position:'absolute', top:0, left:0, right:0, height:HEADER_H, zIndex:10 },
  border:{ ...StyleSheet.absoluteFillObject, borderBottomLeftRadius:RADIUS, borderBottomRightRadius:RADIUS, borderWidth:1, borderColor:'#ffffff80' },
  inner:{ flex:1, borderBottomLeftRadius:RADIUS, borderBottomRightRadius:RADIUS, backgroundColor:'#1D7FA8', paddingTop:PAD_TOP, justifyContent:'center', alignItems:'center' },
  backBtn:{ position:'absolute', left:20, top:PAD_TOP+4, padding:8 , top:56, },
  backIcon:{ width:24, height:24, tintColor:'#FFFFFF' },
  h1:{ width: width*0.8, textAlign:'center', color:'#FFFFFF', fontSize:24, fontWeight:'700' },
});

/* список прогнозов */
const fs = StyleSheet.create({
  container:{ flex:1, backgroundColor:'#10688D' },
  card:{ backgroundColor:'#FFFFFF', borderRadius:16, padding:20 },
  row:{ flexDirection:'row', alignItems:'center', marginBottom:12 },
  icon:{ width:26, height:26, tintColor:'#00344B', marginRight:10 },
  title:{ fontSize:18, fontWeight:'700', color:'#00344B', flex:1 },

  btnRow:{ flexDirection:'row', justifyContent:'space-between' },
  readBtn:{ flex:1, backgroundColor:'#002C38', paddingVertical:12, borderRadius:8, alignItems:'center', marginRight:10 },
  readTxt:{ color:'#FFFFFF', fontWeight:'700', fontSize:16 },
  shareBtn:{ width:48, height:48, borderRadius:8, backgroundColor:'#002C38', alignItems:'center', justifyContent:'center' },
  shareIcon:{ width:22, height:22, tintColor:'#FFFFFF' },
});

/* статья */
const fa = StyleSheet.create({
  container:{ flex:1, backgroundColor:'#10688D' },

  titleCard:{ backgroundColor:'#FFFFFF', borderRadius:16, padding:20, marginBottom:20 },
  textCard: { backgroundColor:'#FFFFFF', borderRadius:16, padding:20, marginBottom:24 },

  blockHeader:{ flexDirection:'row', alignItems:'center' },
  blockIcon:{ width:24, height:24, tintColor:'#00344B', marginRight:8 },
  blockTitle:{ fontSize:20, fontWeight:'700', color:'#00344B', flexShrink:1 },

  text:{ fontSize:16, lineHeight:22, color:'#00344B' },

  subH:{ fontSize:18, fontWeight:'700', color:'#00344B', marginBottom:10 },

  locCard:{ backgroundColor:'#FFFFFF', borderRadius:16, overflow:'hidden', marginBottom:20, padding:10 },
  locImg:{ width:'100%', height:160, borderRadius:10 },
  locBody:{ padding:16 },
  locName:{ fontSize:18, fontWeight:'700', color:'#00344B', marginBottom:6 },
  locDesc:{ fontSize:15, lineHeight:20, color:'#00344B', marginBottom:10 },

  row:{ flexDirection:'row', alignItems:'flex-start', marginBottom:6 },
  rowIcon:{ width:18, height:18, tintColor:'#00344B', marginRight:6 },
  rowTxt:{ flex:1, fontSize:15, color:'#00344B' },

  inlineBtns:{ flexDirection:'row', alignItems:'center', marginTop:10 },
  mapBtn:{ flex:1, backgroundColor:'#002C38', paddingVertical:12, borderRadius:8, marginRight:10, alignItems:'center' },
  mapTxt:{ color:'#FFFFFF', fontWeight:'700', fontSize:15 },

  squareBtn:{ width:48, height:48, borderRadius:8, backgroundColor:'#002C38', alignItems:'center', justifyContent:'center' },
  saveBtn:{ marginRight:12 },
  squareBtnActive:{ backgroundColor:'#20769C' },

  squareIcon:{ width:22, height:22, tintColor:'#FFFFFF' },
  squareIconActive:{ tintColor:'#fff' ,  },   
  shareBtn:{ backgroundColor:'#FFFFFF', borderRadius:10, paddingVertical:18, alignItems:'center', marginTop:20 },
  shareTxt:{ fontSize:18, fontWeight:'700', color:'#00344B' },
});
