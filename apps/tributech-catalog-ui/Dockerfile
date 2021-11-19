FROM node:16-alpine As build
# Install Git
RUN apk --no-cache add git
# Install OpenJDK-8
RUN apk --no-cache add openjdk8-jre

WORKDIR /app

COPY package.json ./
COPY package-lock.json ./

# ensure NODE_ENV is not set to production as
# otherwise we do not install devDependencies
RUN npm i --ci

COPY workspace.json ./
COPY nx.json ./
COPY openapitools.json ./
COPY tsconfig.base.json ./
COPY apps/ ./apps/
COPY libs/ ./libs/
COPY tools/schemas ./tools/schemas

RUN npm run generate-connectors
RUN npm run build-ui

FROM nginx:stable-alpine as deploy
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

## Copy our default nginx config
COPY --from=build app/apps/tributech-catalog-ui/nginx.conf /etc/nginx/conf.d/default.conf

## Remove default nginx website
RUN rm -rf /usr/share/nginx/html/*

COPY --from=build app/dist/apps/tributech-catalog-ui /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
