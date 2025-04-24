---
title: CET vs. Legacy
description: A generic and conceptual overview of what changes if you switch from a legacy to a CET cluster.
categories: [Kubernetes]
tags: [CET, EKS]
weight: 10
---

{{< button href="https://github.vodafone.com/pages/VFDE-ISS/cet-eks/docs/" >}}
VFDE-ISS/CET-EKS Official Docs
{{< /button >}}

## Responsibility / Dependency Chain

With CET EKS, we unify EKS deployments with teams outside of Solstice. ISS is in the lead and owns the source repository [VFDE-ISS/CET-EKS](https://github.vodafone.com/VFDE-ISS) which contains both the terraform and the kubernetes part to deploy a full-functioning EKS cluster following best practices. Team Tesla slightly adapt this with [VFDE-SOL/terraform-component-eks](https://github.vodafone.com/VFDE-SOL/terraform-component-eks) with the goal to stick to the upstream as close as possible. This component is rolled out in every Solstice CET EKS, no matter the client. Hence, there are no more different codebases for CET-EKS clusters per client as for legacy clusters.

{{% alert color="warning" title="Important" %}}
This implies a very important change of your work focus. You cannot implement your custom changes to EKS without thinking about every other user of CET-EKS. Everything you want to contribute must be compatible with everyone else. This is enforced by the respective code owners.
{{% /alert %}}

## Node Management

CET-EKS uses [karpenter](https://karpenter.sh/) to manage nodes and scale clusters, and does not use cluster-autoscaler. This causes crucial changes of how you define nodes. There are no more AWS EC2 Auto Scaling Groups based on launch templates which have to be created via terraform. Instead, karpenter uses kubernetes custom resources called [provisioners](https://karpenter.sh/docs/concepts/provisioners/) to define nodes. These provisioners are not working with a single node configuration but represent limits (e.g. Linux OS, at least 8 GB memory, spot/on-demand). Karpenter frequently reconciles the cluster status and is capable of optimizing nodes. For more information about karpenter provisioners, see [Karpenter Provisioners]({{< ref "karpenter_provisioners" >}}).

{{% alert color="success" title="Note" %}}
Reconciliation and frequent interruption and rescheduling might be an issue for some workloads. If you have affected workloads, please see [this karpenter docs section](https://karpenter.sh/docs/concepts/deprovisioning/#controls)
{{% /alert %}}

In addition to the long-lasting EC2 nodes, CET-EKS comes with configuration for fargate nodes. These are used for CET operations that are absolutely necessary. This is karpenter and a few initializing jobs (as of `v0.4`). You will see those in the cluster, but you are not intended to use any fargate nodes for your own workload.

CET-EKS has configured karpenter to be responsible for node interrupt handling. aws-node-termination-handler is not used anymore. It is capable of handling spot interrupt events, so spot nodes are gracefully shut down.

Under the hood, CET-EKS nodes are based on the [container-optimized Linux distribution Bottlerocket](https://docs.aws.amazon.com/eks/latest/userguide/eks-optimized-ami-bottlerocket.html). This replaces building custom AMIs. These nodes are hardened, targeted to pass the kubernetes [CIS benchmark](https://www.cisecurity.org/benchmark/kubernetes).

{{% alert color="success" title="Note" %}}
This node hardening comes out of the box, but only if you use the built-in node configuration. If you choose to use your own node configurations, you are responsible for securing those!
{{% /alert %}}

## Networking

For security reasons, CET-EKS separated the VPC subnets for its nodes and pods. Per default, pods cannot communicate with nodes via network and vice-versa.

Instead of aws-vpc-cni, CET-EKS uses [Cilium](https://cilium.io/) (open-source version) as networking solution. It uses eBPF for its operations which also integrates with other tools from the Isovalent team, especially [hubble](https://github.com/cilium/hubble). hubble allows to observe all cluster traffic graphically. You can access hubble from your cluster portal.

While cilium supports generic kubernetes network policies, it brings its own [Cilium Network Policies](https://docs.cilium.io/en/latest/security/policy/) with more fine-grained options for allow or deny traffic, e.g. on L7 based on a HTTP request path.

## Authentication & authorization

For legacy clusters, roles have been added to the `system:masters` group which grants full access. CET uses [iam-auth-controller](https://github.com/rustrial/aws-eks-iam-auth-controller) and its custom resources `IamIdentityMapping` for access control. For more information, see [User auth]({{< ref "external-authentication" >}})

{{% alert color="success" title="Note" %}}
Team Tesla is working with NCIS to change the authentication and authorization to AWS accounts fundamentally. Once this is finished, there will be enforced RBAC in the CET-EKS clusters which will limit your privileges. You will be informed about this.
{{% /alert %}}

## Cluster Content

### App of Apps Concept

CET-EKS upstream and Team Tesla started bundling applications, effectively creating ArgoCD applications which expand to more applications which are then handled by ArgoCD, too. This helps standardizing and reducing repetivice work on platform-level.

- [cet-systemapps](https://github.vodafone.com/VFDE-ISS/cet-eks/tree/master/apps/systemapps) @ VFDE-ISS/CET-EKS
- [cet-eks-sol-additions](https://github.vodafone.com/VFDE-SOL/k8s-modules-sol/tree/master/charts/cet-eks-sol-additions) @ VFDE-SOL/k8s-modules-sol

These are helm charts as well, so please take a look at the respective *values.yaml* to see how to configure the contained applications if needed. In ArgoCD, you can identify the bundled apps by prefix, e.g. *cet-systemapps-cilium* and *sol-addition-prometheus*.

### Applications

These are generic changes for a default CET-EKS rollout at Solstice. Please see the respective charts and repositories for the details.

- Istio is used for traffic management only, no more service mesh and istio sidecars. Therefore, Kiali and Jaeger are not deployed anymore.
- The default logging stack is based on the same fluent-bit chart as in legacy, but CloudWatch and OpenSearch are not enabled. The only output is S3. You can enable the others if needed, but you need to deploy the required infrastructure as well.
- All CET EKS clusters come with a [vertical pod autoscaler](https://github.com/kubernetes/autoscaler/blob/master/vertical-pod-autoscaler/) installation which can be used for your applications to mitigate resource bottlenecks.

## Migrating Legacy to CET

There is no intended way of migrating to CET-EKS. Team Tesla recreated their clusters in the same account, although ISS published their view [here](https://github.vodafone.com/VFDE-ISS/cet-eks/blob/master/docs/migration_guide.md).

{{% alert color="warning" title="Warning" %}}
Team Tesla did neither review nor contribute to the ISS migration guide. If you decide to follow it, it's your decision and you own the consequences - no support for any migration conent!
{{% /alert %}}

Telsa's steps to migrate to a new cluster:
- Create a new CET-EKS in the same AWS account. Rename unique identifiers like SSM parameters, esp. when they are encrypted with the new CET-EKS KMS key. This must neither effect any existing infrastructure for the running workload nor be based on legacy resources that will be destroyed at the end of the migration.
- Add your desired workloads as standby. Make sure to add ingress configuration (istio virtualservice), so the default and the migration domain both hit your workload.

{{% alert color="success" title="Note" %}}
Telsa workloads do not have heavy requirements on persisting date. You have to care about how you deal with persistence yourself.
{{% /alert %}}

- Add the existing legacy certificate to the CET loadbalancers listener as alternative (see [`aws_lb_listener_certificate`](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/lb_listener_certificate.html))

- Start shifting specific subdomains from the legacy load balancers to the loadbalancer serving CET-EKS, e.g. shift `app.dev.sol-vf.de`while keeping `.dev.sol-vf.de pointing to legacy as is. Continue until you shifted all domains.

- Manipulate the load balancer's terraform state to serve the domain as default (incl cert) and the temporary migration domain as alternative. Then, remove them.

- Undeploy legacy infrastructure via terraform.
