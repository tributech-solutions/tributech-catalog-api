FROM node:16-alpine As build
# Install Git
RUN apk --no-cache add git
# Install OpenJDK-8
RUN apt-get update && \
    apt-get install -y openjdk-8-jdk && \
    apt-get install -y ant && \
    apt-get clean;

WORKDIR /app

COPY package.json ./
COPY yarn.lock ./
COPY workspace.json ./

COPY apps/ ./apps/
COPY libs/ ./libs/
COPY tools/schemas ./tools/schemas
COPY nx.json ./
COPY tsconfig.base.json ./

# ensure NODE_ENV is not set to production as
# otherwise we do not install devDependencies
RUN yarn install --frozen-lockfile
RUN yarn run generate-connectors
RUN yarn run build-ui

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
