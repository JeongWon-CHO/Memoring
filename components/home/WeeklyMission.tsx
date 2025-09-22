import { getCurrentMission, getPlayRecord } from '@/app/api/mission';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import Constants from 'expo-constants';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

type CurrentMissionUI = {
  id: number;               // user_mission_id
  title: string;
  description: string;
  scheduledAt: string | null;
  listenable: boolean;
};

type WeeklyMissionItem = {
  id: string;                 // 화면 key용 (문자열 권장)
  serverMissionId: number;    // user_mission_id (API 호출용)
  missionText: string;        // 카드에 표시할 텍스트 (title/description 중 택1)
  scheduledDate: string;      // ISO or null이면 today 기준 등
  completed: boolean;         // 성공 여부 (기록하기 버튼 활성화 조건)
};

export default function WeeklyMission() {
  // const { getWeeklyMissions, loading, deleteMission } = useMissionStorage();
  // const weeklyMissions = getWeeklyMissions();
  const [current, setCurrent] = useState<CurrentMissionUI | null>(null);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  // const [isPlaying, setIsPlaying] = useState(false);
  const [isPlaying, setIsPlaying] = useState<string | null>(null);

  const [weeklyMissions, setWeeklyMissions] = useState<WeeklyMissionItem[]>([]);
  const [loading, setLoading] = useState(true);

  const toNumber = (v: unknown) => {
    const n = typeof v === 'string' ? Number(v) : (v as number);
    return Number.isFinite(n) ? n : NaN;
  };

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
        if (mounted  && resp?.has_mission && resp.mission) {
          const m = resp.mission;
          const item: WeeklyMissionItem = {
            id: String(m.id),
            serverMissionId: m.id, // ★ user_mission_id
            missionText: m.title ?? m.description ?? '미션',
            scheduledDate: m.scheduled_at ?? new Date().toISOString(), // null이면 임시로 today
            completed: !!m.completed,
          };
          setWeeklyMissions([item]);
          // setCurrent({
          //   id: m.id,
          //   title: m.title,
          //   description: m.description,
          //   scheduledAt: m.scheduled_at,
          //   listenable: !!m.listenable, // 서버가 false면 재생 버튼 비활성화
          // });
        } else {
          setCurrent(null);
          setWeeklyMissions([]);
        }
      } catch (e) {
        // 로그인 안 되어 있거나 에러: 조용히 무시 or 안내
        setCurrent(null);
        setWeeklyMissions([]);
      } finally {
        setLoading(false);
      }
    })();
    return () => { mounted = false; };
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
        // interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
      });

      const res = await getPlayRecord(mission.serverMissionId); // ★ user_mission_id 사용
      console.log('[voice api resp]', JSON.stringify(res));

      const raw = (res as any).voice_url ?? (res as any).url ?? (res as any).voice;
      const absUrl = toAbsoluteUrl(raw);
      if (!absUrl) {
        Alert.alert('알림', '아직 녹음된 미션이 없습니다.');
        return;
      }


      
      // // 1) 응답 구조 확인
      // console.log('[voice api resp]', JSON.stringify(res));

      // // 2) 키 이름이 다른지 대비
      // const url = (res as any).voice_url ?? (res as any).url ?? (res as any).voice;
      // if (!url || typeof url !== 'string') {
      //   Alert.alert('알림', '아직 녹음된 미션이 없습니다.');
      //   return;
      // }

      // // 3) 헤더 없이 접근 가능한지 사전 점검 (HEAD 요청)
      // let headOk = false;
      // try {
      //   const head = await fetch(url, { method: 'HEAD' });
      //   console.log('[voice HEAD]', head.status);
      //   headOk = head.ok;
      // } catch (e) {
      //   console.log('[voice HEAD error]', e);
      // }




      // if (!res?.voice_url) {
      //   Alert.alert('알림', '아직 녹음된 미션이 없습니다.');
      //   return;
      // }

      if (sound) await sound.unloadAsync();

      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: absUrl },          // ★ 절대 URL 사용
        { shouldPlay: true }
      );

      setSound(newSound);
      setIsPlaying(mission.id);

      newSound.setOnPlaybackStatusUpdate((s) => {
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
  // // 미션 듣기 재생/정지 토글
  // const toggleMissionPlayback = async (missionId: string) => {
  //   // 재생 중인 경우 정지
  //   if (isPlaying === missionId && sound) {
  //     await sound.stopAsync();
  //     await sound.unloadAsync();
  //     setSound(null);
  //     setIsPlaying(null);
  //     return;
  //   }

  //   setIsLoadingAudio(true);

  //   try {
  //     // 서버에서 녹음 파일 URL 가져오기
  //     // 실제로는 missionId를 숫자로 변환해야 합니다
  //     const missionIdNum = parseInt(missionId) || 42; // 테스트용 기본값
  //     const response = await getPlayRecord(missionIdNum);

  //     if (!response.voice_url) {
  //       Alert.alert('알림', '아직 녹음된 미션이 없습니다.');
  //       return;
  //     }

  //     // 기존 사운드가 있으면 정리
  //     if (sound) {
  //       await sound.unloadAsync();
  //     }

  //     // 새로운 재생 시작
  //     const { sound: newSound } = await Audio.Sound.createAsync(
  //       { uri: response.voice_url },
  //       { shouldPlay: true }
  //     );

  //     setSound(newSound);
  //     setIsPlaying(missionId);

  //     // 재생 상태 업데이트
  //     newSound.setOnPlaybackStatusUpdate((status) => {
  //       if (!status.isLoaded) return;
  //       if (status.didJustFinish) {
  //         setIsPlaying(null);
  //       }
  //     });
  //   } catch (error) {
  //     console.error('재생 오류:', error);
  //     Alert.alert('알림', '아직 녹음된 미션이 없습니다.');
  //   } finally {
  //     setIsLoadingAudio(false);
  //   }
  // };

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
  // const handleGiveUp = (missionId: string, missionDate: string) => {
  //   const dateText = formatDate(missionDate);
  //   const isPastMission = isPast(missionDate);

  //   Alert.alert(
  //     '미션 포기',
  //     isPastMission
  //       ? `${dateText} 미션을 포기하시겠습니까?\n지난 미션은 삭제됩니다.`
  //       : '정말로 이 미션을 포기하시겠습니까?',
  //     [
  //       { text: '취소', style: 'cancel' },
  //       {
  //         text: '포기하기',
  //         style: 'destructive',
  //         onPress: async () => {
  //           try {
  //             await deleteMission(missionId);
  //             Alert.alert('완료', '미션이 삭제되었습니다.');
  //           } catch (error) {
  //             Alert.alert('오류', '미션 삭제에 실패했습니다.');
  //           }
  //         }
  //       }
  //     ]
  //   );
  // };

  return (
    <View style={styles.container}>

      {weeklyMissions.length === 0 ? (
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
                  <View style={styles.expiredDetailContainer}>
                    <View style={styles.buttonsContainer}>
                      <TouchableOpacity
                        style={[
                          styles.playButton,
                          isPlaying === mission.id && styles.playButtonActive,
                          isLoadingAudio && styles.playButtonDisabled
                        ]}
                        onPress={() => togglePlay(mission)}
                        disabled={isLoadingAudio}
                      >
                        <Ionicons
                          name={isPlaying === mission.id ? "stop" : isLoadingAudio ? "hourglass" : "headset"}
                          size={20}
                          color={colors.WHITE}
                        />
                        <Text style={[typography.B2_BOLD, styles.playButtonText]}>
                          {isLoadingAudio ? '로딩...' : isPlaying === mission.id ? '정지' : '미션듣기'}
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
                  </View>
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
                  onPress={() => {}}
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
