import Header from '@/components/common/Header';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import React, { useState } from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

interface MemoryItem {
  id: string;
  date: string;
  time: string;
  title: string;
  location: string;
  description: string;
  image: any;
  showMore?: boolean;
}

const memoryData: MemoryItem[] = [
  {
    id: '1',
    date: '2025년 09월 02일',
    time: '오전 10시',
    title: '투유원 오전 10시에 집 주변에서\n15분간 산책하며 마음에 드는 꽃 사진 찍기',
    location: '',
    description:
      '오늘 아침에 동네 한 바퀴를 천천히 걷다가 골목 모퉁이에서 주황빛 능소화를 발견했어. 햇살에 비쳐서 너무 아름답더라. 아직 여름이라 더워도 이렇게 보면 행복하다.',
    image: require('@/assets/images/mission1.jpg'),
  },
  {
    id: '2',
    date: '2025년 09월 05일',
    time: '오후 1시',
    title: '금요일 오후 1시 집 근처\n전통시장에 가서 사진 찍기',
    location: '',
    description:
      '날씨가 더워서 점심을 밖에서 먹고 있자 왔고 시장도 둘러봤어. 오랜만에 시장들로 목적이는 풍경을 보니까 동터. 심싶했더 배추랑 무도 보고',
    image: require('@/assets/images/mission2.jpg'),
  },
];

export default function MemoryScreen() {
  const [selectedMonth, setSelectedMonth] = useState('9월1주차');

  return (
    <>
      <Header title='메모리' />

      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.monthSelector}>
          <Text style={styles.monthText}>{selectedMonth}</Text>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {memoryData.map(item => (
            <View key={item.id} style={styles.memoryCard}>
              <View style={styles.dateHeader}>
                <Text style={styles.dateText}>{item.date}</Text>
              </View>

              <View style={styles.cardContent}>
                <Text style={styles.titleText}>
                  {item.time} {item.title.split('\n')[0]}
                </Text>
                <Text style={styles.subtitleText}>{item.title.split('\n')[1]}</Text>

                <Image source={item.image} style={styles.memoryImage} resizeMode='cover' />

                <Text style={styles.descriptionText}>{item.description}</Text>

                <TouchableOpacity style={styles.moreButton}>
                  <Text style={styles.moreButtonText}>더보기 &gt;</Text>
                </TouchableOpacity>

                {/* <TouchableOpacity style={styles.reactionButton}>
                  <Text style={styles.reactionIcon}>g</Text>
                </TouchableOpacity> */}
              </View>
            </View>
          ))}

          <View style={styles.bottomSpacing} />
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.BG,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: colors.WHITE,
  },
  headerTitle: {
    ...typography.H5,
    color: colors.TEXT,
  },
  monthSelector: {
    marginHorizontal: 20,
    marginTop: 16,
  },
  monthText: {
    ...typography.S2,
    color: colors.MAIN,
  },
  content: {
    flex: 1,
    paddingTop: 16,
  },
  memoryCard: {
    marginBottom: 24,
  },
  dateHeader: {
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  dateText: {
    ...typography.C1,
    color: colors.GRAY_600,
    textAlign: 'center',
  },
  cardContent: {
    backgroundColor: colors.WHITE,
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  titleText: {
    ...typography.B2_BOLD,
    color: colors.TEXT,
    marginBottom: 4,
  },
  subtitleText: {
    ...typography.B2,
    color: colors.TEXT,
    marginBottom: 16,
  },
  memoryImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 16,
  },
  descriptionText: {
    ...typography.C2,
    color: colors.GRAY_700,
    lineHeight: 24,
    marginBottom: 12,
  },
  moreButton: {
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  moreButtonText: {
    ...typography.C2,
    color: colors.GRAY_500,
  },
  reactionButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.BG,
    justifyContent: 'center',
    alignItems: 'center',
  },
  reactionIcon: {
    fontSize: 24,
  },
  bottomSpacing: {
    height: 80,
  },
});
