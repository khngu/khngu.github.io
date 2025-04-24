---
title: Helm Charts Compliance
description: To ensure secure, reliable and predictable workloads in our clusters, all helm charts are suspect for reviews and automation.
categories: [Kubernetes]
tags: [EKS, helm]
aliases:
  - /docs/user_guide/eks/helm-chart-compliance
weight: 20
---

Ensuring compliance with best practices and organizational standards is crucial for maintaining the security and reliability of workloads. Helm charts must adhere to these standards to avoid potential issues and guarantee predictable clusters. At FusionC, we implement checking helm charts against a custom ruleset via pre-commit.

{{< button href="https://github.vodafone.com/VFDE-SOL/pre-commit-hooks/tree/master/hooks/helm_chart_compliance" icon="fa-brands fa-github">}}
pre-commit hook implementation
{{< /button >}}

## Usage

The pre-commit hook is configured per repository by the Tesla team. Once integrated, it will run locally for every commit [if `pre-commit` is set up properly](/pages/VFDE-SOL/docs-sol-cet/docs/developer_guide/toolchain_guide.html#pre-commit).

It requires the following as part of a repository's `.pre-commit-config.yaml`:

```yaml
repos:
  - repo: https://github.vodafone.com/VFDE-SOL/pre-commit-hooks
    rev: <GIT_TAG_CONTAINING_THE_HOOK>
    hooks:
      - id: helm_chart_compliance
```

The hook is executed as part of the pre-commit GitHub PR check. With this, changes to helm charts must comply to the ruleset to be merged.

### Providing test values for charts

If not specified otherwise, a chart is evaluated with its default values. Sometimes, this does not work, e.g. when requiring mandatory values. To overcome this, the hook checks if a `test-values` directory exists in the chart (next to `Chart.yaml`) and if it contains any `*.yaml`/`*.yml` files. If so, it uses these for chart evaluation.

{{% alert color="success" title="Note" %}}
Multiple files in `test-values` means multiple chart evaluations. This way, it is possible to test different configurations.
{{% /alert %}}

**Example**

A chart has default values in `my-chart/values.yaml`:

```yaml
requiredIntegerValue: REPLACE_ME
some:
    other:
        parameter: foo
```

`requiredIntegerValue` must be an integer, templating the chart with the default values will fail. This is expected and desired, as the application does not work without setting this value. In this case, the default value must not be changed. So succeed the compliance hook, a test values file `my-chart/test-values/minimal-config.yaml` is created:

```yaml
requiredIntegerValue: 1
```

Now, the hook uses this file and can successfully test the chart on the ruleset. Because of helm's logic on values, `some.other.parameter` keeps its default value of `foo` and does not need to be present in the test values file.

{{% alert color="success" title="Note" %}}
It is recommended to keep test values files as small as possible. This way, changes to the default values, which can have effects on production workloads, are tested. It only makes sense to override values for tests when overriding in all environments is expected or for feature flags that cause creation of resources which are not present for the default configuration (typical indicator: `enabled: false`).
{{% /alert %}}

## Rules

### General

#### Forbidden kinds

Certain resource kinds are not allowed in helm charts:

- `Pod` and `ReplicaSet`: These do not provide sufficient functionalities to ensure self-healing and no interruptions of the workload. Use `Deployment` instead.
- `Node`: Nodes are created and managed by Karpenter, not by helm charts.
- `Event`: Reconciling events is invalid as the usually temporary event resource would be present at all times.

#### No resource status

The status field of a resource is used for dynamically tracking and persisting a resource's status by the controller responsible for it (e.g. Kubernetes control plane, ArgoCD application controller). We must not deploy or reconcile the status as it would override or block the controller.

#### No `part-of: cet-eks` label

The label `"security.cet.vodafone.com/part-of": "cet-eks"` is copied heavily, but it is not meant to be present at any FusionC resources. It labels all resources that are packaged with CET EKS, not what is deployed inside a CET EKS cluster.

### Workloads

#### No `latest` images

Explicit `latest` or no setting an image tag is forbidden, as these can pull changes to clusters without any engineer's action.

#### No debug images

FusionC's workflow for working with ECR images creates debug images for each push to a pull request. These images are ephemeral, and get deleted after 7 days. These images must not be used in a released chart version, as the deployment would fail although it is fine when testing.

#### Trusted image sources

Images must be pulled from a known and explicitely allowed registry. This is checked by workload images' prefixes.

<!-- sort alphabetical please -->
| Prefix                                                      | Description |
| ----------------------------------------------------------- | ----------- |
| 196433213517.dkr.ecr.eu-central-1.amazonaws.com             | VFDE FusionC mgmt account's AWS ECR |
| 602401143452.dkr.ecr.eu-central-1.amazonaws.com             | Official private AWS ECR ([docs](https://docs.aws.amazon.com/eks/latest/userguide/add-ons-images.html)) |
| 919511681272.dkr.ecr.eu-central-1.amazonaws.com/iss         | VFDE ISS' prod AWS ECR |
| deployvip.internal.vodafone.com                             | Vodafone-internal registry |
| docker.elastic.co                                           | Registry of Elastic ([docs](https://www.docker.elastic.co/)) |
| docker.io/confluentinc                                      | Special case: Confluent, due to support terms |
| gcr.io                                                      | Registries hosted by Google |
| ghcr.io                                                     | Registries hosted in public GitHub |
| public.ecr.aws                                              | Public AWS ECR, see [ECR public gallery](https://gallery.ecr.aws/) |
| quay.io                                                     | Registries hosted in quay.io, operated by RedHat ([status](https://status.redhat.com/)) |
| registry.k8s.io                                             | Official Kubernetes images |

{{% alert color="success" title="Note" %}}
Other registries can be added by request. Please get in touch.
{{% /alert %}}

Docker Hub is and stays blocked because of API limit restrictions.

See [Docker Builds](/docs-sol-cet/docs/developer_guide/technical_solutions/docker_builds.html) for how to pull images from other sources to the FusionC AWS ECR.

#### Must have any security context

To enforce that at least somebody thinks about enhancing security, workloads without any security contexts are forbidden. Technically, no restriction must be set. It is sufficient to set a non-empty and non-restricting security context.

A proper security context looks like this:

```yaml
spec:
  template:
    spec:
      securityContext:
        fsGroup: 10001
        runAsUser: 10001
        runAsGroup: 10001
        runAsNonRoot: true
        seccompProfile:
          type: RuntimeDefault
      containers:
      - image: [...]
        securityContext:
          readOnlyRootFilesystem: true
          privileged: false
          allowPrivilegeEscalation: false
          capabilities:
            drop: [ALL]
```

### Services

#### No service of type LoadBalancer

As NodePort service cause the creation of AWS resources, which are not managed via terraform and couple the lifecycle to the Kubernetes deployment, NodePort services are blocked. The proper way to work with ingress is using existing Istio ingress gateways and [`VirtualServices`](https://istio.io/latest/docs/reference/config/networking/virtual-service/) or creating a load balancer via terraform and bind Kubernetes resources to the load balancer's target group(s) by using a [`TargetGroupBinding`](https://kubernetes-sigs.github.io/aws-load-balancer-controller/latest/guide/targetgroupbinding/targetgroupbinding/).

#### No service of type NodePort

NodePort services route traffic via the cluster's nodes, but the nodes are living in a different subnet than the pods. Also, it adds an additional yet unnecessary traffic hop, which makes load balancing significantly harder. The proper way to work with ingress is using existing Istio ingress gateways and [`VirtualServices`](https://istio.io/latest/docs/reference/config/networking/virtual-service/) or creating a load balancer via terraform and bind Kubernetes resources to the load balancer's target group(s) by using a [`TargetGroupBinding`](https://kubernetes-sigs.github.io/aws-load-balancer-controller/latest/guide/targetgroupbinding/targetgroupbinding/).

#### No `alb.ingress.kubernetes.io` annotations

Infrastructure, include load balancers, must be deployed and controlled with terraform. Having multiple sources to manipulate infrastructure is confusing and adds complexity. Making a load balancer configuration depend on in-cluster resources adds unnecessary coupling of lifetimes. Instead of using these annotations, terraform must be used. There are plenty of ready-to-use load balancer terraform modules in [VFDE-SOL/terraform-modules-sol // modules/network](https://github.vodafone.com/VFDE-SOL/terraform-modules-sol/tree/master/modules/network).

### Observability (CET EKS O11y)

#### Alerts must have severity label

To have an immediate view of the severity of a firing alert event, all alerts must have a `severity` label. Recommended values are `critical`, `warning`, and `info`. For TTWOS alerts, see [`VFDE-SOL/tool-cribl-alerts`](https://github.vodafone.com/VFDE-SOL/tool-cribl-alerts#cribl-severity-levels).

#### Dashboards and panels must not have default titles

Dashboards and containing panels get default titles when creating those via the Grafana UI. Those are blocked from being committed. Set titles describing the element's content/purpose.

#### Dashboards' default time range

The default time range is responsible for what the user sees when opening a dashboard, and subsequently what data is pulled every time a dashboard is opened. Absolute time ranges are forbidden as they are not useful. To limit unneccessary load, the default time range is limited to *seconds*, *minutes* and *hours*. Pulling data for *days* by default is blocked.

{{% alert color="success" title="Note" %}}
This does not block users from extending the time range manually when needed.
{{% /alert %}}

#### Dashboards' default refresh rate

Dashboards can refresh data periodically. Certain combinations of default refresh rate and time range are blocked, as these are considered to cause too high traffic for the use case.

| Refresh rate | Time range restriction |
| ------------ | ---------------------- |
| 10 seconds or less | 10 minutes or less |
| 11 - 29 seconds | 1 hour or less |
| 30 seconds or more | No restriction |

If you depend on such low refresh rates, you probably don't need so much old data and can reduce the default time range. If you need the long time range, you probably don't need a few more seconds and can have less frequent refreshes.

{{% alert color="success" title="Note" %}}
This does not block users from reducing the refresh rate manually when needed.
{{% /alert %}}

### ArgoCD

#### No ArgoCD instance label

ArgoCD uses the label `argocd.argoproj.io/instance` for tracking application resources. Setting this label individually can cause bad application situations like endlessly reconciling without ever being stable/healthy or hard interruptions due to side effects with other applications. This label must not be set explicitly.

See ArgoCD docs: [*Annotations and labels*](https://argo-cd.readthedocs.io/en/stable/user-guide/annotations-and-labels/) or [*Why Is My App Out Of Sync Even After Syncing?*](https://argo-cd.readthedocs.io/en/stable/faq/#why-is-my-app-out-of-sync-even-after-syncing).

#### ArgoCD Manifest Paths Annotation

ArgoCD caches generated manifests and uses the repository commit SHA as a cache key. A new commit to the Git repository invalidates the cache for all applications configured in the repository. This can negatively affect repositories with multiple applications. Setting the application annotation `argocd.argoproj.io/manifest-generate-paths` optimizes this behavior, as ArgoCD reduces the application's scope from the whole repository to the referenced paths only. If no modified files match a specified path, it will not trigger application reconciliation and the existing cache will be considered valid for the new commit. This makes it possible to optimize cache management.

{{% alert color="success" title="Note" %}}
If you don't have a specific reason to do otherwise, set: `argocd.argoproj.io/manifest-generate-paths: .`.
{{% /alert %}}

See ArgoCD doc: [Manifest Paths Annotation](https://argo-cd.readthedocs.io/en/stable/operator-manual/high_availability/#manifest-paths-annotation)

## Troubleshooting

### yq: Unknown option `-r`

Ensure that your `yq4` installation points to a version newer or equal to 4.30.1.
