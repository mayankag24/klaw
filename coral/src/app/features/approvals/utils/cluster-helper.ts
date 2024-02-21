import { ClusterDetails } from "src/domain/cluster";

const clusterTypes: ClusterDetails["clusterType"][] = [
  "ALL",
  "KAFKA",
  "SCHEMA_REGISTRY",
  "KAFKA_CONNECT",
];

export { clusterTypes };
