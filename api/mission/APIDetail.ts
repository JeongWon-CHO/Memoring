import { APIRequest, HTTP_METHOD } from '../APIRequest';
import {
  GetCurrentMissionResponse,
  GiveUpMissionResponse,
  MissionCandidatesResponse,
  MissionScheduleRequest,
  MissionScheduleResponse,
  PlayRecordResponse,
  SelectMissionRequest,
  SelectMissionResponse,
  UploadRecordResponse
} from './entity';

export class PostUploadRecord<R extends UploadRecordResponse> implements APIRequest<R> {
  method = HTTP_METHOD.POST;
  path: string;
  response!: R;
  data: FormData;
  headers = { 'Content-Type': 'multipart/form-data' };

  constructor(public id: number, fileUri: string, fileName: string = 'recording.m4a') {
    this.path = `missions/${id}/voice/`;
    this.data = new FormData();
    // React Native에서 파일 업로드를 위한 형식
    this.data.append('file', {
      uri: fileUri,
      type: 'audio/m4a',
      name: fileName,
    } as any);
  }
}

export class GetPlayRecord<R extends PlayRecordResponse> implements APIRequest<R> {
  method = HTTP_METHOD.GET;
  path: string;
  response!: R;

  constructor(public id: number) {
    this.path = `missions/${id}/voice/`;
  }
}

// 미션 후보 목록 조회 (GET /missions/candidates/)
export class GetMissionCandidates<R extends MissionCandidatesResponse> implements APIRequest<R> {
  method = HTTP_METHOD.GET;
  path = 'missions/candidates/';
  response!: R;
  auth = true;
  authorization?: string;
  constructor(token?: string) {
    this.authorization = token;
  }
}

// 미션 선택 (POST /missions/select/)
export class PostSelectMission<R extends SelectMissionResponse> implements APIRequest<R> {
  method = HTTP_METHOD.POST;
  path = 'missions/select/';
  response!: R;
  auth = true;
  data: SelectMissionRequest;

  constructor(missionId: number) {
    this.data = { mission_id: missionId };
  }
}

// PATCH /missions/{user_mission_id}/schedule/
export class PatchMissionSchedule<R extends MissionScheduleResponse> implements APIRequest<R> {
  method = HTTP_METHOD.PATCH;
  path: string;
  response!: R;
  data: MissionScheduleRequest;
  auth = true;

  constructor(userMissionId: number, body: MissionScheduleRequest) {
    this.path = `missions/${userMissionId}/schedule/`;
    this.data = body;
  }
}

// GET /missions/current/
export class GetCurrentMission<R extends GetCurrentMissionResponse> implements APIRequest<R> {
  method = HTTP_METHOD.GET;
  path = 'missions/current/';
  response!: R;
  auth = true;
}

// POST /missions/{user_mission_id}/giveup/
export class PostGiveUpMission<R extends GiveUpMissionResponse> implements APIRequest<R> {
  method = HTTP_METHOD.POST;
  path: string;
  response!: R;
  auth = true;

  constructor(user_mission_id: number) {
    this.path = `missions/${user_mission_id}/giveup/`;
  }
}
