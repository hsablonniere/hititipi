PORT=${1:-8080}

#  -q 15000 \
oha "http://localhost:$PORT/hello.html?firstname=the%20firstname&lastname=the%20lastname" \
  -c 10 \
  -z 10s \
  --latency-correction \
  --disable-keepalive \
  --wait-ongoing-requests-after-deadline \
  -H 'User-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:131.0) Gecko/20100101 Firefox/131.0' \
  -H 'Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/png,image/svg+xml,*/*;q=0.8' \
  -H 'Accept-Language: fr,fr-FR;q=0.8,en-US;q=0.5,en;q=0.3' \
  -H 'Accept-Encoding: gzip, deflate, br, zstd' \
  -H 'DNT: 1' \
  -H 'Connection: keep-alive' \
  -H 'Upgrade-Insecure-Requests: 1' \
  -H 'Sec-Fetch-Dest: document' \
  -H 'Sec-Fetch-Mode: navigate' \
  -H 'Sec-Fetch-Site: none' \
  -H 'Sec-Fetch-User: ?1' \
  -H 'Priority: u=0, i'
