import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  exp: number;
  iat: number;
  sub: string;
  [key: string]: any;
}

interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

/**
 * Checks if an access token is expired
 * @param token - The JWT access token to check
 * @returns True if the token is expired, false otherwise
 */
export const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = jwtDecode<DecodedToken>(token);
    const currentTime = Date.now() / 1000;
    
    // Add a 30-second buffer to account for network latency
    return decoded.exp < currentTime - 30;
  } catch (error) {
    console.error('Error decoding token:', error);
    return true;
  }
};

/**
 * Checks if a refresh token is expired
 * @param token - The JWT refresh token to check
 * @returns True if the token is expired, false otherwise
 */
export const isRefreshTokenExpired = (token: string): boolean => {
  try {
    const decoded = jwtDecode<DecodedToken>(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  } catch (error) {
    console.error('Error decoding refresh token:', error);
    return true;
  }
};

/**
 * Refreshes the access token using the refresh token
 * @param refreshToken - The JWT refresh token
 * @returns A promise that resolves to a new token pair
 */
export const refreshAccessToken = async (refreshToken: string): Promise<TokenPair> => {
  try {
    const response = await fetch('/api/auth/refresh', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to refresh token');
    }
    
    const data = await response.json();
    return {
      accessToken: data.accessToken,
      refreshToken: data.refreshToken || refreshToken, // Some implementations don't return a new refresh token
    };
  } catch (error) {
    console.error('Error refreshing token:', error);
    throw error;
  }
};

/**
 * Stores tokens in localStorage
 * @param accessToken - The JWT access token
 * @param refreshToken - The JWT refresh token
 */
export const storeTokens = (accessToken: string, refreshToken: string): void => {
  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
};

/**
 * Retrieves tokens from localStorage
 * @returns An object containing the access and refresh tokens
 */
export const getStoredTokens = (): { accessToken: string | null; refreshToken: string | null } => {
  return {
    accessToken: localStorage.getItem('accessToken'),
    refreshToken: localStorage.getItem('refreshToken'),
  };
};

/**
 * Clears tokens from localStorage
 */
export const clearTokens = (): void => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
};

/**
 * Gets a valid access token, refreshing if necessary
 * @returns A promise that resolves to a valid access token or null if refresh fails
 */
export const getValidAccessToken = async (): Promise<string | null> => {
  const { accessToken, refreshToken } = getStoredTokens();
  
  if (!accessToken || !refreshToken) {
    return null;
  }
  
  // If access token is still valid, return it
  if (!isTokenExpired(accessToken)) {
    return accessToken;
  }
  
  // If refresh token is expired, clear tokens and return null
  if (isRefreshTokenExpired(refreshToken)) {
    clearTokens();
    return null;
  }
  
  // Try to refresh the access token
  try {
    const newTokens = await refreshAccessToken(refreshToken);
    storeTokens(newTokens.accessToken, newTokens.refreshToken);
    return newTokens.accessToken;
  } catch (error) {
    clearTokens();
    return null;
  }
};

