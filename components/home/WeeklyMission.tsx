import { getCurrentMission, getPlayRecord, postGiveUpMission } from '@/api/mission';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import Constants from 'expo-constants';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type CurrentMissionUI = {
  id: number; // user_mission_id
  title: string;
  description: string;
  scheduledAt: string | null;
  listenable: boolean;
  status: 'IN_PROGRESS' | 'COMPLETED';
};

type WeeklyMissionItem = {
  id: string; // 화면 key용 (문자열 권장)
  serverMissionId: number; // user_mission_id (API 호출용)
  missionText: string; // 카드에 표시할 텍스트 (title/description 중 택1)
  scheduledDate: string; // ISO or null이면 today 기준 등
  completed: boolean; // 성공 여부 (기록하기 버튼 활성화 조건)
};

export default function WeeklyMission() {
  const [current, setCurrent] = useState<CurrentMissionUI | null>(null);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const [isPlaying, setIsPlaying] = useState<string | null>(null);

  const [weeklyMissions, setWeeklyMissions] = useState<WeeklyMissionItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [givingUpId, setGivingUpId] = useState<string | null>(null);

  // 언마운트 시 사운드 정리
  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  // 현재 미션 불러오기
  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const resp = await getCurrentMission();
        console.log(resp);
        if (mounted) {
          if (resp?.has_mission && resp.mission) {
            const m = resp.mission;
            const item: WeeklyMissionItem = {
              id: String(m.id),
              serverMissionId: m.id, // ★ user_mission_id
              missionText: m.title ?? m.description ?? '미션',
              scheduledDate: m.scheduled_at ?? new Date().toISOString(), // null이면 임시로 today
              completed: !!m.completed,
            };
            setWeeklyMissions([item]);
          } else {
            // has_mission이 false인 경우 빈 배열로 설정하여 '등록하기' UI 표시
            setCurrent(null);
            setWeeklyMissions([]);
          }
        }
      } catch (e) {
        // 로그인 안 되어 있거나 에러: 조용히 무시 or 안내
        setCurrent(null);
        setWeeklyMissions([]);
      } finally {
        setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const API_ORIGIN =
    (Constants.expoConfig?.extra?.API_BASE_URL as string) || 'https://junhong.shop';

  const toAbsoluteUrl = (u: string) => {
    if (!u) return '';
    // 이미 http(s)면 그대로, 아니면 ORIGIN 붙이기
    if (/^https?:\/\//i.test(u)) return u;
    // 슬래시 보정
    const sep = u.startsWith('/') ? '' : '/';
    return `${API_ORIGIN}${sep}${u}`;
  };

  const togglePlay = async (mission: WeeklyMissionItem) => {
    console.log('[미션듣기 버튼 누름]');

    // if (!current) return;

    // 이미 재생 중이면 정지
    // 같은 카드 재생 중이면 정지
    if (isPlaying === mission.id && sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
      setSound(null);
      setIsPlaying(null);
      return;
    }

    setIsLoadingAudio(true);
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        staysActiveInBackground: false,
      });

      const res = await getPlayRecord(mission.serverMissionId); // user_mission_id 사용
      console.log('[voice api resp]', JSON.stringify(res));

      const raw = (res as any).voice_url ?? (res as any).url ?? (res as any).voice;
      const absUrl = toAbsoluteUrl(raw);
      if (!absUrl) {
        Alert.alert('알림', '아직 녹음된 미션이 없습니다.');
        return;
      }

      if (sound) await sound.unloadAsync();

      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: absUrl },
        { shouldPlay: true },
      );

      setSound(newSound);
      setIsPlaying(mission.id);

      newSound.setOnPlaybackStatusUpdate(s => {
        if (!s.isLoaded) return;
        if (s.didJustFinish) {
          setIsPlaying(null);
          newSound.unloadAsync().catch(() => {});
        }
      });
    } catch (e) {
      console.log('[voice play error]', e);
      Alert.alert('알림', '재생할 음성이 없거나 오류가 발생했어요.');
    } finally {
      setIsLoadingAudio(false);
    }
  };

  // 미션 포기
  const giveUpMission = (mission: WeeklyMissionItem) => {
    const dateText = formatDate(mission.scheduledDate);

    Alert.alert('미션 포기', `${dateText} 미션을 포기하시겠습니까?`, [
      { text: '취소', style: 'cancel' },
      {
        text: '포기하기',
        style: 'destructive',
        onPress: async () => {
          try {
            setGivingUpId(mission.id);

            // 토큰이 필요하면 2번째 인자로 전달: postGiveUpMission(mission.serverMissionId, token)
            const res = await postGiveUpMission(mission.serverMissionId);
            console.log('[포기 응답]', res);

            // 성공 처리: 서버에서 최신 상태 다시 가져오기
            const newResp = await getCurrentMission();
            console.log('[포기 후 getCurrentMission 응답]', newResp);

            if (newResp?.has_mission && newResp.mission) {
              const m = newResp.mission;
              const item: WeeklyMissionItem = {
                id: String(m.id),
                serverMissionId: m.id,
                missionText: m.title ?? m.description ?? '미션',
                scheduledDate: m.scheduled_at ?? new Date().toISOString(),
                completed: !!m.completed,
              };
              setWeeklyMissions([item]);
            } else {
              // has_mission이 false인 경우 빈 배열로 설정
              console.log('[미션 없음 - 빈 배열 설정]');
              setWeeklyMissions([]);
              setCurrent(null);
            }

            Alert.alert('완료', '미션을 포기했습니다.');
          } catch (e: any) {
            const status = e?.response?.status;
            if (status === 409) {
              // 명세: 이미 완료된 현재 미션이면 409
              Alert.alert('안내', '이미 완료된 미션입니다.');
            } else if (status === 401 || status === 403) {
              Alert.alert('안내', '로그인이 필요합니다.');
            } else {
              Alert.alert('오류', '미션 포기에 실패했습니다.');
            }
          } finally {
            setGivingUpId(null);
          }
        },
      },
    ]);
  };

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

  return (
    <View style={styles.container}>
      {weeklyMissions.length === 0 ? (
        <View style={styles.emptyCard}>
          <Ionicons name='calendar-outline' size={48} color={colors.GRAY_400} />
          <Text style={styles.emptyTitle}>이번주 미션이 없어요</Text>
          <Text style={styles.emptyDescription}>새로운 미션을 등록해주세요!</Text>
          <TouchableOpacity style={styles.addButton} onPress={() => router.push('/mission/select')}>
            <Text style={styles.addButtonText}>등록하기</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.missionList}>
          {weeklyMissions.map(mission => {
            const isTodayMission = isToday(mission.scheduledDate);
            const isPastMission = isPast(mission.scheduledDate);
            const isFutureMission = isFuture(mission.scheduledDate);

            return (
              <View
                key={mission.id}
                style={[styles.missionCard, isPastMission && styles.missionCardPast]}
              >
                <Text style={[typography.H4, styles.missionTitle]}>미션</Text>

                {/* 오늘 미션인 경우 */}
                {isTodayMission && (
                  <View style={styles.expiredDetailContainer}>
                    <View style={styles.buttonsContainer}>
                      <TouchableOpacity
                        style={[
                          styles.playButton,
                          isPlaying === mission.id && styles.playButtonActive,
                          isLoadingAudio && styles.playButtonDisabled,
                        ]}
                        onPress={() => togglePlay(mission)}
                        disabled={isLoadingAudio}
                      >
                        <Ionicons
                          name={
                            isPlaying === mission.id
                              ? 'stop'
                              : isLoadingAudio
                                ? 'hourglass'
                                : 'headset'
                          }
                          size={20}
                          color={colors.WHITE}
                        />
                        <Text style={[typography.B2_BOLD, styles.playButtonText]}>
                          {isLoadingAudio
                            ? '로딩...'
                            : isPlaying === mission.id
                              ? '정지'
                              : '미션듣기'}
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.recordButton}
                        onPress={() => {
                          router.push({
                            pathname: '/mission/progress',
                            params: {
                              missionId: mission.serverMissionId,
                              scheduledDate: mission.scheduledDate,
                            },
                          });
                        }}
                      >
                        <Ionicons name='pencil' size={16} color={colors.MAIN} />
                        <Text style={[typography.B2_BOLD, styles.recordButtonText]}>기록하기</Text>
                      </TouchableOpacity>
                    </View>

                    {/* <Text style={[typography.C1, styles.todayText]}>
                      오늘의 미션
                    </Text> */}
                  </View>
                )}

                {/* 미래 미션인 경우 */}
                {isFutureMission && (
                  <View style={styles.expiredDetailContainer}>
                    <View style={styles.buttonsContainer}>
                      <TouchableOpacity
                        style={[
                          styles.playButton,
                          isPlaying === mission.id && styles.playButtonActive,
                          isLoadingAudio && styles.playButtonDisabled,
                        ]}
                        onPress={() => togglePlay(mission)}
                        disabled={isLoadingAudio}
                      >
                        <Ionicons name='headset' size={20} color={colors.WHITE} />
                        <Text style={[typography.B2_BOLD, styles.playButtonText]}>
                          {isLoadingAudio
                            ? '로딩...'
                            : isPlaying === mission.id
                              ? '정지'
                              : '미션듣기'}
                        </Text>
                      </TouchableOpacity>
                    </View>

                    <Text style={[typography.C1, styles.dateText]}>
                      {formatDate(mission.scheduledDate)} 예정
                    </Text>
                  </View>
                )}

                {/* 과거 미션인 경우 */}
                {isPastMission && (
                  <View style={styles.expiredDetailContainer}>
                    <View style={styles.expiredContainer}>
                      <Ionicons name='time-outline' size={20} color={colors.GRAY_500} />
                      <Text style={[typography.B2, styles.expiredText]}>기간이 지난 미션</Text>
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
                    isPastMission && styles.deleteButtonHighlighted,
                    (givingUpId === mission.id || (isTodayMission && mission.completed)) && {
                      opacity: 0.6,
                    },
                  ]}
                  onPress={() => giveUpMission(mission)}
                >
                  <Ionicons
                    name='close'
                    size={18}
                    color={isPastMission ? colors.ORANGE_600 : colors.GRAY_500}
                  />
                  <Text
                    style={[
                      typography.C1,
                      styles.deleteButtonText,
                      isPastMission && styles.deleteButtonTextHighlighted,
                    ]}
                  >
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
  missionList: {},
  missionListContent: {},
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
  playButtonActive: {
    backgroundColor: colors.ORANGE_600,
  },
});
