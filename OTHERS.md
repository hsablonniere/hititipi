https://github.com/expressjs/serve-static
=> no compression

https://github.com/isaacs/st
=> gzip option but no static gzip detection

https://github.com/vercel/serve

https://github.com/jfhbrook/node-ecstatic
!! deprecated
=> with express
=> gzip and brotli options and auto static detection

https://github.com/koajs/static
https://github.com/koajs/send
=> with koa
=> gzip and brotli options and auto static detection

https://hapi.dev/module/inert/api/?v=6.0.2
=> static detection for gzip but not brotli

hitititpi (dynamic response, dynamic gzip)
curl -I http://localhost:8080/my-object etag: "16-jOsyb69cCcisD7ZkdFIWJDXFv10"
curl -I http://localhost:8080/my-object --compressed etag: "28-E7SpTmoqRQ3Afn+ktZ8lOQWlkM0

hitititpi (static response, dynamic gzip)
curl -I http://localhost:8080/ etag: W/"1e6c2-174dbce400a"
curl -I http://localhost:8080/ --compressed etag: W/"1e6c2-174dbce400a"

hitititpi (static response, static gzip)
curl -I http://localhost:8080/ etag: W/"1e6c2-174dbce400a"
curl -I http://localhost:8080/ --compressed W/"8060-174dfd98ebf"

NGINX (dynamic gzip)
curl -I http://localhost:8080 ETag: "5f73a989-1e6c2"
curl -I http://localhost:8080 --compressed ETag: W/"5f73a989-1e6c2"

NGINX (static gzip)
curl -I http://localhost:8080 ETag: "5f73a989-1e6c2"
curl -I http://localhost:8080 --compressed ETag: "5f751796-8060"

HTTPD (dynamic gzip)
curl -I http://localhost:8080 ETag: "1e6c2-5b07a9daa25de"
curl -I http://localhost:8080 --compressed ETag: "1e6c2-5b07a9daa25de-gzip"

node-static (static gzip)
curl -I http://localhost:8080 Etag: "13396528-124610-1601415561000"
curl -I http://localhost:8080 --compressed Etag: "13396528-32864-1601415561000"

ecstatic (static gzip)
curl -I http://localhost:8080 etag: W/"13396528-124610-2020-09-29T21:39:21.226Z"
curl -I http://localhost:8080 --compressed etag: W/"13400734-32864-2020-09-30T15:10:56.950Z"

netlify
curl -I https://genericcomponents.netlify.app/ Etag: "49c9bfa7485d7d26cd63f78c1d44f972-ssl"
curl -I https://genericcomponents.netlify.app/ --compressed Etag: "49c9bfa7485d7d26cd63f78c1d44f972-ssl"

app using hapi.js
curl -I https://assistant.corp.clever-cloud.com/ etag: "048acc151172d5bbdc7e1913d4228fd93977caaf"
curl -I https://assistant.corp.clever-cloud.com/ --compressed etag: "048acc151172d5bbdc7e1913d4228fd93977caaf"

wikipedia
curl -I https://www.wikipedia.org ETag: W/"10d12-5b05d55311c8b"
curl -I https://www.wikipedia.org --compressed ETag: W/"10d12-5b05d55311c8b"

amazon
curl -I https://www.amazon.com ETag: "a6f-5af92f6e76880"
curl -I https://www.amazon.com --compressed ETag: "a6f-5af92f6e76880-gzip"

microsoft
curl -I -XGET https://www.microsoft.com ETag: "6082151bd56ea922e1357f5896a90d0a:1425454794"
curl -I -XGET https://www.microsoft.com --compressed ETag: "6082151bd56ea922e1357f5896a90d0a:1425454794"

redditstatic
curl -I -XGET 'https://www.redditstatic.com/desktop2x/img/trending-placeholder.png' ETag: "010ce8e6ec2eb9310b55e0d32bf411a9"
curl -I -XGET 'https://www.redditstatic.com/desktop2x/img/trending-placeholder.png' --compressed ETag: "010ce8e6ec2eb9310b55e0d32bf411a9"

httpd.apache.org
curl -I -XGET http://httpd.apache.org/ ETag: "25e0-5ac482798ef07"
curl -I -XGET http://httpd.apache.org/ --compressed ETag: "25e0-5ac482798ef07"

duckduckgo
curl -I -XGET 'https://duckduckgo.com/s2475.js' ETag: "5edb0819-e47d"
curl -I -XGET 'https://duckduckgo.com/s2475.js' --compressed ETag: "5edb0819-350f"

AWS (AmazonS3/Cloudfront)
curl -I -XGET 'https://a0.awsstatic.com/libra-css/css/1.0.357/style-awsm.css' ETag: "3170364e938266f23b389ee834dcaecc"
curl -I -XGET 'https://a0.awsstatic.com/libra-css/css/1.0.357/style-awsm.css' --compressed ETag: W/"3170364e938266f23b389ee834dcaecc"

azure
curl -I -XGET 'https://amp.azure.net/libs/amp/2.3.5/skins/amp-default/azuremediaplayer.min.css' Etag: "54cd9d36835d61:0"
curl -I -XGET 'https://amp.azure.net/libs/amp/2.3.5/skins/amp-default/azuremediaplayer.min.css' --compressed Etag: "54cd9d36835d61:0+ident"

cloudflare
curl -I -XGET 'https://assets.www.cloudflare.com/js/runtime-72897be4ed4f2c7e97ef.js' ETag: "55ccc93627558059cde0c7b7661751cb"
curl -I -XGET 'https://assets.www.cloudflare.com/js/runtime-72897be4ed4f2c7e97ef.js' --compressed ETag: W/"55ccc93627558059cde0c7b7661751cb"

fastly
curl -I -XGET 'https://www.fastly.com/assets/jquery.modal.min-77afb5af210c88daef170a1583bc33fd636573e930065b0c7aeab48555d0bac7.js' ETag: "cf7175395453e977ccf336c4e706607a"
curl -I -XGET 'https://www.fastly.com/assets/jquery.modal.min-77afb5af210c88daef170a1583bc33fd636573e930065b0c7aeab48555d0bac7.js' --compressed ETag: "cf7175395453e977ccf336c4e706607a"

keycdn
curl -I -XGET 'https://www.keycdn.com/' ETag: ETag: W/"5f5fa0e8-102e4"
curl -I -XGET 'https://www.keycdn.com/' --compressed ETag: ETag: W/"5f5fa0e8-102e4"

keycdn
curl -I -XGET 'https://www.keycdn.com/css/style-e2b8b59ca2.css' ETag: W/"5f2afb66-131ac"
curl -I -XGET 'https://www.keycdn.com/css/style-e2b8b59ca2.css' --compressed ETag: W/"5f2afb66-131ac"

no etag
google, youtube, facebook, yahoo, amazon, reddit (mais reddit static oui), netflix
