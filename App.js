// App.js
import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import BootScreen from './src/screens/BootScreen';
import ChatScreen from './src/screens/ChatScreen';

export default function App() {
  const [booted, setBooted] = useState(false);

  return (
    <SafeAreaProvider>
      <StatusBar style="light" backgroundColor="#080C14" />
      {!booted ? (
        <BootScreen onDone={() => setBooted(true)} />
      ) : (
        <ChatScreen />
      )}
    </SafeAreaProvider>
  );
}
