import { APIRequest, HTTP_METHOD } from '../APIRequest';
import {
  CancelMissionResponse,
  MissionListResponse,
  PlayRecordResponse,
  SelectMissionRequest,
  SelectMissionResponse,
  ShowMissionResponse,
  UploadRecordResponse
} from './entity';

// GET  api/v1/record (녹음 재생 URL 조회)
export class GetPlayRecord<R extends PlayRecordResponse> implements APIRequest<R> {
  method = HTTP_METHOD.GET;
  path: string;
  response!: R;

  constructor(public id: number) {
    this.path = `api/v1/record`;
  }
}

// POST  api/v1/record (녹음 업로드)
export class PostUploadRecord<R extends UploadRecordResponse> implements APIRequest<R> {
  method = HTTP_METHOD.POST;
  path: string;
  response!: R;
  data: FormData;
  headers = { 'Content-Type': 'multipart/form-data' };

  constructor(public id: number, fileUri: string, fileName: string = 'recording.m4a') {
    this.path = `api/v1/record`;
    this.data = new FormData();
    // React Native에서 파일 업로드를 위한 형식
    this.data.append('file', {
      uri: fileUri,
      type: 'audio/m4a',
      name: fileName,
    } as any);
  }
}

// GET  api/v1/mission (미션 목록 조회)
export class GetMissionList<R extends MissionListResponse> implements APIRequest<R> {
  method = HTTP_METHOD.GET;
  path = 'api/v1/mission';
  response!: R;
  auth = true;
  authorization?: string;

  constructor(token?: string) {
    this.authorization = token;
  }
}

// POST  api/v1/mission (미션 선택)
export class PostSelectMission<R extends SelectMissionResponse> implements APIRequest<R> {
  method = HTTP_METHOD.POST;
  path = 'api/v1/mission';
  response!: R;
  auth = true;
  authorization?: string;
  data: SelectMissionRequest;

  constructor(missionId: number, token?: string) {
    this.data = { missionId };
    this.authorization = token;
  }
}

// DELETE  api/v1/mission (미션 취소)
export class DeleteSelectMission<R extends CancelMissionResponse> implements APIRequest<R> {
  method = HTTP_METHOD.DELETE;
  path = 'api/v1/mission';
  response!: R;
  auth = true;
  authorization?: string;

  constructor(token?: string) {
    this.authorization = token;
  }
}

// GET  api/v1/mission/selected (사용자 미션 조회)
export class GetShowMission<R extends ShowMissionResponse> implements APIRequest<R> {
  method = HTTP_METHOD.GET;
  path = 'api/v1/mission/selected';
  response!: R;
  auth = true;
  authorization?: string;

  constructor(token?: string) {
    this.authorization = token;
  }
}

// // PATCH /missions/{user_mission_id}/schedule/
// export class PatchMissionSchedule<R extends MissionScheduleResponse> implements APIRequest<R> {
//   method = HTTP_METHOD.PATCH;
//   path: string;
//   response!: R;
//   data: MissionScheduleRequest;
//   auth = true;

//   constructor(userMissionId: number, body: MissionScheduleRequest) {
//     this.path = `missions/${userMissionId}/schedule/`;
//     this.data = body;
//   }
// }

// // GET /missions/current/
// export class GetCurrentMission<R extends GetCurrentMissionResponse> implements APIRequest<R> {
//   method = HTTP_METHOD.GET;
//   path = 'missions/current/';
//   response!: R;
//   auth = true;
// }

// // POST /missions/{user_mission_id}/giveup/
// export class PostGiveUpMission<R extends GiveUpMissionResponse> implements APIRequest<R> {
//   method = HTTP_METHOD.POST;
//   path: string;
//   response!: R;
//   auth = true;

//   constructor(user_mission_id: number) {
//     this.path = `missions/${user_mission_id}/giveup/`;
//   }
// }
