import { Injectable } from '@angular/core';
import { appRoutes } from '../router';

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  getDataSetsPage() {
    return [...appRoutes.MY_STREAMS];
  }

  getDashboardPage() {
    return [...appRoutes.DASHBOARD];
  }

  getSubscriptionsPage() {
    return [...appRoutes.SUBSCRIPTIONS];
  }

  getRequestsPage() {
    return [...appRoutes.REQUESTS];
  }

  getDataSpacePage() {
    return [...appRoutes.DATASPACE_PAGE];
  }

  getStatisticsPage() {
    return [...appRoutes.STATISTICS];
  }

  getAdminPage() {
    return [...appRoutes.ACCOUNT];
  }

  getConsortiumMemberPage(organisationId: string) {
    return [...appRoutes.CONSORTIUM_MEMBER, organisationId];
  }

  getAuditToolOverviewPage() {
    return [...appRoutes.AUDIT_TOOLS];
  }

  getAuditToolPage(valueMetadataId: string) {
    return [...appRoutes.AUDIT, valueMetadataId];
  }

  getAgentManagementPage() {
    return [...appRoutes.AGENT_MANAGEMENT];
  }

  getTwinManagementPage() {
    return [...appRoutes.TWIN_MANAGEMENT];
  }

  getAgentDetailsPage(agentId: string) {
    return [...appRoutes.AGENT_DETAILS, agentId];
  }
}
