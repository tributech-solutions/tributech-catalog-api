FROM node:16-alpine As base
LABEL vendor="Tributech.io Solutions"
RUN apk --no-cache add git
WORKDIR /app

FROM base As build

COPY package.json ./
COPY package-lock.json ./
COPY workspace.json ./
COPY nx.json ./
COPY tsconfig.base.json ./

COPY apps/ ./apps/
COPY libs/ ./libs/
COPY tools/schemas ./tools/schemas

# ensure NODE_ENV is not set to production as
# otherwise we do not install devDependencies
RUN npm i --ci

RUN npm run build-api

FROM base as final
EXPOSE 3000

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

COPY --from=build /app/package.json ./
COPY --from=build /app/yarn.lock ./
COPY --from=build /app/dist ./

CMD ["node", "main.js"]
