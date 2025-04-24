---
title: How To Content
description: This page explains how to deal with business-related content.
categories: [Observability]
tags: [CET, EKS, o11y]
---

One essential part of E2E is that the content (business topics) don't affect only one, but multiple projects and/or teams. There must be guardrails to the collaboration to ensure a manageable developer and maintainer experience.

{{% alert %}}
This article relates to *E2E content*. This means business-related content like Grafana dashboards and configurations, and not technical resources like the O11y stack pods.
{{% /alert %}}

## Principles

- Everything that targets something end-to-end, is managed in and `-e2e` repository. The most important artifacts are **E2E dashboards**, which have to be **stored as helm charts in [k8s-modules-sol-e2e](https://github.vodafone.com/VFDE-SOL/k8s-modules-sol-e2e)**.
- **E2E accounts only contain cross-project/team contents.** Topics should be managed at the lowest level possible (e.g. own/shared account over E2E). Everything deployed to E2E must have a justification why it must be in E2E and not in lower level.
- **Responsibilities for E2E contents have to be documented.** Contributors are accountable - if there are no documented responsibilities, code contributors are held accountable. The team that operates the E2E accounts is not responsible for any E2E contents.

## Accessing Source-Specific Data

As the `source_name` labels are enforced by design, these can be used to access data for specific sources

- **Metrics**: List all metric names with their counts with `count({source_name="<SOURCE_NAME>"}) by (__name__)`
- **Logs**: Get all logs with `{service_name=~".+"} | source_name = "<SOURCE_NAME>"`

{{% alert color="warning" %}}
This log query is inefficient, as it would search all available data of all sources. It is highly recommended to trim the stream selector as much as possible. For more information about this, read [this section](../../../../../blog/2024-08-o11y-logs-changes/#bonus-easy-logql-query-optimization) in our blog post about CET EKS O11y v0.2 logs changes.

It is planned to add `source_name` as a Loki index label to make this query approach much more efficient. This depends on the upstream issue <a href="https://github.vodafone.com/VFDE-ISS/cet-eks-o11y/issues/349"><i class="fa-brands fa-github"></i> CET EKS O11y #349</a> though. This implementation on E2E-side will be announced and migration steps will be provided.
{{% /alert %}}

## Mandatory README Contents

- **Description** - What business case / E2E topic is covered?
- **Responsibilities** - Who is in charge of the topic (e.g. business process)? Which teams are involved? (See [RA(S)CI matric](https://www.interfacing.com/what-is-rasci-raci))
- **Required data** - Which data is required to make this component work?
