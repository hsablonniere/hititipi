export function getBearerToken (authorizationHeader) {
  if (authorizationHeader?.startsWith('Bearer ')) {
    const bearerToken = authorizationHeader.replace(/^Bearer /, '');
    return bearerToken;
  }
  return null;
}

export function getBasicAuth (authorizationHeader) {
  if (authorizationHeader?.startsWith('Basic ')) {
    const base64String = authorizationHeader.replace(/^Basic /, '');
    try {
      const [user, password] = atob(base64String).split(':');
      return { user, password };
    }
    catch (e) {
    }
  }
  return { user: null, password: null };
}
