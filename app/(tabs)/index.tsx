import AdBanner from '@/components/home/AdBanner';
import LastWeekMemory from '@/components/home/LastWeekMemory';
import WeeklyMission from '@/components/home/WeeklyMission';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getUserMe } from '../../api/login';

export default function HomeScreen() {
  const [userName, setUserName] = useState<string>('');     // ← 서버 값
  const [loadingUser, setLoadingUser] = useState<boolean>(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await getUserMe();
        if (mounted && res?.username) {
          setUserName(res.username);
        }
      } catch (e) {
        if (mounted) setUserName('사용자');
      } finally {
        if (mounted) setLoadingUser(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* 헤더 */}
        <View style={styles.header}>
          <Text style={[typography.H4, styles.logo]}>Memoring</Text>
        </View>

        {/* 1. 광고 배너 컴포넌트 */}
        <AdBanner />

        {/* 사용자 인사말 */}
        <View style={styles.greetingContainer}>
          <Text style={styles.greetingText}>
            <Text style={[typography.S1, styles.userName]}>{userName}님</Text>
          </Text>
          <Text style={styles.greetingSubText}>
            오늘 하루도 기록해볼까요!
          </Text>
        </View>

        {/* 2. 오늘의 미션 컴포넌트
        <TodayMission /> */}

        {/* 3. 이번주 미션 컴포넌트 */}
        <WeeklyMission />

        {/* 4. 지난주 메모리 컴포넌트 */}
        <LastWeekMemory />

        {/* 하단 여백 */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.BG,
  },
  scrollView: {
    flex: 1,
    // margin: 16,
  },
  header: {
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  logo: {
    color: colors.BLACKTEXT,
  },
  greetingContainer: {
    paddingTop: 20,
    paddingBottom: 24,
    marginHorizontal: 20,
  },
  greetingText: {
    fontSize: 20,
    color: colors.BLACKTEXT,
    marginBottom: 4,
  },
  userName: {
    color: colors.BLACKTEXT,
  },
  greetingSubText: {
    fontSize: 20,
    color: colors.BLACKTEXT,
  },
  bottomSpacing: {
    height: 80,
  },
});