import APIClient from '../apiClient';
import {
  DeleteSelectMission,
  GetMissionList,
  GetPlayRecord,
  GetShowMission,
  PostSelectMission,
  PostUploadRecord
} from './APIDetail';

// 미션 관련 API
export const getMissionList = APIClient.of(GetMissionList);
export const postSelectMission = APIClient.of(PostSelectMission);
export const deleteSelectMission = APIClient.of(DeleteSelectMission);
export const getShowMission = APIClient.of(GetShowMission);

// 음성 관련 API
export const getPlayRecord = APIClient.of(GetPlayRecord);
export const postUploadRecord = APIClient.of(PostUploadRecord);
