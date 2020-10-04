docker run -it -v $(pwd)/public:/usr/local/apache2/htdocs/ -v $(pwd)/httpd.conf:/usr/local/apache2/conf/httpd.conf -p 8080:80 httpd:2.4
