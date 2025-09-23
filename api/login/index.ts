import APIClient from '../apiClient';
import {
  GetUserInfo,
  PostLogin,
  PostLogout,
  PostSignUp,
} from './APIDetail';

// 회원가입
export const postSignup = APIClient.of(PostSignUp);

// 로그인
export const postLogin = APIClient.of(PostLogin);

// 로그아웃
export const postLogout = APIClient.of(PostLogout);

// 내정보
export const getUserMe = APIClient.of(GetUserInfo);
