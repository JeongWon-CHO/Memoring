import { useFocusEffect } from 'expo-router';
import { Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function MyScreen() {
  useFocusEffect(() => {
    
  })

  return (
    <SafeAreaView>
      <Text>메모리 스크린</Text>
    </SafeAreaView>
  );
}
