FROM nginx:stable-alpine
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
COPY ./dist/ROOT /usr/share/nginx/html
