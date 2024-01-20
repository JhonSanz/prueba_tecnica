import { getCookie, deleteCookie } from 'cookies-next';

let token = getCookie("token") || '';

const fetchWithInterceptor = async (url: string, options: RequestInit, tokenParam = ""): Promise<any> => {
  const getAuthToken = (token: string, tokenParam: string) => {
    if (tokenParam) return tokenParam;
    if (token) return token;
    return ""
  }
  const headers = {
    ...options.headers,
    // Authorization: `Bearer ${getAuthToken(token, tokenParam || "")}`,
  };

  const modifiedOptions: RequestInit = {
    ...options,
    headers,
  };

  const response = await fetch(`${url}`, modifiedOptions);

  if (response.status === 401) {
    deleteCookie('token');
    deleteCookie('refresh');
    deleteCookie('account');
    deleteCookie('broker');
    return { error: true }
  }

  if (response.status === 204 && response.ok) {
    return { error: false }
  }

  const result = { response: { ...await response.json() } }

  if (!response.ok) {
    return { error: true, ...result }
  }

  return { error: false, ...result }
};

export default fetchWithInterceptor;
