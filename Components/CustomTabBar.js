// Components/CustomTabBar.js
import React from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

/* ── иконки из assets/tab ───────────────────────────── */
const ICONS = {
  Journal : require('../assets/journal.png'),
  Forecast: require('../assets/book.png'),
  Main    : require('../assets/fish.png'),
  Tips    : require('../assets/note.png'),
  Saved   : require('../assets/bookmark.png'),
};

/* ── размеры ─────────────────────────────────────────── */
const OUTER_MARGIN = 16;     // отступ от краёв экрана
const BAR_PADDING   = 25;    // внутр. отступ «пилюли»
const BORDER_RAD    = 20;    // скругление «пилюли»
const BTN_SIZE      = 49;    // размер кнопки
const BTN_RADIUS    = 10;    // скругление кнопки
const ICON_SIZE     = 28;    // размер иконки

export default function CustomTabBar({ state, descriptors, navigation }) {
  const insets = useSafeAreaInsets();
  const barW   = width - OUTER_MARGIN * 2;

  return (
    <View
      style={[
        styles.wrapper,
        {
          bottom: Math.max(insets.bottom, 8),
          width : barW,
          left  : OUTER_MARGIN,
        },
      ]}
    >
      {state.routes.map((route, idx) => {
        const { options } = descriptors[route.key];
        const label       =
          options.tabBarLabel ?? options.title ?? route.name;
        const focused     = state.index === idx;
        const onPress     = () => {
          if (!focused) navigation.navigate(route.name);
        };

        return (
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            activeOpacity={0.8}
            style={[
              styles.btn,
              focused
                ? styles.btnActive
                : styles.btnInactive,
            ]}
          >
            <Image
              source={ICONS[label]}
              style={styles.icon}
              resizeMode="contain"
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    zIndex: 100,

    flexDirection   : 'row',
    justifyContent  : 'space-between',
    alignItems      : 'center',

    backgroundColor : '#2F86AD',
    borderRadius    : BORDER_RAD,
    borderWidth     : 2,
    borderColor     : '#FFFFFF',

    paddingHorizontal: BAR_PADDING,
    paddingVertical  : Platform.OS === 'ios' ? 10 : 8,
  },

  btn: {
    width        : BTN_SIZE,
    height       : BTN_SIZE,
    borderRadius : BTN_RADIUS,
    justifyContent: 'center',
    alignItems    : 'center',
  },
  btnActive: {
    backgroundColor: '#FFFFFF',
  },
  btnInactive: {
    backgroundColor: '#20769C',
  },

  icon: {
    width : ICON_SIZE,
    height: ICON_SIZE,
  },
});
