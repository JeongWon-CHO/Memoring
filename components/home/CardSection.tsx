import { colors } from '@/constants/colors';
import Feather from '@expo/vector-icons/Feather';
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface CardSectionProps {
  title: string;
  content1: string;
  content2: string;
  onClick: () => void;
}

export default function CardSection({ title, content1, content2, onClick }: CardSectionProps) {

  return (
    <TouchableOpacity  style={styles.container} onPress={onClick}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{title}</Text>
        <Feather name="arrow-right" size={24} color="black" />
      </View>

      <View style={styles.content}>
        <Text style={styles.contentDetail}>{content1}</Text>
        <Text style={styles.contentDetail}>{content2}</Text>
      </View>
    </TouchableOpacity>
    
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 14,
    padding: 32,
    marginHorizontal:20,
    backgroundColor: 'white',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    color: colors.BLACKTEXT,
    fontSize: 24,
    fontWeight: 600,
  },
  content: {
    marginTop: 12,
    gap: 2,
  },
  contentDetail: {
    color: colors.GRAY_500,
    fontSize: 18,
  },
});
