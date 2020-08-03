export const ONE_DAY = 60 * 60 * 24;

export const ACCESS_CONTROL_ALLOW_ORIGIN = {
  key: 'acao',
  defaultValue: '',
  ALL: 'all',
};
export const ACCESS_CONTROL_MAX_AGE = {
  key: 'acma',
  defaultValue: '',
  ONE_DAY: '1d',
};

export function getCorsHeaders (options) {
  return {
    ...getAccessControlAllowOriginHeader(options),
    ...getAccessControlMaxAgeHeader(options),
  };
}

function getAccessControlAllowOriginHeader (options) {

  switch (options.get(ACCESS_CONTROL_ALLOW_ORIGIN.key)) {

    case ACCESS_CONTROL_ALLOW_ORIGIN.ALL:
      return { 'Access-Control-Allow-Origin': '*' };

    default:
      return {};
  }
}

function getAccessControlMaxAgeHeader (options) {

  switch (options.get(ACCESS_CONTROL_MAX_AGE.key)) {

    case ACCESS_CONTROL_MAX_AGE.ONE_DAY:
      return { 'Access-Control-Max-Age': String(ONE_DAY) };

    default:
      return {};
  }
};
