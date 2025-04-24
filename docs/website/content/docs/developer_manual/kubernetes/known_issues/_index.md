---
title: Known Issues
description: Known issues for applications used in CET-EKS, legacy EKS or both.
categories: [Kubernetes]
tags: [CET, EKS]
weight: 100
---

It's a collection of links to known issues related to or used in Solstice EKS. We try to keep this up to date, but you might find more docs on the respective charts.

## AWS based

### OpenSearch
- [Compatibility issues with elasticsearch technology]({{< ref "opensearch_compatibility" >}})

## Base components

### Cluster Autoscaler
- [Cluster-Autoscaler pod continuously scaling in/out workernodes](https://github.vodafone.com/VFDE-SOL/k8s-modules-sol/blob/master/charts/cluster-autoscaler/docs/KNOWN_ISSUES.md)

### Descheduler
- [Frequent pods eviction from descheduler](https://github.vodafone.com/VFDE-SOL/k8s-modules-sol/blob/master/charts/descheduler/docs/KNOWN_ISSUES.md)

### Fluent Bit
- [Fluent-bit containers crash-looping with SIGSEGV](https://github.vodafone.com/VFDE-SOL/k8s-modules-sol/blob/master/charts/fluent-bit/docs/KNOWN_ISSUES.md#fluent-bit-containers-crash-looping-with-sigsegv)

### Elasticsearch Curator
- Curator job fails due to `incompatible version` -> [OpenSearch Compatibility]({{< ref "opensearch_compatibility" >}})

### Jaeger Operator
- Spark dependencies job fails due to some Hadoop Platform errors -> [OpenSearch Compatibility]({{< ref "opensearch_compatibility" >}})
