# Tributech Catalog
The Tributech Catalog Monorepo is part of the [Tributech](https://tributech.io) open-source stack. It offers the possibility to create a custom vocabulary based on the [Digital Twin Definition Language](https://github.com/Azure/opendigitaltwins-dtdl/blob/master/DTDL/v2/dtdlv2.md) that can be used to construct a domain specific knowledge graph. Models can be revoked or updated once added. 

The data model can than be used to create instances of the data that can be inserted into the [Twin-API](https://github.com/tributech-solutions/tributech-twin-api) that is also part of the open-source stack. To find out what can be queried from the Twin-API you can use the meta-queries offered by the Catalog-API that is part of this repository.

<a href="https://raw.githubusercontent.com/tributech-solutions/tributech-catalog-api/develop/docs/assets/model-builder.png"><img src="https://raw.githubusercontent.com/tributech-solutions/tributech-catalog-api/develop/docs/assets/model-builder.png" width="550" alt="Tributech Catalog UI Screenshot"></a>


## Projects

* Tributech Catalog API
  * Backend for the Catalog UI
  * OpenAPI endpoints to manage DTDL models
* Tributech Catalog UI
  * Graphical Interface Webapp
  * Create, view, edit and delete DTDL models
  * Create, view, edit and delete instances

### State of the projects
Both projects of this repository are used in production to power the [Tributech DataSpace Kit](https://www.tributech.io/product/dataspace-kit). We will create a demo repository that allows a quick bootstrap of the open-source stack including authorization soon. At the moment some manual adaptions might be necessary to get the frontend/backend running without an identity provider.


### Example DTDL-Models

Models can be added to the Catalog API via REST, a default set of models gets loaded by default.

These models can be found in the following repositories:

[Tributech Data-Asset Models](https://github.com/tributech-solutions/data-asset-twin)

[Tributech GAIA-X Self Description Models](https://github.com/tributech-solutions/gaia-x-self-descriptions)

## Installation

Install dependencies
```bash
$ yarn install
```

Generate API-Connectors
```bash
$ npm run generate-connectors
```

### Configuration UI
* Adapt config.json in apps/tributech-catalog-ui/src/assets/config
  * Currently, needs a Keycloak Identity Server with OpenID-Connect
  * Insert URLs of Keycloak, make sure client-id and scope matches the config set in auth-config.base.ts in /apps/tributech-catalog-ui/src/app

### Configuration API
* Adapt settings.json in apps/tributech-catalog/src/settings
  * Currently, needs a Keycloak Identity Server with OpenID-Connect


### HTTPS
Generate certificate to serve frontend via Self-Signed Certificate
```bash
$ openssl req -x509 -newkey rsa:2048 -keyout apps/twin-builder-playground/ssl/key.pem -out apps/twin-builder-playground/ssl/cert.pem
```

## Development

```bash
# start ui and api at the same time
$ npm run start
```

By default the swagger-ui is reachable via http://localhost:3000/api/
and the Open-API spec at http://localhost:3000/api-json/.


### Testing

```bash
$ npm run test
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
