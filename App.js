// App.js – минимальный набор экранов
import React, { useEffect, useState } from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { SavedProvider } from './Components/SavedContext';
import { DiaryProvider } from './Components/DiaryContext';

import Loader          from './Components/Loader';
import Onboarding      from './Components/Onboarding';
import MainScreen      from './Components/MainScreen';
import ForecastScreen  from './Components/ForecastScreen';
import TipsScreen      from './Components/TipsScreen';
import JournalScreen   from './Components/JournalScreen';
import SavedScreen     from './Components/SavedScreen';
import LocationDetails from './Components/LocationDetails';
// ❌ УДАЛЕНО: import MapScreen from './Components/MapScreen';
import CustomTabBar    from './Components/CustomTabBar';

// ✅ Добавь экран, если используешь кнопку "View all spots"
import AllSpotsScreen  from './Components/AllSpotsScreen'; // <-- закомментируй, если не нужен

const RootStack = createNativeStackNavigator();
const MainStack = createNativeStackNavigator();
const Tab       = createBottomTabNavigator();

// Вложенный стек для вкладки "Main"
function MainStackScreen() {
  return (
    <MainStack.Navigator screenOptions={{ headerShown: false }}>
      <MainStack.Screen name="MainHome"        component={MainScreen} />
      <MainStack.Screen name="LocationDetails" component={LocationDetails} />
      {/* Экран со всеми спотами (опционально) */}
      <MainStack.Screen name="AllSpotsScreen"  component={AllSpotsScreen} />
    </MainStack.Navigator>
  );
}

// Основные вкладки с кастомным таб-баром
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={props => <CustomTabBar {...props} />}
    >
      <Tab.Screen name="Journal"  component={JournalScreen} />
      <Tab.Screen name="Forecast" component={ForecastScreen} />
      <Tab.Screen name="Main"     component={MainStackScreen} />
      <Tab.Screen name="Tips"     component={TipsScreen} />
      <Tab.Screen name="Saved"    component={SavedScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 3000);
    return () => clearTimeout(t);
  }, []);

  if (!ready) {
    return <Loader />;
  }

  const theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: '#006B8F',
      card:       '#006B8F',
      text:       '#FFFFFF',
    },
  };

  return (
    <SafeAreaProvider>
      <StatusBar translucent barStyle="light-content" backgroundColor="transparent" />
      <NavigationContainer theme={theme}>
        <SavedProvider>
          <DiaryProvider>
            <RootStack.Navigator screenOptions={{ headerShown: false }}>
              <RootStack.Screen name="Onboarding" component={Onboarding} />
              <RootStack.Screen name="MainTabs"   component={MainTabs}   />

            </RootStack.Navigator>
          </DiaryProvider>
        </SavedProvider>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
