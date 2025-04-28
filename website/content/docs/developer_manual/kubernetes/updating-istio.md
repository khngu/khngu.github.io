---
title: Updating Istio
description: This guide is meant to be an addition to the trivial update process.
categories: [Kubernetes]
tags: [CET, EKS]
weight: 20
---

Find other relevant resources here:

- [Istio Official Upgrade Guide](https://istio.io/latest/docs/setup/upgrade/)
- [Istio Release Notes and Changelogs](https://istio.io/latest/news/releases/)

{{% alert color="success" title="Note" %}}
There are a couple of modules related to istio (especially istio-routing) in different module repositories. Make sure all Istio chart deployments are compatible with each other.
{{% /alert %}}

## Check Current Status

Check the current setup with `istioctl x precheck` (care about your `istioctl` version and current k8s context).

The info message [IST0136](https://istio.io/latest/docs/reference/config/analysis/ist0136/) is ok to appear, but check if the listed APIs are available in the new version first.

## Rollout: Envoy Proxy Sidecars

Updating the module/control plane does not affect the injected sidecars (data plane). Use `istioctl version` to get a data plane versions overview:


```sh
$  istioctl version
client version: 1.16.2
control plane version: 1.16.2
data plane version: 1.15.5 (2 proxies), 1.16.2 (44 proxies)
```

Use `istioctl proxy-status` to get data plane version details:

```sh
$  istioctl proxy-status | grep -v 1.16.2
NAME                                                              CLUSTER        CDS        LDS        EDS        RDS        ECDS         ISTIOD                     VERSION
elasticsearch-c1-snapshotter-27919545-fw6l7.elasticsearch-c1      Kubernetes     SYNCED     SYNCED     SYNCED     SYNCED     NOT SENT     istiod-846bfb8d9-hsnmd     1.15.5
elasticsearch-c1-snapshotter-27919580-dg6vk.elasticsearch-c1      Kubernetes     SYNCED     SYNCED     SYNCED     SYNCED     NOT SENT     istiod-846bfb8d9-6nxxx     1.15.5
```

You can use [this snippet](https://github.vodafone.com/VFDE-SOL/k8s-modules-sol/blob/master/charts/istio/generate/istio/rollout-sidecars.sh) to start some required rollouts. This neither guarantees to get all resources, nor is optimized. If some proxies don't change their version, act individually and rollout-restart the corresponding deployment/daemonset/statefulset.

This might take some time based on cluster size. Take manual actions if required. Don't care about jobs.
