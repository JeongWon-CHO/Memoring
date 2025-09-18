import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import {
  Dimensions,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

export default function AdBanner() {
  // TODO: 실제 광고 데이터는 API에서 가져오기
  const ads = [
    {
      id: 1,
      title: '노인치매안심센터',
      image: null, // 실제 이미지 URL
    },
    {
      id: 2,
      title: '노인치매안심센터2',
      image: null,
    },
    {
      id: 3,
      title: '노인치매안심센터3',
      image: null,
    },
  ];

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        style={styles.scrollView}
      >
        {ads.map((ad) => (
          <View key={ad.id} style={styles.adCard}>
            <View style={styles.imageContainer}>
              {ad.image ? (
                <Image source={{ uri: ad.image }} style={styles.adImage} />
              ) : (
                <View style={styles.placeholderImage}>
                  <Text style={styles.placeholderText}>광고 이미지</Text>
                </View>
              )}
              <LinearGradient
                colors={['rgba(0, 0, 0, 0.2)', 'rgba(0, 0, 0, 0.9)']}
                style={styles.gradientOverlay}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
              >
                <View style={styles.textOverlay}>
                  <Text style={[typography.H5, styles.adTitle]}>{ad.title}</Text>
                  <Pressable>
                    <Text style={[typography.C1, styles.adSubtitle]}>더보기 &gt; </Text>
                  </Pressable>
                </View>
              </LinearGradient>
            </View>
            <View style={styles.pagination}>
              <View style={styles.dot} />
              <View style={[styles.dot, styles.inactiveDot]} />
              <View style={[styles.dot, styles.inactiveDot]} />
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    marginHorizontal: 20,
  },
  scrollView: {
    flexGrow: 0,
  },
  adCard: {
    width: screenWidth - 40,
    height: 102,
    flexDirection: 'row',
  },
  imageContainer: {
    flex: 1,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: colors.GRAY_200,
  },
  adImage: {
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
    fontSize: 16,
  },
  gradientOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '100%',
    justifyContent: 'flex-end',
  },
  textOverlay: {
    paddingBottom: 10,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  adTitle: {
    color: colors.WHITE,
    marginBottom: 4,
  },
  adSubtitle: {
    color: colors.WHITE,
    marginLeft: 10,
    marginBottom: 4,
  },
  pagination: {
    position: 'absolute',
    bottom: 16,
    right: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 12,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.BG,
    marginHorizontal: 4,
  },
  inactiveDot: {
    backgroundColor: colors.GRAY_500,
  },
});