import { getMissionCandidates, postSelectMission } from '@/app/api/mission';
import { MissionCandidate } from '@/app/api/mission/entity';
import Header from '@/components/common/Header';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function MissionSelectScreen() {
  const [selectedMissionId, setSelectedMissionId] = useState<number | null>(null);
  const [missions, setMissions] = useState<MissionCandidate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 미션 후보 목록 가져오기
  const fetchMissionCandidates = async () => {
  setIsLoading(true);
  try {
    const response = await getMissionCandidates();

    const list =
      Array.isArray(response)
        ? response
        : (response?.candidates ?? []);

    setMissions(list);
    setSelectedMissionId(null);
  } catch (error) {
    console.error('미션 목록 로드 실패:', error);
    Alert.alert('오류', '미션 목록을 불러오는데 실패했습니다.');
  } finally {
    setIsLoading(false);
  }
};

  // 컴포넌트 마운트 시 미션 목록 로드
  useEffect(() => {
    fetchMissionCandidates();
  }, []);

  const toggleMission = (id: number) => {
    setSelectedMissionId(id);
  };

  const handleNext = async () => {
    if (selectedMissionId !== null) {
      const selectedMission = missions.find(m => m.id === selectedMissionId);
      if (selectedMission) {
        setIsSubmitting(true);
        try {
          // 미션 선택 API 호출
          const response = await postSelectMission(selectedMissionId);
          console.log('미션 선택 성공:', response);

          // 미션 일정 설정 페이지로 이동하면서 선택한 미션 데이터 전달
          router.push({
            pathname: '/mission/schedule',
            params: {
              missionId: selectedMission.id,
              missionText: selectedMission.content, // API에서는 content 필드 사용
              serverMissionId: response.mission_id, // 서버에서 받은 실제 미션 ID
            },
          });
        } catch (error) {
          console.error('미션 선택 실패:', error);
          Alert.alert('오류', '미션 선택에 실패했습니다. 다시 시도해주세요.');
        } finally {
          setIsSubmitting(false);
        }
      }
    }
  };

  return (
    <View style={styles.container}>
      <Header title="미션" />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={[typography.B1, styles.title]}>
          미션을 선택해주세요!
        </Text>

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.MAIN} />
            <Text style={[typography.B2, styles.loadingText]}>
              미션을 불러오는 중...
            </Text>
          </View>
        ) : (
          <>
            <View style={styles.missionList}>
              {missions.map((mission) => (
                <TouchableOpacity
                  key={mission.id}
                  style={[
                    styles.missionCard,
                    selectedMissionId === mission.id && styles.missionCardSelected,
                  ]}
                  onPress={() => toggleMission(mission.id)}
                  activeOpacity={0.7}
                  disabled={isSubmitting}
                >
                  <Text
                    style={[
                      typography.C1,
                      styles.missionText,
                      selectedMissionId === mission.id && styles.missionTextSelected,
                    ]}
                  >
                    {mission.content}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={styles.moreButton}
              onPress={fetchMissionCandidates}
              disabled={isLoading || isSubmitting}
            >
              <Text style={[typography.B2_BOLD, styles.moreButtonText]}>
                다른 미션 보기
              </Text>
              <Ionicons name="refresh-outline" size={20} color={colors.GRAY_500} />
            </TouchableOpacity>
          </>
        )}
      </ScrollView>

      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={[
            styles.completeButton,
            (selectedMissionId === null || isSubmitting) && styles.completeButtonDisabled,
          ]}
          onPress={handleNext}
          disabled={selectedMissionId === null || isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator size="small" color={colors.WHITE} />
          ) : (
            <Text
              style={[
                typography.B1_BOLD,
                styles.completeButtonText,
                selectedMissionId === null && styles.completeButtonTextDisabled,
              ]}
            >
              선택완료
            </Text>
          )}
        </TouchableOpacity>
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
  },
  title: {
    color: colors.BLACKTEXT,
    textAlign: 'center',
    marginTop: 40,
    marginBottom: 32,
  },
  missionList: {
    gap: 16,
  },
  missionCard: {
    backgroundColor: colors.WHITE,
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: colors.WHITE,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 5,
  },
  missionCardSelected: {
    borderColor: colors.MAIN,
    backgroundColor: '#e6f2df',
  },
  missionText: {
    color: colors.GRAY_700,
    lineHeight: 24,
  },
  missionTextSelected: {
    color: colors.BLACKTEXT,
  },
  moreButton: {
    flexDirection: 'row',
    gap: 6,
    justifyContent: 'center',
    marginTop: 32,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  moreButtonText: {
    color: colors.GRAY_500,
  },
  bottomContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: 34,
    backgroundColor: colors.WHITE,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 5,
  },
  completeButton: {
    backgroundColor: colors.MAIN,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  completeButtonDisabled: {
    backgroundColor: colors.GRAY_300,
  },
  completeButtonText: {
    color: colors.WHITE,
  },
  completeButtonTextDisabled: {
    color: colors.GRAY_500,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    marginTop: 16,
    color: colors.GRAY_600,
  },
});
