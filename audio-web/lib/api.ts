import { getAccessToken, getRefreshToken, setAuthCookies, clearAuthCookies } from './session';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  let accessToken = await getAccessToken();

  const headers = new Headers(options.headers);
  if (accessToken) {
    headers.set('Authorization', `Bearer ${accessToken}`);
  }
  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  let response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // If unauthorized, attempt to refresh the token
  if (response.status === 401) {
    const refreshToken = await getRefreshToken();

    if (refreshToken) {
      try {
        const refreshRes = await fetch(`${API_URL}/auth/refresh`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${refreshToken}`,
          },
        });

        if (refreshRes.ok) {
          const newTokens = await refreshRes.json();
          // Update the cookies with the new tokens
          await setAuthCookies(newTokens);
          accessToken = newTokens.accessToken;

          // Retry the original request
          headers.set('Authorization', `Bearer ${accessToken}`);
          response = await fetch(`${API_URL}${endpoint}`, {
            ...options,
            headers,
          });
        } else {
          // Refresh failed (e.g., token expired or invalid)
          await clearAuthCookies();
        }
      } catch (error) {
        // Network or other errors during refresh
        await clearAuthCookies();
      }
    } else {
      // No refresh token available
      await clearAuthCookies();
    }
  }

  return response;
}
