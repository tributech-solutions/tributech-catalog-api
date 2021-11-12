export const context = {
  '@context': {
    '@vocab': 'http://azure.com/DigitalTwin/MetaModel/undefinedTerm/',
    dtmm: 'http://azure.com/DigitalTwin/MetaModel/',
    rdf: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
    rdfs: 'http://www.w3.org/2000/01/rdf-schema#',
    xsd: 'http://www.w3.org/2001/XMLSchema#',
    sh: 'http://www.w3.org/ns/shacl#',
    'rdfs:Class': { '@type': '@vocab' },
    'rdfs:subClassOf': { '@type': '@vocab' },
    'rdfs:domain': { '@type': '@vocab' },
    'sh:targetClass': { '@type': '@vocab' },
    'sh:datatype': { '@type': '@vocab' },
    'sh:lessThan': { '@type': '@vocab' },
    'sh:lessThanOrEquals': { '@type': '@vocab' },
    'sh:class': { '@type': '@vocab' },
    'sh:nodeKind': { '@type': '@vocab' },
    'sh:path': {
      '@type': '@vocab',
      '@container': '@list',
    },
    'sh:hasValue': { '@type': '@vocab' },
    'sh:in': {
      '@type': '@vocab',
      '@container': '@list',
    },
    'sh:or': { '@container': '@list' },
    'sh:alternativePath': {
      '@type': '@vocab',
      '@container': '@list',
    },
    'sh:inversePath': { '@type': '@vocab' },
    'sh:zeroOrMorePath': { '@type': '@vocab' },
    'sh:oneOrMorePath': { '@type': '@vocab' },
    'sh:zeroOrOnePath': { '@type': '@vocab' },
    'sh:ignoredProperties': {
      '@type': '@vocab',
      '@container': '@list',
    },
    'dtmm:aka': { '@type': '@vocab' },
    'dtmm:datatypeProperty': { '@type': '@vocab' },
    'dtmm:dictionaryKey': { '@type': '@vocab' },
    'dtmm:doppelganger': { '@type': '@vocab' },
    'dtmm:dtmiSegment': { '@type': '@vocab' },
    'dtmm:excludeType': { '@type': '@vocab' },
    'dtmm:importProperties': {
      '@type': '@vocab',
      '@container': '@list',
    },
    'dtmm:properties': {
      '@type': '@vocab',
      '@container': '@list',
    },
    'dtmm:replaceWith': { '@type': '@vocab' },
    'dtmm:uniqueProperties': {
      '@type': '@vocab',
      '@container': '@list',
    },

    Array: { '@id': 'dtmi:dtdl:class:Array;2' },
    Boolean: { '@id': 'dtmi:dtdl:class:Boolean;2' },
    ComplexSchema: { '@id': 'dtmi:dtdl:class:ComplexSchema;2' },
    Command: { '@id': 'dtmi:dtdl:class:Command;2' },
    CommandPayload: { '@id': 'dtmi:dtdl:class:CommandPayload;2' },
    CommandType: { '@id': 'dtmi:dtdl:class:CommandType;2' },
    Component: { '@id': 'dtmi:dtdl:class:Component;2' },
    Content: { '@id': 'dtmi:dtdl:class:Content;2' },
    Date: { '@id': 'dtmi:dtdl:class:Date;2' },
    DateTime: { '@id': 'dtmi:dtdl:class:DateTime;2' },
    Double: { '@id': 'dtmi:dtdl:class:Double;2' },
    Duration: { '@id': 'dtmi:dtdl:class:Duration;2' },
    Entity: { '@id': 'dtmi:dtdl:class:Entity;2' },
    Enum: { '@id': 'dtmi:dtdl:class:Enum;2' },
    EnumValue: { '@id': 'dtmi:dtdl:class:EnumValue;2' },
    Field: { '@id': 'dtmi:dtdl:class:Field;2' },
    Float: { '@id': 'dtmi:dtdl:class:Float;2' },
    Integer: { '@id': 'dtmi:dtdl:class:Integer;2' },
    Interface: { '@id': 'dtmi:dtdl:class:Interface;2' },
    Long: { '@id': 'dtmi:dtdl:class:Long;2' },
    Map: { '@id': 'dtmi:dtdl:class:Map;2' },
    MapKey: { '@id': 'dtmi:dtdl:class:MapKey;2' },
    MapValue: { '@id': 'dtmi:dtdl:class:MapValue;2' },
    NamedEntity: { '@id': 'dtmi:dtdl:class:NamedEntity;2' },
    NumericSchema: { '@id': 'dtmi:dtdl:class:NumericSchema;2' },
    Object: { '@id': 'dtmi:dtdl:class:Object;2' },
    PrimitiveSchema: { '@id': 'dtmi:dtdl:class:PrimitiveSchema;2' },
    Property: { '@id': 'dtmi:dtdl:class:Property;2' },
    Relationship: { '@id': 'dtmi:dtdl:class:Relationship;2' },
    Schema: { '@id': 'dtmi:dtdl:class:Schema;2' },
    SchemaField: { '@id': 'dtmi:dtdl:class:SchemaField;2' },
    SemanticType: { '@id': 'dtmi:dtdl:class:SemanticType;2' },
    SemanticUnit: { '@id': 'dtmi:dtdl:class:SemanticUnit;2' },
    String: { '@id': 'dtmi:dtdl:class:String;2' },
    Telemetry: { '@id': 'dtmi:dtdl:class:Telemetry;2' },
    TemporalSchema: { '@id': 'dtmi:dtdl:class:TemporalSchema;2' },
    Time: { '@id': 'dtmi:dtdl:class:Time;2' },
    Unit: { '@id': 'dtmi:dtdl:class:Unit;2' },
    UnitAttribute: { '@id': 'dtmi:dtdl:class:UnitAttribute;2' },

    RatioUnit: { '@id': 'dtmi:standard:class:RatioUnit;2' },
    DecimalUnit: { '@id': 'dtmi:standard:class:DecimalUnit;2' },
    DecimalPrefix: { '@id': 'dtmi:standard:class:DecimalPrefix;2' },
    BinaryUnit: { '@id': 'dtmi:standard:class:BinaryUnit;2' },
    BinaryPrefix: { '@id': 'dtmi:standard:class:BinaryPrefix;2' },
    QuantitativeType: { '@id': 'dtmi:standard:class:QuantitativeType;2' },

    Acceleration: { '@id': 'dtmi:standard:class:Acceleration;2' },
    Angle: { '@id': 'dtmi:standard:class:Angle;2' },
    AngularAcceleration: { '@id': 'dtmi:standard:class:AngularAcceleration;2' },
    AngularVelocity: { '@id': 'dtmi:standard:class:AngularVelocity;2' },
    Area: { '@id': 'dtmi:standard:class:Area;2' },
    Capacitance: { '@id': 'dtmi:standard:class:Capacitance;2' },
    Current: { '@id': 'dtmi:standard:class:Current;2' },
    DataRate: { '@id': 'dtmi:standard:class:DataRate;2' },
    DataSize: { '@id': 'dtmi:standard:class:DataSize;2' },
    Density: { '@id': 'dtmi:standard:class:Density;2' },
    Distance: { '@id': 'dtmi:standard:class:Distance;2' },
    ElectricCharge: { '@id': 'dtmi:standard:class:ElectricCharge;2' },
    Energy: { '@id': 'dtmi:standard:class:Energy;2' },
    Force: { '@id': 'dtmi:standard:class:Force;2' },
    Frequency: { '@id': 'dtmi:standard:class:Frequency;2' },
    Humidity: { '@id': 'dtmi:standard:class:Humidity;2' },
    Illuminance: { '@id': 'dtmi:standard:class:Illuminance;2' },
    Inductance: { '@id': 'dtmi:standard:class:Inductance;2' },
    Latitude: { '@id': 'dtmi:standard:class:Latitude;2' },
    Longitude: { '@id': 'dtmi:standard:class:Longitude;2' },
    Length: { '@id': 'dtmi:standard:class:Length;2' },
    Luminance: { '@id': 'dtmi:standard:class:Luminance;2' },
    Luminosity: { '@id': 'dtmi:standard:class:Luminosity;2' },
    LuminousFlux: { '@id': 'dtmi:standard:class:LuminousFlux;2' },
    LuminousIntensity: { '@id': 'dtmi:standard:class:LuminousIntensity;2' },
    MagneticFlux: { '@id': 'dtmi:standard:class:MagneticFlux;2' },
    MagneticInduction: { '@id': 'dtmi:standard:class:MagneticInduction;2' },
    Mass: { '@id': 'dtmi:standard:class:Mass;2' },
    MassFlowRate: { '@id': 'dtmi:standard:class:MassFlowRate;2' },
    Power: { '@id': 'dtmi:standard:class:Power;2' },
    Pressure: { '@id': 'dtmi:standard:class:Pressure;2' },
    RelativeHumidity: { '@id': 'dtmi:standard:class:RelativeHumidity;2' },
    Resistance: { '@id': 'dtmi:standard:class:Resistance;2' },
    SoundPressure: { '@id': 'dtmi:standard:class:SoundPressure;2' },
    Temperature: { '@id': 'dtmi:standard:class:Temperature;2' },
    Thrust: { '@id': 'dtmi:standard:class:Thrust;2' },
    TimeSpan: { '@id': 'dtmi:standard:class:TimeSpan;2' },
    Torque: { '@id': 'dtmi:standard:class:Torque;2' },
    Velocity: { '@id': 'dtmi:standard:class:Velocity;2' },
    Voltage: { '@id': 'dtmi:standard:class:Voltage;2' },
    Volume: { '@id': 'dtmi:standard:class:Volume;2' },
    VolumeFlowRate: { '@id': 'dtmi:standard:class:VolumeFlowRate;2' },

    AccelerationUnit: { '@id': 'dtmi:standard:class:AccelerationUnit;2' },
    AngleUnit: { '@id': 'dtmi:standard:class:AngleUnit;2' },
    AngularAccelerationUnit: {
      '@id': 'dtmi:standard:class:AngularAccelerationUnit;2',
    },
    AngularVelocityUnit: { '@id': 'dtmi:standard:class:AngularVelocityUnit;2' },
    AreaUnit: { '@id': 'dtmi:standard:class:AreaUnit;2' },
    CapacitanceUnit: { '@id': 'dtmi:standard:class:CapacitanceUnit;2' },
    ChargeUnit: { '@id': 'dtmi:standard:class:ChargeUnit;2' },
    CurrentUnit: { '@id': 'dtmi:standard:class:CurrentUnit;2' },
    DataRateUnit: { '@id': 'dtmi:standard:class:DataRateUnit;2' },
    DataSizeUnit: { '@id': 'dtmi:standard:class:DataSizeUnit;2' },
    DensityUnit: { '@id': 'dtmi:standard:class:DensityUnit;2' },
    EnergyUnit: { '@id': 'dtmi:standard:class:EnergyUnit;2' },
    ForceUnit: { '@id': 'dtmi:standard:class:ForceUnit;2' },
    FrequencyUnit: { '@id': 'dtmi:standard:class:FrequencyUnit;2' },
    IlluminanceUnit: { '@id': 'dtmi:standard:class:IlluminanceUnit;2' },
    InductanceUnit: { '@id': 'dtmi:standard:class:InductanceUnit;2' },
    LengthUnit: { '@id': 'dtmi:standard:class:LengthUnit;2' },
    LuminanceUnit: { '@id': 'dtmi:standard:class:LuminanceUnit;2' },
    LuminousFluxUnit: { '@id': 'dtmi:standard:class:LuminousFluxUnit;2' },
    LuminousIntensityUnit: {
      '@id': 'dtmi:standard:class:LuminousIntensityUnit;2',
    },
    MagneticFluxUnit: { '@id': 'dtmi:standard:class:MagneticFluxUnit;2' },
    MagneticInductionUnit: {
      '@id': 'dtmi:standard:class:MagneticInductionUnit;2',
    },
    MassUnit: { '@id': 'dtmi:standard:class:MassUnit;2' },
    MassFlowRateUnit: { '@id': 'dtmi:standard:class:MassFlowRateUnit;2' },
    PowerUnit: { '@id': 'dtmi:standard:class:PowerUnit;2' },
    PressureUnit: { '@id': 'dtmi:standard:class:PressureUnit;2' },
    ResistanceUnit: { '@id': 'dtmi:standard:class:ResistanceUnit;2' },
    SoundPressureUnit: { '@id': 'dtmi:standard:class:SoundPressureUnit;2' },
    TemperatureUnit: { '@id': 'dtmi:standard:class:TemperatureUnit;2' },
    TimeUnit: { '@id': 'dtmi:standard:class:TimeUnit;2' },
    TorqueUnit: { '@id': 'dtmi:standard:class:TorqueUnit;2' },
    Unitless: { '@id': 'dtmi:standard:class:Unitless;2' },
    VelocityUnit: { '@id': 'dtmi:standard:class:VelocityUnit;2' },
    VoltageUnit: { '@id': 'dtmi:standard:class:VoltageUnit;2' },
    VolumeUnit: { '@id': 'dtmi:standard:class:VolumeUnit;2' },
    VolumeFlowRateUnit: { '@id': 'dtmi:standard:class:VolumeFlowRateUnit;2' },

    baseUnit: {
      '@id': 'dtmi:dtdl:property:baseUnit;2',
      '@type': '@vocab',
    },
    bottomUnit: {
      '@id': 'dtmi:dtdl:property:bottomUnit;2',
      '@type': '@vocab',
    },
    commandType: {
      '@id': 'dtmi:dtdl:property:commandType;2',
      '@type': '@vocab',
    },
    comment: { '@id': 'dtmi:dtdl:property:comment;2' },
    contents: {
      '@id': 'dtmi:dtdl:property:contents;2',
      '@type': '@vocab',
    },
    description: {
      '@id': 'dtmi:dtdl:property:description;2',
      '@container': '@language',
      '@language': 'en',
    },
    displayName: {
      '@id': 'dtmi:dtdl:property:displayName;2',
      '@container': '@language',
      '@language': 'en',
    },
    elementSchema: {
      '@id': 'dtmi:dtdl:property:elementSchema;2',
      '@type': '@vocab',
    },
    enumValue: { '@id': 'dtmi:dtdl:property:enumValue;2' },
    enumValues: {
      '@id': 'dtmi:dtdl:property:enumValues;2',
      '@type': '@vocab',
    },
    exponent: { '@id': 'dtmi:dtdl:property:exponent;2' },
    extends: {
      '@id': 'dtmi:dtdl:property:extends;2',
      '@type': '@vocab',
    },
    fields: {
      '@id': 'dtmi:dtdl:property:fields;2',
      '@type': '@vocab',
    },
    mapKey: {
      '@id': 'dtmi:dtdl:property:mapKey;2',
      '@type': '@vocab',
    },
    mapValue: {
      '@id': 'dtmi:dtdl:property:mapValue;2',
      '@type': '@vocab',
    },
    maxMultiplicity: { '@id': 'dtmi:dtdl:property:maxMultiplicity;2' },
    minMultiplicity: { '@id': 'dtmi:dtdl:property:minMultiplicity;2' },
    name: { '@id': 'dtmi:dtdl:property:name;2' },
    prefix: {
      '@id': 'dtmi:dtdl:property:prefix;2',
      '@type': '@vocab',
    },
    properties: {
      '@id': 'dtmi:dtdl:property:properties;2',
      '@type': '@vocab',
    },
    request: {
      '@id': 'dtmi:dtdl:property:request;2',
      '@type': '@vocab',
    },
    response: {
      '@id': 'dtmi:dtdl:property:response;2',
      '@type': '@vocab',
    },
    schema: {
      '@id': 'dtmi:dtdl:property:schema;2',
      '@type': '@vocab',
    },
    schemas: {
      '@id': 'dtmi:dtdl:property:schemas;2',
      '@type': '@vocab',
    },
    symbol: { '@id': 'dtmi:dtdl:property:symbol;2' },
    target: {
      '@id': 'dtmi:dtdl:property:target;2',
      '@type': '@vocab',
    },
    topUnit: {
      '@id': 'dtmi:dtdl:property:topUnit;2',
      '@type': '@vocab',
    },
    unit: {
      '@id': 'dtmi:dtdl:property:unit;2',
      '@type': '@vocab',
    },
    valueSchema: {
      '@id': 'dtmi:dtdl:property:valueSchema;2',
      '@type': '@vocab',
    },
    writable: { '@id': 'dtmi:dtdl:property:writable;2' },

    asynchronous: { '@id': 'dtmi:dtdl:instance:CommandType:asynchronous;2' },
    synchronous: { '@id': 'dtmi:dtdl:instance:CommandType:synchronous;2' },
    boolean: { '@id': 'dtmi:dtdl:instance:Schema:boolean;2' },
    date: { '@id': 'dtmi:dtdl:instance:Schema:date;2' },
    dateTime: { '@id': 'dtmi:dtdl:instance:Schema:dateTime;2' },
    double: { '@id': 'dtmi:dtdl:instance:Schema:double;2' },
    duration: { '@id': 'dtmi:dtdl:instance:Schema:duration;2' },
    float: { '@id': 'dtmi:dtdl:instance:Schema:float;2' },
    integer: { '@id': 'dtmi:dtdl:instance:Schema:integer;2' },
    long: { '@id': 'dtmi:dtdl:instance:Schema:long;2' },
    string: { '@id': 'dtmi:dtdl:instance:Schema:string;2' },
    time: { '@id': 'dtmi:dtdl:instance:Schema:time;2' },

    deci: { '@id': 'dtmi:standard:unitprefix:deci;2' },
    centi: { '@id': 'dtmi:standard:unitprefix:centi;2' },
    milli: { '@id': 'dtmi:standard:unitprefix:milli;2' },
    micro: { '@id': 'dtmi:standard:unitprefix:micro;2' },
    nano: { '@id': 'dtmi:standard:unitprefix:nano;2' },
    pico: { '@id': 'dtmi:standard:unitprefix:pico;2' },
    femto: { '@id': 'dtmi:standard:unitprefix:femto;2' },
    atto: { '@id': 'dtmi:standard:unitprefix:atto;2' },
    zepto: { '@id': 'dtmi:standard:unitprefix:zepto;2' },
    yocto: { '@id': 'dtmi:standard:unitprefix:yocto;2' },
    deka: { '@id': 'dtmi:standard:unitprefix:deka;2' },
    hecto: { '@id': 'dtmi:standard:unitprefix:hecto;2' },
    kilo: { '@id': 'dtmi:standard:unitprefix:kilo;2' },
    mega: { '@id': 'dtmi:standard:unitprefix:mega;2' },
    giga: { '@id': 'dtmi:standard:unitprefix:giga;2' },
    tera: { '@id': 'dtmi:standard:unitprefix:tera;2' },
    peta: { '@id': 'dtmi:standard:unitprefix:peta;2' },
    exa: { '@id': 'dtmi:standard:unitprefix:exa;2' },
    zetta: { '@id': 'dtmi:standard:unitprefix:zetta;2' },
    yotta: { '@id': 'dtmi:standard:unitprefix:yotta;2' },
    kibi: { '@id': 'dtmi:standard:unitprefix:kibi;2' },
    mebi: { '@id': 'dtmi:standard:unitprefix:mebi;2' },
    gibi: { '@id': 'dtmi:standard:unitprefix:gibi;2' },
    tebi: { '@id': 'dtmi:standard:unitprefix:tebi;2' },
    pebi: { '@id': 'dtmi:standard:unitprefix:pebi;2' },
    exbi: { '@id': 'dtmi:standard:unitprefix:exbi;2' },
    zebi: { '@id': 'dtmi:standard:unitprefix:zebi;2' },
    yobi: { '@id': 'dtmi:standard:unitprefix:yobi;2' },

    metrePerSecondSquared: {
      '@id': 'dtmi:standard:unit:metrePerSecondSquared;2',
    },
    centimetrePerSecondSquared: {
      '@id': 'dtmi:standard:unit:centimetrePerSecondSquared;2',
    },
    gForce: { '@id': 'dtmi:standard:unit:gForce;2' },
    radian: { '@id': 'dtmi:standard:unit:radian;2' },
    degreeOfArc: { '@id': 'dtmi:standard:unit:degreeOfArc;2' },
    minuteOfArc: { '@id': 'dtmi:standard:unit:minuteOfArc;2' },
    secondOfArc: { '@id': 'dtmi:standard:unit:secondOfArc;2' },
    turn: { '@id': 'dtmi:standard:unit:turn;2' },
    radianPerSecondSquared: {
      '@id': 'dtmi:standard:unit:radianPerSecondSquared;2',
    },
    radianPerSecond: { '@id': 'dtmi:standard:unit:radianPerSecond;2' },
    degreePerSecond: { '@id': 'dtmi:standard:unit:degreePerSecond;2' },
    revolutionPerSecond: { '@id': 'dtmi:standard:unit:revolutionPerSecond;2' },
    revolutionPerMinute: { '@id': 'dtmi:standard:unit:revolutionPerMinute;2' },
    squareMetre: { '@id': 'dtmi:standard:unit:squareMetre;2' },
    squareCentimetre: { '@id': 'dtmi:standard:unit:squareCentimetre;2' },
    squareMillimetre: { '@id': 'dtmi:standard:unit:squareMillimetre;2' },
    squareKilometre: { '@id': 'dtmi:standard:unit:squareKilometre;2' },
    hectare: { '@id': 'dtmi:standard:unit:hectare;2' },
    squareFoot: { '@id': 'dtmi:standard:unit:squareFoot;2' },
    squareInch: { '@id': 'dtmi:standard:unit:squareInch;2' },
    acre: { '@id': 'dtmi:standard:unit:acre;2' },
    farad: { '@id': 'dtmi:standard:unit:farad;2' },
    millifarad: { '@id': 'dtmi:standard:unit:millifarad;2' },
    microfarad: { '@id': 'dtmi:standard:unit:microfarad;2' },
    nanofarad: { '@id': 'dtmi:standard:unit:nanofarad;2' },
    picofarad: { '@id': 'dtmi:standard:unit:picofarad;2' },
    coulomb: { '@id': 'dtmi:standard:unit:coulomb;2' },
    ampere: { '@id': 'dtmi:standard:unit:ampere;2' },
    microampere: { '@id': 'dtmi:standard:unit:microampere;2' },
    milliampere: { '@id': 'dtmi:standard:unit:milliampere;2' },
    bitPerSecond: { '@id': 'dtmi:standard:unit:bitPerSecond;2' },
    kibibitPerSecond: { '@id': 'dtmi:standard:unit:kibibitPerSecond;2' },
    mebibitPerSecond: { '@id': 'dtmi:standard:unit:mebibitPerSecond;2' },
    gibibitPerSecond: { '@id': 'dtmi:standard:unit:gibibitPerSecond;2' },
    tebibitPerSecond: { '@id': 'dtmi:standard:unit:tebibitPerSecond;2' },
    exbibitPerSecond: { '@id': 'dtmi:standard:unit:exbibitPerSecond;2' },
    zebibitPerSecond: { '@id': 'dtmi:standard:unit:zebibitPerSecond;2' },
    yobibitPerSecond: { '@id': 'dtmi:standard:unit:yobibitPerSecond;2' },
    bytePerSecond: { '@id': 'dtmi:standard:unit:bytePerSecond;2' },
    kibibytePerSecond: { '@id': 'dtmi:standard:unit:kibibytePerSecond;2' },
    mebibytePerSecond: { '@id': 'dtmi:standard:unit:mebibytePerSecond;2' },
    gibibytePerSecond: { '@id': 'dtmi:standard:unit:gibibytePerSecond;2' },
    tebibytePerSecond: { '@id': 'dtmi:standard:unit:tebibytePerSecond;2' },
    exbibytePerSecond: { '@id': 'dtmi:standard:unit:exbibytePerSecond;2' },
    zebibytePerSecond: { '@id': 'dtmi:standard:unit:zebibytePerSecond;2' },
    yobibytePerSecond: { '@id': 'dtmi:standard:unit:yobibytePerSecond;2' },
    bit: { '@id': 'dtmi:standard:unit:bit;2' },
    kibibit: { '@id': 'dtmi:standard:unit:kibibit;2' },
    mebibit: { '@id': 'dtmi:standard:unit:mebibit;2' },
    gibibit: { '@id': 'dtmi:standard:unit:gibibit;2' },
    tebibit: { '@id': 'dtmi:standard:unit:tebibit;2' },
    exbibit: { '@id': 'dtmi:standard:unit:exbibit;2' },
    zebibit: { '@id': 'dtmi:standard:unit:zebibit;2' },
    yobibit: { '@id': 'dtmi:standard:unit:yobibit;2' },
    byte: { '@id': 'dtmi:standard:unit:byte;2' },
    kibibyte: { '@id': 'dtmi:standard:unit:kibibyte;2' },
    mebibyte: { '@id': 'dtmi:standard:unit:mebibyte;2' },
    gibibyte: { '@id': 'dtmi:standard:unit:gibibyte;2' },
    tebibyte: { '@id': 'dtmi:standard:unit:tebibyte;2' },
    exbibyte: { '@id': 'dtmi:standard:unit:exbibyte;2' },
    zebibyte: { '@id': 'dtmi:standard:unit:zebibyte;2' },
    yobibyte: { '@id': 'dtmi:standard:unit:yobibyte;2' },
    kilogramPerCubicMetre: {
      '@id': 'dtmi:standard:unit:kilogramPerCubicMetre;2',
    },
    gramPerCubicMetre: { '@id': 'dtmi:standard:unit:gramPerCubicMetre;2' },
    joule: { '@id': 'dtmi:standard:unit:joule;2' },
    kilojoule: { '@id': 'dtmi:standard:unit:kilojoule;2' },
    megajoule: { '@id': 'dtmi:standard:unit:megajoule;2' },
    gigajoule: { '@id': 'dtmi:standard:unit:gigajoule;2' },
    electronvolt: { '@id': 'dtmi:standard:unit:electronvolt;2' },
    megaelectronvolt: { '@id': 'dtmi:standard:unit:megaelectronvolt;2' },
    kilowattHour: { '@id': 'dtmi:standard:unit:kilowattHour;2' },
    newton: { '@id': 'dtmi:standard:unit:newton;2' },
    pound: { '@id': 'dtmi:standard:unit:pound;2' },
    ounce: { '@id': 'dtmi:standard:unit:ounce;2' },
    ton: { '@id': 'dtmi:standard:unit:ton;2' },
    hertz: { '@id': 'dtmi:standard:unit:hertz;2' },
    kilohertz: { '@id': 'dtmi:standard:unit:kilohertz;2' },
    megahertz: { '@id': 'dtmi:standard:unit:megahertz;2' },
    gigahertz: { '@id': 'dtmi:standard:unit:gigahertz;2' },
    lux: { '@id': 'dtmi:standard:unit:lux;2' },
    footcandle: { '@id': 'dtmi:standard:unit:footcandle;2' },
    henry: { '@id': 'dtmi:standard:unit:henry;2' },
    millihenry: { '@id': 'dtmi:standard:unit:millihenry;2' },
    microhenry: { '@id': 'dtmi:standard:unit:microhenry;2' },
    metre: { '@id': 'dtmi:standard:unit:metre;2' },
    centimetre: { '@id': 'dtmi:standard:unit:centimetre;2' },
    millimetre: { '@id': 'dtmi:standard:unit:millimetre;2' },
    micrometre: { '@id': 'dtmi:standard:unit:micrometre;2' },
    nanometre: { '@id': 'dtmi:standard:unit:nanometre;2' },
    kilometre: { '@id': 'dtmi:standard:unit:kilometre;2' },
    foot: { '@id': 'dtmi:standard:unit:foot;2' },
    inch: { '@id': 'dtmi:standard:unit:inch;2' },
    mile: { '@id': 'dtmi:standard:unit:mile;2' },
    nauticalMile: { '@id': 'dtmi:standard:unit:nauticalMile;2' },
    astronomicalUnit: { '@id': 'dtmi:standard:unit:astronomicalUnit;2' },
    candelaPerSquareMetre: {
      '@id': 'dtmi:standard:unit:candelaPerSquareMetre;2',
    },
    lumen: { '@id': 'dtmi:standard:unit:lumen;2' },
    candela: { '@id': 'dtmi:standard:unit:candela;2' },
    weber: { '@id': 'dtmi:standard:unit:weber;2' },
    maxwell: { '@id': 'dtmi:standard:unit:maxwell;2' },
    tesla: { '@id': 'dtmi:standard:unit:tesla;2' },
    kilogram: { '@id': 'dtmi:standard:unit:kilogram;2' },
    gram: { '@id': 'dtmi:standard:unit:gram;2' },
    milligram: { '@id': 'dtmi:standard:unit:milligram;2' },
    microgram: { '@id': 'dtmi:standard:unit:microgram;2' },
    tonne: { '@id': 'dtmi:standard:unit:tonne;2' },
    slug: { '@id': 'dtmi:standard:unit:slug;2' },
    gramPerSecond: { '@id': 'dtmi:standard:unit:gramPerSecond;2' },
    kilogramPerSecond: { '@id': 'dtmi:standard:unit:kilogramPerSecond;2' },
    gramPerHour: { '@id': 'dtmi:standard:unit:gramPerHour;2' },
    kilogramPerHour: { '@id': 'dtmi:standard:unit:kilogramPerHour;2' },
    watt: { '@id': 'dtmi:standard:unit:watt;2' },
    microwatt: { '@id': 'dtmi:standard:unit:microwatt;2' },
    milliwatt: { '@id': 'dtmi:standard:unit:milliwatt;2' },
    kilowatt: { '@id': 'dtmi:standard:unit:kilowatt;2' },
    megawatt: { '@id': 'dtmi:standard:unit:megawatt;2' },
    gigawatt: { '@id': 'dtmi:standard:unit:gigawatt;2' },
    horsepower: { '@id': 'dtmi:standard:unit:horsepower;2' },
    kilowattHourPerYear: { '@id': 'dtmi:standard:unit:kilowattHourPerYear;2' },
    pascal: { '@id': 'dtmi:standard:unit:pascal;2' },
    kilopascal: { '@id': 'dtmi:standard:unit:kilopascal;2' },
    bar: { '@id': 'dtmi:standard:unit:bar;2' },
    millibar: { '@id': 'dtmi:standard:unit:millibar;2' },
    millimetresOfMercury: {
      '@id': 'dtmi:standard:unit:millimetresOfMercury;2',
    },
    poundPerSquareInch: { '@id': 'dtmi:standard:unit:poundPerSquareInch;2' },
    inchesOfMercury: { '@id': 'dtmi:standard:unit:inchesOfMercury;2' },
    inchesOfWater: { '@id': 'dtmi:standard:unit:inchesOfWater;2' },
    ohm: { '@id': 'dtmi:standard:unit:ohm;2' },
    milliohm: { '@id': 'dtmi:standard:unit:milliohm;2' },
    kiloohm: { '@id': 'dtmi:standard:unit:kiloohm;2' },
    megaohm: { '@id': 'dtmi:standard:unit:megaohm;2' },
    decibel: { '@id': 'dtmi:standard:unit:decibel;2' },
    bel: { '@id': 'dtmi:standard:unit:bel;2' },
    kelvin: { '@id': 'dtmi:standard:unit:kelvin;2' },
    degreeCelsius: { '@id': 'dtmi:standard:unit:degreeCelsius;2' },
    degreeFahrenheit: { '@id': 'dtmi:standard:unit:degreeFahrenheit;2' },
    second: { '@id': 'dtmi:standard:unit:second;2' },
    millisecond: { '@id': 'dtmi:standard:unit:millisecond;2' },
    microsecond: { '@id': 'dtmi:standard:unit:microsecond;2' },
    nanosecond: { '@id': 'dtmi:standard:unit:nanosecond;2' },
    minute: { '@id': 'dtmi:standard:unit:minute;2' },
    hour: { '@id': 'dtmi:standard:unit:hour;2' },
    day: { '@id': 'dtmi:standard:unit:day;2' },
    year: { '@id': 'dtmi:standard:unit:year;2' },
    unity: { '@id': 'dtmi:standard:unit:unity;2' },
    percent: { '@id': 'dtmi:standard:unit:percent;2' },
    newtonMetre: { '@id': 'dtmi:standard:unit:newtonMetre;2' },
    metrePerSecond: { '@id': 'dtmi:standard:unit:metrePerSecond;2' },
    centimetrePerSecond: { '@id': 'dtmi:standard:unit:centimetrePerSecond;2' },
    kilometrePerSecond: { '@id': 'dtmi:standard:unit:kilometrePerSecond;2' },
    metrePerHour: { '@id': 'dtmi:standard:unit:metrePerHour;2' },
    kilometrePerHour: { '@id': 'dtmi:standard:unit:kilometrePerHour;2' },
    milePerHour: { '@id': 'dtmi:standard:unit:milePerHour;2' },
    milePerSecond: { '@id': 'dtmi:standard:unit:milePerSecond;2' },
    knot: { '@id': 'dtmi:standard:unit:knot;2' },
    volt: { '@id': 'dtmi:standard:unit:volt;2' },
    millivolt: { '@id': 'dtmi:standard:unit:millivolt;2' },
    microvolt: { '@id': 'dtmi:standard:unit:microvolt;2' },
    kilovolt: { '@id': 'dtmi:standard:unit:kilovolt;2' },
    megavolt: { '@id': 'dtmi:standard:unit:megavolt;2' },
    cubicMetre: { '@id': 'dtmi:standard:unit:cubicMetre;2' },
    cubicCentimetre: { '@id': 'dtmi:standard:unit:cubicCentimetre;2' },
    litre: { '@id': 'dtmi:standard:unit:litre;2' },
    millilitre: { '@id': 'dtmi:standard:unit:millilitre;2' },
    cubicFoot: { '@id': 'dtmi:standard:unit:cubicFoot;2' },
    cubicInch: { '@id': 'dtmi:standard:unit:cubicInch;2' },
    fluidOunce: { '@id': 'dtmi:standard:unit:fluidOunce;2' },
    gallon: { '@id': 'dtmi:standard:unit:gallon;2' },
    litrePerSecond: { '@id': 'dtmi:standard:unit:litrePerSecond;2' },
    millilitrePerSecond: { '@id': 'dtmi:standard:unit:millilitrePerSecond;2' },
    litrePerHour: { '@id': 'dtmi:standard:unit:litrePerHour;2' },
    millilitrePerHour: { '@id': 'dtmi:standard:unit:millilitrePerHour;2' },

    point: { '@id': 'dtmi:standard:schema:geospatial:point;2' },
    multiPoint: { '@id': 'dtmi:standard:schema:geospatial:multiPoint;2' },
    lineString: { '@id': 'dtmi:standard:schema:geospatial:lineString;2' },
    multiLineString: {
      '@id': 'dtmi:standard:schema:geospatial:multiLineString;2',
    },
    polygon: { '@id': 'dtmi:standard:schema:geospatial:polygon;2' },
    multiPolygon: { '@id': 'dtmi:standard:schema:geospatial:multiPolygon;2' },
  },
};
