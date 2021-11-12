/**
 * Tributech catalog
 * <p>API to access and manage the known vocabulary for this node.<br /><br /><a href=\"https://tributech.io\" title=\"Website\">Website</a><br /><a href=\"https://github.com/tributech-solutions/tributech-catalog-api-client\" title =\"API Client on GitHub\">API Client on GitHub</a><br /><a href=\"https://tributech.atlassian.net/servicedesk/customer/portals\" title =\"Customer Support Portal\">Customer Support Portal</a><br /></p>
 *
 * The version of the OpenAPI document: 1.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { ArraySchema } from './array-schema';
import { ObjectSchema } from './object-schema';
import { Relationship } from './relationship';
import { EnumSchema } from './enum-schema';
import { MapSchema } from './map-schema';
import { Component } from './component';
import { Telemetry } from './telemetry';
import { Property } from './property';


export interface ExpandedInterface { 
    id?: string;
    comment?: string;
    description?: string;
    displayName?: string;
    type: ExpandedInterfaceTypeEnum;
    context: ExpandedInterfaceContextEnum;
    schemas?: string | ArraySchema | EnumSchema | MapSchema | ObjectSchema | null;
    bases?: Array<string> | null;
    properties?: Array<Property>;
    relationships?: Array<Relationship>;
    telemetries?: Array<Telemetry>;
    components?: Array<Component>;
}
export enum ExpandedInterfaceTypeEnum {
    Interface = 'Interface'
};
export enum ExpandedInterfaceContextEnum {
    Dtmidtdlcontext2 = 'dtmi:dtdl:context;2'
};



