"use client";

import { getCookie, deleteCookie } from 'cookies-next';


const fetchWithInterceptor = async (url: string, options: RequestInit, tokenParam = "", includeToken: boolean = true): Promise<any> => {
  let token = localStorage.getItem("token") || '';

  console.log(token)
  const getAuthToken = (token: string, tokenParam: string) => {
    if (tokenParam) return tokenParam;
    if (token) return token;
    return ""
  }
  const headers: any = { ...options.headers };
  if (includeToken) headers["Authorization"] = `Bearer ${getAuthToken(token, tokenParam || "")}`;

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
