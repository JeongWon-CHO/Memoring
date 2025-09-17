// import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);

  // const [loaded] = useFonts({
  //   SpaceMono: require('../assets/fonts/PretendardVariable.ttf'),
  // });

  useEffect(() => {
    async function prepare() {
      try {
        // 여기서 필요한 초기화 작업 수행 (API 호출, 데이터 로드 등)
        // 인위적인 딜레이 추가 (실제 로딩 시간 시뮬레이션)
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (e) {
        console.warn(e);
      } finally {
        setIsReady(true);
        await SplashScreen.hideAsync();
      }
    }

    prepare();
  }, []);

  if (!isReady) {
    return (
      <View style={styles.splashContainer}>
        <Text style={styles.splashText}>Memoring</Text>
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <Stack initialRouteName="auth">
          <Stack.Screen name="auth" options={{ headerShown: false }}  />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  splashText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: 'black',
  },
});
