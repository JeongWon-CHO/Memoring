import { colors } from '@/constants/colors';
import { Stack } from 'expo-router';
import React from 'react';

export default function MyLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: colors.WHITE,
        },
      }}
    >
      <Stack.Screen
        name='index'
        options={{
          headerShown: false,
          title: '퀴즈',
        }}
      />
    </Stack>
  );
}
