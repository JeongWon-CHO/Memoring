// import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  // const [loaded] = useFonts({
  //   SpaceMono: require('../assets/fonts/PretendardVariable.ttf'),
  // });

  // if (!loaded) {
  //   // Async font loading only occurs in development.
  //   return null;
  // }

  return (
    <SafeAreaProvider>
      <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="auth" options={{ headerShown: false }}  />
          <Stack.Screen name="+not-found" />
        </Stack>
    </SafeAreaProvider>
  );
}
