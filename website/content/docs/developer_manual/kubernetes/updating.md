---
title: Updating
description: Updating CET EKS Clusters
aliases: ["/docs/user_guide/eks/updating.html"]
categories: [Kubernetes]
tags: [CET, EKS]
weight: 20
---

{{% alert color="warning" title="Warning" %}}
Do **NOT** update the Kubernetes version and the CET EKS version at the same time!
{{% /alert %}}

## Supported Versions

- Kubernetes: Up to 1.31 (CET only), must be within [AWS standard support](https://docs.aws.amazon.com/eks/latest/userguide/kubernetes-versions.html#available-versions).

- CET EKS: Find the Solstice CET EKS versions [here](https://github.vodafone.com/VFDE-SOL/terraform-component-eks) and see the tags `cet-eks/...`.

{{% alert color="success" %}}
CET EKS limits the supported Kubernetes versions, see [Kubernetes versioning](https://github.vodafone.com/pages/VFDE-ISS/cet-eks/docs/getting-started/#kubernetes-versioning)
{{% /alert %}}

### EKS Extended Support Cost

There is a clear monetary incentive to keep your Kubernetes version updated [standard-vs-extended-support](https://aws.amazon.com/blogs/containers/amazon-eks-extended-support-for-kubernetes-versions-pricing)


Support type | Duration                                                  | Price (per cluster per hour)
-------------| ----------------------------------------------------------| -----------------------------
Standard     | 14 months starting from the date a version is generally available on Amazon EKS | $0.10
Extended     | 12 months starting from the date a version reaches the end of standard support in Amazon EKS | $0.60

Vodafone will pay ***6x the cost*** for clusters in extended support.


Kubernetes version |   Upstream release |  Amazon EKS release  |End of standard support | End of extended support
-------------------| -------------------| ---------------------| -----------------------| -----------------------
1.31               | August 13, 2024    | September 26, 2024   | November 26, 2025      | November 26, 2026
1.30               | April 17, 2024     | May 23, 2024         | July 23, 2025          | July 23, 2026
1.29               | December 13, 2023  | January 23, 2024     | March 23, 2025         | March 23, 2026
1.28               | August 15, 2023    | September 26, 2023   | November 26, 2024      | November 26, 2025
1.27               | April 11, 2023     | May 24, 2023         | July 24, 2024          | July 24, 2025
1.26               | December 9, 2022   | April 11, 2023       | June 11, 2024          | June 11, 2025
1.25               | August 23, 2022    | February 22, 2023    | May 1, 2024            | May 1, 2025
1.24               | May 3, 2022        | November 15, 2022    | January 31, 2024       | January 31, 2025
1.23               | December 7, 2021   | August 11, 2022      | October 11, 2023       | October 11, 2024
1.22               | August 4, 2021     | April 4, 2022        | June 4, 2023           | September 1, 2024
1.21               | April 8, 2021      | July 19, 2021        | February 16, 2023      |July 15, 2024

Also see [aws-release-calendar](https://docs.aws.amazon.com/eks/latest/userguide/kubernetes-versions.html#kubernetes-release-calendar).

It is the subproject's DevOps team's responsibility to keep the cluster within AWS standard support, your inactivity here as a clear security and cost impact on Vodafone, you should not dismiss this.

Please flag vendors in your project that stop you from updating your cluster.

Vodofone position is twofold: we want security patches and we do not want to pay extra for our clusters to be less secure.

## Kubernetes Version

{{< button href="https://github.vodafone.com/pages/VFDE-ISS/cet-eks/docs/getting-started/upgrade/kubernetes-upgrade/" >}}
ISS/CET-EKS Kubernetes Update Guide
{{< /button >}}


In general, follow the linked Kubernetes Update guide from ISS. You must check that your cluster's content is capable of running in the newer Kubernetes version! It is strongly recommended to use tools like [`kubent`](https://github.com/doitintl/kube-no-trouble) to scan for deprecated/unsupported API versions and mitigate the findings before upgrading. Tesla team is not backporting changes to non-latest app versions you maybe use, so you can be forced to update applications in order to update Kubernetes.

### Applications

- Find images bound to the Kubernetes version like this. As you can see, there can be false positives when an application version matches the Kubernetes version
  ```sh
  $ kubectl get po -A -o jsonpath='{range .items[*]}{range .spec.containers[*]}{.image}{"\n"}{end}' | grep -E '1.24|1-24' | uniq
  196433213517.dkr.ecr.eu-central-1.amazonaws.com/k8s-modules-sol/loki/nginx-unprivileged:v1.24
  ```
- Istio (Istio + all routing charts): See [support status table](https://istio.io/latest/docs/releases/supported-releases/#support-status-of-istio-releases)

## CET EKS Version

{{< button href="https://github.vodafone.com/pages/VFDE-ISS/cet-eks/docs/getting-started/upgrade/" >}}
ISS Update Guide
{{< /button >}}


You are expected to read the official upgrade guide. The guides below are specific to Solstice and may highlight a few parts, but are a minimum playbook for updating only.

### Updating to v1.0

#### Prerequisites / Assumptions

- Current version is `v0.8.0` or higher `v0.8` patch if available
- EKS version is: `1.29` or `1.30`. Version `1.28` is not supported anymore

#### Steps

- Update the terraform component `platform/cet_eks` to the latest `v1.0` version available in `VFDE-SOL/terraform-component-eks` (which is `v1.0.1` at the time of writing this guide).
- Add, commit and push the changes. Create a pull request and wait for review, then rollout with `atlantis apply`. Expected: `5 to add, 0 to change, 1 to destroy`.
- Update the `cet-systemapps` ArgoCD application: Point `spec.source.targetRevision` and `spec.source.helm.values.revision` to latest `v1.0.X`.
- Add tolerations for the taints on your custom Karpenter nodepools on the EBS and EFS CSI drivers. This can be done by adding said tolerations in the cet-systemapps application yaml under [`additionalDaemonsetTolerations`](https://github.vodafone.com/VFDE-ISS/cet-eks/blob/master/apps/systemapps/chart/values.yaml#L201-L202).

{{% alert color="success" title="Check taints" %}}
You can get a list of the taints that need to be tolerated by running the following command (ignore the fargate one):
```sh
kubectl get nodes -o jsonpath='{range .items[*]}{range .spec.taints[*]}{.key}{"="}{.value}{":"}{.effect}{"\n"}{end}{end}' | grep -v "^=$" | sort -u
```
{{% /alert %}}

- Roll out the `cet-systemapps` changes and wait for them to be synced and healthy

#### Post Update
- **MANDATORY BEFORE CET-EKS v1.1.0 gets released:** as the aws configmap authentication to the cluster has been deprecated in this cet-eks version and will be dropped in the next one in favour of cluster access entries (API authentication method), you should migrate your custom iam-mappings to cluster access entries. You can add your own cluster access entries in the cet-eks terraform module by leveraging the [access_entries variable](https://github.vodafone.com/VFDE-SOL/terraform-component-eks/blob/master/modules/cet-eks/variables.tf#L90-L108).
- OPTIONAL: you can enable systemapps observability, more information on [how to here](https://github.vodafone.com/pages/VFDE-ISS/cet-eks/v1.0/concepts/monitoring/). Keep in mind that coredns observability was also implemented on cet-eks-o11y so before enabling systemapps observability you should disable it on o11y by setting [config.disableCetSystemappsObservability](https://github.vodafone.com/VFDE-ISS/cet-eks-o11y/blob/v0.3.0/apps/o11yapps/chart/values.yaml#L54) to `true`.
- If you have any karpenter custom nodepool that is being deployed via the Tesla provided chart ([karpenter-provisioner](https://github.vodafone.com/VFDE-SOL/k8s-modules-sol/tree/master/charts/karpenter-provisioner)), you should update it to use the [karpenter-nodepool](https://github.vodafone.com/VFDE-SOL/k8s-modules-sol/tree/master/charts/karpenter-nodepool) chart.
<br>This chart is the same as the old karpenter-provisioner chart, but the nodepool custom resource has been updated to v1 (this was necessary since `v1beta1` has been deprecated and will soon be unsupported in a future release). This update does not recreate neither the nodePools nor the nodeClaims, hence there will be **no downtime** for your applications.
<br>To update, you can just change the `path` and `targetRevision` of your custom nodepool's ArgoCD application to use at least `karpenter-nodepool/v1.0.1` and rename the value called `provisioner` to `nodePool`. The following is an example of a karpenter custom nodepool update:

PRE-UPDATE:
<pre>
[...]
spec:
  destination:
    namespace: karpenter
    server: "{{ .Values.eks.server }}"
  project: "target"
  source:
    path: charts/<b>karpenter-provisioner</b>/chart
    repoURL: "https://github.vodafone.com/VFDE-SOL/k8s-modules-sol"
    targetRevision: <b>karpenter-provisioner/v2.0.0</b>
    helm:
      values: |
        <b>provisioner</b>:
          name: my-custom-nodepool
[...]
</pre>

POST-UPDATE:

<pre>
[...]
spec:
  destination:
    namespace: karpenter
    server: "{{ .Values.eks.server }}"
  project: "target"
  source:
    path: charts/<b>karpenter-nodepool</b>/chart
    repoURL: "https://github.vodafone.com/VFDE-SOL/k8s-modules-sol"
    targetRevision: <b>karpenter-nodepool/v1.0.0</b>
    helm:
      values: |
        <b>nodePool</b>:
          name: my-custom-nodepool
[...]
</pre>

{{% alert color="success" title="Note" %}}
If you have any custom Karpenter nodepool that is **not** created through team Tesla's provided chart, please make sure to update the nodepool resources from v1beta1 to v1 before support for v1beta1 is dropped.
{{% /alert %}}

### Updating to v0.8

{{% alert color="warning" title="Warning" %}}
This guide has been updated after the release of CET-EKS v0.8.1 that fixes a [known issue](https://github.vodafone.com/VFDE-ISS/cet-eks/issues/517) with the update to CET-EKS v0.8.
Because of this, the guide is meant to update from CET-EKS v0.7 directly to v0.8.1 (passing by v0.8.1-mig as described below).

If your EKS clusters have already been updated CET-EKS v0.8.0 you can just update to v0.8.1 directly by moving the referenced tag - no need to perform the steps listed below, as they cover what you already did.
{{% /alert %}}

#### Prerequisites / Assumptions

- Current version is `v0.7.0` or higher `v0.7` patch if available
- EKS version is: `1.28` or `1.29`. Version `1.27` is not supported anymore
- Current version of the module `foundation/iam_roles` is at least `v0.13.0`
- Nodes managed by custom Karpenter nodepools have the `node.vodafone.com/cilium-cni: true` label

{{% alert color="success" title="Note" %}}
Use the following command to check that there are no nodes (other than fargate nodes) in the cluster missing the Cilium label stated above: `kubectl get nodes --selector='!node.vodafone.com/cilium-cni'`
{{% /alert %}}

{{% alert color="warning" title="Important" %}}
if you are using only the karpenter custom nodepool chart provided by Tesla (still called provisioner), you don't have to worry about the Cilium node label
{{% /alert %}}

#### Steps
- **Terraform provider update**
    - In the terraform-project repository, under the `platform/cet_eks` folder, check the terraform aws provider version in the `.terraform.lock.hcl` file. If it is >= 5.58, skip to **Terraform Update to v0.8.1-mig** section.
    - Delete the `.terraform.lock.hcl` file
    - Locally plan `platform/cet_eks module` to recreate the `.terraform.lock.hcl` file and then run `with_sol_<ENV_SHORT_ALIAS> terragrunt providers lock -platform=linux_arm64 -platform=linux_amd64 -platform=darwin_amd64 -platform=darwin_arm64 -platform=windows_amd64`
    - Add, commit and push the changes. Create a pull request and wait for review, then comment with `atlantis apply` on the PR. Expected plan: no changes.
    - Wait for atlantis to apply the changes and merge your PR.
- **Terraform Update to v0.8.1-mig**
    - Edit terraform component `platform/cet_eks` version to `cet-eks/v0.8.1-mig`
    - Add, commit and push the changes. Create a pull request and wait for review, then comment with `atlantis apply` on the PR. Expected: `2 to add, 1 to change, 3 to destroy`. *NOTE: make sure that terraform doesn't want to recreate the EKS cluster!*
    - Wait for atlantis to apply the changes and merge your PR.
- **Terraform Update to v0.8.1**
    - Change the component `platform/cet_eks` version to `cet-eks/v0.8.1` (make sure that this change is saved in your editor)
    - Check whether PAM related roles are present in your environment (check if INF-DEVOPS and KubeAdmin AWS roles exist - having them as IamIdentityMapping in the cluster does not prove that PAM is rolled out). If not set `pam_roles_access_entries_enabled = false` in the inputs of `platform/cet_eks terragrunt.hcl` file
    - In the directory containing the terragrunt.hcl file (most likely `platform/cet_eks`), run the script [`migrate-to-v0.8.sh`](https://github.vodafone.com/VFDE-SOL/terraform-component-eks/blob/cet-eks/v0.8.1/modules/cet-eks/utils/migrate-to-v0.8.sh) to import EKSAdmin `cluster access entry` and `cluster access policy association`. The script must be run using `with_sol_<ENV_SHORT_ALIAS>` alias.
    - If the script succeeds, optionally add your own access entries through the `access_entries` input 
    - Add, commit and push the changes. Create a pull request and wait for review, then comment `atlantis apply` on the PR. Expected: `13 + 2*n to add, 0 to change, 0 to destroy` where `n` is the number of access entries you added other than the default ones. If `pam_roles_access_entries_enabled` was set to `false` expect `8 + 2*n to add, 0 to change, 0 to destroy`.

{{% alert color="success" title="Note" %}}
You can check whether you have extra aws roles mapped to cluster roles by running `kubectl get iamidentitymappings -A`. If you have entries not in the following list, you might want to add them as access entries:
- account-admin
- cet-eks-nodegroup-default
- eks-admin
- fargate-cet-eks
- fargate-cet-ops
- fargatekarpenter
- ntt-data-infra
- reply-infra
- sys-admin
- vodafone-infra
{{% /alert %}}

- **Cet-systemapps update to v0.8.1**

    - Update the `cet-systemapps` ArgoCD application: Point `spec.source.targetRevision` and `spec.source.helm.values.revision` to `v0.8.1`
    - Roll out the `cet-systemapps` changes and wait for them to be synced and health

### Updating to v0.7

#### Prerequisites / Assumptions

- Current version is `v0.6.0` or higher `v0.6` patch if available
- EKS version is: `1.27` or `1.28`. Version `1.26` is not supported anymore
- Due to the update of `karpenter`, the API `v1alpha` (`Provisioner` and `AWSNodeTemplate`) is removed. If you are using your own provisioners, you need to update to the `v1beta1` API before updating.

{{% alert color="success" title="Note" %}}
You can use this command: `kubectl get node -L karpenter.sh/nodepool -L karpenter.sh/provisioner-name` in order to see if there are any nodes still running with old provisioners instead of nodepools.
{{% /alert %}}

#### Steps

- Edit terraform component `platform/cet_eks` version to the latest `v0.7` available in `VFDE-SOL/terraform-component-eks`
- Add, commit and push the changes. Create a pull request and wait for review, then rollout with `atlantis apply`. Expected: `8 to add, 1 to change, 8 to destroy` (8 recreations).
- Update the `cet-systemapps` ArgoCD application: Point `spec.source.targetRevision` and `spec.source.helm.values.revision` to latest `v0.7.X`.
- Roll out the `cet-systemapps` changes and wait for them to be synced and health

### Updating to v0.6

#### Prerequisites / Assumptions

- Current version is `v0.5.0` or higher `v0.5` patch if available
- EKS version is: `1.26` or `1.27` or `1.28`. Version 1.25 is not supported anymore
- Due to the update of `karpenter`, the API `v1alpha` is deprecated for resources as `Provisioner` and `AWSNodeTemplate`. If you are using your own provisioners, you need to update to the `v1beta1` API before updating to `CET EKS v0.6`.

{{% alert color="success" title="Note" %}}
You can use this command: `kubectl get node -L karpenter.sh/nodepool -L karpenter.sh/provisioner-name` in order to see if there are any nodes still running with old provisioners instead of nodepools.
{{% /alert %}}

#### Steps

- Edit terraform component `platform/cet_eks` version to the latest `v0.6` available in `VFDE-SOL/terraform-component-eks`
- Add, commit and push the changes. Create a pull request and wait for review, then make an `atlantis apply`.
- Update the `cet-systemapps` ArgoCD application:
	- Point `spec.source.targetRevision` and `spec.source.helm.values.revision` to latest `v0.6.X`
	- Now is implemented the `external snapshotter` to the `EBS CSI controller`. Note that by default the external snapshotter is `enabled`.

{{% alert color="warning" title="Important" %}}
CET EKS come with `external snapshotter`added. If you are already using them, you must align both before deploying the new version. Check your cluster with `kubectl api-resources | grep 'snapshot.storage.k8s.io'`.
{{% /alert %}}

- Roll out the `cet-systemapps` changes and wait for them to be synced and health

### Updating to v0.5

#### Prerequisites / Assumptions

- Current version is `v0.4.0` or higher `v0.4` patch if available
- EKS version `1.25+`, `1.24` is not supported anymore
- Karpenter does not use the deprecated provisioners anymore (cet-systemapps values: explicit `config.karpenter.provisioners.useDeprecated: false`)

#### Steps

- Update the terraform component `platform/cet_eks` to the latest `v0.5` version available in `VFDE-SOL/terraform-component-eks`
- Update the `cet-systemapps` ArgoCD application
    - Point `spec.source.targetRevision` and `spec.source.helm.values.revision` to latest `v0.5.X`
- Roll out the systemapps changes and wait for them to be synced and health
- Remove the Karpenter feature flag for deprecated provisioners as it is not used anymore `config.karpenter.provisioners.useDeprecated: false` (cet-systemapps values)

#### Next Steps

These steps are recommeded to apply after updating, but not strictly part of the update procedure.

- Check the usage of the pod annotations `karpenter.sh/do-not-consolidate` and `karpenter.sh/do-not-evict`. Those are deprecated and should be replaced by `karpenter.sh/do-not-disrupt`

    {{% alert color="success" title="Note" %}}
    Search for pods with a specific annotation like this: `kubectl get pods -A -o json | jq '.items[].metadata|select(.annotations."karpenter.sh/do-not-evict"=="true")|"\(.namespace)/\(.name)"'`
    {{% /alert %}}

- Migrate from Karpenter `NodeTemplate` and `Provisioner` to `NodePool` and `EC2NodeClass` (see [official v1beta1 API upgrade procedure](https://karpenter.sh/v0.32/upgrading/v1beta1-migration/)).
- Discuss using [downscaling](https://github.vodafone.com/pages/VFDE-ISS/cet-eks/docs/concepts/downscaling/) (new feature, disabled by default)

### Updating to v0.4

#### Prerequisites / Assumptions

- Current version is `v0.3.3` or higher `v0.3` patch if available, thus EKS version is 1.24 or 1.25

#### Steps

- Update `foundation/iam_roles` to `foundation/iam_roles/v0.7.0` or newer
- Update the terraform component `platform/cet_eks` to the latest `v0.4` version available in `VFDE-SOL/terraform-component-eks`
    - Adjust cluster logging (categories and retention time) if needed, default is prod = all logging to CloudWatch, 90 days of retention
    - No change of EKS version at the same time, [KISS](https://en.wikipedia.org/wiki/KISS_principle)!
- If present, update `karpenter-provisioner` charts to `karpenter-provisioner/v1.1.0` or newer. Ensure all weights are more than 20.
- Update the `cet-systemapps` ArgoCD application
    - Point `spec.source.targetRevision` and `spec.source.helm.values.revision` to latest `v0.4.X`
    - Enable ArgoCD sync waves: `spec.source.helm.values.config.argoCDSyncWaves.enabled: true`
    - Disable applications `gatekeeper`, `gatekeeper-constraint-templates` and `gatekeeper-constraints-best-practice`
    - Disable karpenter node interrupt handling via `spec.source.helm.values.config.karpenter.interruptionHandling.enabled: false`
- Roll out the systemapps changes and wait for them to be synced and health
- If karpenter pods stay in pending state and the scheduler has changed to `default-scheduler`, then point `karpenter` revision to `fix/karpenter-scheduling` ([open issue](https://github.vodafone.com/VFDE-ISS/cet-eks/issues/284))
- Switch to the newer karpenter provisioners in `cet-systemapps`: `spec.source.helm.values.config.karpenter.provisioners.useDeprecated: false`
- Disable `node-termination-handler` application in `cet-eks-sol-additions` chart
- Enable karpenter interrupt handling by deleting `spec.source.helm.values.config.karpenter.interruptionHandling.enabled` (default `true`) in `cet-systemapps`
- Make sure that the karpetner pods are recreated to start watching the interrupt queue ([open issue](https://github.vodafone.com/VFDE-ISS/cet-eks/issues/285))
- If there is active EFS storage used and controlled by the CET-EKS EFS driver chart, go to [VFDE-ISS/CET-EKS/hack/fixEFSAccessPointTags.sh](https://github.vodafone.com/VFDE-ISS/cet-eks/blob/master/hack/fixEFSAccessPointTags.sh), **switch from master to the target release version**, and run it (one argument: cluster name)
- If there is the need to support `deployvip` or other systems signed with the Vodafone internal certificate authority, enable native bottlerocket support for it and drop any other way to do so (`registry-ca`): `spec.source.helm.values.config.karpenter.nodes.additionalTrustedCaCertificates.vodafoneInternalRootCa.enabled: true`
- Undeploy NTH resources in `cet-eks-sol-additions` terraform module (disable via `interruption_handling` variable)
