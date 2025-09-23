import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

interface MissionCardProps {
  dayTime?: {
    day: string;
    time: string;
  };
  missionText: string;
  highlightDayTime?: boolean;
}

export default function MissionCard({ dayTime, missionText, highlightDayTime = false }: MissionCardProps) {
  return (
    <View style={styles.container}>
      {dayTime && highlightDayTime ? (
        <>
          <Text style={[typography.B1, styles.text]}>
            <Text style={styles.highlightText}>{dayTime.day} {dayTime.time}</Text>에{' '}
            {missionText}
          </Text>
        </>
      ) : (
        <Text style={[typography.B1, styles.text]}>
          {dayTime ? (
            <>
              _________{' '}에{' '}
              {missionText}
            </>
          ) : (
            missionText
          )}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.WHITE,
    borderRadius: 12,
    padding: 40,
    marginTop: 20,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  text: {
    color: colors.GRAY_700,
    lineHeight: 24,
  },
  highlightText: {
    color: colors.ORANGE_600,
    fontWeight: '600',
  },
});
