import { Test } from '@nestjs/testing';
import { Interface } from '../models/models';
import { ModelManagerService } from '../services/model-manager.service';
import { mockProvider } from '../shared/testing.utils';
import { ModelManagerController } from './model-manager.controller';

describe('ModelManagerController', () => {
  let modelManagerController: ModelManagerController;
  let modelManagerService: ModelManagerService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [ModelManagerController],
      providers: [
        mockProvider(ModelManagerService, {
          get: (dtmi: string) => {
            return dtmi.includes('test')
              ? {
                  id: 'exists',
                }
              : null;
          },
        }),
      ],
    }).compile();

    modelManagerController = moduleRef.get(ModelManagerController);
    modelManagerService = moduleRef.get(ModelManagerService);
  });

  it('should call modelService and return model if present', () => {
    const result = modelManagerController.getEntity('dtmi:io:tributech:test;1');
    expect(result).toBeTruthy();
    expect(modelManagerService.get).toHaveBeenCalledTimes(1);
    expect(modelManagerService.get).toHaveBeenCalledWith(
      'dtmi:io:tributech:test;1'
    );
  });

  it('should call modelService and return model and throw is not found', () => {
    expect(() =>
      modelManagerController.getEntity('dtmi:io:tributech:throw;1')
    ).toThrowError('Model not found');
    expect(modelManagerService.get).toHaveBeenCalledTimes(1);
    expect(modelManagerService.get).toHaveBeenCalledWith(
      'dtmi:io:tributech:throw;1'
    );
  });

  it('should call modelService to get all entities', () => {
    modelManagerController.getAllEntities();
    expect(modelManagerService.getAll).toHaveBeenCalledTimes(1);
    expect(modelManagerService.getAll).toHaveBeenCalledWith(0, 100);
  });

  it('should call modelService to add an entity', () => {
    modelManagerController.addEntity({
      '@id': 'dtmi:io:tributech.test',
    } as Interface);
    expect(modelManagerService.addNew).toHaveBeenCalledTimes(1);
    expect(modelManagerService.addNew).toHaveBeenCalledWith({
      '@id': 'dtmi:io:tributech.test',
    });
  });

  it('should call modelService to add multiple entities', () => {
    modelManagerController.addEntities([
      {
        '@id': 'dtmi:io:tributech:test;1',
      } as Interface,
    ]);
    expect(modelManagerService.addManyNew).toHaveBeenCalledTimes(1);
    expect(modelManagerService.addManyNew).toHaveBeenCalledWith([
      {
        '@id': 'dtmi:io:tributech:test;1',
      },
    ]);
  });

  it('should call modelService to revoke model', () => {
    modelManagerController.revokeEntity('dtmi:io:tributech:test;1');
    expect(modelManagerService.revokeModel).toHaveBeenCalledTimes(1);
    expect(modelManagerService.revokeModel).toHaveBeenCalledWith(
      'dtmi:io:tributech:test;1'
    );
  });
});
