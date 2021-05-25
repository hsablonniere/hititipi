"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.permissionsPolicy = permissionsPolicy;

var _contentType = require("../lib/content-type.js");

function permissionsPolicy(options = {}) {
  return async context => {
    const contentTypeHeader = context.responseHeaders['content-type'];

    if (!(0, _contentType.isHtml)(contentTypeHeader)) {
      return;
    }

    const featurePolicyHeader = 'accelerometer \'none\'; camera \'none\'; geolocation \'none\'; gyroscope \'none\'; magnetometer \'none\'; microphone \'none\'; payment \'none\'; usb \'none\'';
    const permissionsPolicyHeader = 'accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()';
    const responseHeaders = { ...context.responseHeaders,
      'feature-policy': featurePolicyHeader,
      'permissions-policy': permissionsPolicyHeader
    };
    return { ...context,
      responseHeaders
    };
  };
}