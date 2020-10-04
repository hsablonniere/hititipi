const DIRECTIVES = [
  'no-referrer',
  'no-referrer-when-downgrade',
  'origin',
  'origin-when-cross-origin',
  'same-origin',
  'strict-origin',
  'strict-origin-when-cross-origin',
  'unsafe-url',
];

export function referrerPolicy (directive) {

  return async (context) => {

    if (DIRECTIVES.includes(directive)) {
      const responseHeaders = { ...context.responseHeaders, 'referrer-policy': directive };
      return { ...context, responseHeaders };
    }
  };
}
