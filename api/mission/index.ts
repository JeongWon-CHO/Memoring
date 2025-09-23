import APIClient from '../apiClient';
import {
  GetCurrentMission,
  GetMissionCandidates,
  GetPlayRecord,
  PatchMissionSchedule,
  PostGiveUpMission,
  PostSelectMission,
  PostUploadRecord
} from './APIDetail';

// 미션 관련 API
export const getMissionCandidates = APIClient.of(GetMissionCandidates);
export const postSelectMission = APIClient.of(PostSelectMission);
export const patchMissionSchedule = APIClient.of(PatchMissionSchedule);
export const getCurrentMission = APIClient.of(GetCurrentMission);
export const postGiveUpMission = APIClient.of(PostGiveUpMission);

// 음성 관련 API
export const postUploadRecord = APIClient.of(PostUploadRecord);
export const getPlayRecord = APIClient.of(GetPlayRecord);
