// import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
// import { ContextType, EnumValue, MapKey, SelfDescription } from './models';
//
// export class ParsedSchema extends SelfDescription {
//   @ApiPropertyOptional()
//   mapKey: MapKey;
//   @ApiPropertyOptional()
//   mapValue: ParsedSchema;
//   @ApiPropertyOptional({ type: [EnumValue] })
//   enumValues: EnumValue[];
//   @ApiPropertyOptional()
//   enumValueSchema: string;
//   @ApiPropertyOptional()
//   elementSchema: ParsedSchema;
// }
//
// export class ParsedProperty extends SelfDescription {
//   @ApiProperty()
//   schema: ParsedSchema;
//   @ApiPropertyOptional()
//   unit?: string;
//   @ApiPropertyOptional()
//   writable?: boolean;
// }
//
// export class ParsedRelationship extends SelfDescription {
//   @ApiPropertyOptional()
//   maxMultiplicity?: number;
//   @ApiPropertyOptional()
//   minMultiplicity?: number;
//   @ApiPropertyOptional({ type: [ParsedProperty], nullable: true })
//   properties?: ParsedProperty[];
//   @ApiPropertyOptional({ type: 'string' })
//   target?: string;
//   @ApiPropertyOptional()
//   writable?: boolean;
// }
//
// export class ParsedTelemetry extends SelfDescription {
//   @ApiProperty()
//   schema: ParsedSchema;
//   @ApiPropertyOptional()
//   unit?: string;
// }
//
// export class CommandPayload extends SelfDescription {
//   @ApiProperty()
//   schema: ParsedSchema;
// }
//
// export class ParsedCommand extends SelfDescription {
//   @ApiPropertyOptional()
//   request?: CommandPayload;
//   @ApiPropertyOptional()
//   response?: CommandPayload;
// }
//
// export class ParsedInterface extends SelfDescription {
//   @ApiProperty({ type: 'string', enum: ContextType })
//   '@context': ContextType.DTDL2;
//   @ApiProperty({
//     type: 'array',
//     items: { type: 'string' },
//   })
//   bases: string[] = [];
//   @ApiProperty({ type: [ParsedProperty] })
//   properties?: ParsedProperty[] = [];
//   @ApiProperty({ type: [ParsedRelationship] })
//   relationships?: ParsedRelationship[] = [];
//   @ApiProperty({ type: [ParsedTelemetry] })
//   telemetries?: ParsedTelemetry[] = [];
//   @ApiProperty({ type: () => [ParsedComponent] })
//   components?: ParsedComponent[] = [];
//   @ApiProperty({ type: [ParsedCommand] })
//   commands?: ParsedCommand[] = [];
// }
//
// export class ParsedComponent extends SelfDescription {
//   @ApiProperty()
//   schema: string;
// }
