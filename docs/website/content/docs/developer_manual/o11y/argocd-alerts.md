---
title: ArgoCD Alerts
description: This page explains how to get alerts from ArgoCD to DevOps teams' receivers.
categories: [Observability]
tags: [CET, EKS, o11y]
aliases:
  - /docs/user_guide/o11y/argocd-alerts
---

As the ArgoCD instances run in Tesla's mgmt account, teams cannot directly get alerts related to their respective ArgoCD instances. This page explains which alerts are available for ArgoCD instances and how teams can configure to receive their corresponding alerts.

## Available Alerts

### ArgoAppNotSynced

This is an alerts coming from the ArgoCD upstream. It's description is:

> The application *APPLICATION_NAME* has not been synchronized for over 12 hours which means that the state of this cloud has drifted away from the state inside Git.

This can happen when the auto-sync capability of an application is disabled, or if a deployment is faulty (helm error). In this case, go to the ArgoCD UI, see what is happening and act accordingly.

### ArgoAppMissing

This is an alerts coming from the ArgoCD upstream. It's description is:

> Argo CD has not reported any applications data for the past 15 minutes which means that it must be down or not functioning properly. This needs to be resolved for this cloud to continue to maintain state.

This means that ArgoCD is not reconciling the respective application properly. If you receive such an alert, get in touch with Tesla team for troubleshooting.

### ArgoGitRequestsHigh

This is an alert added by Tesla team after recurring problems with high traffic from our ArgoCD instances sent to the GitHub Enterprise Server. This alert is instance-scoped and is tracing a specific application. The root cause has to be identified individually by accessing the ArgoCD UI. A very common reason is an application with some auto-conversion which leads to a permanent difference between desired and live manifest, and a new sync attempt about every second.

## How To Get The Alerts

{{% alert color="success" title="Note" %}}
Please get in touch with Tesla team first before touching the account
{{% /alert %}}

The way to receive alerts is identical to the known way for the project clusters (see [O11y docs about this](https://github.vodafone.com/pages/VFDE-ISS/cet-eks-o11y/docs/concepts/alerting/)). The only difference is that it has to be configured in Tesla's mgmt account. [Here's the direct link](https://github.vodafone.com/VFDE-SOL/k8s-apps-mgmt-sol-vfde/blob/master/apps/templates/apps/cet-eks-o11y.yaml) to the config file for that account's CET EKS O11y stack.

Please create a receiver with a meaningful and recognizable name. It must be unique across all projects and teams - only `prod` is not unique, `<TEAM_NAME>-prod-<PROJECT_SLUG>` is a lot better. The alert route should look similar to this:

```yaml
config:
  alerts:
    routes:
      - receiver: tesla-mgmt-notification-channel
        matchers:
        - alertname =~ "ArgoAppNotSynced|ArgoAppMissing|ArgoGitRequestsHigh"
        - namespace = "argocd-<SHORT_ALIAS>"
```
