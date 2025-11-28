import { colors } from "@/constants/colors";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface MissionCardProps {
  content: string;
  day: string;
  time: string;
  imgURL: string;
}

export default function MissionCard({ content, day, time, imgURL }: MissionCardProps) {
  return (
    <TouchableOpacity style={styles.container} onPress={() => {}}>
        <Image source={require('../../assets/images/mission1.jpg')} style={styles.img} /> {/* 이거 나중에 requir을 이용해서 url로 받아야 됨 */}
        
        <View style={styles.contentContainer}>
          <View style={styles.textContainer}>
            <Text style={styles.text}>{content}</Text>
          </View>

          <View style={styles.scheduleContainer}>
            <Text style={styles.schedule}>{day}</Text>
            <Text style={styles.schedule}>{time}</Text>
          </View>       
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    paddingVertical: 10,
    paddingHorizontal: 12,
    flexDirection: 'row',
    gap: 16,
  },
  imgContainer: {
    flexDirection: 'row',
    gap: 4,
  },
  contentContainer: {
    gap: 4,
  },
  img: {
    width: 75,
    height: '100%',
  },
  textContainer: {
    width: 250,
  },
  text: {
    fontSize: 16,
  },
  scheduleContainer: {
    gap: 8,
    flexDirection: 'row',
  },
  schedule: {
    backgroundColor: '#6D717F',
    borderRadius: 6,
    color: colors.WHITE,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
})

// import { colors } from '@/constants/colors';
// import { typography } from '@/constants/typography';
// import React from 'react';
// import {
//   StyleSheet,
//   Text,
//   View,
// } from 'react-native';

// interface MissionCardProps {
//   dayTime?: {
//     day: string;
//     time: string;
//   };
//   missionText: string;
//   highlightDayTime?: boolean;
// }

// export default function MissionCard({ dayTime, missionText, highlightDayTime = false }: MissionCardProps) {
//   return (
//     <View style={styles.container}>
//       {dayTime && highlightDayTime ? (
//         <>
//           <Text style={[typography.B1, styles.text]}>
//             <Text style={styles.highlightText}>{dayTime.day} {dayTime.time}</Text>에{' '}
//             {missionText}
//           </Text>
//         </>
//       ) : (
//         <Text style={[typography.B1, styles.text]}>
//           {dayTime ? (
//             <>
//               _________{' '}에{' '}
//               {missionText}
//             </>
//           ) : (
//             missionText
//           )}
//         </Text>
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     backgroundColor: colors.WHITE,
//     borderRadius: 12,
//     padding: 40,
//     marginTop: 20,
//     marginBottom: 32,
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.05,
//     shadowRadius: 3,
//     elevation: 2,
//   },
//   text: {
//     color: colors.GRAY_700,
//     lineHeight: 24,
//   },
//   highlightText: {
//     color: colors.ORANGE_600,
//     fontWeight: '600',
//   },
// });
