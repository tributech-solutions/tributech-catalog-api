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
import { Property } from './property';


export interface Relationship { 
    id?: string;
    comment?: string;
    description?: string;
    displayName?: string;
    type: RelationshipTypeEnum;
    name: string;
    maxMultiplicity?: number;
    minMultiplicity?: number;
    properties?: Array<Property> | null;
    target?: string;
}
export enum RelationshipTypeEnum {
    Relationship = 'Relationship'
};



