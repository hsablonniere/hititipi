const http = require('http');
const { Readable } = require('stream');
const { chainAll } = require('../cjs/middlewares/chain-all.js');
const { hititipi } = require('../cjs/hititipi.js');
const { logRequest } = require('../cjs/middlewares/log-request.js');

function ifProduction (middleware) {
  return () => {
    if (process.env.NODE_ENV === 'production') {
      return middleware;
    }
  };
}

http
  .createServer(
    hititipi(
      logRequest(
        chainAll([
          (context) => {
            const responseBody = new Readable.from('foo');
            return { ...context, responseStatus: 200, responseBody };
          },
        ]),
      ),
    ),
  )
  .listen(8080);
