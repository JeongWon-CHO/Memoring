import Header from '@/components/common/Header';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import Feather from '@expo/vector-icons/Feather';
import { useFocusEffect } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

export default function MyScreen() {
  useFocusEffect(() => {
    // router.replace('/auth');
  })

  return (
    <View>
      <Header title='퀴즈' />
      
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={typography.B1_BOLD}>퀴즈를 풀어볼까요?</Text>
        </View>

        <View style={styles.icon}>
          <Feather name="check-circle" size={64} color="black" />
        </View>
        
        <View style={styles.contentContainer}>
          <View style={styles.quizInfo}>
            <Text style={[typography.C1, styles.subText]}>총 10문제</Text>
          </View>

          <View style={styles.startButton}>
            <Text style={styles.startButtonText}>시작하기</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  header: {
    marginHorizontal: 20,
    marginTop: 60,
  },
  contentContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
    gap: 20,
  },
  icon: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 150,
  },
  quizInfo: {
    marginVertical: 12,
  },
  subText: {
    color: colors.GRAY_400,
  },
  startButton: {
    width: 150,
    paddingHorizontal: 8,
    paddingVertical: 12,
    backgroundColor: colors.MAIN,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  startButtonText: {
    color: colors.WHITE,
  }
});
