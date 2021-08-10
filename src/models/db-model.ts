import { InMemoryDBEntity } from '@nestjs-addons/in-memory-db';
import { ApiProperty } from '@nestjs/swagger';
import { ExpandedInterface, Interface } from './models';

export class ModelEntity implements InMemoryDBEntity {
  @ApiProperty()
  id: string;
  @ApiProperty()
  active: boolean;
  @ApiProperty()
  model?: Interface;
  @ApiProperty()
  createdTime: string;
  @ApiProperty()
  modifiedTime: string;
}

export class PagedResult<T> {
  @ApiProperty()
  data: T[];
  @ApiProperty()
  totalCount: number;
}

export class ExpandedInterfacePagedResult {
  @ApiProperty({ type: [ExpandedInterface] })
  data: ExpandedInterface[];
  @ApiProperty()
  totalCount: number;
}

export class ModelEntityPagedResult {
  @ApiProperty({ type: [ModelEntity] })
  data: ModelEntity[];
  @ApiProperty()
  totalCount: number;
}
