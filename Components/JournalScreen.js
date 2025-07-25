// screens/JournalScreen.js
import React, { useState, useContext } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  TextInput, Image, Share, Linking, Dimensions, Platform,
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { DiaryContext }    from './DiaryContext';

/* ---------- assets ---------- */
const ICON_PLUS  = require('../assets/plus.png');
const ICON_BACK  = require('../assets/arrow.png');
const ICON_SEND  = require('../assets/share.png');
const ICON_MAP   = require('../assets/pin.png');

/* ---------- banner-header (общий стиль приложения) ---------- */
const { width }   = Dimensions.get('window');
const HEADER_H    = 140;
const RADIUS      = 24;
const PAD_TOP     = Platform.OS === 'ios' ? 44 : 24;

function BannerHeader({ title, showBack, onBack }) {
  return (
    <View style={b.headerWrap}>
      <View style={b.border} />
      <View style={b.inner}>
        {showBack && (
          <TouchableOpacity style={b.backBtn} onPress={onBack} hitSlop={8}>
            <Image source={ICON_BACK} style={b.backIcon} resizeMode="contain" />
          </TouchableOpacity>
        )}
        <Text style={b.h1}>{title}</Text>
      </View>
    </View>
  );
}

/* ---------- helper ---------- */
const formatDate = d => d.toLocaleDateString('en-GB');

export default function JournalScreen() {
  /* global ctx */
  const { entries, add } = useContext(DiaryContext);

  /* ui mode */
  const [mode, setMode] = useState('list');

  /* form state */
  const [title, setTitle] = useState('');
  const [desc,  setDesc]  = useState('');
  const [date,  setDate]  = useState(new Date());

  /* calendar modal */
  const [dpVisible, setDpVisible] = useState(false);

  const resetForm = () => { setTitle(''); setDesc(''); setDate(new Date()); };

  const saveEntry = () => {
    if (!title.trim()) return;
    add({ id: Date.now().toString(), title, desc, date: formatDate(date) });
    resetForm();
    setMode('list');
  };

  /* common add button */
  const AddButton = ({ wide, onPress }) => (
    <TouchableOpacity
      style={[s.addBtn, wide && { alignSelf: 'stretch' }]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <Image source={ICON_PLUS} style={s.addIcon} />
      <Text style={s.addTxt}>Add the new</Text>
    </TouchableOpacity>
  );

  /* ===== EMPTY LIST ===== */
  if (mode === 'list' && entries.length === 0) {
    return (
      <View style={s.container}>
        <BannerHeader title="Fishing journal" />
        <View style={s.emptyWrap}>
          <Text style={s.emptyH}>There are no entries here at the moment.</Text>
          <Text style={s.emptySub}>You can add new ones using the button below.</Text>
          <AddButton onPress={() => setMode('form')} />
        </View>
      </View>
    );
  }

  /* ===== FORM (ADD) ===== */
  if (mode === 'form') {
    return (
      <View style={s.container}>
        <BannerHeader
          title="Fishing journal"
          showBack
          onBack={() => { resetForm(); setMode('list'); }}
        />

        <ScrollView
          contentContainerStyle={{ paddingTop: HEADER_H + 24, paddingHorizontal: 24, paddingBottom: 100 }}
          keyboardShouldPersistTaps="handled"
        >
          <Label text="Enter the title:" />
          <Input value={title} onChangeText={setTitle} placeholder="Title" />

          <Label text="Describe your catch:" />
          <Input
            value={desc}
            onChangeText={setDesc}
            placeholder="Description"
            multiline
            style={{ height: 100, textAlignVertical: 'top' }}
          />

          <Label text="Date:" />
          <TouchableOpacity onPress={() => setDpVisible(true)} activeOpacity={0.7}>
            <View pointerEvents="none">
              <Input value={formatDate(date)} editable={false} />
            </View>
          </TouchableOpacity>

          <DateTimePickerModal
            isVisible={dpVisible}
            mode="date"
            date={date}
            maximumDate={new Date()}
            display={Platform.OS === 'ios' ? 'inline' : 'default'}
            onConfirm={d => { setDpVisible(false); setDate(d); }}
            onCancel={() => setDpVisible(false)}
          />

          <AddButton wide onPress={saveEntry} />
        </ScrollView>
      </View>
    );
  }

  /* ===== LIST ===== */
  return (
    <View style={s.container}>
      <BannerHeader title="Fishing journal" />

      <ScrollView
        contentContainerStyle={{ paddingTop: HEADER_H + 24, paddingHorizontal: 24, paddingBottom: 90 }}
      >
        <AddButton wide onPress={() => setMode('form')} />
        <Text style={s.section}>My catches</Text>

        {entries.map(e => {
          const share = () =>
            Share.share({ title: e.title, message: `${e.title}\n${e.date}\n\n${e.desc}` });

          const openMap = () => {
            if (!e.coords) return;
            Linking.openURL(
              `https://www.google.com/maps/search/?api=1&query=${e.coords.lat},${e.coords.lon}`,
            );
          };

          return (
            <View key={e.id} style={s.card}>
              <Text style={s.date}>{e.date}</Text>
              <Text style={s.titleEntry}>{e.title}</Text>
              <Text style={s.descEntry}>{e.desc}</Text>

              <View style={s.inlineRow}>
                {e.coords && (
                  <TouchableOpacity style={s.smallBtn} onPress={openMap}>
                    <Image source={ICON_MAP} style={s.smallIcon} />
                  </TouchableOpacity>
                )}
                <TouchableOpacity style={s.smallBtn} onPress={share}>
                  <Image source={ICON_SEND} style={s.smallIcon} />
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

/* ---------- helpers ---------- */
const Label = ({ text }) => <Text style={s.label}>{text}</Text>;

const Input = props => (
  <TextInput
    {...props}
    placeholderTextColor="#8BB1C6"
    style={[s.input, props.style]}
  />
);

/* ---------- styles ---------- */
/* banner */
const b = StyleSheet.create({
  headerWrap:{ position:'absolute', top:0, left:0, right:0, height:HEADER_H, zIndex:10 },
  border:{ ...StyleSheet.absoluteFillObject, borderBottomLeftRadius:RADIUS, borderBottomRightRadius:RADIUS,
           borderWidth:1, borderColor:'#ffffff80' },
  inner:{ flex:1, borderBottomLeftRadius:RADIUS, borderBottomRightRadius:RADIUS, backgroundColor:'#1D7FA8',
          paddingTop:PAD_TOP, justifyContent:'center', alignItems:'center' },
  backBtn:{ position:'absolute', left:20, top:PAD_TOP+4, padding:8  , top:62},
  backIcon:{ width:24, height:24, tintColor:'#FFFFFF' },
  h1:{ width: width*0.8, textAlign:'center', color:'#FFFFFF', fontSize:24, fontWeight:'700' },
});

/* rest */
const s = StyleSheet.create({
  container:{ flex:1, backgroundColor:'#10688D' },

  /* add btn */
  addBtn:{ backgroundColor:'#FFFFFF', borderRadius:10, flexDirection:'row', alignItems:'center',
           alignSelf:'center', paddingVertical:18, paddingHorizontal:32, marginBottom:20 },
  addIcon:{ width:18, height:18, tintColor:'#00344B', marginRight:8 },
  addTxt:{ fontSize:18, fontWeight:'700', color:'#00344B' },

  /* empty */
  emptyWrap:{ flex:1, justifyContent:'center', alignItems:'center', paddingHorizontal:24 },
  emptyH:{ fontSize:22, fontWeight:'700', color:'#FFFFFF', textAlign:'center', marginBottom:12 },
  emptySub:{ fontSize:16, lineHeight:22, color:'#FFFFFF', opacity:0.85, textAlign:'center', marginBottom:28 },

  /* list section */
  section:{ fontSize:22, fontWeight:'700', color:'#FFFFFF', marginBottom:16 },
  card:{ backgroundColor:'#FFFFFF', borderRadius:16, padding:20, marginBottom:20 },
  date:{ fontSize:14, color:'#00344B', marginBottom:4 },
  titleEntry:{ fontSize:18, fontWeight:'700', color:'#00344B', marginBottom:4 },
  descEntry:{ fontSize:15, lineHeight:20, color:'#00344B', marginBottom:12 },

  inlineRow:{ flexDirection:'row' },
  smallBtn:{ width:44, height:44, borderRadius:10, backgroundColor:'#00344B',
             alignItems:'center', justifyContent:'center', marginRight:10 },
  smallIcon:{ width:20, height:20, tintColor:'#FFFFFF' },

  /* form */
  label:{ color:'#FFFFFF', fontSize:16, marginBottom:6 },
  input:{ backgroundColor:'rgba(255,255,255,0.1)', borderRadius:10, paddingHorizontal:16,
          color:'#FFFFFF', fontSize:16, height:50, marginBottom:20 },
});
