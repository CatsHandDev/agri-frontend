import axios from 'axios';
import { getDefaultStore } from 'jotai';
import { accessTokenAtom, refreshTokenAtom, setTokensAtom, clearAuthDataAtom } from '@/atoms/authAtoms';

const isServer = typeof window === 'undefined';
const serverBaseURL = process.env.INTERNAL_API_URL || 'http://backend:8000/api';
const clientBaseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
const baseURL = isServer ? serverBaseURL : clientBaseURL;

console.log(`[axios] Environment: ${isServer ? 'Server' : 'Client'}`);
console.log(`[axios] API Base URL: ${baseURL}`);

const apiClient = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// === デフォルトストアを取得 ===
// 注意: この方法はクライアントサイドでのみ機能する可能性が高い
const jotaiStore = !isServer ? getDefaultStore() : null;

// === リクエストインターセプター ===
apiClient.interceptors.request.use(
  (config) => {
    // ★ Content-Type の設定を確認 ★
    if (!(config.data instanceof FormData)) {
      // FormData 以外の場合は application/json を設定 (またはデフォルトのままにする)
      config.headers['Content-Type'] = 'application/json';
      console.log('[Axios Request Interceptor] Setting Content-Type to application/json');
    } else {
      // FormData の場合は削除 (Axios が自動設定)
      delete config.headers['Content-Type'];
      console.log('[Axios Request Interceptor] FormData detected, removed Content-Type header.');
    }

    console.log('[Axios Request Interceptor] Final Headers:', config.headers); // ★最終ヘッダー確認

    // if (jotaiStore) {
    //   const accessToken = jotaiStore.get(accessTokenAtom);
    //   console.log('[Axios Request Interceptor] Intercepting request:', config.method?.toUpperCase(), config.url);
    //   if (accessToken) {
    //     console.log('[Axios Request Interceptor] Attaching token:', accessToken.substring(0, 10) + '...');
    //     config.headers.Authorization = `Bearer ${accessToken}`;
    //   } else {
    //     console.log('[Axios Request Interceptor] No access token found.');
    //   }
    // }

    return config;
  }, (error) => Promise.reject(error)
);


// === レスポンスインターセプター ===
apiClient.interceptors.request.use(
  (config) => {
    if (jotaiStore) {
      const accessToken = jotaiStore.get(accessTokenAtom);
      // ★★★ デバッグログを追加 ★★★
      console.log('[Axios Request Interceptor] Intercepting request:', config.method?.toUpperCase(), config.url);
      if (accessToken) {
        console.log('[Axios Request Interceptor] Attaching token:', accessToken.substring(0, 10) + '...');
        config.headers.Authorization = `Bearer ${accessToken}`;
      } else {
        console.log('[Axios Request Interceptor] No access token found.');
      }
    }
    return config;
  }, (error) => Promise.reject(error)
);

export default apiClient;