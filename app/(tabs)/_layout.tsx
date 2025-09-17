import { colors } from '@/constants/colors';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Tabs } from 'expo-router';
import React from 'react';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.MAIN,
        headerShown: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: '홈',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "home-sharp" : "home-outline"}
              size={25}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="quiz"
        options={{
          title: '퀴즈',
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons 
              name={focused ? "lightbulb-question" : "lightbulb-question-outline"}
              size={25}
              color={color}
            />
          )
        }}
      />
      <Tabs.Screen
        name="memory"
        options={{
          title: '메모리',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "document-text" : "document-text-outline"}
              size={25}
              color={color}
            />
          )
        }}
      />
      <Tabs.Screen
        name="my"
        options={{
          title: '내 프로필',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "person-circle" : "person-circle-outline"}
              size={25}
              color={color}
            />
          )
        }}
      />
    </Tabs>
  );
}
