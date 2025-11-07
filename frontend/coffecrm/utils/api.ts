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

export const buildUrl = (path: string) => {
  if (path.startsWith('http')) {
    return path;
  }
  return `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;
};

