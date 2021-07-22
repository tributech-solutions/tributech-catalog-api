// import { Vertex } from 'jsonld-graph';
// import { TwinContentType } from '../models/constants';
// import {
//   Component,
//   ContextType,
//   EnumSchema,
//   Interface,
//   InterfaceType,
//   MapSchema,
//   ModelType,
//   ObjectSchema,
//   PrimitiveSchema,
//   Property,
//   Relationship,
//   Schema,
//   SchemaType,
//   Telemetry,
// } from '../models/models';
// import {
//   ParsedCommand,
//   ParsedComponent,
//   ParsedInterface,
//   ParsedProperty,
//   ParsedRelationship,
//   ParsedSchema,
//   ParsedTelemetry,
// } from '../models/parsed-models';
// import { getComment, getDescription, getDisplayName } from './model.utils';
//
// export function getObjectSchema(vertex: Vertex): ObjectSchema {
//   return {
//     '@type': SchemaType.Object,
//     '@id': vertex?.id,
//     comment: getComment(vertex),
//     description: getDescription(vertex),
//     displayName: getDisplayName(vertex),
//     fields: [
//       ...vertex
//         .getOutgoing('dtmi:dtdl:property:fields;2')
//         .map((edge) => ({
//           name: getPropertyName(edge.to) as string,
//           schema: inferSchema(edge.to) as Schema,
//         }))
//         .filter((edge) => !!edge.schema),
//     ],
//   };
// }
//
// export function getEnumSchema(vertex: Vertex): EnumSchema {
//   return {
//     '@type': SchemaType.Enum,
//     '@id': vertex?.id,
//     comment: getComment(vertex),
//     description: getDescription(vertex),
//     displayName: getDisplayName(vertex),
//     enumValues: [
//       ...vertex.getOutgoing('dtmi:dtdl:property:enumValues;2').map((edge) => ({
//         name: getPropertyName(edge.to),
//         displayName: getDisplayName(edge.to),
//         enumValue: edge.to.getAttributeValue('dtmi:dtdl:property:enumValue;2'),
//       })),
//     ],
//     valueSchema: vertex
//       .getOutgoing('dtmi:dtdl:property:valueSchema;2')
//       .map((edge) => edge.to.iri)
//       .first(),
//   };
// }
//
// export function getMapSchema(vertex: Vertex): MapSchema {
//   return {
//     '@type': SchemaType.Map,
//     '@id': vertex?.id,
//     comment: getComment(vertex),
//     description: getDescription(vertex),
//     displayName: getDisplayName(vertex),
//     mapKey: vertex
//       .getOutgoing('dtmi:dtdl:property:mapKey;2')
//       .map((edge) => ({
//         name: getPropertyName(edge.to),
//         schema: edge.to.id as string,
//       }))
//       .first(),
//     mapValue: vertex
//       .getOutgoing('dtmi:dtdl:property:mapValue;2')
//       .map((edge) => ({
//         name: getPropertyName(edge.to),
//         schema: inferSchema(edge.to) as Schema,
//       }))
//       .first(),
//   };
// }
//
// export function inferSchema(vertex: Vertex): Schema | undefined {
//   const schemaEdge = vertex.getOutgoing('dtmi:dtdl:property:schema;2').first();
//   if (!schemaEdge) return undefined;
//
//   if (schemaEdge.to.isType('dtmi:dtdl:class:Object;2')) {
//     return getObjectSchema(schemaEdge?.to);
//   }
//
//   if (schemaEdge.to.isType('dtmi:dtdl:class:Enum;2')) {
//     return getEnumSchema(schemaEdge?.to);
//   }
//
//   if (schemaEdge.to.isType('dtmi:dtdl:class:Map;2')) {
//     return getMapSchema(schemaEdge?.to);
//   }
//   return schemaEdge.to.id as PrimitiveSchema;
// }
//
// export function inferComponentSchema(
//   vertex: Vertex
// ): Interface | string | undefined {
//   const schemaEdge = vertex.getOutgoing('dtmi:dtdl:property:schema;2').first();
//
//   if (!schemaEdge) return undefined;
//
//   if (schemaEdge.to.isType('dtmi:dtdl:class:Interface;2')) {
//     return getInterfaceFromVertex(schemaEdge?.to);
//   }
//
//   return schemaEdge.to.id;
// }
//
// export function getPropertyFromVertex(vertex: Vertex): Property | undefined {
//   if (!vertex || !vertex?.isType(TwinContentType.Property)) {
//     return undefined;
//   }
//
//   return {
//     '@type': ModelType.Property,
//     name: getPropertyName(vertex),
//     displayName: getDisplayName(vertex),
//     schema: inferSchema(vertex),
//     writable: getPropertyWritable(vertex),
//     comment: getComment(vertex),
//     description: getDescription(vertex),
//   };
// }
//
// export function getTelemetryFromVertex(vertex: Vertex): Telemetry | undefined {
//   if (!vertex || !vertex?.isType(TwinContentType.Telemetry)) {
//     return undefined;
//   }
//
//   return {
//     '@type': ModelType.Telemetry,
//     name: getPropertyName(vertex),
//     displayName: getDisplayName(vertex),
//     schema: inferSchema(vertex),
//     comment: getComment(vertex),
//     description: getDescription(vertex),
//   };
// }
//
// export function getRelationshipFromVertex(
//   vertex: Vertex
// ): Relationship | undefined {
//   if (!vertex || !vertex?.isType(TwinContentType.Relationship)) {
//     return undefined;
//   }
//
//   const outgoing = vertex.getOutgoing('dtmi:dtdl:property:properties;2');
//   const properties = outgoing
//     .items()
//     .reduce(
//       (prev, v) => getContentFromVertex(v.to, TwinContentType.Property),
//       [] as Property[]
//     ) as Property[];
//
//   return {
//     '@type': ModelType.Relationship,
//     name: getPropertyName(vertex),
//     displayName: getDisplayName(vertex),
//     target: inferTarget(vertex),
//     comment: getComment(vertex),
//     description: getDescription(vertex),
//     properties,
//   };
// }
//
// export function getComponentFromVertex(vertex: Vertex): Component | undefined {
//   if (!vertex || !vertex?.isType(TwinContentType.Component)) {
//     return undefined;
//   }
//
//   return {
//     '@type': ModelType.Component,
//     name: getPropertyName(vertex),
//     displayName: getDisplayName(vertex),
//     comment: getComment(vertex),
//     description: getDescription(vertex),
//     schema: getInterfaceFromVertex(vertex),
//   };
// }
//
// export function getParsedSchema(v: Vertex): ParsedSchema {
//   return {
//     '@type': InterfaceType.Interface,
//     '@id': v.id,
//     '@context': ContextType.DTDL2,
//     displayName: getDisplayName(v),
//     comment: getComment(v),
//     description: getDescription(v),
//     contents: v
//       .getOutgoing('dtmi:dtdl:property:contents;2')
//       .items()
//       .map((edge) => mapToTwinType(edge?.to)),
//   };
// }
//
// export function parseInterface(v: Vertex): ParsedInterface {
//   if (!v) throw new Error('Empty Vertex!');
//   return {
//     '@id': v.id,
//     '@type': InterfaceType.Interface,
//     '@context': ContextType.DTDL2,
//     displayName: getDisplayName(v),
//     description: getDescription(v),
//     comment: getComment(v),
//     properties: getContentFromVertex(
//       v,
//       TwinContentType.Property
//     ) as ParsedProperty[],
//     relationships: getContentFromVertex(
//       v,
//       TwinContentType.Relationship
//     ) as ParsedRelationship[],
//     telemetries: getContentFromVertex(
//       v,
//       TwinContentType.Telemetry
//     ) as ParsedTelemetry[],
//     components: getContentFromVertex(
//       v,
//       TwinContentType.Component
//     ) as ParsedComponent[],
//     commands: getContentFromVertex(
//       v,
//       TwinContentType.Command
//     ) as ParsedCommand[],
//     bases: getBasesFromVertex(v),
//   };
// }
