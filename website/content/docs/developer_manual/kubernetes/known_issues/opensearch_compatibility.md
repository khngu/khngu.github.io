---
title: Opensearch Compatibility
description: AWS OpenSearch
toc_hide: true
---


| Metadata | |
|:-----|:-----|
| Affected clusters | All |
| Affected k8s version | All |
| Observed at | Documenting: Feb '23, previously Olaf |
| Observed by | Alessio, Mikel |
| Solved by | Alessio, Sherief, Mikel |

We use AWS-managed OpenSearch but some technology for OSS elasticsearch. These are not fully compatible, see the [official feature list](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/features-by-version.html).

## Symptoms

- `elasticsearch-curator` job fails due to incompatibility:
  ```console
  2023-02-23 01:01:01,422 ERROR     Elasticsearch version 1.2.4 incompatible with this version of Curator (5.8.4)
  2023-02-23 01:01:01,422 CRITICAL  Curator cannot continue due to version incompatibilites. Exiting
  ```

- `jaeger-spark-dependencies` job fails:
  ```console
  WARNING: An illegal reflective access operation has occurred
  WARNING: Illegal reflective access by org.apache.spark.unsafe.Platform (file:/app/jaeger-spark-dependencies-0.0.1-SNAPSHOT.jar) to method java.nio.Bits.unaligned()
  WARNING: Please consider reporting this to the maintainers of org.apache.spark.unsafe.Platform
  Exception in thread "main" org.elasticsearch.hadoop.EsHadoopIllegalArgumentException: invalid map received dynamic_templates=[{span_tags_map={path_match=tag.*, mapping={ignore_above=256, type=keyword}}}, {process_tags_map={path_match=process.tag.*, mapping={ignore_above=256, type=keyword}}}]
  ```

## Fix

We can activate a compatibility mode in OpenSearch via HTTP request:

```bash
curl -X PUT https://logsearch.<ACCOUNT_DOMAIN>/_cluster/settings -d  '{"persistent":{"compatibility.override_main_response_version" : true}}' -H "content-type: application/json"
```

To stick with the GitOps approach, better activate the compatibility mode introduced in `elasticsearch-curator/v0.0.4` ([changelog](https://github.vodafone.com/VFDE-SOL/k8s-modules-sol/releases/tag/elasticsearch-curator%2Fv0.0.4)).

**Helm chart values:**

```yaml
es:
    compatibilityMode:
        enabled: true
```
