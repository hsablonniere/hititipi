docker run --name my-nginx \
  -it --rm \
  -v $(pwd)/examples/nginx/nginx.conf:/etc/nginx/nginx.conf:ro \
  -v $(pwd)/public:/var/www/localhost/public:ro \
  -p 8080:8080 \
  nginx:latest
