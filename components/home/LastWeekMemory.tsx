import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  Image,
  PanResponder,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const { width: screenWidth } = Dimensions.get('window');
const CONTAINER_PADDING = 40; // marginHorizontal 20 * 2
const CARD_WIDTH = (screenWidth - CONTAINER_PADDING) * 0.65;
const CARD_HEIGHT = CARD_WIDTH * (4 / 3); // 3:4 비율

export default function LastWeekMemory() {
  const [activeIndex, setActiveIndex] = useState(0);
  const translateX = useRef(new Animated.Value(0)).current;
  const [isAnimating, setIsAnimating] = useState(false);

  // TODO: 실제 메모리 데이터는 API에서 가져오기
  const memories = [
    {
      id: 1,
      date: '8월 4주차',
      title: '미션1',
      subtitle: '산책을 하며 발견한 꽃 사진 찍기',
      image: null,
    },
    {
      id: 2,
      date: '8월 5주차',
      title: '미션2',
      subtitle: '가족과 함께 저녁 식사',
      image: null,
    },
    {
      id: 3,
      date: '9월 1주차',
      title: '미션3',
      subtitle: '좋아하는 노래 듣기',
      image: null,
    },
    {
      id: 4,
      date: '9월 2주차',
      title: '미션4',
      subtitle: '좋아하는 책 읽기',
      image: null,
    },
    {
      id: 5,
      date: '9월 3주차',
      title: '미션5',
      subtitle: '친구와 통화하기',
      image: null,
    },
  ];

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !isAnimating,
      onMoveShouldSetPanResponder: () => !isAnimating,
      onPanResponderMove: (_, gestureState) => {
        if (!isAnimating) {
          translateX.setValue(gestureState.dx * 0.5); // 드래그 감도 조절
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        const velocity = gestureState.vx;
        const swipeThreshold = 30;
        const velocityThreshold = 0.3;

        if ((gestureState.dx < -swipeThreshold || velocity < -velocityThreshold) && activeIndex < memories.length - 1) {
          // Swipe left - next
          handleNext();
        } else if ((gestureState.dx > swipeThreshold || velocity > velocityThreshold) && activeIndex > 0) {
          // Swipe right - previous
          handlePrev();
        } else {
          // Snap back with spring
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
            tension: 40,
            friction: 8,
          }).start();
        }
      },
    })
  ).current;

  const handleNext = () => {
    if (activeIndex < memories.length - 1 && !isAnimating) {
      setIsAnimating(true);

      Animated.timing(translateX, {
        toValue: -screenWidth * 0.8,
        duration: 300,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }).start(() => {
        setActiveIndex(activeIndex + 1);

        // 즉시 반대편에서 시작
        translateX.setValue(screenWidth * 0.2);

        // 부드럽게 제자리로
        Animated.timing(translateX, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
          easing: Easing.out(Easing.cubic),
        }).start(() => {
          setIsAnimating(false);
        });
      });
    }
  };

  const handlePrev = () => {
    if (activeIndex > 0 && !isAnimating) {
      setIsAnimating(true);

      Animated.timing(translateX, {
        toValue: screenWidth * 0.8,
        duration: 300,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }).start(() => {
        setActiveIndex(activeIndex - 1);

        // 즉시 반대편에서 시작
        translateX.setValue(-screenWidth * 0.2);

        // 부드럽게 제자리로
        Animated.timing(translateX, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
          easing: Easing.out(Easing.cubic),
        }).start(() => {
          setIsAnimating(false);
        });
      });
    }
  };

  const getCardStyle = (index: number) => {
    const position = index - activeIndex;

    if (position < -2 || position > 2) {
      return styles.hiddenCard;
    }

    switch (position) {
      case -2:
        return styles.prevCard2;
      case -1:
        return styles.prevCard1;
      case 0:
        return styles.activeCard;
      case 1:
        return styles.middleCard;
      case 2:
        return styles.bottomCard;
      default:
        return styles.hiddenCard;
    }
  };

  const getCardTransform = (index: number) => {
    const position = index - activeIndex;

    const scale = translateX.interpolate({
      inputRange: [-screenWidth, -screenWidth/2, 0, screenWidth/2, screenWidth],
      outputRange: position === -2 ? [0.78, 0.76, 0.75, 0.77, 0.8] :
                    position === -1 ? [0.9, 0.87, 0.85, 0.88, 0.92] :
                    position === 0 ? [1.05, 1.02, 1, 0.98, 0.95] :
                    position === 1 ? [0.92, 0.9, 0.88, 0.86, 0.84] :
                    position === 2 ? [0.82, 0.8, 0.78, 0.76, 0.74] : [0.7, 0.7, 0.7, 0.7, 0.7],
      extrapolate: 'clamp',
    });

    const translateXCard = translateX.interpolate({
      inputRange: [-screenWidth, -screenWidth/2, 0, screenWidth/2, screenWidth],
      outputRange: position === -2 ? [-70, -65, -80, -55, -50] :
                    position === -1 ? [-45, -40, -45, -30, -25] :
                    position === 0 ? [-30, -15, 0, 15, 30] :
                    position === 1 ? [0, 12, 45, 37, 50] :
                    position === 2 ? [25, 37, 80, 62, 75] : [0, 0, 0, 0, 0],
      extrapolate: 'clamp',
    });

    const rotateY = translateX.interpolate({
      inputRange: [-screenWidth, -screenWidth/2, 0, screenWidth/2, screenWidth],
      outputRange: position === 0 ? ['-25deg', '-12deg', '0deg', '12deg', '25deg'] :
                    position === 1 ? ['-10deg', '-5deg', '0deg', '5deg', '10deg'] :
                    position === -1 ? ['10deg', '5deg', '0deg', '-5deg', '-10deg'] :
                    ['0deg', '0deg', '0deg', '0deg', '0deg'],
      extrapolate: 'clamp',
    });

    const rotateZ = translateX.interpolate({
      inputRange: [-screenWidth, -screenWidth/2, 0, screenWidth/2, screenWidth],
      outputRange: position === 0 ? ['3deg', '1.5deg', '0deg', '-1.5deg', '-3deg'] :
                    position === 1 ? ['2deg', '1deg', '0deg', '-1deg', '-2deg'] :
                    position === -1 ? ['-2deg', '-1deg', '0deg', '1deg', '2deg'] :
                    ['0deg', '0deg', '0deg', '0deg', '0deg'],
      extrapolate: 'clamp',
    });

    const opacity = translateX.interpolate({
      inputRange: [-screenWidth, -screenWidth/2, 0, screenWidth/2, screenWidth],
      outputRange: position === -2 ? [0.85, 0.8, 0.75, 0.7, 0.65] :
                    position === -1 ? [0.95, 0.92, 0.9, 0.85, 0.8] :
                    position === 0 ? [1, 1, 1, 1, 0.95] :
                    position === 1 ? [1, 0.98, 0.95, 0.92, 0.9] :
                    position === 2 ? [0.9, 0.85, 0.8, 0.75, 0.7] :
                    position < -2 ? [0, 0, 0, 0, 0] : [1, 1, 1, 1, 1],
      extrapolate: 'clamp',
    });

    const translateY = translateX.interpolate({
      inputRange: [-screenWidth, -screenWidth/2, 0, screenWidth/2, screenWidth],
      outputRange: position === 0 ? [-5, -2, 0, -2, -5] :
                    position === 1 ? [5, 2, 0, 2, 5] :
                    position === -1 ? [5, 2, 0, 2, 5] :
                    [0, 0, 0, 0, 0],
      extrapolate: 'clamp',
    });

    return {
      transform: [
        { perspective: 1200 },
        { translateY },
        { scale },
        { translateX: translateXCard },
        { rotateY },
        { rotateZ },
      ],
      opacity,
    };
  };

  return (
    <View style={styles.container}>
      <Text style={[typography.B1_BOLD, styles.title]}>지난주 메모리</Text>

      <View style={styles.carouselWrapper}>
        <View style={styles.carouselContainer} {...panResponder.panHandlers}>
        <View style={styles.cardsWrapper}>
          {memories.map((memory, index) => {
            const cardStyle = getCardStyle(index);
            const animatedStyle = getCardTransform(index);
            const position = index - activeIndex;
            const isVisible = position >= -1 && position <= 2;
            const zIndex = position === 0 ? 4 :
                          position === 1 ? 3 :
                          position === 2 ? 2 :
                          position === -1 ? 1 : 0;

            return (
              <Animated.View
                key={memory.id}
                style={[
                  styles.memoryCard,
                  cardStyle,
                  animatedStyle,
                  { zIndex },
                  !isVisible && styles.hiddenCard,
                ]}
              >
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
              </Animated.View>
            );
          })}
        </View>

        {/* Navigation buttons */}
        {activeIndex > 0 && (
          <TouchableOpacity
            style={[styles.navButton, styles.prevButton]}
            onPress={handlePrev}
          >
            <Ionicons name="chevron-back" size={24} color={colors.BLACKTEXT} />
          </TouchableOpacity>
        )}

        {activeIndex < memories.length - 1 && (
          <TouchableOpacity
            style={[styles.navButton, styles.nextButton]}
            onPress={handleNext}
          >
            <Ionicons name="chevron-forward" size={24} color={colors.BLACKTEXT} />
          </TouchableOpacity>
        )}
      </View>
      </View>

      {/* Pagination dots */}
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
    backgroundColor: colors.WHITE,
    borderRadius: 12,
    marginHorizontal: 20,
    paddingVertical: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  title: {
    color: colors.BLACKTEXT,
    marginBottom: 16,
    marginHorizontal: 20,
    textAlign: 'center',
  },
  carouselWrapper: {
    overflow: 'hidden', // container 밖으로 나가지 않도록
  },
  carouselContainer: {
    height: CARD_HEIGHT + 50,
    position: 'relative',
    overflow: 'visible',
    
  },
  cardsWrapper: {
    flex: 1,
    position: 'relative',
  },
  memoryCard: {
    position: 'absolute',
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    left: ((screenWidth - CONTAINER_PADDING) - CARD_WIDTH) / 2, // 컨테이너 중앙
    top: 20,
  },
  prevCard2: {
    transform: [
      { scale: 0.6 },
      { translateX: -60 },
    ],
  },
  prevCard1: {
    transform: [
      { scale: 0.85 },
      { translateX: -35 },
    ],
  },
  bottomCard: {
    transform: [
      { scale: 0.7 },
      { translateX: 50 },
    ],
  },
  middleCard: {
    transform: [
      { scale: 0.88 },
      { translateX: 25 },
    ],
  },
  activeCard: {
    transform: [
      { scale: 1 },
      { translateX: 0 },
    ],
  },
  hiddenCard: {
    opacity: 0,
    pointerEvents: 'none',
  },
  imageContainer: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: colors.GRAY_200,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
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
  navButton: {
    position: 'absolute',
    top: CARD_HEIGHT / 2,
    backgroundColor: colors.WHITE,
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
    zIndex: 10,
  },
  prevButton: {
    left: 20,
  },
  nextButton: {
    right: 20,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 8,
    marginHorizontal: 20,
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
