import APIClient from '../apiClient';
import {
  GetUserInfo,
  PostLogin,
  PostSignUp,
} from './APIDetail';

// 회원가입
export const postSignup = APIClient.of(PostSignUp);

// 로그인
export const postLogin = APIClient.of(PostLogin);

// 내정보
export const getUserMe = APIClient.of(GetUserInfo);
