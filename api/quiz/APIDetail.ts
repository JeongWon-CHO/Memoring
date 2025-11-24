import { APIRequest, HTTP_METHOD } from "../APIRequest";
import { SelectMissionRequest, SelectMissionResponse, ShowQuizResponse } from "./entity";

// POST  api/v1/quizzes/{quizSetId}/results (퀴즈 결과 저장)
export class PostSelectMissionResponse<R extends SelectMissionResponse> implements APIRequest<R> {
  method = HTTP_METHOD.POST;
  path: string;
  response!: R;
  data: SelectMissionRequest;
  auth = true;
  authorization?: string;

  constructor(quizSetId: number, body: SelectMissionRequest, token?: string) {
    this.path = `api/v1/quizzes/${quizSetId}/results`;
    this.data = body;
    this.authorization = token;
  }
}

// GET  api/v1/quizzes (퀴즈 세트 조회)
export class GetShowQuizResponse<R extends ShowQuizResponse> implements APIRequest<R> {
  method = HTTP_METHOD.POST;
  path = 'api/v1/quizzes';
  response!: R;
  auth = true;
  authorization?: string;

  constructor(token?: string) {
    this.authorization = token;
  }
}
