import Header from '@/components/common/Header';
import MissionCard from '@/components/mission/MissionCard';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Audio } from 'expo-av';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { getPlayRecord, postUploadRecord } from '../../api/mission';

export default function MissionRecordScreen() {
  const getParam = (v: any) => (Array.isArray(v) ? v[0] : v);

  const params = useLocalSearchParams();
  // const { missionId, missionText, serverMissionId, notificationTime } = params;
  const missionText = getParam(params.missionText);
  const scheduledDateStr = getParam(params.scheduledDate) as string | undefined;
  const serverMissionIdStr = getParam(params.missionId);
  const serverMissionIdNum = Number(serverMissionIdStr);

  if (!Number.isFinite(serverMissionIdNum)) {
    console.warn('invalid serverMissionId:', serverMissionIdStr);
  }

  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  // const [serverVoiceUrl, setServerVoiceUrl] = useState<string | null>(null);
  // const [sound, setSound] = useState<Audio.Sound | null>(null);
  // const [isUploading, setIsUploading] = useState(false);
  
  // const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [serverVoiceUrl, setServerVoiceUrl] = useState<string | null>(null);

  useEffect(() => {
      (async () => {
        const { status } = await Audio.requestPermissionsAsync();
        if (status !== "granted") {
          Alert.alert("마이크 권한이 필요합니다.");
        }
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });
  
        // 서버에서 기존 녹음 파일 URL 가져오기
        try {
          const response = await getPlayRecord(serverMissionIdNum);
          if (response.voice_url) {
            setServerVoiceUrl(response.voice_url);
          }
        } catch (error) {
          console.log("기존 녹음이 없습니다.");
        }
      })();
    }, []);

  
  // 타이머 시작
  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => setSeconds(s => s + 1), 1000);
  };

  // 타이머 끝
  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  // // 녹음 시작
  // const startRecording = async () => {
  //   try {
  //     console.log("녹음 시작");
  //     const { recording } = await Audio.Recording.createAsync(
  //       Audio.RecordingOptionsPresets.HIGH_QUALITY
  //     );
  //     setRecording(recording);  // 얘만 원래 코드
  //     setIsRecording(true);
  //     setIsPaused(false);
  //     setSeconds(0);
  //     startTimer();
  //   } catch (err) {
  //     console.error("녹음 시작 실패", err);
  //   }
  // };

  // 녹음 시작
  const startRecording = async () => {
    try {
      if (recording) {
        if (isPaused) {
          await recording.startAsync();
          setIsPaused(false);
          startTimer();
        }
        return;
      }

      console.log('녹음 시작');
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording: rec } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      setRecording(rec);
      setIsRecording(true);
      setIsPaused(false);
      setSeconds(0);
      startTimer();
    } catch (err) {
      console.error("녹음 시작 실패", err);
    }
  };

  // 일시정지
  const togglePause = async () => {
    if (!recording) return;
    try {
      if (isPaused) {
        await recording.startAsync();
        setIsPaused(false);
        startTimer();
      } else {
        await recording.pauseAsync();
        setIsPaused(true);
        stopTimer();
      }
    } catch (e) {
      console.error('일시정지/재개 실패', e);
    }
  };

  // 다시녹음
  const resetRecording = async () => {
    stopTimer();
    setSeconds(0);
    setIsPaused(false);
    setIsRecording(false);
    if (recording) {
      try { await recording.stopAndUnloadAsync(); } catch {}
    }
    setRecording(null);
  };

  // 녹음 중지 및 서버에 업로드
  const stopRecording = async () => {
    console.log("녹음 중지");
    if (!recording) return;

    try {
    await recording.stopAndUnloadAsync();
    stopTimer();

    const cacheUri = recording.getURI();
    if (!cacheUri) throw new Error('녹음 파일 경로를 찾을 수 없어요.');

    const res = await postUploadRecord(serverMissionIdNum, cacheUri);
    if (res?.voice_url) {
      setServerVoiceUrl(res.voice_url);
      Alert.alert('성공', '녹음이 성공적으로 업로드되었습니다.');
    }
    router.push({
      pathname: '/', // 실제 녹음 화면 경로
    });
  } catch (e) {
    console.error('업로드 실패', e);
    Alert.alert('오류', '녹음 업로드에 실패했습니다.');
  } finally {
    setIsSaving(false);
    setIsRecording(false);
    setIsPaused(false);
    setRecording(null);
  }
    // setIsUploading(true);
    // await recording.stopAndUnloadAsync();
    // const cacheUri = recording.getURI();

    // if (cacheUri) {
    //   try {
    //     // 서버에 업로드
    //     const response = await postUploadRecord(serverMissionIdNum, cacheUri);
    //     console.log("녹음이 서버에 업로드되었습니다:", response);

    //     // 업로드 성공 후 URL 저장
    //     if (response.voice_url) {
    //       setServerVoiceUrl(response.voice_url);
    //       Alert.alert("성공", "녹음이 성공적으로 업로드되었습니다.");
    //     }
    //   } catch (error) {
    //     console.error("업로드 실패:", error);
    //     Alert.alert("오류", "녹음 업로드에 실패했습니다.");
    //   }
    // }

    // setIsUploading(false);
    // setRecording(null);
  };

  // 타이머 포맷팅 (MM:SS)
  const formatTime = (t: number) =>
    `${String(Math.floor(t / 60)).padStart(2, '0')}:${String(t % 60).padStart(2, '0')}`;

  // 날짜 포맷팅
  const formatDayTimeFromISO = (iso?: string) => {
    if (!iso) return { day: '', time: '' };
    const d = new Date(iso);

    const day = `${d.getDate()}일`;
    let hour = d.getHours();
    const period = hour < 12 ? '오전' : '오후';
    if (hour === 0) hour = 12;
    else if (hour > 12) hour -= 12;

    return { day, time: `${period} ${hour}시` };
  };

  const formattedDayTime = formatDayTimeFromISO(scheduledDateStr);

  return (
    <View style={styles.container}>
      <Header title="녹음" />

      <View style={styles.content}>
        {/* 미션 텍스트 */}
        <MissionCard
          dayTime={{ day: formattedDayTime.day, time: formattedDayTime.time }}
          missionText={missionText as string}
          highlightDayTime={true}
        />

        {/* 타이머 */}
        <View style={styles.timerSection}>
          <Text style={styles.timerText}>{formatTime(seconds)}</Text>

          {/* 녹음 버튼 */}
          <TouchableOpacity
            style={styles.recordButton}
            onPress={!isRecording ? startRecording : togglePause}
          >
            {!isRecording ? (
              <>
                <Ionicons name="mic" size={32} color={colors.MAIN} />
                <Text style={[typography.B2_BOLD, styles.recordButtonText]}>녹음하기</Text>
              </>
            ) : (
              <>
                {isPaused ? (
                  <Ionicons name="play" size={32} color={colors.MAIN} />
                ) : (
                  <Ionicons name="pause" size={32} color={colors.MAIN} />
                )}
                <Text style={[typography.B2_BOLD, styles.recordButtonText]}>
                  {isPaused ? '재개하기' : '일시정지'}
                </Text>
              </>
            )}
          </TouchableOpacity>

          {/* 하단 안내 텍스트 */}
          {!isRecording && (
            <Text style={[typography.C1, styles.hintText]}>
              본인 목소리로 녹음해주세요
            </Text>
          )}
        </View>

        {/* 하단 버튼들 */}
        {isRecording && (
          <View style={styles.bottomButtons}>
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={resetRecording}
            >
              <Text style={[typography.B1_BOLD, styles.secondaryButtonText]}>
                다시녹음
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.primaryButton, isSaving && styles.primaryButtonDisabled]}
              onPress={stopRecording}
              disabled={isSaving}
            >
              <Ionicons name="download-outline" size={20} color={colors.WHITE} />
              <Text style={[typography.B1_BOLD, styles.primaryButtonText]}>
                {isSaving ? '저장 중...' : '저장하기'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.BG,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  timerSection: {
    flex: 1,
    marginTop: 30,
    alignItems: 'center',
  },
  timerText: {
    fontSize: 48,
    fontWeight: '300',
    color: colors.BLACKTEXT,
    marginBottom: 60,
  },
  recordButton: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: colors.WHITE,
    borderWidth: 1,
    borderColor: colors.MAIN,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#6fb34d',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  recordButtonText: {
    color: colors.MAIN,
    marginTop: 8,
  },
  hintText: {
    color: colors.GRAY_500,
    marginTop: 30,
  },
  bottomButtons: {
    flexDirection: 'row',
    gap: 12,
    paddingBottom: 34,
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: colors.GRAY_200,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: colors.GRAY_700,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: colors.MAIN,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  primaryButtonText: {
    color: colors.WHITE,
  },
  primaryButtonDisabled: {
    backgroundColor: colors.GRAY_400,
  },
});
