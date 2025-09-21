import Header from '@/components/common/Header';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface Mission {
  id: number;
  text: string;
}

export default function MissionSelectScreen() {
  const [selectedMissions, setSelectedMissions] = useState<number|null>(null);

  const missions: Mission[] = [
    { id: 1, text: '아침 식사를 마치고 부엌을 나올 때, 해야 할 일을 종이에 5개 작성' },
    { id: 2, text: 'TV 뉴스를 볼 때, 뉴스 내용을 종이에 정리한 뒤 정리한 종이를 사진으로 찍어 올리기' },
    { id: 3, text: '잠자리에 들기 전에 침실에서, 하루 동안 감사했던 일을 하나 종이에 적고 침실 보습을 사진으로 찍기' },
  ];

  const toggleMission = (id: number) => {
    setSelectedMissions(id);
  };

  const handleNext = () => {
    if (selectedMissions !== null) {
      const selectedMission = missions.find(m => m.id === selectedMissions);
      if (selectedMission) {
        // 미션 일정 설정 페이지로 이동하면서 선택한 미션 데이터 전달
        router.push({
          pathname: '/mission/schedule',
          params: {
            missionId: selectedMission.id,
            missionText: selectedMission.text,
          },
        });
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

        <View style={styles.missionList}>
          {missions.map((mission) => (
            <TouchableOpacity
              key={mission.id}
              style={[
                styles.missionCard,
                selectedMissions === (mission.id) && styles.missionCardSelected,
              ]}
              onPress={() => toggleMission(mission.id)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  typography.C1,
                  styles.missionText,
                  selectedMissions === (mission.id) && styles.missionTextSelected,
                ]}
              >
                {mission.text}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.moreButton}>
          <Text style={[typography.B2_BOLD, styles.moreButtonText]}>
            다른 미션 보기
          </Text>
          <Ionicons name="refresh-outline" size={20} color={colors.GRAY_500} />
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={[
            styles.completeButton,
            selectedMissions === null && styles.completeButtonDisabled,
          ]}
          onPress={handleNext}
          disabled={selectedMissions === null}
        >
          <Text
            style={[
              typography.B1_BOLD,
              styles.completeButtonText,
              selectedMissions === null && styles.completeButtonTextDisabled,
            ]}
          >
            선택완료
          </Text>
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
});
