import {
  approveConnectorRequest,
  requestConnectorCreation,
  declineConnectorRequest,
  requestConnectorDeletion,
  deleteConnectorRequest,
  requestConnectorEdit,
  getConnectorDetailsPerEnv,
  getConnectorOverview,
  getConnectorRequests,
  getConnectorRequestsForApprover,
  getConnectors,
  updateConnectorDocumentation,
  requestConnectorClaim,
  requestConnectorPromotion,
} from "src/domain/connector/connector-api";
import {
  Connector,
  ConnectorDetailsForEnv,
  ConnectorDocumentationMarkdown,
  ConnectorOverview,
  ConnectorRequest,
  ConnectorRequestsForApprover,
  CreateConnectorRequestPayload,
} from "src/domain/connector/connector-types";

export {
  approveConnectorRequest,
  requestConnectorCreation,
  declineConnectorRequest,
  requestConnectorDeletion,
  deleteConnectorRequest,
  requestConnectorEdit,
  getConnectorDetailsPerEnv,
  getConnectorOverview,
  getConnectorRequests,
  getConnectorRequestsForApprover,
  getConnectors,
  updateConnectorDocumentation,
  requestConnectorClaim,
  requestConnectorPromotion,
};

export type {
  Connector,
  ConnectorDetailsForEnv,
  ConnectorDocumentationMarkdown,
  ConnectorOverview,
  ConnectorRequest,
  ConnectorRequestsForApprover,
  CreateConnectorRequestPayload,
};
