import { colors } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { postLogin } from '@/app/api/login';
import * as SecureStore from 'expo-secure-store';

export default function LoginScreen() {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [autoLogin, setAutoLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!id || !password) {
      Alert.alert('알림', '아이디와 비밀번호를 입력해주세요.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await postLogin({
        id,
        password,
      });

      // 자동 로그인 설정 저장
      if (autoLogin) {
        await SecureStore.setItemAsync('autoLogin', 'true');
        await SecureStore.setItemAsync('userId', id);
      }

      // 로그인 성공 시 메인 화면으로 이동
      router.replace('/(tabs)');
    } catch (error: any) {
      console.error('Login error:', error);
      if (error.status === 401) {
        Alert.alert('로그인 실패', '아이디 또는 비밀번호가 일치하지 않습니다.');
      } else if (error.status === 404) {
        Alert.alert('로그인 실패', '존재하지 않는 계정입니다.');
      } else {
        Alert.alert('로그인 실패', '로그인에 실패했습니다. 다시 시도해주세요.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = () => {
    router.push('/auth/signup');
  };

  const handleSNSLogin = (provider: string) => {
    console.log(`${provider} 로그인`);
    // TODO: SNS 로그인 구현
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardView}
        >
          <View style={styles.content}>
            {/* Logo Section */}
            <View style={styles.logoSection}>
              <Text style={styles.logoTitle}>Memoring</Text>
              <Text style={styles.logoSubtitle}>LOGO</Text>
            </View>

            {/* Login Form */}
            <View style={styles.form}>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="아이디 입력"
                  placeholderTextColor={colors.GRAY_500}
                  value={id}
                  onChangeText={setId}
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.inputContainer}>
                <View style={styles.passwordInputWrapper}>
                  <TextInput
                    style={styles.passwordInput}
                    placeholder="비밀번호 입력"
                    placeholderTextColor={colors.GRAY_500}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.eyeIcon}
                  >
                    <Ionicons
                      name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                      size={20}
                      color={colors.GRAY_500}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Auto Login Checkbox */}
              <TouchableOpacity
                style={styles.autoLoginContainer}
                onPress={() => setAutoLogin(!autoLogin)}
                activeOpacity={0.7}
              >
                <View style={[styles.checkbox, autoLogin && styles.checkboxChecked]}>
                  {autoLogin && (
                    <Ionicons name="checkmark" size={16} color={colors.WHITE} />
                  )}
                </View>
                <Text style={styles.autoLoginText}>자동 로그인하기</Text>
              </TouchableOpacity>

              {/* Login Button */}
              <TouchableOpacity
                style={[styles.loginButton, isLoading && styles.disabledButton]}
                onPress={handleLogin}
                activeOpacity={0.8}
                disabled={isLoading}
              >
                <Text style={styles.loginButtonText}>{isLoading ? '로그인 중...' : '로그인'}</Text>
              </TouchableOpacity>

              {/* Links */}
              <View style={styles.linksContainer}>
                <TouchableOpacity>
                  <Text style={styles.linkText}>아이디 찾기</Text>
                </TouchableOpacity>
                <Text style={styles.linkSeparator}>·</Text>
                <TouchableOpacity>
                  <Text style={styles.linkText}>비밀번호 찾기</Text>
                </TouchableOpacity>
              </View>

              {/* Sign Up Button */}
              <TouchableOpacity
                style={styles.signupButton}
                onPress={handleSignup}
                activeOpacity={0.8}
              >
                <Text style={styles.signupButtonText}>회원가입</Text>
                <View style={styles.SignUpUnderline} />
              </TouchableOpacity>

              {/* SNS Login Section */}
              {/* <View style={styles.snsSection}>
                <Text style={styles.snsTitle}>SNS 계정으로 로그인</Text>
                <View style={styles.snsButtons}>
                  <TouchableOpacity
                    style={styles.snsButton}
                    onPress={() => handleSNSLogin('Google')}
                  >
                    <View style={[styles.snsIconWrapper, { backgroundColor: '#fff' }]}>
                      <Text style={{ fontSize: 20 }}>G</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.snsButton}
                    onPress={() => handleSNSLogin('KakaoTalk')}
                  >
                    <View style={[styles.snsIconWrapper, { backgroundColor: '#FEE500' }]}>
                      <Ionicons name="chatbubble" size={20} color="#000" />
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.snsButton}
                    onPress={() => handleSNSLogin('Naver')}
                  >
                    <View style={[styles.snsIconWrapper, { backgroundColor: '#03C75A' }]}>
                      <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#fff' }}>N</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View> */}

              {/* Footer */}
              <TouchableOpacity style={styles.footer}>
                <Text style={styles.footerText}>보호자 회원가입</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.WHITE,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  logoSection: {
    alignItems: 'center',
    marginTop: 78,
    marginBottom: 76,
  },
  logoTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.BLACKTEXT,
  },
  logoSubtitle: {
    fontSize: 18,
    color: colors.BLACKTEXT,
    marginTop: 4,
  },
  form: {
    flex: 1,
    gap: 14,
  },
  inputContainer: {
    // marginBottom: 12,
  },
  input: {
    height: 52,
    borderWidth: 1,
    borderColor: colors.GRAY_200,
    borderRadius: 26,
    paddingHorizontal: 20,
    fontSize: 16,
    color: colors.BLACKTEXT,
    backgroundColor: colors.WHITE,
  },
  passwordInputWrapper: {
    position: 'relative',
  },
  passwordInput: {
    height: 52,
    borderWidth: 1,
    borderColor: colors.GRAY_200,
    borderRadius: 26,
    paddingHorizontal: 20,
    paddingRight: 50,
    fontSize: 16,
    color: colors.BLACKTEXT,
    backgroundColor: colors.WHITE,
  },
  eyeIcon: {
    position: 'absolute',
    right: 20,
    top: 16,
  },
  autoLoginContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 20,
    paddingLeft: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: colors.GRAY_300,
    borderRadius: 4,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: colors.MAIN,
    borderColor: colors.MAIN,
  },
  autoLoginText: {
    fontSize: 14,
    color: colors.GRAY_600,
  },
  loginButton: {
    height: 50,
    backgroundColor: colors.MAIN,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  loginButtonText: {
    color: colors.WHITE,
    fontSize: 18,
    fontWeight: '600',
  },
  disabledButton: {
    opacity: 0.6,
  },
  linksContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  linkText: {
    fontSize: 14,
    color: colors.BLACK,
  },
  linkSeparator: {
    marginHorizontal: 12,
    color: colors.GRAY_400,
  },
  signupButton: {
    height: 52,
    borderColor: colors.BLACKTEXT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  signupButtonText: {
    color: colors.BLACKTEXT,
    fontSize: 18,
    fontWeight: '600',
  },
  snsSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  snsTitle: {
    fontSize: 14,
    color: colors.GRAY_500,
    marginBottom: 20,
  },
  snsButtons: {
    flexDirection: 'row',
    gap: 20,
  },
  snsButton: {
    marginHorizontal: 10,
  },
  snsIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  footer: {
    alignItems: 'center',
    marginTop: 90,
    marginBottom: 30,
    color: colors.TEXT,
  },
  footerText: {
    fontSize: 16,
    color: colors.BLACKTEXT,
    fontWeight: '500',
  },
  SignUpUnderline: {
    width: 70,
    height: 2,
    backgroundColor: colors.BLACKTEXT,
    marginTop: 2,
  },
});