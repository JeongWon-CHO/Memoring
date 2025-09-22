import type { APIResponse } from '../APIResponse';

// 음성 업로드 응답
export interface UploadRecordResponse extends APIResponse {
  mission_id: number;
  voice_url: string;
}

// 음성 재생 응답
export interface PlayRecordResponse extends APIResponse {
  voice_url: string;
}

// 미션 후보 목록 (랜덤 3개)
export interface MissionCandidate {
  id: number;
  content: string;
}

export interface MissionCandidatesResponse extends APIResponse {
  candidates: MissionCandidate[];
}

// 미션 선택 요청
export interface SelectMissionRequest {
  mission_id: number;
}

// 미션 선택 응답
export interface SelectMissionResponse extends APIResponse {
  mission_id: number;
  status: string;
}

// 일정 설정 요청/응답
export interface MissionScheduleRequest {
  scheduled_at: string;        // "2025-09-22T08:00:00+09:00"
  alarm_offset_minutes: number; // 0,5,10,15,30,60 ...
}

export interface MissionScheduleResponse extends APIResponse {
  mission_id: number;
  scheduled_at: string;
  alarm_offset_minutes: number;
}

// 메인화면에 보여주는 미션 정보
export interface CurrentMissionPayload {
  id: number;
  title: string;
  description: string;
  scheduled_at: string | null;
  alarm_offset_minutes: number;
  voice_uploaded: boolean;
  completed: boolean;
  listenable: boolean;
}

export interface GetCurrentMissionResponse extends APIResponse {
  has_mission: boolean;
  mission?: CurrentMissionPayload | null;
}
