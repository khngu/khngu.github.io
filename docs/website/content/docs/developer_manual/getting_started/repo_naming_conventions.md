---
title: Naming Conventions
description: How we use repo naming to make it easy to navigate.
categories: [Tooling]
tags: [git, Onboarding]
weight: 10
---

## Repository Naming Conventions

### action repos `(^action-*)`

github action repositories to develop and provide own github actions. See [here](https://github.vodafone.com/orgs/VFDE-SOL/repositories?q=action-&type=all&language=&sort=name) to get an list of existing ones.

Valid examples:
- [action-changelog-generator](https://github.vodafone.com/VFDE-SOL/action-changelog-generator)
- [action-enable-github-vodafone](https://github.vodafone.com/VFDE-SOL/action-enable-github-vodafone)
- [action-peribolos](https://github.vodafone.com/VFDE-SOL/action-peribolos)
- [more...](https://github.vodafone.com/orgs/VFDE-SOL/repositories?q=action-&type=all&language=&sort=name)

### caws repos `(^caws-*)`

Repositories for `caws` account configs and mappings.

Valid examples:
- [caws-accounts-sol](https://github.vodafone.com/VFDE-SOL/caws-accounts-sol)
- [caws-mappings-sol](https://github.vodafone.com/VFDE-SOL/caws-mappings-sol)
- [more...](https://github.vodafone.com/orgs/VFDE-SOL/repositories?q=caws-&type=all&language=&sort=name)

### dev repos `(^dev-*)`

Temporary repositories for development of actions or testing.

Valid examples:
- dev-k8s-modules-sol

### docs repos `(^docs-*)`

Documentation and guidelines for other engineers.

Valid examples:
- [docs-sol-cet](https://github.vodafone.com/VFDE-SOL/docs-sol-cet)
- [more...](https://github.vodafone.com/orgs/VFDE-SOL/repositories?q=docs-&type=all&language=&sort=name)

### ecr registries `(^ecr-*)`

Repositories to control the ecr registries for all images used in.

Valid examples:
- [ecr-k8s-modules-sol](https://github.vodafone.com/VFDE-SOL/ecr-k8s-modules-sol)
- [ecr-k8s-modules-sol-done](https://github.vodafone.com/VFDE-SOL/ecr-k8s-modules-sol-done)
- [more...](https://github.vodafone.com/orgs/VFDE-SOL/repositories?q=ecr-&type=all&language=&sort=name)

### iam repos `(^iam-*)`

Repositories controlling users' rights to assume another iam role; i.e. permissions escalation.
One repository per sub-project, manages all aws accounts/environments belonging to that sub-project.

Valid examples:
- [iam-sol-sec](https://github.vodafone.com/VFDE-SOL/iam-sol-sec)
- [more...](https://github.vodafone.com/orgs/VFDE-SOL/repositories?q=iam-&type=all&language=&sort=name)

### image repos `(^image-*)`

Repositories to create and maintain docker images.

Valid examples:
- [image-k8s-modules-sol](https://github.vodafone.com/VFDE-SOL/image-k8s-modules-sol)
- [image-k8s-modules-sol-done](https://github.vodafone.com/VFDE-SOL/image-k8s-modules-sol-done)
- [more...](https://github.vodafone.com/orgs/VFDE-SOL/repositories?q=image-&type=all&language=&sort=name)

### kubernetes apps `(^k8s-apps-*)`

Contains helm charts for a specific k8s cluster which directly used by actual deployments with argocd.
Please add always the target cluster account to the repository name: **k8s-apps**-account-alias

Valid examples:
- [k8s-apps-dev-sol-vfde](https://github.vodafone.com/VFDE-SOL/k8s-apps-dev-sol-vfde)
- [k8s-apps-dev-done-sol-vfde](https://github.vodafone.com/VFDE-SOL/k8s-apps-dev-done-sol-vfde)
- [k8s-apps-prod-done-sol-vfde](https://github.vodafone.com/VFDE-SOL/k8s-apps-prod-done-sol-vfde)
- [more...](https://github.vodafone.com/orgs/VFDE-SOL/repositories?q=k8s-apps&type=all&language=&sort=name)

### kubernetes modules `(^k8s-modules-*)`

Contains modules with scope for all solstice accounts or a specific subproject:

- k8s-modules-**sol** (holds modules with scope for all solstice accounts)
- k8s-modules-**sol-done** (holds modules with scope for all done accounts in solstice)

Valid examples:
- [k8s-modules-sol](https://github.vodafone.com/VFDE-SOL/k8s-modules-sol)
- [k8s-modules-sol-cone](https://github.vodafone.com/VFDE-SOL/k8s-modules-sol-cone)
- [k8s-modules-sol-fulfill](https://github.vodafone.com/VFDE-SOL/k8s-modules-sol-fulfill)
- [more...](https://github.vodafone.com/orgs/VFDE-SOL/repositories?q=k8s-modules-&type=all&language=&sort=name)

### meta-org repositories `(^meta-org-*)`

Repositories to help managing the github organisation like team or repository management.

Valid examples:
- [meta-org-repos](https://github.vodafone.com/VFDE-SOL/meta-org-repos)
- [meta-org-teams](https://github.vodafone.com/VFDE-SOL/meta-org-teams)
- [meta-org-workspaces](https://github.vodafone.com/VFDE-SOL/meta-org-workspaces)

### packer-ami repositories `(^packer-ami-*)`

Packer repositories build aws ami images via ansible and shell provisioner.

Valid examples:
- [packer-ami-amzn2-pcs-base](https://github.vodafone.com/VFDE-SOL/packer-ami-amzn2-pcs-base)
- ...

### template repositories `(^template-*)`

Template repositories with pre-defined configs and actions.

Valid examples:
- [template-action](https://github.vodafone.com/VFDE-SOL/template-action)
- [template-default](https://github.vodafone.com/VFDE-SOL/template-default)
- [template-k8s-apps](https://github.vodafone.com/VFDE-SOL/template-k8s-apps)
- [template-k8s-modules](https://github.vodafone.com/VFDE-SOL/template-k8s-modules)
- [template-packer-ami](https://github.vodafone.com/VFDE-SOL/template-packer-ami)
- [template-terraform-component](https://github.vodafone.com/VFDE-SOL/template-terraform-component)
- [template-terraform-project](https://github.vodafone.com/VFDE-SOL/template-terraform-project)

### terraform-component repositories `(^terraform-component-*)`

Repositories for more complex "terraform modules" which contain more than one terraform module and dependencies.
A terraform-component should be deployable in any account using VFCF/CET.

Valid examples:
- [terraform-component-bastionhost](https://github.vodafone.com/VFDE-SOL/terraform-component-bastionhost)
- [terraform-component-datadog](https://github.vodafone.com/VFDE-SOL/terraform-component-datadog)
- [more...](https://github.vodafone.com/orgs/VFDE-SOL/repositories?q=terraform-component-&type=all&language=&sort=name)

### terraform-modules repositories `(^terraform-modules-*)`

Repositories for smaller and reusable "terraform modules" without many dependencies.

Valid examples:
- [terraform-modules-sol](https://github.vodafone.com/VFDE-SOL/terraform-modules-sol)
- terraform-modules-sol-done

### terraform-project repositories `(^terraform-project-*)`

Repositories for a project which holds everything for a subproject like `aprm`, `done` or also `mgmt`.
The code can directly used by deployment with terragrunt and atlantis.

Valid examples:
- [terraform-project-sol-aprm](https://github.vodafone.com/VFDE-SOL/terraform-project-sol-aprm)
- [terraform-project-sol-mgmt](https://github.vodafone.com/VFDE-SOL/terraform-project-sol-mgmt)
- [more...](https://github.vodafone.com/orgs/VFDE-SOL/repositories?q=terraform-project-&type=all&language=&sort=name)

### test repositories `(^test-*)`

Repositories for testing or PoCs.

### tool repositories `(^tool-*)`

Repositories for software or tools which be maintained by VF developers.

Valid examples:
- [tool-ghsync](https://github.vodafone.com/VFDE-SOL/tool-ghsync)
