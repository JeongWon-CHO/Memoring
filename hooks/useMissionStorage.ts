import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

export interface SavedMission {
  id: string;
  missionText: string;
  scheduledDate: string;
  recordingPath?: string; // 녹음 파일 경로
  isCompleted: boolean;
  createdAt: string;
}

const STORAGE_KEY = '@memoring_missions';

export function useMissionStorage() {
  const [missions, setMissions] = useState<SavedMission[]>([]);
  const [loading, setLoading] = useState(true);

  // 미션 목록 불러오기
  const loadMissions = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setMissions(parsed);
      }
      setLoading(false);
    } catch (error) {
      console.error('Failed to load missions:', error);
      setLoading(false);
    }
  };

  // 미션 저장
  const saveMission = async (mission: Omit<SavedMission, 'id' | 'createdAt'>) => {
    try {
      const newMission: SavedMission = {
        ...mission,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };

      const updatedMissions = [...missions, newMission];
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedMissions));
      setMissions(updatedMissions);
      return newMission;
    } catch (error) {
      console.error('Failed to save mission:', error);
      throw error;
    }
  };

  // 미션 삭제
  const deleteMission = async (missionId: string) => {
    try {
      const updatedMissions = missions.filter(m => m.id !== missionId);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedMissions));
      setMissions(updatedMissions);
    } catch (error) {
      console.error('Failed to delete mission:', error);
      throw error;
    }
  };

  // 미션 완료 상태 업데이트
  const updateMissionStatus = async (missionId: string, isCompleted: boolean) => {
    try {
      const updatedMissions = missions.map(m =>
        m.id === missionId ? { ...m, isCompleted } : m
      );
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedMissions));
      setMissions(updatedMissions);
    } catch (error) {
      console.error('Failed to update mission status:', error);
      throw error;
    }
  };

  // 오늘 날짜의 미션만 필터링
  const getTodayMissions = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return missions.filter(mission => {
      const missionDate = new Date(mission.scheduledDate);
      missionDate.setHours(0, 0, 0, 0);
      return missionDate.getTime() === today.getTime();
    });
  };

  // 이번 주 미션 필터링
  const getWeeklyMissions = () => {
    const now = new Date();
    const weekStart = new Date(now);
    const weekEnd = new Date(now);

    // 이번 주 일요일 (시작)
    weekStart.setDate(now.getDate() - now.getDay());
    weekStart.setHours(0, 0, 0, 0);

    // 이번 주 토요일 (끝)
    weekEnd.setDate(weekStart.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);

    return missions.filter(mission => {
      const missionDate = new Date(mission.scheduledDate);
      return missionDate >= weekStart && missionDate <= weekEnd;
    });
  };

  useEffect(() => {
    loadMissions();
  }, []);

  return {
    missions,
    loading,
    saveMission,
    deleteMission,
    updateMissionStatus,
    getTodayMissions,
    getWeeklyMissions,
    reloadMissions: loadMissions,
  };
}