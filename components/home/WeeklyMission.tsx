import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { useMissionStorage } from '@/hooks/useMissionStorage';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

export default function WeeklyMission() {
  const { getWeeklyMissions, loading, deleteMission } = useMissionStorage();
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

  // 과거 날짜 체크 함수
  const isPast = (dateString: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const missionDate = new Date(dateString);
    missionDate.setHours(0, 0, 0, 0);
    return missionDate < today;
  };

  // 미래 날짜 체크 함수
  const isFuture = (dateString: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const missionDate = new Date(dateString);
    missionDate.setHours(0, 0, 0, 0);
    return missionDate > today;
  };

  // 날짜 포맷팅
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    return `${date.getMonth() + 1}/${date.getDate()}(${days[date.getDay()]})`;
  };

  // 포기하기 버튼 핸들러
  const handleGiveUp = (missionId: string, missionDate: string) => {
    const dateText = formatDate(missionDate);
    const isPastMission = isPast(missionDate);

    Alert.alert(
      '미션 포기',
      isPastMission
        ? `${dateText} 미션을 포기하시겠습니까?\n지난 미션은 삭제됩니다.`
        : '정말로 이 미션을 포기하시겠습니까?',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '포기하기',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteMission(missionId);
              Alert.alert('완료', '미션이 삭제되었습니다.');
            } catch (error) {
              Alert.alert('오류', '미션 삭제에 실패했습니다.');
            }
          }
        }
      ]
    );
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
            const isPastMission = isPast(mission.scheduledDate);
            const isFutureMission = isFuture(mission.scheduledDate);

            return (
              <View
                key={mission.id}
                style={[
                  styles.missionCard,
                  isPastMission && styles.missionCardPast
                ]}
              >
                <Text style={[typography.H4, styles.missionTitle]}>미션</Text>

                {/* 오늘 미션인 경우 */}
                {isTodayMission && (
                  <>
                    <View style={styles.buttonsContainer}>
                      <TouchableOpacity
                        style={styles.playButton}
                      >
                        <Ionicons name="headset" size={20} color={colors.WHITE} />
                        <Text style={[typography.B2_BOLD, styles.playButtonText]}>
                          미션듣기
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.recordButton}
                        onPress={() => {
                          router.push({
                            pathname: '/mission/record',
                            params: {
                              missionId: mission.id,
                              missionText: mission.missionText,
                              scheduledDate: mission.scheduledDate,
                            }
                          });
                        }}
                      >
                        <Ionicons name="pencil" size={16} color={colors.MAIN} />
                        <Text style={[typography.B2_BOLD, styles.recordButtonText]}>
                          기록하기
                        </Text>
                      </TouchableOpacity>
                    </View>

                    <Text style={[typography.C1, styles.todayText]}>
                      오늘의 미션
                    </Text>
                  </>
                )}

                {/* 미래 미션인 경우 */}
                {isFutureMission && (
                  <>
                    <View style={styles.buttonsContainer}>
                      <TouchableOpacity
                        style={[styles.playButton, styles.playButtonDisabled]}
                        disabled={true}
                      >
                        <Ionicons name="headset" size={20} color={colors.WHITE} />
                        <Text style={[typography.B2_BOLD, styles.playButtonText]}>
                          미션듣기
                        </Text>
                      </TouchableOpacity>
                    </View>

                    <Text style={[typography.C1, styles.dateText]}>
                      {formatDate(mission.scheduledDate)} 예정
                    </Text>
                  </>
                )}

                {/* 과거 미션인 경우 */}
                {isPastMission && (
                  <View style={styles.expiredDetailContainer}>
                    <View style={styles.expiredContainer}>
                      <Ionicons name="time-outline" size={20} color={colors.GRAY_500} />
                      <Text style={[typography.B2, styles.expiredText]}>
                        기간이 지난 미션
                      </Text>
                    </View>

                    <Text style={[typography.C1, styles.pastDateText]}>
                      {formatDate(mission.scheduledDate)}
                    </Text>
                  </View>
                )}

                {/* 포기하기 버튼 */}
                <TouchableOpacity
                  style={[
                    styles.deleteButton,
                    isPastMission && styles.deleteButtonHighlighted
                  ]}
                  onPress={() => handleGiveUp(mission.id, mission.scheduledDate)}
                >
                  <Ionicons
                    name="close"
                    size={18}
                    color={isPastMission ? colors.ORANGE_600 : colors.GRAY_500}
                  />
                  <Text style={[
                    typography.C1,
                    styles.deleteButtonText,
                    isPastMission && styles.deleteButtonTextHighlighted
                  ]}>
                    포기하기
                  </Text>
                </TouchableOpacity>
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
    // backgroundColor: colors.WHITE,
    // borderRadius: 12,
    // marginHorizontal: 20,
    // shadowColor: '#000',
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    // shadowOpacity: 0.05,
    // shadowRadius: 3,
    // elevation: 2,
  },
  missionListContent: {
    // paddingHorizontal: 4,
  },
  missionCard: {
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
    marginTop: 20,
  },
  deleteButtonText: {
    color: colors.GRAY_500,
  },
  dateText: {
    color: colors.GRAY_500,
    marginTop: 8,
  },
  missionCardPast: {
    backgroundColor: '#f8f8f8',
  },
  expiredDetailContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  expiredContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  expiredText: {
    color: colors.GRAY_500,
  },
  pastDateText: {
    color: colors.GRAY_400,
    fontSize: 12,
  },
  todayText: {
    color: colors.MAIN,
    fontWeight: '600',
  },
  deleteButtonHighlighted: {
    backgroundColor: '#fff3f0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.ORANGE_600,
  },
  deleteButtonTextHighlighted: {
    color: colors.ORANGE_600,
    fontWeight: '600',
  },
});