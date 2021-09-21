# Tributech Catalog

## Description
The Tributech catalog gets used to store, exchange and manage vocabulary written in the [Digital Twin Definition Language](https://github.com/Azure/opendigitaltwins-dtdl/blob/master/DTDL/v2/dtdlv2.md).

Responsibilities:
- Store models
- Validate models
- Retrieve models
- Get related models
- Exchange/Sync models with other catalog nodes

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# if running with Ubuntu using WSL2 under Windows you might have to set different IP binding
$ HOST=0.0.0.0 npm run start

# production mode
$ npm run start:prod
```

By default the swagger-ui is reachable via http://localhost:3000/api/
and the Open-API spec at http://localhost:3000/api-json/.


## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Docker

### Build images
```powershell
docker-compose -f ./docker-compose.yml -f ./docker-compose.ci.build.yml build
```

### Run

```powershell
# start
docker-compose -f .\docker-compose.yml -f .\docker-compose.run.yml -p dsk-catalog-api up -d
# stop
docker-compose -f .\docker-compose.yml -f .\docker-compose.run.yml -p dsk-catalog-api down
```