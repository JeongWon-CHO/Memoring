import { useFocusEffect } from 'expo-router';
import { Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function MyScreen() {
  useFocusEffect(() => {
    // router.replace('/auth');
  })

  return (
    <SafeAreaView>
      <Text>퀴즈 스크린</Text>
    </SafeAreaView>
  );
}
