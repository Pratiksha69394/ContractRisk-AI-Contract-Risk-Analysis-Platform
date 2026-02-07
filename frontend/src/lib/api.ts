// API helper that works both locally (with proxy) and on Vercel (direct URL)
const getApiBaseUrl = () => {
  // In development with proxy, use relative paths
  if (import.meta.env.DEV) {
    return '';
  }
  // On Vercel/production, use absolute URL from env var
  return 'https://contractrisk-ai-contract-risk-analysis-ueyx.onrender.com';
};

export const API_BASE_URL = getApiBaseUrl();

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || 'Request failed');
  }

  return response.json();
}

// Helper for authenticated requests
export async function authenticatedApiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem('token');
  
  return apiRequest<T>(endpoint, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    },
  });
}

