import type { APIResponse } from '../APIResponse';

/* 

퀴즈

*/

// 변경된 퀴즈 결과 저장
export interface SelectMissionRequest {
  quizSetId: number;
}

// 변경된 퀴즈 결과 저장 응답
export interface SelectMissionResponse extends APIResponse {
  answers: AnswerList[];
}

export interface AnswerList {
  additionalProp1: {
    user_answer: string;
  }
}

// 변경된 퀴즈 세트 조회 응답
export interface ShowQuizResponse {
  quizInfo: {
    quizSetId: number;
    sequence: number;
    unlocked: boolean;
    quizzes: Quiz[];
  }
}

export interface Quiz {
  quizId: number;
  content: string;
}
