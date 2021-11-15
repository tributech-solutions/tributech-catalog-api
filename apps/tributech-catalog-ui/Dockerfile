FROM node:16-alpine As build

WORKDIR /app

COPY package.json ./
COPY yarn.lock ./
COPY workspace.json ./

COPY apps/tributech-catalog-ui ./apps/tributech-catalog-ui

# ensure NODE_ENV is not set to production as
# otherwise we do not install devDependencies
RUN yarn install --frozen-lockfile

RUN yarn run build-ui

FROM nginx:stable-alpine as deploy
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

## Copy our default nginx config
COPY apps/tributech-catalog-ui/nginx.conf /etc/nginx/conf.d/default.conf

## Remove default nginx website
RUN rm -rf /usr/share/nginx/html/*

COPY --from=build dist/apps/tributech-catalog-ui /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
