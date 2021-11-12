import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

export const appRoutes = {
  DASHBOARD: ['/dashboard'],
  DATASPACE_PAGE: ['/dataspace'],
  MY_STREAMS: ['/datasets'],
  SUBSCRIPTIONS: ['/subscriptions'],
  REQUESTS: ['/requests'],
  STATISTICS: ['/statistics'],
  ACCOUNT: ['/admin'],
  ORGANISATION: ['/organisation'],
  CONSORTIUM: ['/consortium'],
  CONSORTIUM_MEMBER: ['/consortium', 'member'],
  TOOLS: ['/tools'],
  AUDIT_TOOLS: ['/audit'],
  AUDIT: ['/audit'],
  AGENT_MANAGEMENT: ['/agents'],
  AGENT_DETAILS: ['/agents'],
  TWIN_MANAGEMENT: ['/twins'],
};

export const companionRoutes = {
  LOGIN: ['/login'],
  LINK_AGENT: ['/link-agent'],
  SYSTEM_INFO: ['/system-info'],
  CONFIGURATION: ['/configuration'],
};

export const appRouteParams = {
  DATA_SET_ID: 'dataSetId',
  PUBLICATION_ID: 'publicationId',
  VALUEMETADATA_ID: 'valueMetadataId',
  ORGANISATION_ID: 'organisationId',
  REQUEST_ID: 'requestId',
  TYPE: 'type',
  AGENT_ID: 'agentId',
  TWIN_ID: 'dtId',
};

export interface MenuItem {
  name?: string;
  type?: string;
  icon?: IconDefinition;
  path?: string | string[];
  separator?: boolean;
  preview?: boolean;
}
