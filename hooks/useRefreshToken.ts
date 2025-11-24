import { useTokenStore } from '@/store/tokenStore';
import { useMutation } from '@tanstack/react-query';
import { postRefresh } from '../../../api/auth/index';

export const useRefreshToken = () => {
  const { refreshToken, setToken, setRefreshToken, clear } = useTokenStore();

  const mutation = useMutation({
    mutationFn: () =>
      postRefresh({
        refreshToken: refreshToken ?? '',
      }),

    onSuccess: (data) => {
      setToken(data.accessToken);
      setRefreshToken(data.refreshToken);
    },

    onError: () => {
      clear();   // refreshToken이 만료되었을 때 자동 로그아웃
    },
  });

  return mutation;
};
