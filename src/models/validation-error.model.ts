import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ValidationError extends Error {
  constructor(message: string, private description?: string) {
    super(message);
  }

  toString() {
    return `${this.message} [${this.description}]`;
  }
}

// Based on Ajv error object
export class SchemaErrorObject<
  K extends string = string,
  P = Record<string, any>,
  S = unknown
> {
  @ApiProperty()
  keyword: K;
  @ApiProperty()
  instancePath: string;
  @ApiProperty()
  schemaPath: string;
  @ApiProperty()
  params: P;
  // Added to validation errors of "propertyNames" keyword schema
  @ApiPropertyOptional()
  propertyName?: string;
  // Excluded if option `messages` set to false.
  @ApiProperty()
  message?: string;
  // These are added with the `verbose` option.
  @ApiPropertyOptional()
  schema?: S;
  @ApiPropertyOptional()
  data?: unknown;
}

export class SchemaValidationError {
  @ApiProperty()
  success: boolean;
  @ApiProperty({ type: [SchemaErrorObject] })
  errors: SchemaErrorObject[];
}
