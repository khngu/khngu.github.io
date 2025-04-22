---
title: Downscaling
description: This is a guide to the correct activation and configuration of the Kube Downscaler.
categories: [Kubernetes]
tags: [CET, EKS]
weight: 20
---

# Kube-downscaler

[VFDE-ISS/CET-EKS Official Docs on Downscaling](https://github.vodafone.com/pages/VFDE-ISS/cet-eks/docs/concepts/downscaling/)


## Prerequisites

- `cet-eks/v0.5.2` or newer
- `argo-cd-bootstrap/v0.2.0` or newer

# Introduction

Starting with `v0.5.2`, CET EKS provides the option to scale down cluster workloads during non-business hours. It will scale down resources, like deployments or statefulsets, thus scaling down the cluster itself.

It is recommended that you read the [ISS](https://github.vodafone.com/pages/VFDE-ISS/cet-eks/docs/concepts/downscaling/) documentation, which explains the implementation and operation of the kube downscaler.

For more details visit also the official [codeberg](https://codeberg.org/hjacobs/kube-downscaler) page of kube-downscaler.

## CET EKS O11y

The O11y addon comes with its own kube-downscaler config. This idea is to have an offset, so that O11y is still running when the workloads are downscaled and is already running when the workloads are upscaled again. This way, the full lifecycle of workloads can be observed.

# Setup

## ArgoCD

We need to setup an [ArgoCD sync window](https://argo-cd.readthedocs.io/en/stable/user-guide/sync_windows/), so that ArgoCD stops reconciling during the designated time range. This stops ArgoCD from counter-acting kube-downscaler.

{{% alert color="warning" title="Important" %}}
ArgoCD Sync Window and Cluster Uptime (the `time window` set in `kube-downscaler.uptime`) should be consistent, outside this window the workloads will be scaled down to 0 replicas.
{{% /alert %}}

In this example, we define a Sync Window between 6:00 to 20:00, from Monday to Friday.

- Go to [k8s-apps-mgmt-sol-vfde repo](https://github.vodafone.com/VFDE-SOL/k8s-apps-mgmt-sol-vfde) and open the correct argocd-bootstrap: `k8s-apps-mgmt-sol-vfde/apps/templates/apps/argocd-<SHORT_ALIAS>-bootstrap.yaml`.

- Ensure that the target revision is at least `argo-cd-bootstrap/v0.2.0`.

- Then, define the correct values, in our case:

{{% alert color="warning" title="Important" %}}
Here we define the time when `ArgoCD` will perform an active sync, in this example the sync window is active from 6:00 to 20:00, from Monday to Friday.
{{% /alert %}}

```yaml
spec:
  source:
    helm:
      values: |
        targetSyncWindow:
          schedule: "0 6 * * 1-5" # start at 6:00, Mon-Fri
          duration: "14h" # end: 6:00 + 14h = 20:00
          timeZone: "Europe/Berlin"
```

- Commit, push and merge this change on master and the ArgoCD Sync Window is now set.

{{% alert color="success" title="Note" %}}
Since `ArgoCD` is deployed inside the mgmt cluster, in order to apply this change you will need the approval from team Tesla.
{{% /alert %}}

## Configure cet-systemapps

- Open `k8s-apps-<SHORT_ALIAS>-sol-vfde/apps/templates/apps/cet-systemapps.yaml`.
- Add dynamic `kube-downscaler` config:


```yaml
spec:
  source:
    helm:
      values: |
        config:
          {{- if dig "downscaling" "enabled" false .Values.eks }}
          kube-downscaler:
            {{- with .Values.eks.downscaling.includeResources }}
            includeResources: {{ . }}
            {{- end }}
            uptime: {{ dig "uptime" dict .Values.eks.downscaling | toYaml | nindent 14}}
          {{- end }}

        apps:
          kube-downscaler:
            enabled: {{ dig "downscaling" "enabled" false .Values.eks }}
```


## Configure CET EKS O11y (if deployed)

- Open `k8s-apps-<SHORT_ALIAS>-sol-vfde/apps/templates/apps/cet-eks-o11y.yaml`.
- Add dynamic `kube-downscaler` config:


```yaml
spec:
  source:
    helm:
      values: |
        config:
          {{- if dig "downscaling" "enabled" false .Values.eks }}
          kube-downscaler:
            uptime: {{ dig "uptime" dict .Values.eks.downscaling | toYaml | nindent 14}}
          {{- end }}
```


## Enable kube-downscaler

- Open `k8s-apps-<SHORT_ALIAS>-sol-vfde/apps/values.yaml`.
- Enable kube-downscaler from the values:

```yaml
eks:
  downscaling:
    enabled: true
```

- In this way the default values will be used. They define an `uptime window` from 06:00 to 20:00 (German timezone), from Monday to Friday and `deployments,statefulsets` as list of resources.

- Commit, push and merge this change on master. Now kube-downscaler will start to work properly.

# Customizable settings

## Resources

In our default configuration, kube-downscaler scales down deployments and statefulsets. But you can change this behaviour.

- For example, if you want to add resources of kind `horizontalpodautoscalers` to the ones that are managed by `kube-downscaler` (scaled up/down):
    - Open `k8s-apps-<SHORT_ALIAS>-sol-vfde/apps/values.yaml`
    - Set the `helm.values.kube-downscaler.includeResources` argument:

```yaml
eks:
  downscaling:
    enabled: true
    includeResources: "deployments,statefulsets,horizontalpodautoscalers"  # resources to scale
```

{{% alert color="success" title="Note" %}}
Inside the `includeResources` argument, you can set a subset of: `deployments,statefulsets,stacks,horizontalpodautoscalers,rollouts,scaledobjects`.
{{% /alert %}}

## Custom Timing

In our default configuration, the cluster uptime set for `kube-downscaler` is from 6:00 to 20:00 (German timezone), from Monday to Friday.

- You can change this behaviour by editing the `timeWindow` in the kube-downscaler values:

```yaml
eks:
  downscaling:
    enabled: true
    uptime:
      # Mon-Fri 06:00-20:00 Europe/Berlin
      daysOfWeek: "Mon-Fri"
      timeWindow:
        startHours: "06"        # HH
        startMinutes: "00"      # MM
        endHours: "20"          # HH
        endMinutes: "00"        # MM
```

{{% alert color="warning" title="Important" %}}
Remember to update also the ArgoCD Sync Window, we don't want ArgoCD to counter-act kube-downscaler.
{{% /alert %}}

{{% alert color="success" title="Note" %}}
The SystemApps have a grace period (of 30 min) to ensure that the workload has all supporting services available at start and shutdown time. So, during the shutdown, the SystemApps will be scaled down after your workload, and critical SystemApps will be scaled down only at the end. Vice-versa for the Startup Window.
{{% /alert %}}

## Exclude

If you want to exclude specific workloads from being scaled down, you can prevent this using an annotation.

{{% alert color="warning" title="Important" %}}
Be aware that your workload will continue running while no supporting SystemApps are available any more. This is mostly not the intended behaviour.
{{% /alert %}}

```yaml
metadata:
  annotations:
    downscaler/exclude: "true"
```
