---
title: External Auth
description: External Authentication & Authorization
aliases: ["/docs/user_guide/eks/external-authentication.html"]
categories: [Kubernetes]
tags: [EKS]
weight: 20
---

{{% alert color="warning" title="Scope" %}}
This article is only valid for CET EKS v0.8+
{{% /alert %}}


## Introduction

Authentication and authorization from within the cluster is done via well-known and Kubernetes-native RBAC resources. To access the Kubernetes API from external (e.g. locally, Lambda, remote Jenkins, remote GitHub Action runner), additional AWS configurations apply. This is implemented with [AWS EKS Access Entries](https://docs.aws.amazon.com/eks/latest/userguide/access-entries.html).

## Usage

### Adding a role with cluster access policy

AWS provides generic cluster access policies that can be attached to AWS IAM roles. As FusionC clusters work not only with Kubernetes-native resources but also CRDs, the only relevant policies are:
- `AmazonEKSClusterAdminPolicy`: Can do everything with any resource
- `AmazonEKSAdminViewPolicy`: Read-only access to every resource

[AWS docs on EKS access policies](https://docs.aws.amazon.com/eks/latest/userguide/access-policies.html#access-policy-permissions)

To allow an IAM role to access the cluster, add the link as input to the CET EKS terraform module input:

```hcl
terraform {
  source = "git::https://github.vodafone.com/VFDE-SOL/terraform-component-eks.git//modules/cet-eks?ref=cet-eks/vX.Y.Z"
}

inputs = {
  access_entries = {
    "VerboseName" = {
        principal_arn = "arn:aws:iam:..." // ARN of the IAM role
        aws_policies = [{
            policy_arn = "arn:aws:eks::..." // ARN of the cluster access policy
            access_scope = {
                type = "namespace" // use "cluster" for cluster-wide access
                namespaces = ["my-namespace"]
            }
        }]
    }
  }
}
```

### Adding a role with custom permissions

Instead of using a more generic access policy, AWS EKS access entries allow to map roles to Kubernetes-based principals, too. With this, a IAM role can be linked to a Kubernetes role or clusterrole with the respective RBAC privileges. This requires two steps: The terraform part to add the access entry, and the Kubernetes part to define the RBAC resources.

Add the access entry to the cluster as input of the CET EKS terraform module:

```hcl
terraform {
  source = "git::https://github.vodafone.com/VFDE-SOL/terraform-component-eks.git//modules/cet-eks?ref=cet-eks/vX.Y.Z"
}

inputs = {
  access_entries = {
    "VerboseName" = {
        principal_arn = "arn:aws:iam:..." // ARN of the IAM role
        kubernetes = { // can use username or group
            username = "my-username"
            groups   = ["my-custom-group"]
        }
    }
  }
}
```

In Kubernetes, the respective user(name) or group has to be configured. This can be done with the combination of a (cluster-)role and a corresponding binding, as shown here with a `Role` and `RoleBinding`:

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata: [...]
rules: [...]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata: [...]
subjects: # can use user, group or both
- apiGroup: rbac.authorization.k8s.io
  kind: Group
  name: [...] # group name
- apiGroup: rbac.authorization.k8s.io
  kind: User
  name: [...] # user name
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: Role
  name: [...]
```

## Best Practices

**Follow least privilege** \
Whenever possible, limit the given privileges to the respective use case and do not give everything/everyone admin permissions. There is no need for admin permissions if your Lambda only interacts with nodes or if you use Jenkins to deploy to a specific namespace.

**Don't share/reuse roles** \
To be able to restrict applications individually, roles must not be used by multiple applications or use cases. Keep them separate to be able to adjust them separately and without side effects.
