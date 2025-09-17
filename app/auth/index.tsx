import { Link } from "expo-router";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AuthScreen () {
  return(
    <SafeAreaView style={styles.container}>
      <View style={styles.buttonContainer}>
        <Link href={"/auth/signup"} style={styles.signupText}>이메일로 가입하기</Link>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  logo: {
    width: 112,
    height: 112,
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 2,
  },
  signupText: {
    textAlign: 'center',
    textDecorationLine: 'underline',
    marginTop: 20,
  },
  buttonContainer: {
    paddingHorizontal: 32,
    flex: 1,
  },
})
