import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { createSpyObject } from '@ngneat/spectator';
import request from 'supertest';
import { AppModule } from '../app.module';
import { AuthenticationGuard } from '../auth/auth.guard';
import { TwinInstance, TwinRelationship } from '../models/models';
import { SchemaValidationError } from '../models/validation-error.model';
import { ValidationService } from '../services/validation.service';

describe('ValidationController', () => {
  let app: INestApplication;
  const validationService = createSpyObject<ValidationService>(
    ValidationService,
    {
      validateInstance: (): SchemaValidationError => ({
        success: true,
        errors: [],
      }),
      validateSubgraph: (): SchemaValidationError => ({
        success: true,
        errors: [],
      }),
    }
  );

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(AuthenticationGuard)
      .useValue(
        createSpyObject<AuthenticationGuard>(AuthenticationGuard, {
          canActivate: (): Promise<boolean> => Promise.resolve(true),
        })
      )
      .overrideProvider(ValidationService)
      .useValue(validationService)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  it(`POST /validate`, () => {
    const exampleTwin = {
      $dtId: 'test',
      $etag: 'etag',
      $metadata: {
        $model: 'dtmi:io:tributech:test;1',
      },
    };

    const expected: SchemaValidationError = {
      success: true,
      errors: [],
    };

    return request(app.getHttpServer())
      .post('/validate')
      .send(exampleTwin)
      .expect(200, expected);
  });

  it(`POST /validate/graph`, () => {
    const exampleTwin: TwinInstance = {
      $dtId: 'test',
      $etag: 'etag',
      $metadata: {
        $model: 'dtmi:io:tributech:test;1',
      },
    };

    const exampleTwin1: TwinInstance = {
      $dtId: 'test1',
      $etag: 'etag',
      $metadata: {
        $model: 'dtmi:io:tributech:test;1',
      },
    };

    const exampleRel: TwinRelationship = {
      $etag: 'etag',
      $relationshipId: 'relId',
      $targetId: 'test',
      $sourceId: 'test1',
      $relationshipName: 'Test Rel',
    };

    const exampleGraph = {
      digitalTwins: [exampleTwin, exampleTwin1],
      relationships: [exampleRel],
    };

    const expected: SchemaValidationError = {
      success: true,
      errors: [],
    };

    return request(app.getHttpServer())
      .post('/validate/graph')
      .send(exampleGraph)
      .expect(200, expected);
  });

  afterAll(async () => {
    await app.close();
  });
});
