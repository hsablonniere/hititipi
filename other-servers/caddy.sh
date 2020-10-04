docker run -it -v $(pwd)/public:/usr/share/caddy/ -v $(pwd)/caddy.conf:/etc/caddy/Caddyfile -p 8080:80 caddy
