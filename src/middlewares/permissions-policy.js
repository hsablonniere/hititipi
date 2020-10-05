export function permissionsPolicy (options = {}) {

  return async (context) => {

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
