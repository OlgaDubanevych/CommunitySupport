# Dockerfile
FROM httpd:alpine

# Copy the build directory to the container
COPY build/ /usr/local/apache2/htdocs/

# Copy the custom httpd.conf file to the container
COPY httpd.conf /usr/local/apache2/conf/httpd.conf

# Load the prefork MPM module
RUN echo "LoadModule mpm_prefork_module modules/mod_mpm_prefork.so" >> /usr/local/apache2/conf/httpd.conf

# Expose the port (if needed)
EXPOSE 80

# Start Apache HTTP Server
CMD ["httpd-foreground"]
