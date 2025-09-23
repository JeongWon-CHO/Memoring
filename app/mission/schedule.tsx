import Header from '@/components/common/Header';
import MissionCard from '@/components/mission/MissionCard';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { ScrollView as GestureScrollView } from 'react-native-gesture-handler';
import { patchMissionSchedule } from '../../api/mission';

const DAYS = ['일', '월', '화', '수', '목', '금', '토'];

export default function MissionScheduleScreen() {
  const params = useLocalSearchParams();
  const { missionId, missionText, serverMissionId } = params;

  // 현재 날짜 기준으로 한 주 생성
  const today = new Date();
  const currentDay = today.getDay();
  const [selectedDay, setSelectedDay] = useState(currentDay);

  // 시간 선택 상태
  const [selectedHour, setSelectedHour] = useState(9);
  const [selectedMinute, setSelectedMinute] = useState(0);
  const [isHourDropdownOpen, setIsHourDropdownOpen] = useState(false);
  const [isMinuteDropdownOpen, setIsMinuteDropdownOpen] = useState(false);

  // 알림 설정 상태
  const [notificationTime, setNotificationTime] = useState('1시간 전');
  const [isNotificationDropdownOpen, setIsNotificationDropdownOpen] = useState(false);

  // 오프셋 포함 ISO 생성 유틸
  const toOffsetISOString = (d: Date) => {
    const pad = (n: number) => String(n).padStart(2, '0');
    const yyyy = d.getFullYear();
    const MM = pad(d.getMonth() + 1);
    const dd = pad(d.getDate());
    const hh = pad(d.getHours());
    const mm = pad(d.getMinutes());
    const ss = pad(d.getSeconds());

    const offsetMin = -d.getTimezoneOffset();      // e.g. KST = +540
    const sign = offsetMin >= 0 ? '+' : '-';
    const oh = pad(Math.floor(Math.abs(offsetMin) / 60));
    const om = pad(Math.abs(offsetMin) % 60);

    return `${yyyy}-${MM}-${dd}T${hh}:${mm}:${ss}${sign}${oh}:${om}`;
  };

  const alarmOffsetMap: Record<string, number> = {
    '정시': 0,
    '5분 전': 5,
    '10분 전': 10,
    '15분 전': 15,
    '30분 전': 30,
    '1시간 전': 60,
  };

  const notificationOptions = [
    '정시',
    '5분 전',
    '10분 전',
    '15분 전',
    '30분 전',
    '1시간 전',
  ];

  // 이번 주 날짜 계산
  const getWeekDates = () => {
    const dates = [];
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - currentDay);

    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      dates.push(date.getDate());
    }
    return dates;
  };

  const weekDates = getWeekDates();

  const handleNext = async () => {
    const base = new Date();
    base.setDate(base.getDate() + (selectedDay - currentDay));
    base.setHours(selectedHour, selectedMinute, 0, 0);

    const scheduledAt = toOffsetISOString(base);
    const alarmOffset = alarmOffsetMap[notificationTime] ?? 0;

    // 주의: 아래 missionId는 user_mission_id 여야 함!
    //  - 미션 선택 API(POST /missions/select/) 응답의 id를 이전 화면에서 params로 넘겨주세요.
    //  - 후보 id를 그대로 넘기면 404/400 날 수 있어요.
    const userMissionId = Number(serverMissionId);

    try {
      const res = await patchMissionSchedule(userMissionId, {
        scheduled_at: scheduledAt,
        alarm_offset_minutes: alarmOffset,
      });

      // 성공 후 다음 페이지로 이동
      router.push({
        pathname: '/mission/record', // 실제 녹음 화면 경로
        params: {
          missionId: String(userMissionId),
          // serverMissionId: String(userMissionId),
          missionText,
          scheduledDate: scheduledAt,
          notificationTime,
        },
      });
    } catch (e: any) {
      console.log('스케줄 저장 실패', e?.response?.data || e);
      alert('스케줄 저장에 실패했습니다. 날짜/시간 형식을 다시 확인해주세요.');
    }
  };

  return (
    <View style={styles.container}>
      <Header title="녹음" />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* 미션 텍스트 표시 */}
        <MissionCard
          missionText={missionText as string}
          dayTime={{ day: '', time: '' }}
        />

        {/* 날짜 선택 */}
        <View style={styles.section}>
          <Text style={[typography.S2, styles.sectionTitle]}>날짜</Text>
          <View style={styles.daySelector}>
            {DAYS.map((day, index) => (
              <View key={index} style={styles.dayContainer}>
                <TouchableOpacity
                  style={[
                    styles.dayButton,
                    index === currentDay && styles.todayButton,
                    selectedDay === index && styles.selectedDayButton,
                  ]}
                  onPress={() => setSelectedDay(index)}
                >
                  <Text
                    style={[
                      typography.B2_BOLD,
                      styles.dayNumber,
                      selectedDay === index && styles.selectedDayNumber,
                    ]}
                  >
                    {weekDates[index]}
                  </Text>
                </TouchableOpacity>
                <Text
                  style={[
                    typography.C1,
                    styles.dayText,
                    index === currentDay && styles.todayText,
                    selectedDay === index && styles.selectedDayText,
                  ]}
                >
                  {day}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* 시간 선택 */}
        <View style={styles.section}>
          <Text style={[typography.S2, styles.sectionTitle]}>시간</Text>
          <View style={styles.timeSelector}>
            {/* 시간 드롭다운 */}
            <View style={styles.timeDropdownContainer}>
              <TouchableOpacity
                style={styles.timeDropdown}
                onPress={() => {
                  setIsHourDropdownOpen(!isHourDropdownOpen);
                  setIsMinuteDropdownOpen(false);
                }}
              >
                <Text style={[typography.B2, styles.timeText]}>
                  {String(selectedHour).padStart(2, '0')}시
                </Text>
                <Ionicons
                  name={isHourDropdownOpen ? 'chevron-up' : 'chevron-down'}
                  size={20}
                  color={colors.GRAY_600}
                />
              </TouchableOpacity>

              {isHourDropdownOpen && (
                <GestureScrollView style={styles.dropdownList} nestedScrollEnabled>
                  {Array.from({ length: 24 }, (_, i) => i).map((hour) => (
                    <TouchableOpacity
                      key={hour}
                      style={styles.dropdownItem}
                      onPress={() => {
                        setSelectedHour(hour);
                        setIsHourDropdownOpen(false);
                      }}
                    >
                      <Text style={[typography.B2, styles.dropdownItemText]}>
                        {String(hour).padStart(2, '0')}시
                      </Text>
                    </TouchableOpacity>
                  ))}
                </GestureScrollView>
              )}
            </View>

            {/* 분 드롭다운 */}
            <View style={styles.timeDropdownContainer}>
              <TouchableOpacity
                style={styles.timeDropdown}
                onPress={() => {
                  setIsMinuteDropdownOpen(!isMinuteDropdownOpen);
                  setIsHourDropdownOpen(false);
                }}
              >
                <Text style={[typography.B2, styles.timeText]}>
                  {String(selectedMinute).padStart(2, '0')}분
                </Text>
                <Ionicons
                  name={isMinuteDropdownOpen ? 'chevron-up' : 'chevron-down'}
                  size={20}
                  color={colors.GRAY_600}
                />
              </TouchableOpacity>

              {isMinuteDropdownOpen && (
                <GestureScrollView style={styles.dropdownList} nestedScrollEnabled>
                  {Array.from({ length: 60 }, (_, i) => i).map((minute) => (
                    <TouchableOpacity
                      key={minute}
                      style={styles.dropdownItem}
                      onPress={() => {
                        setSelectedMinute(minute);
                        setIsMinuteDropdownOpen(false);
                      }}
                    >
                      <Text style={[typography.B2, styles.dropdownItemText]}>
                        {String(minute).padStart(2, '0')}분
                      </Text>
                    </TouchableOpacity>
                  ))}
                </GestureScrollView>
              )}
            </View>
          </View>
        </View>

        {/* 알림 설정 */}
        <View style={styles.section}>
          <Text style={[typography.B1_BOLD, styles.sectionTitle]}>알림</Text>
          <TouchableOpacity
            style={styles.notificationDropdown}
            onPress={() => setIsNotificationDropdownOpen(!isNotificationDropdownOpen)}
          >
            <Text style={[typography.B2, styles.notificationText]}>
              {notificationTime}
            </Text>
            <Ionicons
              name={isNotificationDropdownOpen ? 'chevron-up' : 'chevron-down'}
              size={20}
              color={colors.GRAY_600}
            />
          </TouchableOpacity>

          {isNotificationDropdownOpen && (
            <View style={styles.notificationDropdownList}>
              {notificationOptions.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={styles.dropdownItem}
                  onPress={() => {
                    setNotificationTime(option);
                    setIsNotificationDropdownOpen(false);
                  }}
                >
                  <Text style={[typography.B2, styles.dropdownItemText]}>
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* 다음 버튼 */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={[typography.B1_BOLD, styles.nextButtonText]}>
            다음
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
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    color: colors.BLACKTEXT,
    marginBottom: 16,
  },
  daySelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayContainer: {
    alignItems: 'center',
    gap: 6,
  },
  dayButton: {
    width: 42,
    height: 42,
    backgroundColor: colors.GRAY_100,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  todayButton: {
    borderWidth: 1,
    borderColor: colors.MAIN,
  },
  selectedDayButton: {
    backgroundColor: colors.MAIN,
  },
  dayNumber: {
    color: colors.GRAY_700,
  },
  selectedDayNumber: {
    color: colors.WHITE,
  },
  dayText: {
    color: colors.GRAY_600,
    fontSize: 12,
  },
  todayText: {
    color: colors.MAIN,
    fontWeight: '600',
  },
  selectedDayText: {
    color: colors.MAIN,
    fontWeight: '600',
  },
  timeSelector: {
    flexDirection: 'row',
    gap: 16,
  },
  timeDropdownContainer: {
    flex: 1,
    position: 'relative',
    zIndex: 1,
  },
  timeDropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.WHITE,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: colors.GRAY_200,
  },
  timeText: {
    color: colors.BLACKTEXT,
  },
  dropdownList: {
    position: 'absolute',
    top: 52,
    left: 0,
    right: 0,
    backgroundColor: colors.WHITE,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.GRAY_200,
    maxHeight: 200,
    zIndex: 1000,
  },
  notificationDropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.WHITE,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: colors.GRAY_200,
  },
  notificationText: {
    color: colors.BLACKTEXT,
  },
  notificationDropdownList: {
    marginTop: 8,
    backgroundColor: colors.WHITE,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.GRAY_200,
  },
  dropdownItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.GRAY_100,
  },
  dropdownItemText: {
    color: colors.GRAY_700,
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
  nextButton: {
    backgroundColor: colors.MAIN,
    borderRadius: 32,
    paddingVertical: 12,
    alignItems: 'center',
  },
  nextButtonText: {
    color: colors.WHITE,
  },
});
