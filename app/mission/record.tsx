import Header from '@/components/common/Header';
import MissionCard from '@/components/mission/MissionCard';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { useMissionStorage } from '@/hooks/useMissionStorage';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function MissionRecordScreen() {
  const params = useLocalSearchParams();
  const { missionId, missionText, scheduledDate, notificationTime } = params;
  const { saveMission } = useMissionStorage();

  // 타이머 상태
  const [seconds, setSeconds] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // 타이머 포맷팅 (MM:SS)
  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // 녹음 시작
  const startRecording = () => {
    setIsRecording(true);
    setIsPaused(false);
    intervalRef.current = setInterval(() => {
      setSeconds(prev => prev + 1);
    }, 1000);
  };

  // 녹음 일시정지
  const pauseRecording = () => {
    setIsPaused(true);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  // 녹음 재개
  const resumeRecording = () => {
    setIsPaused(false);
    intervalRef.current = setInterval(() => {
      setSeconds(prev => prev + 1);
    }, 1000);
  };

  // 녹음 중지 및 저장
  const stopRecording = () => {
    setIsRecording(false);
    setIsPaused(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    // 저장 로직 처리 후 다음 화면으로 이동
    handleSave();
  };

  // 다시 녹음
  const resetRecording = () => {
    setSeconds(0);
    setIsRecording(false);
    setIsPaused(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  // 저장하기
  const handleSave = async () => {
    if (isSaving) return;

    setIsSaving(true);
    try {
      // 미션 저장
      await saveMission({
        missionText: missionText as string,
        scheduledDate: scheduledDate as string,
        isCompleted: false,
        // recordingPath는 실제 녹음 기능 구현 시 추가
      });

      Alert.alert(
        '저장 완료',
        '미션이 저장되었습니다.',
        [
          {
            text: '확인',
            onPress: () => router.replace('/(tabs)'),
          },
        ]
      );
    } catch (error) {
      Alert.alert('저장 실패', '미션 저장에 실패했습니다.');
      setIsSaving(false);
    }
  };

  // 컴포넌트 언마운트 시 타이머 정리
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // 요일과 시간 텍스트 가져오기
  const getDayTimeText = () => {
    if (!scheduledDate) return { day: '', time: '' };
    const date = new Date(scheduledDate as string);
    const days = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
    const dayText = days[date.getDay()];

    const hours = date.getHours();
    const period = hours < 12 ? '오전' : '오후';
    const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
    const timeText = `${period} ${displayHours}시`;

    return { day: dayText, time: timeText };
  };

  const { day: dayText, time: timeText } = getDayTimeText();

  return (
    <View style={styles.container}>
      <Header title="녹음" />

      <View style={styles.content}>
        {/* 미션 텍스트 */}
        <MissionCard
          dayTime={{ day: dayText, time: timeText }}
          missionText={missionText as string}
          highlightDayTime={true}
        />

        {/* 타이머 */}
        <View style={styles.timerSection}>
          <Text style={styles.timerText}>{formatTime(seconds)}</Text>

          {/* 녹음 버튼 */}
          <TouchableOpacity
            style={styles.recordButton}
            onPress={() => {
              if (!isRecording) {
                startRecording();
              } else if (isPaused) {
                resumeRecording();
              } else {
                pauseRecording();
              }
            }}
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