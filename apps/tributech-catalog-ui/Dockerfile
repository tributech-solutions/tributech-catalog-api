FROM nginx:stable-alpine as deploy

## Copy our default nginx config
COPY apps/tributech-catalog-ui/nginx.conf /etc/nginx/conf.d/default.conf

## Remove default nginx website
RUN rm -rf /usr/share/nginx/html/*

COPY dist/apps/tributech-catalog-ui /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
