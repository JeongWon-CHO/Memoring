import { Stack } from 'expo-router';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function MissionLayout() {
  return (
    <SafeAreaProvider>
      <Stack screenOptions={{ headerShown: true }}>
        <Stack.Screen name='index' options={{ headerShown: false }} />
        <Stack.Screen name='schedule' options={{ title: '수정' }} />
        <Stack.Screen name='record' options={{ title: '녹음' }} />
      </Stack>
    </SafeAreaProvider>
  );
}
