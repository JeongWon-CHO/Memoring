import { useTokenStore } from '@/store/tokenStore';
import { useMutation } from '@tanstack/react-query';
import * as SecureStore from 'expo-secure-store';
// import * as Crypto from 'expo-crypto';
import { postLogin } from '../api/auth/index';
import { showToast } from '../utills/showToast';

// const sha256 = async (text: string) => {
//   return await Crypto.digestStringAsync(
//     Crypto.CryptoDigestAlgorithm.SHA256,
//     text
//   );
// };

export const useLogin = () => {
  const { setToken, setRefreshToken } = useTokenStore();

  const mutation = useMutation({
    mutationFn: postLogin,
    onSuccess: async data => {
      await SecureStore.setItemAsync('authToken', data.accessToken);
      await SecureStore.setItemAsync('refreshToken', data.refreshToken);

      setToken(data.accessToken);
      setRefreshToken(data.refreshToken);

      showToast('success', '로그인 성공!');
    },
    onError: () => {
      showToast('error', '로그인 실패');
    },
  });

  const login = async ({ loginId, loginPw }: { loginId: string; loginPw: string }) => {
    if (!loginId) return showToast('error', '아이디를 입력해주세요');
    if (!loginPw) return showToast('error', '비밀번호를 입력해주세요');

    console.log(`loginId: ${loginId}  loginPw: ${loginPw}`);

    return mutation.mutateAsync({
      username: loginId,
      password: loginPw,
    });
  };

  return login;
};
