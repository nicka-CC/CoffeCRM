export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:7000';

export const withAuthHeaders = (headers: HeadersInit = {}) => {
  if (typeof window === 'undefined') {
    return headers;
  }

  const token = sessionStorage.getItem('access_token');

  if (token) {
    return {
      ...headers,
      Authorization: `Bearer ${token}`,
    };
  }

  return headers;
};

export const buildUrl = (path: string, params?: Record<string, any>) => {
  let url = '';
  if (path.startsWith('http')) {
    url = path;
  } else {
    url = `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;
  }

  if (!params) return url;

  const search = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v === undefined || v === null || v === '') return;
    if (Array.isArray(v)) {
      v.forEach((it) => search.append(k, String(it)));
    } else {
      search.set(k, String(v));
    }
  });

  const qs = search.toString();
  return qs ? `${url}${url.includes('?') ? '&' : '?'}${qs}` : url;
};

