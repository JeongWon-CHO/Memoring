import { APIResponse } from "../APIResponse";

// 회원가입
export interface SignUpResponse extends APIResponse {
  message: string;
  token: string;
  role: "Staff" | "Club" | "Major";
  name: string;
}

export interface SignUpRequest {
  username: string;
  id: string;
  password: string;
  password_confirm: string;
}

// 로그인
export interface LoginResponse extends APIResponse {
  user_id: number;
  username: string;
  id: string;
}

export interface LoginRequest {
  id: string;
  password: string;
}

// 내 정보
export interface UserInfoResponse extends APIResponse {
  user_id: number;
  username: string;
  id: string;
}
