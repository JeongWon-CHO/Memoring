import { colors } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function WeeklyMission() {
  // TODO: 실제 미션 데이터는 API에서 가져오기
  const weeklyMissions = [
    // 데이터가 없는 경우 빈 배열
  ];

  return (
    <View style={styles.container}>

      {weeklyMissions.length === 0 ? (
        <View style={styles.emptyCard}>
          {/* <Text style={[typography.B1, styles.title]}>이번주 미션</Text> */}
          <Ionicons name="calendar-outline" size={48} color={colors.GRAY_400} />
          <Text style={styles.emptyTitle}>이번주 미션이 없어요</Text>
          <Text style={styles.emptyDescription}>
            새로운 미션을 등록해주세요!
          </Text>
          <TouchableOpacity style={styles.addButton}>
            <Text style={styles.addButtonText}>등록하기</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.missionList}
        >
          {weeklyMissions.map((mission, index) => (
            <TouchableOpacity key={index} style={styles.missionCard}>
              {/* 미션 카드 내용 */}
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
    marginHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    color: colors.BLACKTEXT,
  },
  emptyCard: {
    backgroundColor: colors.WHITE,
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.BLACKTEXT,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    color: colors.GRAY_600,
    marginBottom: 20,
  },
  addButton: {
    backgroundColor: colors.MAIN,
    paddingHorizontal: 32,
    paddingVertical: 10,
    borderRadius: 20,
  },
  addButtonText: {
    color: colors.WHITE,
    fontSize: 14,
    fontWeight: '600',
  },
  missionList: {
    paddingHorizontal: 20,
  },
  missionCard: {
    width: 280,
    height: 120,
    backgroundColor: colors.WHITE,
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
});