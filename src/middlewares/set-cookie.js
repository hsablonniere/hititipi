import cookie from 'cookie';

// TODO delete cookie
// TODO handle duplicates in the string list
export function setCookie (name, value, options = {}) {
  return async (context) => {
    const { prefix = '' } = options;
    const cookieList = context.responseHeaders['set-cookie'] || [];
    cookieList.push(cookie.serialize(prefix + name, value, {
      expires: options.expires,
      maxAge: options.maxAge,
      domain: options.domain,
      path: options.path,
      secure: options.secure,
      httpOnly: options.httpOnly,
      sameSite: options.sameSite,
    }));
    const responseHeaders = { ...context.responseHeaders, 'set-cookie': cookieList };
    return { ...context, responseHeaders };
  };
}
