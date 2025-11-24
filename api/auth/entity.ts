import { APIResponse } from "../APIResponse";

export type Emotion = 'HAPPY' | 'SAD' | 'ANGRY' | 'NEUTRAL';
export type Role = 'USER' | 'ADMIN';

// 변경된 회원가입
export interface SignUpResponse extends APIResponse {
  message: string;
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  username: string;
  accessTokenExpiresIn: number;
  refreshTokenExpiresIn: number;
}

export interface SignUpRequest {
  nickname: string;
  userName: string;
  password: string;
  passwordConfirm: string;
}

// 변경된 로그인
export interface LoginResponse extends APIResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  accessTokenExpiresIn: number;
  refreshTokenExpiresIn: number;
}

export interface LoginRequest {
  username: string;  // userId
  password: string;
}

// 변경된 액세스 토큰 재발급
export interface RefreshResponse extends APIResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  accessTokenExpiresIn: number;
  refreshTokenExpiresIn: number;
}

export interface RefreshRequest {
  refreshToken: string;
}


// 변경된 현재 사용자 정보 조회
export interface UserInfoResponse extends APIResponse {
  username: string;
  nickname: string;
  role: Role;
}
