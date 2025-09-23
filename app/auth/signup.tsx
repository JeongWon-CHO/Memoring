import { postSignup } from '@/api/login';
import Header from '@/components/common/Header';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function SignupScreen() {
  const [username, setUsername] = useState('');
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async () => {
    // Basic validation
    if (!username || !id || !password || !passwordConfirm) {
      Alert.alert('알림', '모든 정보를 입력해주세요.');
      return;
    }

    if (password !== passwordConfirm) {
      Alert.alert('알림', '비밀번호가 일치하지 않습니다.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await postSignup({
        username,
        id,
        password,
        password_confirm: passwordConfirm,
      });

      // 토큰 저장
      if (response.token) {
        await SecureStore.setItemAsync('authToken', response.token);
      }

      Alert.alert('회원가입 완료', '회원가입이 완료되었습니다.', [
        {
          text: '확인',
          onPress: () => router.replace('/auth/login'),
        },
      ]);
    } catch (error: any) {
      console.error('Signup error:', error);
      if (error.status === 409) {
        Alert.alert('회원가입 실패', '이미 존재하는 아이디입니다.');
      } else if (error.status === 400) {
        Alert.alert('회원가입 실패', '입력한 정보를 다시 확인해주세요.');
      } else {
        Alert.alert('회원가입 실패', '회원가입에 실패했습니다. 다시 시도해주세요.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Header title='회원가입' />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={[typography.S2, styles.title]}>본인확인을 위해 </Text>
          <Text style={[typography.S2, styles.title]}>기본 정보를 입력해 주세요.</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={[typography.B2_BOLD, styles.label]}>이름</Text>
            <TextInput
              style={styles.input}
              placeholder="이름을 입력해 주세요."
              placeholderTextColor={colors.GRAY_400}
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[typography.B2_BOLD, styles.label]}>아이디</Text>
            <TextInput
              style={styles.input}
              placeholder="아이디를 입력해 주세요."
              placeholderTextColor={colors.GRAY_400}
              value={id}
              onChangeText={setId}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[typography.B2_BOLD, styles.label]}>비밀번호</Text>
            <TextInput
              style={styles.input}
              placeholder="비밀번호를 입력해 주세요."
              placeholderTextColor={colors.GRAY_400}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[typography.B2_BOLD, styles.label]}>비밀번호 확인</Text>
            <TextInput
              style={styles.input}
              placeholder="비밀번호를 다시 입력해 주세요."
              placeholderTextColor={colors.GRAY_400}
              value={passwordConfirm}
              onChangeText={setPasswordConfirm}
              secureTextEntry
              autoCapitalize="none"
            />
          </View>
        </View>

        <TouchableOpacity
          style={[
            styles.signupButton,
            ((!username || !id || !password || !passwordConfirm) || isLoading) && styles.disabledButton,
          ]}
          onPress={handleSignup}
          disabled={!username || !id || !password || !passwordConfirm || isLoading}
        >
          <Text style={styles.signupButtonText}>{isLoading ? '처리 중...' : '가입 완료'}</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.BG,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 40,
  },
  title: {
    
  },
  form: {
    marginBottom: 30,
  },
  inputGroup: {
    marginBottom: 30,
  },
  label: {
    color: colors.TEXT,
  },
  input: {
    borderBottomWidth: 1,
    borderColor: colors.GRAY_200,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: colors.TEXT,
    fontSize: 14,
  },
  signupButton: {
    backgroundColor: colors.MAIN,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 80,
  },
  disabledButton: {
    opacity: 0.5,
  },
  signupButtonText: {
    color: colors.WHITE,
  },
});
