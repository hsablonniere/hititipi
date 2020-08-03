export const matcher = /^\/index\.html$/;

export const mimeType = 'text/html';

export const render = (httpRequest) => `

<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Home</title>
  <link rel="stylesheet" href="./global-styles.css">
  <script type="module" src="home.js"></script>
</head>
<body>

<h1>Hello world</h1>

<p>This page was generated from a template at ${new Date().toISOString()}</p>

<p>Request headers were:</p>

<pre>
${JSON.stringify(httpRequest.headers, null, '  ')}
</pre>

</body>
</html>

`.trim();
