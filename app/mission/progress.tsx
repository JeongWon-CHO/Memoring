import Header from '@/components/common/Header';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

type MoodType = 'laugh' | 'smile' | 'meh' | 'sad-tear';

export default function MissionProgressScreen() {
  const params = useLocalSearchParams();
  const getParam = (v: any) => (Array.isArray(v) ? v[0] : v);

  const missionDate = getParam(params.scheduledDate) as string || new Date().toISOString();
  const missionId = getParam(params.missionId);

  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);
  const [memoText, setMemoText] = useState('');
  const [photoUri, setPhotoUri] = useState<string | null>(null);

  // 날짜 포맷팅 (2025-09-18 (목))
  const formatDate = () => {
    const date = new Date(missionDate);
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day} (${days[date.getDay()]})`;
  };

  const moodOptions: { icon: MoodType; selected: boolean }[] = [
    { icon: 'laugh', selected: selectedMood === 'laugh' },
    { icon: 'smile', selected: selectedMood === 'smile' },
    { icon: 'meh', selected: selectedMood === 'meh' },
    { icon: 'sad-tear', selected: selectedMood === 'sad-tear' },
  ];

  const handleSaveProgress = () => {
    // TODO: API 연동
    console.log('저장할 데이터:', {
      missionId,
      mood: selectedMood,
      memo: memoText,
      photo: photoUri
    });

    router.back();
  };

  const handleCancel = () => {
    router.back();
  };

  const handleAddPhoto = () => {
    // TODO: 사진 선택 기능 구현
    console.log('사진 추가');
  };

  return (
    <View style={styles.container}>
      <Header title="메모리" />

      <KeyboardAvoidingView
        style={styles.content}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* 날짜 섹션 */}
          <View style={styles.section}>
            <Text style={[typography.B2_BOLD, styles.sectionTitle]}>날짜</Text>
            <View style={styles.dateBox}>
              <Text style={[typography.C1, styles.dateText]}>{formatDate()}</Text>
            </View>
          </View>

          {/* 오늘의 기분 섹션 */}
          <View style={styles.section}>
            <Text style={[typography.B2_BOLD, styles.sectionTitle]}>오늘의 기분</Text>
            <View style={styles.moodContainer}>
              {moodOptions.map((mood) => (
                <TouchableOpacity
                  key={mood.icon}
                  style={[
                    styles.moodButton,
                    mood.selected && styles.moodButtonSelected
                  ]}
                  onPress={() => setSelectedMood(mood.icon)}
                >
                  <FontAwesome5
                    name={mood.icon}
                    size={32}
                    color={mood.selected ? colors.MAIN : colors.GRAY_600}
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* 오늘의 메모 섹션 */}
          <View style={styles.section}>
            <Text style={[typography.B2_BOLD, styles.sectionTitle]}>오늘의 메모</Text>
            <TextInput
              style={[typography.C1, styles.memoInput]}
              multiline
              placeholder="오늘 미션을 하며 느낀 점을 적어주세요!"
              placeholderTextColor={colors.GRAY_400}
              value={memoText}
              onChangeText={setMemoText}
              textAlignVertical="top"
            />
          </View>

          {/* 사진 섹션 */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[typography.B2_BOLD, styles.sectionTitle]}>사진</Text>
              <Text style={[typography.C1, styles.sectionSubtitle]}>최대 5장</Text>
            </View>

            <View style={styles.photoContainer}>
              <TouchableOpacity
                style={styles.addPhotoButton}
                onPress={handleAddPhoto}
              >
                <Ionicons name="add" size={32} color={colors.GRAY_400} />
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* 하단 버튼들 */}
      <View style={styles.bottomButtons}>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSaveProgress}
        >
          <Ionicons name="download-outline" size={20} color={colors.WHITE} />
          <Text style={[typography.B1_BOLD, styles.saveButtonText]}>
            메모저장
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cancelButton}
          onPress={handleCancel}
        >
          <Text style={[typography.B1_BOLD, styles.cancelButtonText]}>
            취소
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
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  section: {
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  sectionTitle: {
    color: colors.BLACKTEXT,
    marginBottom: 12,
  },
  sectionSubtitle: {
    color: colors.GRAY_500,
  },
  dateBox: {
    backgroundColor: colors.WHITE,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  dateText: {
    color: colors.BLACKTEXT,
  },
  moodContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  moodButton: {
    width: 48,
    height: 48,
    borderRadius: 36,
    backgroundColor: colors.WHITE,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.GRAY_200,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  moodButtonSelected: {
    borderColor: colors.MAIN,
    backgroundColor: '#F5FBF2',
  },
  memoInput: {
    backgroundColor: colors.WHITE,
    borderRadius: 12,
    padding: 16,
    height: 120,
    borderWidth: 1,
    borderColor: colors.GRAY_200,
    color: colors.BLACKTEXT,
  },
  photoContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  addPhotoButton: {
    width: 100,
    height: 100,
    borderRadius: 12,
    backgroundColor: colors.WHITE,
    borderWidth: 1,
    borderColor: colors.GRAY_300,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomButtons: {
    paddingHorizontal: 20,
    paddingBottom: 34,
    paddingTop: 16,
    backgroundColor: colors.BG,
    gap: 12,
  },
  saveButton: {
    backgroundColor: colors.MAIN,
    borderRadius: 25,
    paddingVertical: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  saveButtonText: {
    color: colors.WHITE,
  },
  cancelButton: {
    backgroundColor: colors.GRAY_200,
    borderRadius: 25,
    paddingVertical: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: colors.GRAY_700,
  },
});