import { APIRequest, HTTP_METHOD } from "../APIRequest";
import { LoginRequest, LoginResponse, SignUpRequest, SignUpResponse, UserInfoResponse } from "./entity";

// POST /user/signup/ (회원가입)
export class PostSignUp<R extends SignUpResponse> implements APIRequest<R> {
  method = HTTP_METHOD.POST;
  path: string
  response!: R;
  auth = false;

  constructor(public data: SignUpRequest) {
    this.path = `user/signup/`;
  }
}

// POST /user/login/ (로그인)
export class PostLogin implements APIRequest<LoginResponse> {
  method = HTTP_METHOD.POST;
  path = 'user/login/';
  response!: LoginResponse;
  auth = false;

  constructor(public data: LoginRequest) { }
}

// GET /user/me/ (내 정보)
export class GetUserInfo<R extends UserInfoResponse> implements APIRequest<R> {
  method = HTTP_METHOD.GET;
  path = 'user/me/';
  response!: R;
  auth = true;

  // authorization?: string;
  // constructor(token?: string) {
  //   this.authorization = token;
  // }
}
