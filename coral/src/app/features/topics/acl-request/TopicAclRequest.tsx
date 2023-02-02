import { Box } from "@aivenio/aquarium";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useForm } from "src/app/components/Form";
import AclTypeField from "src/app/features/topics/acl-request/fields/AclTypeField";
import SkeletonForm from "src/app/features/topics/acl-request/forms/SkeletonForm";
import TopicConsumerForm from "src/app/features/topics/acl-request/forms/TopicConsumerForm";
import TopicProducerForm from "src/app/features/topics/acl-request/forms/TopicProducerForm";
import topicConsumerFormSchema, {
  TopicConsumerFormSchema,
} from "src/app/features/topics/acl-request/schemas/topic-acl-request-consumer";
import topicProducerFormSchema, {
  TopicProducerFormSchema,
} from "src/app/features/topics/acl-request/schemas/topic-acl-request-producer";
import { ClusterInfo, Environment } from "src/domain/environment";
import { getClusterInfo } from "src/domain/environment/environment-api";
import { ENVIRONMENT_NOT_INITIALIZED } from "src/domain/environment/environment-types";
import { getTopicTeam, TopicTeam } from "src/domain/topic";
import useEnvironmentTopics from "src/app/features/topics/acl-request/queries/useEnvironmentTopics";

const TopicAclRequest = () => {
  const { topicName } = useParams();
  const [topicType, setTopicType] = useState("Producer");

  const topicProducerForm = useForm<TopicProducerFormSchema>({
    schema: topicProducerFormSchema,
    defaultValues: {
      topicname: topicName,
      environment: ENVIRONMENT_NOT_INITIALIZED,
      topictype: "Producer",
    },
  });

  const topicConsumerForm = useForm<TopicConsumerFormSchema>({
    schema: topicConsumerFormSchema,
    defaultValues: {
      aclPatternType: "LITERAL",
      topicname: topicName,
      environment: ENVIRONMENT_NOT_INITIALIZED,
      topictype: "Consumer",
      consumergroup: "-na-",
    },
  });

  const {
    scopedTopicNames,
    scopedTopicNamesIsLoading,
    environmentsIsLoading,
    validEnvironments,
  } = useEnvironmentTopics();

  const selectedPatternType =
    topicType === "Producer"
      ? topicProducerForm.watch("aclPatternType")
      : "LITERAL";
  const selectedTopicName =
    topicType === "Producer"
      ? topicProducerForm.watch("topicname")
      : topicConsumerForm.watch("topicname");
  useQuery<TopicTeam, Error>({
    queryKey: ["topicTeam", selectedTopicName, selectedPatternType, topicType],
    queryFn: () =>
      getTopicTeam({
        topicName: selectedTopicName,
        patternType: selectedPatternType,
      }),
    onSuccess: (data) => {
      if (data === undefined) {
        throw new Error("Could not fetch team for current Topic");
      }
      return topicType === "Producer"
        ? topicProducerForm.setValue("teamname", data.team)
        : topicConsumerForm.setValue("teamname", data.team);
    },
    enabled: selectedTopicName !== undefined,
    keepPreviousData: true,
  });

  const selectedEnvironment =
    topicType === "Producer"
      ? topicProducerForm.watch("environment")
      : topicConsumerForm.watch("environment");
  // We cast the type of selectedEnvironmentType to be Environment["type"]
  // Because there should be no case where this returns undefined
  // As an additional safety, this query is disabled when it *is* undefined
  const selectedEnvironmentType = validEnvironments.find(
    (env) => env.id === selectedEnvironment
  )?.type as Environment["type"];
  const { data: clusterInfo } = useQuery<ClusterInfo, Error>(
    ["cluster-info", selectedEnvironment, topicType],
    {
      queryFn: () =>
        getClusterInfo({
          envSelected: selectedEnvironment,
          envType: selectedEnvironmentType,
        }),
      keepPreviousData: true,
      enabled:
        selectedEnvironment !== ENVIRONMENT_NOT_INITIALIZED &&
        validEnvironments !== undefined &&
        selectedEnvironmentType !== undefined,
      onSuccess: (data) => {
        const isAivenCluster = data?.aivenCluster === "true";
        // Enable the only possible options when the environment chosen is Aiven Kafka flavor
        if (isAivenCluster) {
          if (topicType === "Producer") {
            topicProducerForm.setValue("aclPatternType", "LITERAL");
            topicProducerForm.setValue("aclIpPrincipleType", "PRINCIPAL");
            topicProducerForm.resetField("transactionalId");
          }
          if (topicType === "Consumer") {
            topicConsumerForm.setValue("aclIpPrincipleType", "PRINCIPAL");
          }
        }
      },
    }
  );

  if (environmentsIsLoading || scopedTopicNamesIsLoading) {
    return <SkeletonForm />;
  }

  const currentTopicNames =
    scopedTopicNames.find(
      (scoped) => scoped.environmentId === selectedEnvironment
    )?.topicNames || [];

  return (
    <Box maxWidth={"4xl"}>
      {topicType === "Consumer" ? (
        <TopicConsumerForm
          renderAclTypeField={() => (
            <AclTypeField topicType={topicType} handleChange={setTopicType} />
          )}
          topicConsumerForm={topicConsumerForm}
          topicNames={currentTopicNames}
          environments={validEnvironments}
          clusterInfo={clusterInfo}
        />
      ) : (
        <TopicProducerForm
          renderAclTypeField={() => (
            <AclTypeField topicType={topicType} handleChange={setTopicType} />
          )}
          topicProducerForm={topicProducerForm}
          topicNames={currentTopicNames}
          environments={validEnvironments}
          clusterInfo={clusterInfo}
        />
      )}
    </Box>
  );
};

export default TopicAclRequest;