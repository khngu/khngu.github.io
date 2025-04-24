---
title: Observability
description: These pages hold concepts for observability in FusionC projects.
categories: [Observability]
tags: [CET, EKS, o11y]
aliases:
  - /docs/user_guide/o11y
weight: 10
---


[VF General Observability Guidelines](https://de.confluence.agile.vodafone.com/display/VFITDOC/TAD+-+Cloud+-+Logging+and+Metrics+Strategy)

## Introduction to OpenTelemetry

[Official Website](https://opentelemetry.io/)

The [CNCF project *OpenTelemetry*](https://www.cncf.io/projects/opentelemetry/) is a collection of software (SDKs, tools, ...) around the [**OpenTelemetry Line Protocol (OTLP)**](https://opentelemetry.io/docs/specs/otel/overview/). OTLP standardizes so-called *signals* (e.g. metrics, logs) syntactically and in terms of interoperability in a vendor-agnostic fashion. This adds a layer of abstraction and allows decoupling from central tools while still being compatible.

## Architecture

The center of the observability stack is the [CET EKS O11y](https://github.vodafone.com/pages/VFDE-ISS/cet-eks-o11y/) addon. It mainly consists of Grafana's LGTM stack, OpenTelemetry collectors for signal aggregation and configuration for Grafana like datasources and dashboards. Please read more about the addon in its official documentation.

## Principles

- **Extensibility**: Leveraging OTel allows seamless extention by additional tooling if needed. Adjusting existing components and creating new ones is a balance to keep and discuss actively.
- **Shared responsibility**: The extensibility allows to work on the stack with multiple teams, each responsible for different parts. Everyone own their share and interacts with the other teams to add value on the largest scale possible.
- **GitOps**: Everything is GitOps, there is no click & forget.

### Optional additions

| Name | Use case | Short description | Status |
|------|----------|-------------------|--------|
| [Exporter Metrics Sql](https://github.vodafone.com/VFDE-SOL/k8s-modules-sol-e2e/tree/master/charts/exporter-metrics-sql) | Create metrics from databases by evaluating SQL queries | Deploys an exporter in Kubernetes that fires the SQL queries and offers metrics via ServiceMonitor | Beta |
| [OTEL Collector Logs Cloudwatch](https://github.vodafone.com/VFDE-SOL/k8s-modules-sol-e2e/tree/master/charts/otel-collector-logs-cloudwatch) | Access logs from AWS services in O11y, e.g., RDS, EKS control plane | Deploys an OTEL collector in Kubernetes to fetch logs directly from AWS CloudWatch log groups and send them to Loki. Saves AWS requests = costs | Initial Development |
| [Exporter Metrics Cloudwatch](https://github.vodafone.com/VFDE-SOL/k8s-modules-sol-e2e/tree/master/charts/exporter-metrics-cloudwatch) | Access metrics from AWS services in O11y, e.g. RDS, load balancers | Deploys an exporter in Kubernetes that connects to AWS and sends the metrics to Mimir. Saves AWS requests = costs | Initial Development |
| [OTEL Collector Ingress](https://github.vodafone.com/VFDE-SOL/k8s-modules-sol-e2e/tree/master/charts/otel-collector-ingress) | Send signals from non-EKS, e.g. EC2, to O11y | OTLP Endpoint for Non-EKS workload, adds a load balancer which routes traffic to an extra OpenTelemetry collector | Initial Development |

{{< alert >}}
If your addition to O11y is missing, please raise a pull request.
{{< /alert >}}

## Additional Links

- [GitHub: open-telemetry/opentelemetry-collector-contrib](https://github.com/open-telemetry/opentelemetry-collector-contrib) - contains all community-contributed collector receivers, processors and exporters incl. their docs
- [OpenTelemetry Operator CRD docs](https://doc.crds.dev/github.com/open-telemetry/opentelemetry-helm-charts)
- [VFDE-ISS/cet-eks-o11y docs](https://github.vodafone.com/pages/VFDE-ISS/cet-eks-o11y/docs/)
