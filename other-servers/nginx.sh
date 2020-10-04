docker run -it -v $(pwd)/public:/usr/share/nginx/html:ro -v $(pwd)/nginx.conf:/etc/nginx/nginx.conf:ro  -p 8080:80 nginx
