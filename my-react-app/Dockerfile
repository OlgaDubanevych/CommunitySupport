FROM httpd:alpine

COPY build/ /usr/local/apache2/htdocs/

COPY httpd.conf /usr/local/apache2/conf/httpd.conf

RUN echo "LoadModule mpm_prefork_module modules/mod_mpm_prefork.so" >> /usr/local/apache2/conf/httpd.conf

EXPOSE 80

CMD ["httpd-foreground"]
