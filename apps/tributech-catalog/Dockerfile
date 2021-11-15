FROM node:16-alpine As base
LABEL vendor="Tributech.io Solutions"
WORKDIR /app

FROM node:16-alpine As build

WORKDIR /app

COPY package.json ./
COPY yarn.lock ./
COPY workspace.json ./

COPY apps/tributech-catalog ./apps/tributech-catalog

# ensure NODE_ENV is not set to production as
# otherwise we do not install devDependencies
RUN yarn install --frozen-lockfile

RUN yarn run build-api

FROM base as final
EXPOSE 3000

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

COPY --from=build /app/package.json ./
COPY --from=build /app/yarn.lock ./
COPY --from=build /app/dist ./

CMD ["node", "main.js"]
