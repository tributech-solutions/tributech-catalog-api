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

# production mode
$ npm run start:prod
```

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


Validate SHACL
https://www.npmjs.com/package/rdf-validate-shacl
https://zazuko.com/get-started/developers/
https://github.com/schimatos/schimatos.org
https://shacl.org/playground/
https://github.com/mulesoft-labs/json-ld-schema

Generate Typescript from schema
https://github.com/google/schema-dts/tree/main

OWL TO DTDL
https://github.com/Azure-Samples/RdfToDtdlConverter/blob/main/Program.cs

TS from SHACL
https://github.com/jeswr/on2ts