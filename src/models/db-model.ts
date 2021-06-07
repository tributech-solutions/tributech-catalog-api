import { InMemoryDBEntity } from '@nestjs-addons/in-memory-db';
import { ApiProperty } from '@nestjs/swagger';
import { Interface } from './models';

export class ModelEntity implements InMemoryDBEntity {
  @ApiProperty()
  id: string;
  @ApiProperty()
  active: boolean;
  @ApiProperty({ type: () => Interface })
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
