import http from 'node:http';
import { hititipi } from '../src/hititipi.node.js';
import { runCluster } from '../src/lib/run.cluster.js';
import { chainAll } from '../src/middlewares/chain-all/chain-all.js';
import { serverName } from '../src/middlewares/server-name/server-name.js';
import { mainMiddleware } from './main-middleware.js';

runCluster('auto', (pid) => {
  const [PORT_STRING = '8080'] = process.argv.slice(2);
  const PORT = Number(PORT_STRING);

  http.createServer(hititipi(chainAll([mainMiddleware, serverName('hititipi + Node.js')]))).listen(PORT);

  console.log(`[Node.js] (pid:${pid}) Listening on port ${PORT} ...`);
});
