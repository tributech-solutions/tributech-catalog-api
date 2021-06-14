FROM node:14-alpine As base
LABEL vendor="Tributech.io Solutions"
WORKDIR /app

FROM node:14-alpine As build

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /app

COPY package.json ./
COPY yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . .

RUN yarn run build

FROM base as final
EXPOSE 3000
#WORKDIR /app

COPY package.json ./
COPY --from=build /app/package.json ./
COPY --from=build /app/yarn.lock ./
COPY --from=build /app/dist ./dist

RUN yarn install --frozen-lockfile

CMD ["node", "dist/src/main.js"]
