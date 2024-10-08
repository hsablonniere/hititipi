/**
 * @param {Headers} headers
 * @return {string|null}
 */
export function getBearerToken(headers) {
  const authorizationHeader = headers.get('authorization');
  if (authorizationHeader?.startsWith('Bearer ')) {
    const bearerToken = authorizationHeader.replace(/^Bearer /, '');
    return bearerToken;
  }
  return null;
}

/**
 * @param {Headers} headers
 * @return {{password: string|null, user: string|null}}
 */
export function getBasicAuth(headers) {
  const authorizationHeader = headers.get('authorization');
  if (authorizationHeader?.startsWith('Basic ')) {
    const base64String = authorizationHeader.replace(/^Basic /, '');
    try {
      const [user, password] = atob(base64String).split(':');
      return { user, password };
    } catch {}
  }
  return { user: null, password: null };
}
