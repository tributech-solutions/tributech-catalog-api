export enum RelationType {
  Source = 'outgoing',
  Target = 'incoming',
  All = 'all',
}

export enum TwinContentType {
  Property = 'dtmi:dtdl:class:Property;2',
  Telemetry = 'dtmi:dtdl:class:Telemetry;2',
  Relationship = 'dtmi:dtdl:class:Relationship;2',
  Component = 'dtmi:dtdl:class:Component;2',
  Command = 'dtmi:dtdl:class:Command;2',
}

export enum ComplexSchemaType {
  Object = 'dtmi:dtdl:class:Object;2',
  Enum = 'dtmi:dtdl:class:Enum;2',
  Map = 'dtmi:dtdl:class:Map;2',
}

export enum InterfaceType {
  Interface = 'Interface',
}

export enum ContextType {
  DTDL2 = 'dtmi:dtdl:context;2',
}

export enum SelfDescriptionType {
  Interface = 'Interface',
  Property = 'Property',
  Relationship = 'Relationship',
  Telemetry = 'Telemetry',
  Component = 'Component',
  Command = 'Command',
  Array = 'Array',
  Enum = 'Enum',
  Map = 'Map',
  Object = 'Object',
}

// export enum ModelType {
//   Interface = 'Interface',
//   Property = 'Property',
//   Telemetry = 'Telemetry',
//   Command = 'Command',
//   Component = 'Component',
//   Relationship = 'Relationship',
// }
//
// export enum SelfDescriptionSchemaType {
//   Enum = 'Enum',
//   Map = 'Map',
//   Object = 'Object',
//   Array = 'Array',
// }
