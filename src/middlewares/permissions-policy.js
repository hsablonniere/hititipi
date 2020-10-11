import { isHtml } from '../lib/content-type.js';

export function permissionsPolicy (options = {}) {

  return async (context) => {

    const contentTypeHeader = context.responseHeaders['content-type'];
    if (!isHtml(contentTypeHeader)) {
      return;
    }

    const featurePolicyHeader = 'accelerometer \'none\'; camera \'none\'; geolocation \'none\'; gyroscope \'none\'; magnetometer \'none\'; microphone \'none\'; payment \'none\'; usb \'none\'';
    const permissionsPolicyHeader = 'accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()';

    const responseHeaders = {
      ...context.responseHeaders,
      'feature-policy': featurePolicyHeader,
      'permissions-policy': permissionsPolicyHeader,
    };
    return { ...context, responseHeaders };
  };
}
