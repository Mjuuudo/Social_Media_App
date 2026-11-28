/**
 * Base URL of the FastAPI backend.
 */
export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

/**
 * Paths for which a 401 must NOT trigger a token refresh.
 *
 * - /login and /register: a 401 here means bad credentials or invalid input,
 *   not an expired access token, so refreshing would make no sense.
 * - /refresh: a 401 here means the refresh token itself is invalid/expired.
 *   Trying to refresh again would cause an infinite refresh loop.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- used once apiFetch is implemented
const NO_REFRESH_PATHS: string[] = ["/api/auth/login", "/api/auth/register", "/api/auth/refresh"];

/**
 * The single in-flight refresh request, shared by all concurrent callers.
 *
 * If several requests get a 401 at the same time, they must all wait for the
 * SAME refresh instead of each sending its own POST /refresh (the backend
 * rotates the refresh token, so parallel refreshes would invalidate each other).
 * It is null when no refresh is currently running.
 */
// eslint-disable-next-line prefer-const, @typescript-eslint/no-unused-vars -- reassigned once refreshAccessToken is implemented
let refreshPromise: Promise<boolean> | null = null;

// elite drive .ma


async function callRefreshEndpoint ( ): Promise<Boolean> {
  try {
    const response = await fetch( `${API_URL}/api/auth/refresh`, {
      method: "POST",
      credentials: "include"
    })
    return response.status === 204
  } catch {
    return false
  }
}

/**
 * Asks the backend for a new access token using the httpOnly refresh_token cookie.
 * Concurrent calls share one request. Resolves to true on success, false otherwise.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- used once apiFetch is implemented
async function refreshAccessToken(): Promise<boolean | null>{
  // TODO 1: If refreshPromise already exists, return it (share the in-flight refresh).
  // TODO 2: Otherwise create it: POST `${API_URL}/api/auth/refresh` with credentials: "include" (no body).
  // TODO 3: Resolve to true if the response status is 204, false otherwise
  //         (also false if the network request itself fails).
  // TODO 4: When the promise settles (.finally), set refreshPromise back to null
  //         so a later 401 can trigger a fresh refresh.
  // TODO 5: Return the promise.
  if ( refreshPromise !== null ) {
    return refreshPromise;
  }

 
  const response = await callRefreshEndpoint( ).finally( ( ) => {
      refreshPromise = null;
  });

  return  refreshPromise;
}

/**
 * Wrapper around fetch for calling the backend.
 * Always sends cookies, and on a 401 transparently refreshes the access token
 * and retries the request once. Redirects to /signin if the refresh fails.
 *
 * @param path Backend path starting with "/", e.g. "/api/auth/me".
 * @param init Standard fetch options (method, headers, body...).
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- params used once implemented
export async function apiFetch(path: string, init: RequestInit = {}): Promise<Response> {
  // TODO 1: Send fetch(`${API_URL}${path}`, { ...init, credentials: "include" }).
  // TODO 2: If the status is not 401, or path is in NO_REFRESH_PATHS, return the response as is.
  // TODO 3: Otherwise call refreshAccessToken().
  // TODO 4: If it returns true, send the same request again ONCE and return that response.
  // TODO 5: If it returns false, redirect with window.location.assign("/signin")
  //         and return the original 401 response.
  // TODO 6: Never retry more than once (a 401 on the retry is returned as is, no new refresh).
  const response = await fetch( `${API_URL}/${path}`, {
    ...init,
    credentials: "include"
  })

  if (response.status !== 401 || NO_REFRESH_PATHS.includes(path)) {
      return response;
  }

  const refreshed = await refreshAccessToken( );
  if (!refreshed) {
    return response;
  }

  
  return await fetch(`${API_URL}/${path}`, {
    ...init,
    credentials: "include"
  });
}

/**
 * Logs the user out: the backend clears the auth cookies, then the user is
 * sent back to the sign-in page.
 */
export async function logout(): Promise<void> {
  try {
    await apiFetch("api/auth/logout", { method: "POST" });
  } finally {
    // Leave even if the request failed, and do a full reload so no user state stays in memory.
    window.location.assign("/login");
  }
}
