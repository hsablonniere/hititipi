export function notFound () {
  return (context) => {
    if (context.responseStatus == null) {
      return { ...context, responseStatus: 404 };
    }
  };
}
