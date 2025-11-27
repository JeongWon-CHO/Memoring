import { getUserMe } from "@/api/auth";
import { colors } from "@/constants/colors";
import { typography } from "@/constants/typography";
import Entypo from '@expo/vector-icons/Entypo';
import { useEffect, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';

export default function MissionHome() {
  const [userName, setUserName] = useState<string>('');
  const [loadingUser, setLoadingUser] = useState<boolean>(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await getUserMe();
        if (mounted && res?.nickname) {
          setUserName(res.nickname);
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
      {/* 헤더 */}
      <View style={styles.header}>
        <Image source={require('../../../assets/images/MEMORING_TEXT.png')} style={styles.memoryLogo} />
      </View>

      {/* 인삿말 */}
      <View style={styles.greetingContainer}>
        <Text style={styles.greetingText}>
          <Text style={[typography.S1, styles.userName]}>{userName}님</Text>
        </Text>
        <Text style={styles.greetingSubText}>
          오늘 하루도 기록해볼까요!
        </Text>
      </View>

      {/* 미션 리스트 */}
      <TouchableOpacity  style={styles.container} onPress={() => {}}>
        <View style={styles.weeklyContainer}>
          <Entypo name="plus" size={24} color={colors.GRAY_500} />
          <Text style={styles.text}>이번 주 미션 리스트에서 추가하기</Text>
        </View>
      </TouchableOpacity>
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
  memoryLogo: {
    marginVertical: 16,
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
  weeklyContainer: {
    gap: 4,
    alignItems: 'center',
    backgroundColor: '#D9D9D9',
    padding: 36,
    borderRadius: 16,
    marginHorizontal: 20,
  },
  text: {
    fontSize: 18,
    color: colors.GRAY_700,
  },
  bottomSpacing: {
    height: 80,
  },
});
