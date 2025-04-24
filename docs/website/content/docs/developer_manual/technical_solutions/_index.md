---
title: Technical Solutions
description: >
  In this section you will find a collection of technical solutions and concepts which are ready to use in a VFCET account.
# weight: 10
---

## Available FusionC solutions

 | | |
--------|-----|-----|------
{{< figure src="logo_docker.png" width="120" >}} | **docker image builds**<br />Automatic image building with push to `aws ecr` via GitHub Actions - [more]({{< ref "/docs/developer_manual/technical_solutions/docker_builds" >}} "more") | {{< figure src="logo_packer.png" width="120" >}} | **packer ami builds**<br />ami building with `packer` inclusive automated nightly builds and deployment via GitHub Actions - [more]({{< ref "/docs/developer_manual/technical_solutions/packer_builds" >}} "more")
{{< figure src="logo_kubernetes.png" width="120" >}} | **k8s cluster**<br />Ready to use `k8s` cluster in a solstice aws account with basic application setup - [more]({{< ref "/docs/developer_manual/kubernetes/getting_started" >}} "more") | {{< figure src="logo_argocd.png" width="120" >}} | **k8s Deployments**<br />Automated `k8s helm` deployments via `ArgoCD` - [more]({{< ref "/docs/developer_manual/kubernetes/getting_started#gitops--argocd" >}} "more")
{{< figure src="logo_atlantis.png" width="120" >}} | **atlantis account setup**<br />Ready to use solstice aws account with `terraform` pull request automation via `atlantis` - [more]({{< ref "/docs/core_concepts/aws/terraform" >}} "more") | {{< figure src="logo_terraform.png" width="120" >}} | **terraform modules**<br />Collection of reusable `terraform modules` and repository setup to maintain own modules - [more]({{< ref "/docs/core_concepts/aws/terraform" >}} "more")
{{< figure src="logo_public_alb.png" width="120" >}} | **public git auth load balancer**<br />Deploy reliable and secure public web portal for your Kubernetes (K8s) apps with embedded GitHub authentication - [more]({{< ref "/docs/developer_manual/technical_solutions/public_load_balancer_guide" >}} "more") | {{< figure src="logo_criblStream.png" width="120" >}} | **Grafana / Cribl / TTWOS Integration**<br />Integrating Cribl / TTWOS to automate ticket creation from Grafana alertmanager events - [more]({{< ref "/docs/developer_manual/technical_solutions/cribl_integration" >}} "more")
{{< figure src="logo_helm.png" width="120" >}} | **oci helm charts**<br />Publishing `helm charts` in the ECR via GitHub Actions - [more]({{< ref "/docs/developer_manual/technical_solutions/oci_helm_chart_builds" >}} "more")

<br />
