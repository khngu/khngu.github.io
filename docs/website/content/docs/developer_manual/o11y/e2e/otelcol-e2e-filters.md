---
title: Using OTelCol Filters
description: This page explains how to leverage the filter processors in OpenTelemetry Collectors to configure which data to send.
categories: [Observability]
tags: [CET, EKS, o11y]
---

The recommended way to selectively send data from workload to E2E accounts with OpenTelemetry Collectors is by using the [`filter`](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/processor/filterprocessor) processor. The following guide explains how to configure which data is sent, for these helm charts:

- [otel-collector-k8s-logs](https://github.vodafone.com/VFDE-SOL/k8s-modules-sol-e2e/tree/master/charts/otel-collector-k8s-logs)
- [otel-collector-k8s-metrics](https://github.vodafone.com/VFDE-SOL/k8s-modules-sol-e2e/tree/master/charts/otel-collector-k8s-metrics)
- [otel-collector-ingress](https://github.vodafone.com/VFDE-SOL/k8s-modules-sol-e2e/tree/master/charts/otel-collector-ingress)

{{% alert color="warning" %}}
Traces are not supported.
{{% /alert %}}

## Metrics

Metrics can be selected by name and/or by label. List entries in `shippedMetrics` are OR-combined, meaning if a metric datapoint matches one of multiple entries, it is sent. A list entry must have at least `metricName` or `labels`. These are AND-combined.

- `metricsName`: Name of a metric to be sent. This is the name in the OTLP context, which can differ from what is shown in Grafana.
- `labels`: List of elements with `name` and `filter`
  - `name`: The name of the label
  - `filter`: The filter which is applied to the label value. This accepts a regular expression.

See [below](#identifying-available-resource-attributes) how to identify the OTLP name of a metric. This should be identical for in-cluster metrics.

```yaml
config:
  e2e:
    shippedMetrics:
      - metricName: kube_pod_info
        labels:
          - name: namespace
            filter: .*-system$
          - name: deployment
            filter: ^istio-ingress.*
      - labels:
        - name: state
          filter: ^free$
        - name: device
          filter: ".*1$"
      - metricName: system.disk.operations
```

The example above sends the following data:
- All datapoints of the metric `kube_pod_info` with `namespace` suffixed with `-system` and `deployment` prefixed with `istio-ingress`
- All datapoints of all metrics with `state` equal to `free` and a `device` ending with `1`
- All datapoints of the metric `system.disk.operations` (in Grafana available as `system_disk_operations_total`)

</details>

## Logs

Logs can be selected by a specific set of criteria. It's based on OTLP resource attributes, which translate to fields in Grafana, but with a slightly different syntax (dots instead of underscores). List entries of `shippedLogs` are OR-combined, their contents are AND-combined..

- `resourceAttributes`: List of filters on resource attributes
  - `field`: The name of the resource attribute
  - `filter`: The filter which is applied to the field value. This accepts a regular expression.

See [below](#identifying-available-resource-attributes) how to identify available resource attributes.

```yaml
config:
  e2e:
    shippedLogs:
      - resourceAttributes:
        - field: k8s.deployment.name
          filter: ^cilium-operator$
      - resourceAttributes:
        - field: k8s.deployment.name
          filter: ^istio-ingress.*
        - field: k8s.namespace.name
          filter: ^istio-routing.*
```

The example above sends the following data:
- All logs having a resource attribute `k8s.deployment.name` equal to `cilium-operator`
- All logs having a resource attribute `k8s.deployment.name` prefixed with `istio-ingress` and a resource attribute `k8s.namespace.name` prefixed with `istio-routing`

## Identifying Available Resource Attributes

{{% alert title="Support for OpenTelemetry Collector only" color="warning" %}}
OpenTelemetry Collector is the default and recommended application to be used as observability agent. If you choose to use something else (e.g. Grafana Alloy, AWS ADOT), you own this decision with all consequences. You have to identify this on your own.
{{% /alert %}}

As different sending deployment (OpenTelemetry Collectors or similar) annotate different metadata to their data, identifying the correct filter configuration can be hard. The most generic but always succeeding approach is enabling the `debug` exporter to print log data to stdout. As this might be different for each Helm chart containing an OpenTelemetry Collector, the blank configuration is explained below. Check the chart's source code to see how to enable the `debug` exporter with given variables, raise a feature request and/or disable ArgoCD auto-sync and edit the `OpenTelemetryCollector` custom resource manually to follow along.

The [`debug` exporter](https://github.com/open-telemetry/opentelemetry-collector/tree/main/exporter/debugexporter) must be initialized with `verbosity: detailed` and then added to the target pipeline as additional exporter:

```yaml
exporters:
  debug:
    verbosity: detailed
service:
  pipelines:
    logs: # this can be different
      receivers: [...]
      exporters: [..., debug]
```

<details style="margin-bottom: 1rem;">
<summary><code>debug</code> exporter example for k8s logs</summary>

```
ResourceLog #0
Resource SchemaURL:
Resource attributes:
     -> k8s.pod.uid: Str(9efb9d54-4a0d-4ca9-abf6-e4ddd3bc7b30)
     -> k8s.container.name: Str(cilium-operator)
     -> k8s.namespace.name: Str(kube-system)
     -> k8s.pod.name: Str(cilium-operator-778674948b-wvfvj)
     -> k8s.container.restart_count: Str(0)
     -> k8s.replicaset.uid: Str(2a1cd23f-b7a1-477d-bca5-64c5475f3a5a)
     -> k8s.replicaset.name: Str(cilium-operator-778674948b)
     -> k8s.deployment.name: Str(cilium-operator)
     -> k8s.node.name: Str(ip-100-126-106-188.eu-central-1.compute.internal)
     -> k8s.pod.start_time: Str(2024-10-30T05:49:02Z)
     -> container.image.name: Str(196433213517.dkr.ecr.eu-central-1.amazonaws.com/quay/cilium/operator-aws)
     -> container.image.tag: Str(v1.12.15)
     -> service.name: Str(cilium-operator)
     -> cluster: Str(dev1)
ScopeLogs #0
ScopeLogs SchemaURL:
InstrumentationScope
LogRecord #0
ObservedTimestamp: 2024-10-30 14:39:41.963160043 +0000 UTC
Timestamp: 2024-10-30 14:39:41.824361605 +0000 UTC
SeverityText:
SeverityNumber: Unspecified(0)
Body: Str(2024-10-30T14:39:41.824361605Z stderr F level=info msg=\"Synchronized ENI information\" numInstances=7 numSecurityGroups=22 numSubnets=15 numVPCs=1 subsys=eni)
Attributes:
     -> log.file.path: Str(/var/log/pods/kube-system_cilium-operator-778674948b-wvfvj_9efb9d54-4a0d-4ca9-abf6-e4ddd3bc7b30/cilium-operator/0.log)
     -> log: Str(level=info msg=\"Synchronized ENI information\" numInstances=7 numSecurityGroups=22 numSubnets=15 numVPCs=1 subsys=eni)
     -> time: Str(2024-10-30T14:39:41.824361605Z)
     -> log.iostream: Str(stderr)
     -> logtag: Str(F)
Trace ID:
Span ID:
Flags: 0
```

This gives us a list of 14 resource attributes, but also a list of 5 attributes (without *resource*!) that cannot be used as a filter.

</details>

<details style="margin-bottom: 1rem;">
<summary><code>debug</code> exporter example for EC2 metrics</summary>

```
ResourceMetrics #10
Resource SchemaURL: https://opentelemetry.io/schemas/1.9.0
Resource attributes:
-> cloud.provider: Str(aws)
-> cloud.platform: Str(aws_ec2)
-> cloud.region: Str(eu-central-1)
-> cloud.account.id: Str(195729192670)
-> cloud.availability_zone: Str(eu-central-1b)
-> host.id: Str(i-03f9e34eff86810eb)
-> host.image.id: Str(ami-03bd67641eeab9cf1)
-> host.type: Str(t2.micro)
-> host.name: Str(ip-100-126-101-8.eu-central-1.compute.internal)
-> ec2.tag.aws:ec2launchtemplate:id: Str(lt-0693c15c3b3d41e46)
-> ec2.tag.aws:ec2launchtemplate:version: Str(1)
-> ec2.tag.aws:autoscaling:groupName: Str(bastionhost-1)
ScopeMetrics #0
ScopeMetrics SchemaURL:
InstrumentationScope github.com/open-telemetry/opentelemetry-collector-contrib/receiver/hostmetricsreceiver/internal/scraper/diskscraper 0.107.0
[...]
Metric #4
Descriptor:
-> Name: system.disk.operations
-> Description: Disk operations count.
-> Unit: {operations}
-> DataType: Sum
-> IsMonotonic: true
-> AggregationTemporality: Cumulative
NumberDataPoints #0
Data point attributes:
-> device: Str(xvda)
-> direction: Str(read)
-> service.name: Str(bastionhost)
StartTimestamp: 2024-11-20 03:01:57 +0000 UTC
Timestamp: 2024-11-20 08:57:43.896859078 +0000 UTC
Value: 281732
NumberDataPoints #1
Data point attributes:
-> device: Str(xvda)
-> direction: Str(write)
-> service.name: Str(bastionhost)
StartTimestamp: 2024-11-20 03:01:57 +0000 UTC
Timestamp: 2024-11-20 08:57:43.896859078 +0000 UTC
Value: 120981
[...]
```

This gives us a list of valid resource attributes, but also the `Descriptor` section with `Name: system.disk.operations`.

</details>

### Available Resource Attributes for In-Cluster Logs

- `k8s.pod.uid`
- `k8s.container.name`
- `k8s.namespace.name`
- `k8s.pod.name`
- `k8s.container.restart_count`
- `k8s.replicaset.uid`
- `k8s.replicaset.name`
- `k8s.deployment.name`
- `k8s.node.name`
- `k8s.pod.start_time`
- `container.image.name`
- `container.image.tag`
- `service.name`
