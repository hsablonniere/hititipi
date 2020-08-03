export const KEEP_ALIVE = {
  key: 'ka',
  defaultValue: '0',
  REQ_2_TO_100: 'r2_t100',
  REQ_5_TO_100: 'r5_t100',
  REQ_100_TO_100: 'r100_t100',
  REQ_1000_TO_100: 'r1000_t100',
};

export function getKeepAliveHeaders (options) {

  switch (options.get(KEEP_ALIVE.key)) {

    case KEEP_ALIVE.REQ_2_TO_100:
      return { Connection: 'keep-alive', 'Keep-Alive': `max=2,timeout=100` };
      break;

    case KEEP_ALIVE.REQ_5_TO_100:
      return { Connection: 'keep-alive', 'Keep-Alive': `max=5,timeout=100` };
      break;

    case KEEP_ALIVE.REQ_100_TO_100:
      return { Connection: 'keep-alive', 'Keep-Alive': `max=100,timeout=100` };
      break;

    case KEEP_ALIVE.REQ_1000_TO_100:
      return { Connection: 'keep-alive', 'Keep-Alive': `max=1000,timeout=100` };
      break;

    default:
      return { Connection: 'close' };
      break;
  }
}
