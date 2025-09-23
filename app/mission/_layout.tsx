import { Stack } from 'expo-router';
import React from 'react';

export default function MissionLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="select" />
      <Stack.Screen name="schedule" />
      <Stack.Screen name="record" />
      <Stack.Screen name="test" />
    </Stack>
  );
}
