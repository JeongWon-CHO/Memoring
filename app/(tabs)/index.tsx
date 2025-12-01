import CardSection from '@/components/home/CardSection';
import { colors } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Image, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const [userName, setUserName] = useState<string>('');
  const [loadingUser, setLoadingUser] = useState<boolean>(true);

  // useEffect(() => {
  //   let mounted = true;
  //   (async () => {
  //     try {
  //       const res = await getUserMe();
  //       if (mounted && res?.nickname) {
  //         setUserName(res.nickname);
  //       }
  //     } catch (e) {
  //       if (mounted) setUserName('사용자');
  //     } finally {
  //       if (mounted) setLoadingUser(false);
  //     }
  //   })();
  //   return () => { mounted = false; };
  // }, []);

  const handleNext = () => {
    router.push({ pathname: '/mission' as any });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* 헤더 */}
        <View style={styles.headerContainer}>
          <View style={styles.header}>
            <Image
              source={require('../../assets/images/MEMORING_TEXT.png')}
              style={styles.memoryLogo}
            />
          </View>

          <Ionicons name={'person-circle-outline'} size={37} color={colors.GRAY_800} />
        </View>

        <View style={styles.menu}>
          {/* 1. 미션 이동 컴포넌트 */}
          <CardSection
            title='미션'
            content1='매주 미션을 통해'
            content2='목소리로 기억을 훈련해요!'
            onClick={handleNext}
          />

          {/* 2. 퀴즈 이동 컴포넌트 */}
          <CardSection
            title='퀴즈'
            content1='매주 새로운 미션을 통해'
            content2='일상을 기록해 보아요!'
            onClick={handleNext}
          />

          {/* 4. 메모리 이동 컴포넌트 */}
          <CardSection
            title='메모링'
            content1='미션을 완료 시 작성한 일기로'
            content2='일상을 기록하고 돌아보아요!'
            onClick={handleNext}
          />
        </View>

        {/* ==================== 변경 전 UI ====================*/}
        {/* 사용자 인사말 */}
        {/* <View style={styles.greetingContainer}>
          <Text style={styles.greetingText}>
            <Text style={[typography.S1, styles.userName]}>{userName}님</Text>
          </Text>
          <Text style={styles.greetingSubText}>
            오늘 하루도 기록해볼까요!
          </Text>
        </View> */}

        {/* 2. 오늘의 미션 컴포넌트
        <TodayMission /> */}

        {/* 3. 이번주 미션 컴포넌트 */}
        {/* <WeeklyMission /> */}

        {/* 4. 지난주 메모리 컴포넌트 */}
        {/* <LastWeekMemory /> */}

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
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  header: {
    // paddingVertical: 16,
    // paddingHorizontal: 20,
  },
  memoryLogo: {
    marginVertical: 16,
  },
  logo: {
    color: colors.BLACKTEXT,
  },
  menu: {
    gap: 24,
    marginTop: 32,
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
