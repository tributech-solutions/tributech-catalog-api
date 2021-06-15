FROM node:14-alpine As base
LABEL vendor="Tributech.io Solutions"
WORKDIR /app

FROM node:14-alpine As build

WORKDIR /app

COPY package.json ./
COPY yarn.lock ./

COPY . ./

# ensure NODE_ENV is not set to develop as
# otherwise we do not install devDependencies
RUN yarn install --frozen-lockfile

RUN yarn run build

FROM base as final
EXPOSE 3000

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

COPY package.json ./
COPY --from=build /app/dist ./dist

CMD ["node", "dist/src/main.js"]
