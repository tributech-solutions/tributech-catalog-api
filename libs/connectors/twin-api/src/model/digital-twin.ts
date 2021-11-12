/**
 * Tributech DataSpace Twin API
 * API for managing twin instances.
 *
 * The version of the OpenAPI document: v1
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { DigitalTwinMetadata } from './digital-twin-metadata';


export interface DigitalTwin { 
  [key: string]: any | any;


    $dtId?: string;
    $etag?: string | null;
    $metadata?: DigitalTwinMetadata;
}

