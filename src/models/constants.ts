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
