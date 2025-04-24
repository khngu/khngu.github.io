---
title: Karpenter Provisioners
description: Legacy Karpenter Provisioners
categories: [Kubernetes]
tags: [CET, EKS]
weight: 20
---

{{% alert color="warning" title="Scope" %}}
Karpenter provisioners are deprecated (removed in CET EKS v0.6.0) in favor of the newer API (NodePool and EC2NodeClass). Learn more about those in the [corresponding CET EKS docs](https://github.vodafone.com/pages/VFDE-ISS/cet-eks/docs/concepts/cluster-autoscaling/#your-own-nodepools).
{{% /alert %}}

[Karpenter](https://karpenter.sh/) is used for scaling the cluster and thus for creating new nodes. Provisioners are Karpenter CRDs used to decide what kind of nodes to spawn.

[karpenter-provisioner (helm chart)](https://github.vodafone.com/VFDE-SOL/k8s-modules-sol/tree/master/charts/karpenter-provisioner)


## Default providers
<!-- ignoring the short-lived provisioner - no idea what that should be used for -->
CET-EKS comes with at least two provisioners `cet-bottlerock-on-demand` and `cet-bottlerock-spot`. Depending on what is configured to be the default capacity type, the provisioners are weighted differently. You can use all of them in the same cluster, e.g. by using a node selector to specifically force a workload on spot nodes while running everything else on on-demand instances.

There can be an additional Tesla provisioner (e.g. `cet-bottlerock-sol-on-demand`). You can check this with

```sh
kubectl get provisioner
```

## Creating a custom provider

To adjust what nodes are created, the chart [karpenter-provisioner](https://github.vodafone.com/VFDE-SOL/k8s-modules-sol/tree/master/charts/karpenter-provisioner) should be used. The intended way to override is by using [weighted provisioners](https://karpenter.sh/v0.27.3/concepts/scheduling/#weighting-provisioners). The default providers have a weight `< 20`, Tesla uses a weight of 100. All provisioners with a weight higher than that will be prioritized.

The chart comes with some sane defaults. These can have some unexpected requirements, so take a look at them and override them if needed. Deploy the chart as a new ArgoCD application (example: [dev1](https://github.vodafone.com/VFDE-SOL/k8s-apps-dev1-sol-vfde/blob/master/apps/templates/apps/karpenter-provisioner.yaml)).

{{% alert color="warning" title="Warning" %}}
Existing nodes will not be adjusted right away. If you need this, manually start cordoning and draining nodes.
{{% /alert %}}

For more information, read [the upstream docs on cluster autoscaling](https://github.vodafone.com/pages/VFDE-ISS/cet-eks/docs/concepts/cluster-autoscaling/).
