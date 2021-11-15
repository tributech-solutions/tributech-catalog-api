import { Test } from '@nestjs/testing';
import { mockProvider } from '@tributech/self-description';
import { ModelGraphService } from '../services/model-graph.service';
import { ModelManagerService } from '../services/model-manager.service';
import { ModelGraphController } from './model-graph.controller';

describe('ModelGraphController', () => {
  let modelGraphController: ModelGraphController;
  let modelGraphService: ModelGraphService;
  let modelManagerService: ModelManagerService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [ModelGraphController],
      providers: [
        mockProvider(ModelGraphService, {}),
        mockProvider(ModelManagerService, {
          get: (dtmi: string) => {
            return dtmi.includes('test')
              ? {
                  id: 'exists',
                  model: {},
                }
              : null;
          },
        }),
      ],
    }).compile();

    modelGraphController = moduleRef.get(ModelGraphController);
    modelGraphService = moduleRef.get(ModelGraphService);
    modelManagerService = moduleRef.get(ModelManagerService);
  });

  it('should call through to get all expanded models', () => {
    modelGraphController.getExpandedModels();
    expect(modelGraphService.getAllExpanded).toHaveBeenCalledTimes(1);
    expect(modelGraphService.getAllExpanded).toHaveBeenCalledWith(0, 100);
  });

  it('should call through to get all root models', () => {
    modelGraphController.getRoots();
    expect(modelGraphService.getRoots).toHaveBeenCalledTimes(1);
  });

  it('should call through to get the expanded model', () => {
    modelGraphController.getExpanded('dtmi:io:tributech:test;1');
    expect(modelGraphService.getExpanded).toHaveBeenCalledTimes(1);
    expect(modelGraphService.getExpanded).toHaveBeenCalledWith(
      'dtmi:io:tributech:test;1'
    );
  });

  it('should call through to get the relationships between two models', () => {
    modelGraphController.getRelationships(
      'dtmi:io:tributech:test;1',
      'dtmi:io:tributech:test1;1'
    );
    expect(modelGraphService.getInvolvedRelationships).toHaveBeenCalledTimes(1);
    expect(modelGraphService.getInvolvedRelationships).toHaveBeenCalledWith(
      'dtmi:io:tributech:test;1',
      'dtmi:io:tributech:test1;1'
    );
  });

  it('should return the model identified by the dtmi if present', () => {
    modelGraphController.getModel('dtmi:io:tributech:test;1');
    expect(modelManagerService.get).toHaveBeenCalledTimes(1);
    expect(modelManagerService.get).toHaveBeenCalledWith(
      'dtmi:io:tributech:test;1'
    );
  });

  it('should throw if the model identified by the dtmi is not present', () => {
    expect(() =>
      modelGraphController.getModel('dtmi:io:tributech:throw;1')
    ).toThrowError('Model not found');
    expect(modelManagerService.get).toHaveBeenCalledTimes(1);
    expect(modelManagerService.get).toHaveBeenCalledWith(
      'dtmi:io:tributech:throw;1'
    );
  });
});
