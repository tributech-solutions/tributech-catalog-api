export interface JSONSchema {
  $id?: string;
  id?: string;
  $schema?: string;
  $ref?: string;
  title?: string;
  description?: string;
  multipleOf?: number;
  maximum?: number;
  exclusiveMaximum?: number | boolean;
  minimum?: number;
  exclusiveMinimum?: number | boolean;
  maxLength?: number;
  minLength?: number;
  pattern?: string | RegExp;
  additionalItems?: boolean | JSONSchema;
  items?: JSONSchema | JSONSchema[];
  maxItems?: number;
  minItems?: number;
  uniqueItems?: boolean;
  maxProperties?: number;
  minProperties?: number;
  required?: string[] | boolean;
  additionalProperties?: boolean | JSONSchema;
  definitions?: {
    [name: string]: JSONSchema;
  };
  properties?: {
    [name: string]: JSONSchema;
  };
  patternProperties?: {
    [name: string]: JSONSchema;
  };
  dependencies?: {
    [name: string]: JSONSchema | string[];
  };
  const?: any;
  enum?: any[];
  type?: string | string[];
  format?: string;
  allOf?: JSONSchema[];
  anyOf?: JSONSchema[];
  oneOf?: JSONSchema[];
  not?: JSONSchema;
  if?: JSONSchema;
  then?: JSONSchema;
  else?: JSONSchema;
}
