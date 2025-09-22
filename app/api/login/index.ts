import APIClient from '../apiClient';
import {
  PostLogin,
  PostSignUp,
} from './APIDetail';

// 회원가입
export const postSignup = APIClient.of(PostSignUp);

// 로그인
export const postLogin = APIClient.of(PostLogin);
