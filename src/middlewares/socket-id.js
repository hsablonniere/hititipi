export function socketId (options = {}) {

  const socketMap = new WeakMap();
  let globalSocketId = 0;

  return async (context) => {

    if (socketMap.get(context.socket) == null) {
      globalSocketId = (globalSocketId + 1) % 10000;
      socketMap.set(context.socket, {
        id: String(globalSocketId).padStart(4, '0'),
        count: 0,
      });
    }

    const socket = socketMap.get(context.socket);
    socket.count += 1;
    const id = `${socket.id}/${socket.count}`;

    const responseHeaders = { ...context.responseHeaders, 'x-socket-id': id };

    return { ...context, responseHeaders };
  };
}
