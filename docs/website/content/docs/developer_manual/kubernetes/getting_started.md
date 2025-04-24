---
title: Getting Started
description: This guide explains how to work with the kubernetes clusters provided by VFCF/CET.
categories: [Kubernetes, Tooling]
tags: [CET, EKS, Onboarding, helm]
aliases:
  - /docs/user_guide/eks/getting_started
weight: -1
---


{{% alert color="warning" title="Scope" %}}
Please be aware that this guide covers Tesla team's intended way of using the clusters. If your team uses a different approach (e.g. Jenkins), Tesla teams does neither support any of those ways, nor takes any action if requested. If your team decided to go another way, your team owns that way!
{{% /alert %}}

## Concepts

### Helm charts

We use helm charts - no kustomize, no k8cdk or else. Helm charts are located in our modules repositories. Generic charts, maintained by Tesla, are located in [VFDE-SOL/k8s-modules-sol](https://github.vodafone.com/VFDE-SOL/k8s-modules-sol/). If teams need their own helm charts, they can manage their own repository, e.g. [VFDE-SOL/k8s-modules-sol-fulfill](https://github.vodafone.com/VFDE-SOL/k8s-modules-sol-fulfill/) for `fulfill` environments. Helm charts are versioned, see below.

Use Github Search to find existing helm chart repos like [this](https://github.vodafone.com/orgs/VFDE-SOL/repositories?q=k8s-modules-&type=source&language=&sort=)

### GitOps & ArgoCD

We follow the GitOps approach, which means that our clusters are defined in GitHub repositories and updated based on the latest commits. For this, we use [ArgoCD](https://argo-cd.readthedocs.io/en/stable/) as control plane. To define a deployment of an application, a custom resource `Application` has to be created. These applications are stored in a *k8s-apps* repository - one per cluster. For instance, [VFDE-SOL/k8s-apps-dev-fulfill-sol-vfde](https://github.vodafone.com/VFDE-SOL/k8s-apps-dev-fulfill-sol-vfde/) contains all application resources deployed to the *dev-fulfill* cluster. The applications point to a helm chart located in a *k8s-modules* repository. They use a Git tag as target reference for versioning and contain a section for configuring the application leveraging helm chart values.

The applications are not only deployed by ArgoCD, but also constantly monitored, compared against the desired state in Git and corrected if any deviations are detected. This means one cannot change the application manually (e.g. by using `kubectl`). If you try to do so, ArgoCD will remove your changes within a few seconds. See the *Workflow* section on how to properly work on a cluster.

There is one ArgoCD instance per cluster, located in Tesla's mgmt cluster. You can access the ArgoCD web UI from your cluster's portal (e.g. [dev-fulfill](https://portal.tool.dev.fulfill.sol-vf.de/)). You must connect from your VFCF workspace.

Use Github Search to find existing argocd app repos like [this](https://github.vodafone.com/orgs/VFDE-SOL/repositories?q=k8s-apps-&type=source&language=&sort=)


### Versioning

Helm charts are versioned with [SemVer](https://semver.org) and those versions are immutable. This means: Don't delete or move versions, ever. If something is wrong with a version, release a new one to fix it.

GitHub is configured to enforce a linear chart history. This means there is no complex tree of versions with backporting fixes to older versions. Only the newest version is updated. There is no way of getting the latest changes/fixes without getting all prior changes, too.

## User Authentication & Authorization

Authentication and authorization is handled by mapping AWS IAM roles to cluster entities. This is handled by [AWS EKS IAM Auth Controller](https://github.com/rustrial/aws-eks-iam-auth-controller).

To allow certain roles, identity mappings need to be configured. This is achieved by leveraging the [IAM auth mappings chart](https://github.vodafone.com/VFDE-SOL/k8s-modules-sol/tree/master/charts/iam-auth-mappings). A minimal configuration is shipped with every base installation. This can be extended rather than creating a new deployment. Add the desired role to `apps/templates/apps/iam-auth-mappings.yaml` to the `mappings` list.

{{% alert color="success" title="Note" %}}
There is no fine-grained RBAC yet. This might change in the future. For now, copy the sysadmin & system:masters approach.
{{% /alert %}}

## Workflow

{{% alert color="succees" title="Note" %}}
Please read [How to PR](/pages/VFDE-SOL/docs-sol-cet/docs/user_guide/how-to-pr.html) carefully to make PR reviewing as fast and convenient as possible.
{{% /alert %}}

1. **You define your changes locally**: Checkout the *k8s-modules* repository with your target chart and add your changes.
2. **You create a feature branch**: Create a feature branch with a meaningful name, commit your changes to your branch and push that branch. Do NOT create a pull request.
3. **You rollout your feature branch to a non-prod cluster**: You and your team decide in which cluster you test your changes. Mostly, it's *dev* or *sbox*. To roll it out, you need to change the `targetRevision` in the corresponding ArgoCD application in the correct *k8s-apps* repository, e.g. [VFDE-SOL/k8s-apps-dev-fulfill-sol-vfde](https://github.vodafone.com/VFDE-SOL/k8s-apps-dev-fulfill-sol-vfde/). If needed, change the helm chart values, too. Create a pull request for this.
4. The policy bot will assign PR reviewers automatically. **Kindly wait for approval and watch any comments for required changes**. Once the PR is approved, it is merged automatically and ArgoCD deploys your feature branch.
5. **Review and test your changes**: This covers both in-cluster and the ArgoCD sync. If there is an error in the chart, e.g. a syntax mistake, you will not see a change in the cluster as ArgoCD fails to execute the helm chart and therefore does not apply changes.
6. You can add additional changes or fixes to your feature branch. As ArgoCD now watches your feature branch, any change is applied to the cluster immediately, so be careful! **Iterate reviewing and adjusting until you get your desired state**.
7. **Open a PR on the *k8s-modules* repository**: The policy bot will assign PR reviewers automatically. Kindly wait for approval and watch any comments for required changes. Once the PR is approved, it is merged and your feature branch is deleted automatically.
8. **Create a new version** for the chart by adding a new tag to the *k8s-modules* repository. This will create a GitHub release and an additional PR to handle the changelog and release notes.
9. **Open a PR on the *k8s-apps* repository** you used for testing. Your feature branch was deleted automatically, so ArgoCD cannot find the currently configured `targetRevision`. Point it to you newly created version.
10. **Open PRs in other *k8s-apps* repositories** to rollout your new version to other clusters.

## Terraform resources

If you need infrastructure resources for your charts, please read [the infrastructure development article]({{< ref infrastructure_development >}}).

## Images

If you create your own images and need to push them to a registry, please see [VFDE-SOL/image-k8s-modules-sol](https://github.vodafone.com/VFDE-SOL/image-k8s-modules-sol) for generic images or client-specific repositories, e.g. [VFDE-SOL/image-k8s-modules-sol-asgw](https://github.vodafone.com/VFDE-SOL/image-k8s-modules-sol-asgw).
