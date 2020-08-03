import { serializeOptions } from './options.js';

const socketsMap = new WeakMap();
let globalId = 0;

export function getServerHeaders (options, httpRequest) {

  if (socketsMap.get(httpRequest.socket) == null) {
    globalId = (globalId + 1) % 10000;
    socketsMap.set(httpRequest.socket, {
      id: String(globalId).padStart(4, '0'),
      count: 0,
    });
  }
  const socket = socketsMap.get(httpRequest.socket);
  socket.count += 1;

  return {
    'Server': 'hititipi',
    'x-hititipi-options': serializeOptions(options),
    'x-hititipi-socket': `${socket.id}/${socket.count}`,
  };
}
