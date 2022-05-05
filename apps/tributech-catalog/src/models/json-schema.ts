// Taken from https://github.com/tdegrunt/jsonschema/blob/master/lib/index.d.ts
// Adapted for OpenAPI

import { ApiProperty } from '@nestjs/swagger';
import { JSONSchema } from '@tributech/self-description';

export class Schema implements JSONSchema {
  @ApiProperty()
  $id?: string;
  @ApiProperty()
  id?: string;
  @ApiProperty()
  $schema?: string;
  @ApiProperty()
  $ref?: string;
  @ApiProperty()
  title?: string;
  @ApiProperty()
  description?: string;
  @ApiProperty()
  multipleOf?: number;
  @ApiProperty()
  maximum?: number;
  @ApiProperty()
  exclusiveMaximum?: number | boolean;
  @ApiProperty()
  minimum?: number;
  @ApiProperty()
  exclusiveMinimum?: number | boolean;
  @ApiProperty()
  maxLength?: number;
  @ApiProperty()
  minLength?: number;
  @ApiProperty()
  pattern?: string | RegExp;
  @ApiProperty()
  additionalItems?: boolean | Schema;
  @ApiProperty()
  items?: Schema | Schema[];
  @ApiProperty()
  maxItems?: number;
  @ApiProperty()
  minItems?: number;
  @ApiProperty()
  uniqueItems?: boolean;
  @ApiProperty()
  maxProperties?: number;
  @ApiProperty()
  minProperties?: number;
  @ApiProperty()
  required?: string[] | boolean;
  @ApiProperty()
  additionalProperties?: boolean | Schema;
  @ApiProperty()
  definitions?: {
    [name: string]: Schema;
  };
  @ApiProperty()
  properties?: {
    [name: string]: Schema;
  };
  @ApiProperty()
  patternProperties?: {
    [name: string]: Schema;
  };
  @ApiProperty()
  dependencies?: {
    [name: string]: Schema | string[];
  };
  @ApiProperty()
  const?: any;
  @ApiProperty()
  enum?: any[];
  @ApiProperty()
  type?: string | string[];
  @ApiProperty()
  format?: string;
  @ApiProperty()
  allOf?: Schema[];
  @ApiProperty()
  anyOf?: Schema[];
  @ApiProperty()
  oneOf?: Schema[];
  @ApiProperty()
  not?: Schema;
  @ApiProperty()
  if?: Schema;
  @ApiProperty()
  then?: Schema;
  @ApiProperty()
  else?: Schema;
}
