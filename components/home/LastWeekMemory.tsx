import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState, useRef } from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';

const { width: screenWidth } = Dimensions.get('window');
const CARD_WIDTH = screenWidth - 80;
const CARD_MARGIN = 10;

export default function LastWeekMemory() {
  const scrollViewRef = useRef<ScrollView>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // TODO: 실제 메모리 데이터는 API에서 가져오기
  const memories = [
    {
      id: 1,
      date: '9월 1주차',
      title: '미션1',
      subtitle: '산책을 하며 발견한 꽃 사진 찍기',
      image: null, // 실제 이미지 URL
    },
    {
      id: 2,
      date: '9월 2주차',
      title: '미션2',
      subtitle: '가족과 함께 저녁 식사',
      image: null,
    },
    {
      id: 3,
      date: '9월 3주차',
      title: '미션3',
      subtitle: '좋아하는 노래 듣기',
      image: null,
    },
  ];

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / (CARD_WIDTH + CARD_MARGIN * 2));
    setActiveIndex(index);
  };

  return (
    <View style={styles.container}>
      <Text style={[typography.B1_BOLD, styles.title]}>지난주 메모리</Text>

      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        snapToInterval={CARD_WIDTH + CARD_MARGIN * 2}
        decelerationRate="fast"
        contentContainerStyle={styles.scrollContent}
      >
        {memories.map((memory) => (
          <View key={memory.id} style={styles.cardWrapper}>
            <TouchableOpacity style={styles.memoryCard} activeOpacity={0.9}>
              <View style={styles.imageContainer}>
                {memory.image ? (
                  <Image source={{ uri: memory.image }} style={styles.memoryImage} />
                ) : (
                  <View style={styles.placeholderImage}>
                    <Text style={[typography.B2, styles.placeholderText]}>메모리 이미지</Text>
                  </View>
                )}
                <LinearGradient
                  colors={['transparent', 'rgba(0, 0, 0, 0.7)']}
                  style={styles.gradientOverlay}
                >
                  <View style={styles.overlay}>
                    <Text style={[typography.C1, styles.memoryDate]}>{memory.date}</Text>
                    <Text style={[typography.B1_BOLD, styles.memoryTitle]}>{memory.title}</Text>
                    <Text style={[typography.B2, styles.memorySubtitle]}>{memory.subtitle}</Text>
                  </View>
                </LinearGradient>
              </View>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      {/* 페이지네이션 닷 */}
      <View style={styles.pagination}>
        {memories.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              index === activeIndex && styles.activeDot
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  title: {
    color: colors.BLACKTEXT,
    marginBottom: 16,
    marginHorizontal: 20,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  scrollView: {
    flexGrow: 0,
  },
  cardWrapper: {
    width: CARD_WIDTH,
    marginHorizontal: CARD_MARGIN,
  },
  memoryCard: {
    width: '100%',
  },
  imageContainer: {
    height: 200,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: colors.GRAY_200,
  },
  memoryImage: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.GRAY_300,
  },
  placeholderText: {
    color: colors.GRAY_600,
  },
  gradientOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '70%',
    justifyContent: 'flex-end',
  },
  overlay: {
    padding: 16,
  },
  memoryDate: {
    color: colors.WHITE,
    marginBottom: 4,
  },
  memoryTitle: {
    color: colors.WHITE,
    marginBottom: 4,
  },
  memorySubtitle: {
    color: colors.WHITE,
    opacity: 0.9,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 16,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.GRAY_300,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: colors.MAIN,
    width: 20,
  },
});