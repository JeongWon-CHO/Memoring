import { APIRequest, HTTP_METHOD } from '../APIRequest';
import { APIResponse } from '../APIResponse';
import {
  LoginRequest,
  LoginResponse,
  RefreshRequest,
  RefreshResponse,
  SignUpRequest,
  SignUpResponse,
  UserInfoResponse,
} from './entity';

// POST /user/signup/ (회원가입)
export class PostSignUp<R extends SignUpResponse> implements APIRequest<R> {
  method = HTTP_METHOD.POST;
  path = 'api/v1/user/signup';
  response!: R;
  auth = false;

  constructor(public data: SignUpRequest) { }
}

// POST  api/v1/user/login (로그인)
export class PostLogin implements APIRequest<LoginResponse> {
  method = HTTP_METHOD.POST;
  path = 'api/v1/user/login';
  response!: LoginResponse;
  auth = false;

  constructor(public data: LoginRequest) { }
}

// POST  api/v1/user/logout (로그아웃)
export class PostLogout<R extends APIResponse> implements APIRequest<R> {
  method = HTTP_METHOD.POST;
  path = 'api/v1/user/logout'; // 끝에 슬래시 유지
  response!: R;
  auth = true;
  authorization?: string;

  constructor(token?: string) {
    this.authorization = token;
  }
}

// POST api/v1/user/refresh (액세스 토큰 재발급)
export class PostRefresh implements APIRequest<RefreshResponse> {
  method = HTTP_METHOD.POST;
  path = 'api/v1/user/refresh';
  response!: RefreshResponse;
  auth = false;

  constructor(public data: RefreshRequest) { }
}

// GET api/v1/user/me (내 정보)
export class GetUserInfo<R extends UserInfoResponse> implements APIRequest<R> {
  method = HTTP_METHOD.GET;
  path = 'api/v1/user/me';
  response!: R;
  auth = true;
  authorization?: string;

  constructor(token?: string) {
    this.authorization = token;
  }
}
