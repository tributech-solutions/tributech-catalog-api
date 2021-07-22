import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BaseModel, ContextType, EnumValue, MapKey } from './models';

export class ParsedSchema extends BaseModel {
  @ApiPropertyOptional()
  mapKey: MapKey;
  @ApiPropertyOptional()
  mapValue: ParsedSchema;
  @ApiPropertyOptional({ type: [EnumValue] })
  enumValues: EnumValue[];
  @ApiPropertyOptional()
  enumValueSchema: string;
  @ApiPropertyOptional()
  elementSchema: ParsedSchema;
}

export class ParsedProperty extends BaseModel {
  @ApiProperty()
  schema: ParsedSchema;
  @ApiPropertyOptional()
  unit?: string;
  @ApiPropertyOptional()
  writable?: boolean;
}

export class ParsedRelationship extends BaseModel {
  @ApiPropertyOptional()
  maxMultiplicity?: number;
  @ApiPropertyOptional()
  minMultiplicity?: number;
  @ApiPropertyOptional({ type: [ParsedProperty], nullable: true })
  properties?: ParsedProperty[];
  @ApiPropertyOptional({ type: 'string' })
  target?: string;
  @ApiPropertyOptional()
  writable?: boolean;
}

export class ParsedTelemetry extends BaseModel {
  @ApiProperty()
  schema: ParsedSchema;
  @ApiPropertyOptional()
  unit?: string;
}

export class ParsedCommand extends BaseModel {
  @ApiPropertyOptional()
  commandType?: any;
  @ApiPropertyOptional()
  request?: any;
  @ApiPropertyOptional()
  response?: any;
}

export class ParsedInterface extends BaseModel {
  @ApiProperty({ type: 'string', enum: ContextType })
  '@context': ContextType.DTDL2;
  @ApiProperty({
    type: 'array',
    items: { type: 'string' },
  })
  bases: string[] = [];
  @ApiProperty({ type: [ParsedProperty] })
  properties?: ParsedProperty[] = [];
  @ApiProperty({ type: [ParsedRelationship] })
  relationships?: ParsedRelationship[] = [];
  @ApiProperty({ type: [ParsedTelemetry] })
  telemetries?: ParsedTelemetry[] = [];
  @ApiProperty({ type: () => [ParsedComponent] })
  components?: ParsedComponent[] = [];
  @ApiProperty({ type: [ParsedCommand] })
  commands?: ParsedCommand[] = [];
}

export class ParsedComponent extends BaseModel {
  @ApiProperty()
  schema: ParsedInterface;
}
