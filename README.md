# hititipi

An HTTP static file server dedicated for testing with live configurable response headers.

## Installation

You can install it as a global command from npm.

```bash
npm install -g hititipi
```

## Run the server

Run the `hititipi` command with the path to the static files directory as the first arg: 

```bash
hititipi ./path/to/static-files-dir
```

If you need to change the port (defaults to `8080`), use the `PORT` environment variable: 

```bash
PORT=8080 hititipi ./path/to/static-files-dir
```

## Dynamic templates

This server also supports dynamic files/pages.
You can load templates the second CLI arg, it is optional: 

```bash
hititipi ./path/to/static-files-dir ./path/to/templates-dir
```

Templates are ES modules and need to export:

* `matcher`: a regex that will be executed on the URL pathname
* `mimeType`: the mime type to be use in the `Content/Type` header
* `render`: a function taking the HTTP request and response as params and returning some (HTML) text: `(httpRequest, httpResponse) => 'text'`

## The options system

This server can configure a series of HTTP response headers for each request individually.
This is done through a prefix in the URL containing the list of options serialized in a special format.
If you want to know which options are supported, browse the dashboard and configure what you need:

```
http://localhost:8080/__dashboard__
```

For example, if you configure gzip and etags, you'll be redirected here:

```
http://localhost:8080/@ce=gz@et=1/__dashboard__
```

You can now browse your files/pages with this `/@ce=gz@et=1/` prefix.
If you have absolute URLs in your HTML, CSS... they will point to the option-less config.
You may want to use mostly relative URLs.

## Fixed options

You can disable the options system and provide fixed options used for all requests.
Starting the server with the `HITITIPI_OPTIONS` environment variable:

```bash
HITITIPI_OPTIONS='@ce=gz@lm=1' hititipi ./path/to/static-files-dir
```

In this example, the server will always serve gzip contents and the `Last-Modified` header.
The dynamic options in the prefix of the URLs will have no impact.

## Compression

This server supports pre-compressed files.
If the config is gzip and you browse `/foobar.svg`, the server will try to look for a `foobar.svg.gz` file.
Same thing with brotli, the server will try to look for a `foobar.svg.gbr` file.

## Pre-compression

It's often a good idea to pre-compress, especially when using brotli since it can slow requests.
We you installed the `hititipi` npm package, you also got another CLI command to compress files.

The first and only arg must be a glob of files you want to compress.
It will do gzip and brotli.
It won't compress files that don't need to (like jpeg...).

```bash
hititipi-compress ./path/to/static-files-dir/**/*
```
