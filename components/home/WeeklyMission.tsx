import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { useMissionStorage } from '@/hooks/useMissionStorage';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

export default function WeeklyMission() {
  const { getWeeklyMissions, loading } = useMissionStorage();
  const weeklyMissions = getWeeklyMissions();

  // 오늘 날짜 체크 함수
  const isToday = (dateString: string) => {
    const today = new Date();
    const missionDate = new Date(dateString);
    return (
      today.getDate() === missionDate.getDate() &&
      today.getMonth() === missionDate.getMonth() &&
      today.getFullYear() === missionDate.getFullYear()
    );
  };

  // 날짜 포맷팅
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    return `${date.getMonth() + 1}/${date.getDate()}(${days[date.getDay()]})`;
  };

  return (
    <View style={styles.container}>

      {loading ? (
        <View style={styles.loadingContainer}>
          <Text style={[typography.B2, styles.loadingText]}>로딩 중...</Text>
        </View>
      ) : weeklyMissions.length === 0 ? (
        <View style={styles.emptyCard}>
          <Ionicons name="calendar-outline" size={48} color={colors.GRAY_400} />
          <Text style={styles.emptyTitle}>이번주 미션이 없어요</Text>
          <Text style={styles.emptyDescription}>
            새로운 미션을 등록해주세요!
          </Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => router.push('/mission/select')}
          >
            <Text style={styles.addButtonText}>등록하기</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.missionList}>
          {weeklyMissions.map((mission) => {
            const isTodayMission = isToday(mission.scheduledDate);

            return (
              <View key={mission.id} style={styles.missionCard}>
                <Text style={[typography.H4, styles.missionTitle]}>미션</Text>

                <View style={styles.buttonsContainer}>
                  <TouchableOpacity
                    style={[
                      styles.playButton,
                      !isTodayMission && styles.playButtonDisabled
                    ]}
                    disabled={!isTodayMission}
                  >
                    <Ionicons name="headset" size={20} color={colors.WHITE} />
                    <Text style={[typography.B2_BOLD, styles.playButtonText]}>
                      미션듣기
                    </Text>
                  </TouchableOpacity>

                  {isTodayMission && (
                    <TouchableOpacity
                      style={styles.recordButton}
                      onPress={() => {
                        // 기록하기 화면으로 이동 (추후 구현)
                      }}
                    >
                      <Ionicons name="pencil" size={16} color={colors.MAIN} />
                      <Text style={[typography.B2_BOLD, styles.recordButtonText]}>
                        기록하기
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>

                <TouchableOpacity style={styles.deleteButton}>
                  <Ionicons name="close" size={18} color={colors.GRAY_500} />
                  <Text style={[typography.C1, styles.deleteButtonText]}>
                    포기하기
                  </Text>
                </TouchableOpacity>

                {!isTodayMission && (
                  <Text style={[typography.C1, styles.dateText]}>
                    {formatDate(mission.scheduledDate)} 예정
                  </Text>
                )}
              </View>
            );
          })}
        </View>
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
  loadingContainer: {
    padding: 32,
    alignItems: 'center',
  },
  loadingText: {
    color: colors.GRAY_600,
  },
  missionList: {
    // flexGrow: 0,
    backgroundColor: colors.WHITE,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  missionListContent: {
    // paddingHorizontal: 4,
  },
  missionCard: {
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    minHeight: 200,
    paddingVertical: 30,
  },
  missionTitle: {
    color: colors.BLACKTEXT,
    marginBottom: 16,
  },
  buttonsContainer: {
    width: '100%',
    gap: 8,
    justifyContent: 'center',
    flexDirection: 'row',
  },
  playButton: {
    backgroundColor: colors.MAIN,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 24,
    gap: 6,
  },
  playButtonDisabled: {
    backgroundColor: colors.GRAY_400,
  },
  playButtonText: {
    color: colors.WHITE,
  },
  recordButton: {
    backgroundColor: colors.WHITE,
    borderWidth: 1,
    borderColor: colors.MAIN,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 24,
    gap: 6,
  },
  recordButtonText: {
    color: colors.MAIN,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 12,
  },
  deleteButtonText: {
    color: colors.GRAY_500,
  },
  dateText: {
    color: colors.GRAY_500,
    marginTop: 8,
  },
});