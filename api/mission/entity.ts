import type { APIResponse } from '../APIResponse';

/* 

녹음 재생 URL 조회

*/

// 변경된 녹음 재생 URL 조회
export interface PlayRecordResponse extends APIResponse {
  recordId: number;
  playbackUrl: string;
  sizeBytes: number;
}

// 변경된 녹음 업로드
export interface UploadRecordResponse extends APIResponse {
  recordId: number;
  playbackUrl: string;
  sizeBytes: string;
}


/* 

미션 조회 및 선택 API

*/


// 변경된 미션 목록 조회
export interface MissionList {
  id: number;
  content: string;
}

export interface MissionListResponse extends APIResponse {
  list: MissionList[];
}

// 변경된 미션 선택
export interface SelectMissionRequest {
  missionId: number;
}

// 변경된 미션 선택 응답
export interface SelectMissionResponse extends APIResponse {
  mission_id: number;
}

// 변경된 미션 취소
export interface CancelMissionResponse extends APIResponse { }

// 변경된 사용자 미션 조회
export interface ShowMissionResponse extends APIResponse {
  missionId: number;
  content: string;
}


/* 

댓글 작성 및 삭제 API

*/

// 변경된 댓글 생성
export interface CreateCommentRequest {
  diaryId: number;
  content: string;
}

// 변경된 댓글 생성 응답
export interface CreateCommentResponse extends APIResponse {
  commentId: number;
  diaryId: number;
  userId: number;
  content: string;
  createdAt: string;
}

// 변경된 댓글 삭제
export interface DeleteCommentRequest {
  commentId: number;
}


// ========================= 수정 전 =========================



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

// 메인화면에 보여주는 미션 정보 status가 given_up이면 이 객체를 반환 안 함
export interface CurrentMissionPayload {
  id: number;
  title: string;
  description: string;
  scheduled_at: string | null;
  alarm_offset_minutes: number;
  voice_uploaded: boolean;
  completed: boolean;
  listenable: boolean;
  status: "IN_PROGRESS" | "COMPLETED";
}

export interface GetCurrentMissionResponse extends APIResponse {
  has_mission: boolean;
  mission?: CurrentMissionPayload | null;
}

// 미션 포기
export interface GiveUpMissionResponse extends APIResponse {
  mission_id: number;
  status: 'GIVEN_UP' | 'SELECTED';
}
