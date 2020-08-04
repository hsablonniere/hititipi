import * as dashboard from './dashboard-template.js';
import http from 'http';
import { catchErrors, replaceUrl, serve301, serve302, serve404, serve405, serveFile } from './lib/http.js';
import { extractPathAndOptionsString, parseOptionsString, serializeOptions } from './lib/options.js';
import { getFileInfo, loadAllTemplates } from './lib/fs.js';
import { Readable } from 'stream';

export async function startServer ({ PORT, HITITIPI_OPTIONS, staticRoot, templateRoot }) {

  const templateList = templateRoot.exists
    ? await loadAllTemplates(templateRoot.path)
    : [];

  // Add the dashboard in the templates
  const stats = await dashboard.getStats();
  templateList.unshift({ ...dashboard, stats });

  http
    .createServer(catchErrors(async (httpRequest, httpResponse) => {

      // Replace httpRequest.url (which is a string version of the path and search params) by a WHATWG URL object
      replaceUrl(httpRequest);

      console.log(new Date().toISOString(), httpRequest.method, httpRequest.url.toString());

      // hititipi only supports GET and HEAD
      // TODO: Do we need to support OPTIONS for CORS?
      if (httpRequest.method !== 'GET' && httpRequest.method !== 'HEAD') {
        return serve405(httpResponse);
      }

      // Dashboard update requests are redirected so we can rewrite the URL
      // options in query params are serialized to the "options string format"
      if (dashboard.matcher.test(httpRequest.url.pathname) && (httpRequest.url.search !== '')) {
        const options = new Map(httpRequest.url.searchParams.entries());
        const optionsString = serializeOptions(options);
        return serve302(httpResponse, [optionsString, '__dashboard__'].join('/'));
      }

      // Force trailing slash when there are options but nothing after
      if (httpRequest.url.pathname.startsWith('/@')) {
        const parts = httpRequest.url.pathname.split('/');
        if (parts.length === 2) {
          return serve301(httpResponse, httpRequest.url.pathname + '/');
        }
      }

      // Extract and parse options for env var HITITIPI_OPTIONS or from path prefix "/@xx=yy"
      const { requestPath, optionsString } = extractPathAndOptionsString(httpRequest.url.pathname);
      const options = (HITITIPI_OPTIONS != null)
        ? parseOptionsString(HITITIPI_OPTIONS)
        : parseOptionsString(optionsString);

      // Serve matching template if there's one
      for (const template of templateList) {
        if (template.matcher.test(requestPath)) {
          const file = { ...template, stream: Readable.from(template.render(httpRequest, requestPath)) };
          return serveFile(httpRequest, httpResponse, file, options);
        }
      }

      // Serve file
      const file = await getFileInfo(staticRoot.path, requestPath, options);
      return file.exists
        ? serveFile(httpRequest, httpResponse, file, options)
        : serve404(httpResponse);
    }))
    .listen(PORT);
}
