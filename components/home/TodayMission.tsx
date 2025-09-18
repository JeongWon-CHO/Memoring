import { colors } from '@/constants/colors';
import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function TodayMission() {
  // TODO: 실제 미션 데이터는 API에서 가져오기
  const mission = {
    title: '미션',
    currentCount: 0,
    totalCount: 1,
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{mission.title}</Text>

      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${(mission.currentCount / mission.totalCount) * 100}%` }
            ]}
          />
        </View>
        <Text style={styles.progressText}>
          {mission.currentCount}/{mission.totalCount}
        </Text>
      </View>

      <View style={styles.missionCard}>
        <Text style={styles.missionTitle}>이번주 미션</Text>
        <Text style={styles.missionDescription}>
          이번주 미션이 없어요{'\n'}
          새로운 미션을 등록해주세요!
        </Text>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>등록하기</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.BLACKTEXT,
    marginBottom: 12,
    marginHorizontal: 20,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    marginHorizontal: 20,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: colors.GRAY_200,
    borderRadius: 4,
    overflow: 'hidden',
    marginRight: 12,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.MAIN,
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: colors.GRAY_600,
  },
  missionCard: {
    backgroundColor: colors.WHITE,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    marginHorizontal: 20,
  },
  missionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.BLACKTEXT,
    marginBottom: 8,
  },
  missionDescription: {
    fontSize: 14,
    color: colors.GRAY_600,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
  },
  button: {
    backgroundColor: colors.MAIN,
    paddingHorizontal: 32,
    paddingVertical: 10,
    borderRadius: 20,
  },
  buttonText: {
    color: colors.WHITE,
    fontSize: 14,
    fontWeight: '600',
  },
});