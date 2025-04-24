---
title: Onboarding
description: This page explains how to onboard a workload account to E2E monitoring.
categories: [Observability]
tags: [CET, EKS, o11y]
weight: -100
---

## Prerequisites

- There is a management decision to onboard the workload account to a specific E2E account
- The account connectivity follows the account stages concept, see <a href="https://de.confluence.agile.vodafone.com/pages/viewpage.action?pageId=183169298" target=_blank><i class="fa-brands fa-confluence"></i> Accounts on stage - Graphical Overview (Gliffy)</a>

## Allowing The Workload Account

Workload accounts cannot simply connect to an E2E account. Specific resources must be created first, including policy statements to allow the access. To do so, **add the workload account to the respective instance of `e2e_gateway`** in the E2E account. Example: <a href="https://github.vodafone.com/VFDE-SOL/terraform-project-sol-e2e/blob/master/env/dev-e2e/eu-central-1/network/e2e_gateway/terragrunt.hcl" target=_blank><i class="fa-brands fa-github"></i> E2E gateway config of <code>dev-e2e</code></a>

The `connected_accounts` input is structured as follows:

```hcl
connected_accounts = {
  <ACCOUNT_SHORT_ALIAS> = {
    account_id = "123456789012"
  }
  account_a = {
    account_id = "234567890123"
  }
  account_b = {
    account_id = "345678901234"
  }
}
```

Expected plan is:

`Plan: 8*n+2 to add, 6 to change, 2 to destroy.`

Where `n` is the number of accounts being onboarded in the same PR.

## Connecting The Workload Account

With proper resources and permissions in place, connectivity can be set up. This is done by **deploying the [`e2e_consuming`](https://github.vodafone.com/VFDE-SOL/terraform-modules-sol-e2e/tree/master/modules/e2e_gateway/extra/e2e_consuming) module**. In preparation for the next step, configure the creation of IRSA roles from the input variables.

- `e2e_account_short_alias` & `e2e_account_id` - E2E account details
- `irsa_invoke_api` - Service account details to create a matching IRSA role for allowing API Gateway invokation
- `irsa_read_api_key` - Service account details to create a matching IRSA role for reading the API key from the E2E account's SSM parameters

<details style="margin-bottom: 1.5rem;">
<summary><code>e2e_consuming</code> example terragrunt.hcl incl. config <span style="color: #AAA; font-style: italic;">(version can be outdated!)</span></summary>

```hcl
terraform {
  # Git_Auto_Ref: https://github.vodafone.com/VFDE-SOL/terraform-modules-sol-e2e/tree/e2e_gateway/v1.0.0/modules/e2e_gateway/extra/e2e_consuming
  source = "git::https://github.vodafone.com/VFDE-SOL/terraform-modules-sol-e2e.git//modules/e2e_gateway/extra/e2e_consuming?ref=e2e_gateway/v1.0.0&depth=1"
}

prevent_destroy = true

include {
  path = find_in_parent_folders()
}

dependency "tfremotestate" {
  config_path  = "../../foundation/tfremotestate"
  skip_outputs = true
}

dependency "account_config" {
  config_path = "../../foundation/account_config"
}

dependency "cet_eks" {
  config_path = "../cet_eks"
}

dependency "vpc" {
  config_path = "../../network/vpc"
}

inputs = {
  cluster_name            = dependency.cet_eks.outputs.cluster_name
  e2e_account_id          = "992382654038"
  e2e_account_short_alias = "dev-e2e"
  env_short_alias         = dependency.account_config.outputs.account.short_alias

  irsa_invoke_api = {
    otel_collector_metrics_e2e = {
      service_account_name      = "otel-collector-k8s-metrics-collector"
      service_account_namespace = "cet-o11y-metrics"
    }
    otel_collector_logs_e2e = {
      service_account_name      = "otel-collector-k8s-logs-collector"
      service_account_namespace = "cet-o11y-logs"
    }
  }

  irsa_read_api_key = {
    otel_collector_metrics_e2e = {
      service_account_name      = "otel-collector-k8s-metrics-api-key"
      service_account_namespace = "cet-o11y-metrics"
    }
    otel_collector_logs_e2e = {
      service_account_name      = "otel-collector-k8s-logs-api-key"
      service_account_namespace = "cet-o11y-logs"
    }
  }

  vpc_id     = dependency.vpc.outputs.vpc_id
  subnet_ids = dependency.vpc.outputs.subnetgroup_private.subnets

  tags = dependency.account_config.outputs.mandatory_tags
}
```

</details>

## Replace Kubernetes OTel Collectors

{{% alert title="Proceed only if you know which data to send" color="warning" %}}
The following step requires knowledge of what data is to be sent to the E2E account. Without the respective config, the deployment fails. It is ok to pause the onboarding here, or performing the following changes for logs or metrics only, but not both of them.
{{% /alert %}}

The default CET EKS O11y collectors must be replaced by collectors that send data to both the local and E2E CET EKS O11y stack. The new collectors continue to send all data to the local CET EKS O11y stack and require configuration to send specific data to the E2E account (opt-in). Follow the [Using OTelCol Filters](../otelcol-e2e-filters) guide to build configurations matching your requirements.

The following steps have to be performed in the `k8s-apps` repository or the workload account. It is recommended to perform all of these steps in one PR (with separate, atomic commits with meaningful commit messages), to keep o11y data loss as small as possible. The following code snippets give examples for the `dev-e2e` account.

Firstly, **disable the default logs and metrics collectors of the CET EKS O11y stack**. To do so, set `apps.otel-metrics.enabled` and `apps.otel-logs.enabled` to false in `cet-eks-o11y.yaml`.

```yaml
apps:
  otel-metrics:
    enabled: false
  otel-logs:
    enabled: false
```

Next, **add E2E-specific configuration values in `values.yaml`** to manage them centrally:

```yaml
eks:
  o11y:
    e2e:
      endpoint: "https://o11y.dev.e2e.sol-vf.de/" # private dev-e2e
      accountId: "992382654038" # dev-e2e
```

- `endpoint` - The E2E endpoint where data is to be sent to. This can be the public or private endpoint. The endpoints are listed in the [E2E accounts overview](../#e2e-accounts)
- `accountID`: The account ID of the E2E account.

Next, **deploy the new collectors** via ArgoCD as new applications:

<div style="display: flex; flex-direction: row; justify-content: center; margin-bottom: 1rem;">
  <a href="https://github.vodafone.com/VFDE-SOL/k8s-modules-sol-e2e/tree/master/charts/otel-collector-k8s-metrics" target=_blank>
    <div style="background-color: #EEE; padding: 0.5rem 1.5rem; border-radius: 2rem; margin-right: 3rem;">
    <i class="fa-brands fa-github"></i> <code>otel-collector-k8s-metrics</code> Helm chart
    </div>
  </a>
  <a href="https://github.vodafone.com/VFDE-SOL/k8s-modules-sol-e2e/tree/master/charts/otel-collector-k8s-logs" target=_blank>
    <div style="background-color: #EEE; padding: 0.5rem 1.5rem; border-radius: 2rem;">
    <i class="fa-brands fa-github"></i> <code>otel-collector-k8s-logs</code> Helm chart
    </div>
  </a>
</div>

Copy the ArgoCD applications below, and

- Double-check if this deploys the latest compatible version. If not, update according to the changelog / release notes.
- Double-check that the referenced IRSA roles have been created. If not, create the via terraform (see above)
- Adjust `config.e2e.shippedMetrics` / `config.e2e.shippedLogs` to match your requirements.
- Check if the workload cluster has a `kube-downscaler` configuration and if it is referenced in `config.kube-donwscaler` correctly

<details style="margin-bottom: 1rem;">
<summary>Reference ArgoCD application: otel-collector-k8s-metrics</summary>

```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: "otel-collector-k8s-metrics"
  labels:
    project: "{{ .Values.project }}"
    account: "{{ .Values.shortAlias }}"
    clusterName: "{{ .Values.eks.clusterName }}"
  finalizers:
    - resources-finalizer.argocd.argoproj.io
spec:
  destination:
    namespace: cet-o11y-metrics
    server: "{{ .Values.eks.server }}"
  project: target
  source:
    path: charts/otel-collector-k8s-metrics/chart
    repoURL: "https://github.vodafone.com/VFDE-SOL/k8s-modules-sol-e2e"
    targetRevision: "otel-collector-k8s-metrics/v1.0.0"
    helm:
      values: |
        config:
          collectorIrsaRoleArn: arn:aws:iam::{{- .Values.accountId -}}:role/irsa-eks-cet-o11y-metrics-otel-collector-k8s-metrics-collector
          accountId: "{{ .Values.accountId }}"
          clusterName: "{{ .Values.eks.clusterName }}"

          e2e:
            endpoint: "{{ .Values.eks.o11y.e2e.endpoint }}"
            sourceName: {{ .Values.shortAlias }}
            shippedMetrics:
              - metricName: kube_deployment_status_replicas_available
                labels:
                  - name: deployment
                    filter: istio-ingress.*

          {{- if dig "downscaling" "enabled" false .Values.eks }}
          kube-downscaler:
            uptime: {{ dig "uptime" dict .Values.eks.downscaling | toYaml | nindent 14}}
          {{- end }}

        eso:
          apiKey:
            irsaRoleArn: arn:aws:iam::{{- .Values.accountId -}}:role/irsa-eks-cet-o11y-metrics-otel-collector-k8s-metrics-api-key
            assumeRoleArn: arn:aws:iam::{{ .Values.eks.o11y.e2e.accountId }}:role/e2e-gw-read-ssm-parameter-{{ .Values.shortAlias }}
            ssmParameterPath: /sol/component/e2e-gw/output/api-key/{{ .Values.shortAlias }}
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
```

</details>

<details style="margin-bottom: 1rem;">
<summary>Reference ArgoCD application: otel-collector-k8s-logs</summary>

```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: "otel-collector-k8s-logs"
  labels:
    project: "{{ .Values.project }}"
    account: "{{ .Values.shortAlias }}"
    clusterName: "{{ .Values.eks.clusterName }}"
  finalizers:
    - resources-finalizer.argocd.argoproj.io
spec:
  destination:
    namespace: cet-o11y-logs
    server: "{{ .Values.eks.server }}"
  project: target
  source:
    path: charts/otel-collector-k8s-logs/chart
    repoURL: "https://github.vodafone.com/VFDE-SOL/k8s-modules-sol-e2e"
    targetRevision: "otel-collector-k8s-logs/v1.0.0"
    helm:
      values: |
        config:
          collectorIrsaRoleArn: arn:aws:iam::{{- .Values.accountId -}}:role/irsa-eks-cet-o11y-logs-otel-collector-k8s-logs-collector
          accountId: "{{ .Values.accountId }}"
          clusterName: "{{ .Values.eks.clusterName }}"

          e2e:
            endpoint: "{{ .Values.eks.o11y.e2e.endpoint }}"
            sourceName: {{ .Values.shortAlias }}
            shippedLogs:
              - resourceAttributes:
                - field: k8s.deployment.name
                  filter: istio-ingress.*

          {{- if dig "downscaling" "enabled" false .Values.eks }}
          kube-downscaler:
            uptime: {{ dig "uptime" dict .Values.eks.downscaling | toYaml | nindent 14}}
          {{- end }}

        eso:
          apiKey:
            irsaRoleArn: arn:aws:iam::{{- .Values.accountId -}}:role/irsa-eks-cet-o11y-logs-otel-collector-k8s-logs-api-key
            assumeRoleArn: arn:aws:iam::{{ .Values.eks.o11y.e2e.accountId }}:role/e2e-gw-read-ssm-parameter-{{ .Values.shortAlias }}
            ssmParameterPath: /sol/component/e2e-gw/output/api-key/{{ .Values.shortAlias }}

  syncPolicy:
    automated:
      prune: true
      selfHeal: true
```

</details>

## Configuring OTel Collector for Non-EKS Workloads

If not already, migrate from the discontinued `otel-in` collector to [`otel-collector-ingress`](https://github.vodafone.com/VFDE-SOL/k8s-modules-sol-e2e/tree/master/charts/otel-collector-ingress). See the changelog for relevant changes.

`otel-collector-ingress` has the capabilities to forward observability data to an E2E account out of the box, without any replacement. Use the `config.e2e.shippedMetrics` and  `config.e2e.shippedLogs` configuration the add data forwarding. Read [Using OTelCol Filters](../otelcol-e2e-filters) to identify the needed configuration values.

{{% alert title="Operating Model" %}}
Using `otel-collector-ingress` to forward data to E2E accounts is convenient when onboarding/migrating. But effectively, this is detouring data and creating additional and unnecessary workload on the EKS cluster as well as the network, which adds costs.

It is strongly recommended to work on sending data directly from the origin (e.g. EC2 instances) to the corresponding E2E account. Read [Designing OTelCols For E2E](../otelcol-e2e-design) to see how to configure an OpenTelemetry Collector to be E2E-viable.
{{% /alert %}}

## Verifying E2E Data Transfers

This can be done opening the Grafana UI of the corresponding E2E account, and use the *Explore* feature to query the expected data. To check if any data is sent, e.g. use these queries:

| Type | Syntax | Example |
|------|--------|---------|
| Metrics | `{source_name="SHORT_ALIAS"}` | `{source_name="dev1"}` |
| Logs | `{service_name =~ ".+"} \| source_name = "SHORT_ALIAS"` | `{service_name =~ ".+"} \| source_name = "dev1"` |
<!-- CARE: need to escape | as \| in `...` to not make it a column break -->

#### Troubleshooting

If you think you did everything correctly and you do not see anything in Grafana, check the logs of the corresponding OTelCols and act on eventually occurring errors. In case you get errors from the E2E account (e.g. *Exporting failed [...] 403 Denied*), reach out in the [FusionC Infra](https://teams.microsoft.com/l/channel/19%3A8d91067bfebe4ce3b716b4867b4e2e08%40thread.tacv2/General?groupId=5164eb43-04e8-47a5-9df2-41e590a879c7&tenantId=68283f3b-8487-4c86-adb3-a5228f18b893) teams channel, alongside the following information:

- Workload account short alias
- E2E account short alias
- Is the account onboarding completed?
- Which data did you configure to be sent to the E2E account, and which ArgoCD apps hold this configuration?
- Which Grafana query should yield the data?
- Do the collector pods throw any errors? If so, provide them, and explain what you tried to resolve these (if applicable)

## Next Steps

See [How To Content](../how-to-content) to learn how E2E content like dashboards are managed.
