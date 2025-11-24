// api/apiClient.ts
import axios, { AxiosError, AxiosResponse } from 'axios';
import Constants from 'expo-constants';
import * as SecureStore from 'expo-secure-store';
import qs from 'qs';
import { APIRequest, HTTP_METHOD } from './APIRequest';
import { APIResponse } from './APIResponse';

type Constructor<T> = new (...args: any[]) => T;
type ResponseType<T> = T extends APIRequest<infer R> ? R : never;

export default class APIClient {
  static shared = new APIClient();

  static request<U extends APIResponse>(request: APIRequest<U>): Promise<U> {
    return APIClient.shared.request(request);
  }

  static toCallable<
    T extends Constructor<any>,
    U extends InstanceType<T>,
    R extends ResponseType<U>,
  >(api: T) {
    return (...args: ConstructorParameters<T>) => APIClient.request<R>(new api(...args));
  }

  static of = APIClient.toCallable;

  baseURL = Constants.expoConfig?.extra?.API_BASE_URL || 'https://memoring.n-e.kr';
  timeout = 10000;

  private async getToken() {
    try {
      return await SecureStore.getItemAsync('authToken');
    } catch {
      return null;
    }
  }

  async request<U extends APIResponse>(request: APIRequest<U>): Promise<U> {
    // 1) URL 정규화 (base의 끝 슬래시 / path의 앞 슬래시 정리)
    const base = (request.baseURL || this.baseURL).replace(/\/+$/, '');
    const p = (request.path || '').replace(/^\/+/, '');
    const url = `${base}/${p}`;

    // 2) 헤더 구성
    const headers: Record<string, string> = {};

    // JSON 본문일 때만 Content-Type (FormData는 브라우저/axios가 알아서 처리)
    if (
      (request.method === HTTP_METHOD.POST ||
        request.method === HTTP_METHOD.PUT ||
        request.method === HTTP_METHOD.DELETE ||
        request.method === HTTP_METHOD.PATCH) &&
      !(request.data instanceof FormData)
    ) {
      headers['Content-Type'] = 'application/json';
    }

    // 사용자가 직접 준 Authorization이 있으면 우선
    if (request.authorization) {
      headers.Authorization = `Bearer ${request.authorization}`;
    } else {
      // (옵션) 요청 객체에 auth=false 면 토큰 주입 스킵
      const shouldSkipAuth = (request as any).auth === false;
      if (!shouldSkipAuth) {
        const token = await this.getToken();
        if (token) headers.Authorization = `Bearer ${token}`;
      }
    }

    // 추가 헤더 병합
    if (request.headers) {
      Object.assign(headers, request.headers);
    }

    // 3) axios 설정 (완성 URL을 직접 전달: baseURL 사용 안 함)
    const config = {
      url,
      method: request.method,
      params: request.params,
      // ✅ 더 이상 JSON.stringify 하지 않음 (axios가 자동 처리)
      data: request.data instanceof FormData ? request.data : request.data,
      paramsSerializer: (params: any) => qs.stringify(params),
      timeout: this.timeout,
      headers,
      responseType: 'json' as const,
      // 필요 시 쿠키 인증: withCredentials 켜기 (RN에서는 별도 쿠키관리 라이브러리 필요)
      // withCredentials: true,
    };

    // 디버그: 최종 URL/인증 헤더 로그
    try {
      const fullUrl = axios.getUri(config as any);
      console.log('[API][REQUEST]', request.method, fullUrl, {
        params: config.params,
        hasData: !!config.data && !(config.data instanceof FormData),
        authHeader: headers.Authorization ? 'Bearer ...' : '(none)',
      });
    } catch (e) {
      console.log('[API][REQUEST] url preview failed', e);
      console.log('[API][REQUEST] url', url);
    }

    try {
      const res: AxiosResponse<U> = await axios.request(config as any);
      console.log('[API][RESPONSE]', request.method, res.status, res.config?.url);
      return res.data;
    } catch (error) {
      const err = error as AxiosError;
      try {
        const failedUrl = err.config ? axios.getUri(err.config as any) : '(unknown url)';
        console.log('[API][ERROR]', request.method, failedUrl, err.toString());
      } catch {
        console.log('[API][ERROR]', request.method, err.toString());
      }
      throw err;
    }
  }

  // (참고) 기존 createHeaders는 위에서 인라인로직으로 대체됐지만 남겨둬도 무방
  private createHeaders<U extends APIResponse>(request: APIRequest<U>) {
    const headers: Record<string, string> = {};

    if (request.authorization) {
      headers.Authorization = `Bearer ${request.authorization}`;
    }

    if (
      (
        request.method === HTTP_METHOD.POST ||
        request.method === HTTP_METHOD.PUT ||
        request.method === HTTP_METHOD.DELETE ||
        request.method === HTTP_METHOD.PATCH
      ) &&
      !(request.data instanceof FormData)
    ) {
      headers['Content-Type'] = 'application/json';
    }

    if (request.headers) {
      Object.assign(headers, request.headers);
    }

    return headers;
  }
}
