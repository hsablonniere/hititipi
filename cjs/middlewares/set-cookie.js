"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setCookie = setCookie;

var _cookie = _interopRequireDefault(require("cookie"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// TODO delete cookie
// TODO handle duplicates in the string list
function setCookie(name, value, options = {}) {
  return async context => {
    const {
      prefix = ''
    } = options;
    const cookieList = context.responseHeaders['set-cookie'] || [];
    cookieList.push(_cookie.default.serialize(prefix + name, value, {
      expires: options.expires,
      maxAge: options.maxAge,
      domain: options.domain,
      path: options.path,
      secure: options.secure,
      httpOnly: options.httpOnly,
      sameSite: options.sameSite
    }));
    const responseHeaders = { ...context.responseHeaders,
      'set-cookie': cookieList
    };
    return { ...context,
      responseHeaders
    };
  };
}