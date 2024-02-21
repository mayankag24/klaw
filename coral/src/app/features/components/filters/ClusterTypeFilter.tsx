import { NativeSelect } from "@aivenio/aquarium";
import { ChangeEvent } from "react";
import { clusterTypes } from "src/app/features/approvals/utils/cluster-helper";
import { useFiltersContext } from "src/app/features/components/filters/useFiltersContext";
import { ClusterDetails } from "src/domain/cluster";

type ClusterType = ClusterDetails["clusterType"];

function ClusterTypeFilter() {
  const { clusterType, setFilterValue } = useFiltersContext();

  const handleChangeClusterType = (e: ChangeEvent<HTMLSelectElement>) => {
    const nextOperationType = e.target.value as ClusterType;

    setFilterValue({ name: "clusterType", value: nextOperationType });
  };

  return (
    <NativeSelect
      labelText={"Filter by cluster type"}
      key={"filter-cluster-type"}
      defaultValue={clusterType}
      onChange={handleChangeClusterType}
    >
      {clusterTypes.map((clusterType) => {
        return (
          <option key={clusterType} value={clusterType}>
            {clusterType === "ALL" ? "All cluster types" : clusterType}
          </option>
        );
      })}
    </NativeSelect>
  );
}

export { ClusterTypeFilter };
