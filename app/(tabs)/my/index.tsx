import { postLogout } from '@/api/auth';
import Header from '@/components/common/Header';
import { colors } from '@/constants/colors';
import { router } from 'expo-router';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function MyScreen() {

  async function handleLogout() {
    try {
      await postLogout();
      Alert.alert('로그아웃', '로그아웃이 완료되었습니다.', [
        { text: '확인', onPress: () => router.replace('/auth/login') }
      ]);
      router.replace('/(tabs)');
    } catch (e: any) {
      const status = e?.response?.status;
      if (status !== 401) {
        // 필요한 경우만 에러 안내
        console.log('logout failed', e);
      }
    } finally {
      router.replace('/auth/login');
    }

    // try {
    //   await postLogout();
    //   Alert.alert('로그아웃', '로그아웃이 완료되었습니다.', [
    //     { text: '확인', onPress: () => router.replace('/auth/login') }
    //   ]);
    // } catch (e: any) {
    //   const status = e?.response?.status;
    //   if (status !== 401) {
    //     // 필요한 경우만 에러 안내
    //     console.log('logout failed', e);
    //   }
    //   router.replace('/auth/login');
    // }
  }

  return (
    <>
      <Header title='내 정보' />

      <SafeAreaView>
        <View style={styles.container}>
          <Text>로그아웃 하시겠습니까?</Text>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
          >
            <Text style={styles.logoutButtonText}>로그아웃</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 200,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
  },
  logoutButton: {
    backgroundColor: colors.MAIN,
    borderRadius: 25,
    paddingHorizontal: 24,
    paddingVertical: 8,
  },
  logoutButtonText: {
    color: colors.WHITE,
  },
});
