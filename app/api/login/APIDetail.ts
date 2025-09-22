import { APIRequest, HTTP_METHOD } from "../APIRequest";
import { LoginRequest, LoginResponse, SignUpRequest, SignUpResponse } from "./entity";

// 회원가입
export class PostSignUp<R extends SignUpResponse> implements APIRequest<R> {
  method = HTTP_METHOD.POST;
  path: string
  response!: R;
  auth = false;

  constructor(public data: SignUpRequest) {
    this.path = `user/signup/`;
  }
}

// 로그인
export class PostLogin implements APIRequest<LoginResponse> {
  method = HTTP_METHOD.POST;
  path = 'user/login/';
  response!: LoginResponse;
  auth = false;

  constructor(public data: LoginRequest) { }
}
