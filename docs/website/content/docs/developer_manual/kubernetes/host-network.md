---
title: Pods in host network
description: >
  Some pods are running with the `hostNetwork: true` option. As CET-EKS separates subnets for pods and nodes, the security group for the node subnets / ENIs is relevant to allow communication between pods in the pod subnets and with the host network enabled.
categories: [Kubernetes]
tags: [CET, EKS]
weight: 20
---

{{% alert color="warning" title="Scope" %}}
This requires terraform cet-eks version v0.2.0-1 or above
{{% /alert %}}

## Example

Take prometheus as example: A prometheus instance is located in a pod subnet. Some targets, here a prometheus node exporter pod, are running on the host network, thus in a node subnet.

```mermaid
graph TB

subgraph pod [pod subnet]
prometheus-->target[any target]
A[...]
end

subgraph host [node subnet / host network]
node-exporter
B[...]
end

prometheus-->node-exporter
```

To allow this communication, the specific target port has to be allowlisted as a security group rule. Non-allowlisted ports cause a request timeout (so prometheus targets appear as down).

## Configuration

The Solstice CET-EKS instances come with pre-configured allowlisted ports for

- prometheus-node-exporter
- cilium (agent and operator)
- hubble
- kubelet

Additional ports can be configured in the terraform project. Open the `terragrunt.hcl` for `platform/cet_eks`. In the input section, add or adjust the optional variable `additional_pod_to_host_ports` (list of numbers).

{{< button href="https://github.vodafone.com/VFDE-SOL/terraform-component-eks/tree/master/modules/cet-eks" icon="fa-brands fa-github">}}
Go to the terraform module
{{< /button >}}
