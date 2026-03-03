import React, { useEffect } from 'react';
import { StatusBar, LogBox } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import { setupNotifications } from './src/services/notifications';

// suppress some noisy warnings in dev
// TODO: address these properly before release
LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);

export default function App() {
  useEffect(() => {
    setupNotifications();
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" backgroundColor="#0f0f0f" />
      <AppNavigator />
    </SafeAreaProvider>
  );
}
