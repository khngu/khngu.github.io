---
title: How to migrate external secrets operator
description: A guide describing the procedure to follow to be able to use the external secrets operator integrated in CET-EKS
categories: [EKS]
tags: [How-To, EKS]
weight: 1
---

# Intro

Due to the adoption of a unified approach for authentication against external secret stores in AWS to retrieve SSM parameters, we have modified the Secrets Store configuration. Instead of directly referencing an AWS role for authentication, the Secrets Store now references a service account, which assumes the AWS role. This guide is about replacing the old integration of the External Secrets Operator with the new one.

# Identify if you are still using the old implementation of the ESO

Execute the following command on each of your EKS clusters to determine which Secret Store needs to be updated:

    kubectl get secretstore -A -o=custom-columns='NAMESPACE:.metadata.namespace,NAME:.metadata.name,OLD:.spec.provider.aws.role,NEW:.spec.provider.aws.auth.jwt.serviceAccountRef.name'

This command will produce an output with the columns 'namespace,' 'name,' 'old,' and 'new.' Each line represents one SecretStore. If the value in the 'old' column is not 'none' the Secret Store has to be updated.

# Adapt Terraform module

The first step is to Create a new external secrets irsa role and policy. The irsa role should be made to be assumed by the secretstore service account and the policy should allow access decryption of the needed SSM parameters/secrets manager secrets with the KMS key that was used to encrypt them.
The final result should look similar to the one of the [oauth hubble](https://github.vodafone.com/VFDE-SOL/terraform-component-eks/blob/cet-eks-sol-additions/v1.3.0/modules/cet-eks-sol-additions/oauth_hubble.tf).
  - To create the irsa role you can use the module [eks/irsa](https://github.vodafone.com/VFDE-ISS/terraform-modules-iss/tree/master/modules/eks/irsa) from ISS.
    - `cluster_name`: name of the CET-EKS cluster
    - `sevice_account_name`, `service_account_namspace`: those are the service account name and namespaces of the secretstore that will need to use this irsa role
    - `policy_json`: refer here the policy that will be created in the next step.
  - To create the policy you can use the module [external_secrets/ssmps_read_policy](https://github.vodafone.com/VFDE-ISS/terraform-component-eks/tree/master/modules/cluster_addons/external_secrets/ssmps_read_policy) from ISS.
    - `kms_key_arns`: this is the kms key that the role will be allowed to use to decrypt ssm parameters (this should be the same key that was used by the old external secrets role if you didn't add any new parameter that is encrypted with a different key)
    - `parameters`: this is the list of ssm parameters paths that the role will have access to (you can use wildcards), this list could be retrieved from the old exernal secrets role.

After making those changes to the terraform module, apply it locally to a dev environment by sourcing in the terragrunt.hcl either the local path, or the feature branch you are working on.
Before merging the changes made on the Terraform module you will have to procede with the changes on the kubernetes chart (explained in the next session) and test that everything still works correctly

{{< alert color="success" >}}
Evaluate if you want to delete the old role used by your secrets store only after you completed the migration, this could avoid any unexpected downtime.
{{< /alert >}}

# Adapt Kubernetes Chart

Adjust the Kubernetes module that creates the secretstore (and possibly external secrets):
- Add a service account annotated with the new role created
- Reference said service account in the Secrets Store under `spec.provider.aws.auth.jwt.serviceAccountRef`.
- Add, commit and push your changes to a feature branch (do not merge it yet!)
You can use [this](https://github.vodafone.com/VFDE-SOL/k8s-modules-sol/pull/1054/files) pull request as a reference for the needed changes.


Deploy the feature branch created in the previous step in the same dev environment where you deployed the terraform changes and make sure that the the external secrets are still synced correctly.

Once you tested everything and made sure that everything works fine, merge both the feature branches on the terraform module and kubernetes chart and release the new revisions.

# Enable CET-EKS / ISS Mantained External Secrets Operator

Once all your application's external secrets have been adjusted you can procede with disabling cet-eks-sol-additions ESO and enabling cet-systemapps ESO. To achieve this, for each of your environments you can follow those steps:

- Go to the environment's specific `k8s-apps` repo
- Modify `cet-eks-sol-additions.yaml` by setting `apps.external-secrets.enabled` to `false`
- Modify `cet-systemapps.yaml` by removing the value `eso.enabled: false` (it defaults to true, so removing it is equivalent to setting it to true)
- you can use the changes in [this PR](https://github.vodafone.com/VFDE-SOL/k8s-apps-dev1-sol-vfde/pull/746/files) as a reference
- add, commit, push and merge to master
- Go to your project's `terraform-project` repo and in the `terragrunt.hc`l under `platform/cet-eks-sol-additions` set `external-secrets.enabled` to `false` (this will cleanup the old ESO IAM role)
- you can use the changes in [this PR](https://github.vodafone.com/VFDE-SOL/terraform-project-sol-vfcf/pull/922/files) as a reference
- add, commit and push. Open a PR and let atlantis apply your changes
- Check that the external secrets in your cluster are still being synced correctly
