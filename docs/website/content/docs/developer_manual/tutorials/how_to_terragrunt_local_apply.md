---
title: How to testing Terraform
description: Here we will describe how to use local testing for terraform changes.
categories: [Infrastructure]
tags: [How-To, terraform]
weight: 1
---

{{< alert color="success" >}}
Do not use PRs for testing your terraform changes. You should never have to merge a switch to a feature branch as you have with argocd. The concepts here are different.
{{< /alert >}}

# Development Workflow

The usual workflow for terraform is:

- Change your module code in your module repo
- Use a local apply
- Verify it does what you need
- Raise a PR in your module repo
- Make it Pass the bots
- Pass Review and get it merged
- Create a tag
- Use the new tag in your project
- Raise a PR in your projcet repo
- Make it Pass the bots
- Pass Review and get it merged


## Terragrunt local testing

{{< alert color="success" >}}
You do only want to use that in your dev, or if you have good reasons.
{{< /alert >}}

During the development of new terraform modules, particularly those involving complex AWS resources, it is often beneficial for developers to iterate quickly and gain feedback locally. To facilitate this process, you can plan and review your local changes' impact on Terraform resources using Terragrunt.

Instead of raising a PR in your project repo with a change to a feature branch or a untested tag, use a local apply.


### File Method

A straight forward way is to substitute the _source_ field with the local path.

Navigate to the specific module folder within the [Project repository](../../infrastructure/infrastructure_development/#folder-structure) and execute the Terragrunt plan. Assuming the module being developed is located in local path _~/VFDE-SOL/30-tf-modules/terraform-modules-sol-afms/modules/example_application_, substitute:

```sh
source = "git::https://github.vodafone.com/VFDE-SOL/terraform-modules-sol-afms.git//modules/example_application?ref=feat/add_module_for_example_application"
```

with:

```sh
source = "~/VFDE-SOL/30-tf-modules/terraform-modules-sol-afms//modules/example_application"
```

You can run the local plan and apply by executing terragrunt from the path of the terragrunt.hcl file you just edited.


Example

```sh
# navigate to your terragrunt.hcl
cd env/dev-abp/eu-central-1/application/example_application
# call apply with context of your target env
with_sol_dev-abp terragrunt apply
```


## CLI option Method

A second method for modifying the Terragrunt plan on the fly is to make use of its CLI options [--terragrunt-source-map](https://terragrunt.gruntwork.io/docs/reference/cli-options/#cli-options). This switch replaces literal strings in the URL of the _source_ field of the terragrunt.hcl as well as dependencies. Note that the sub-string after the '//' is not replaced. E.g. to test locally without changing the GitHub URL of the file itself, terragrunt can be planned locally as follows:

```sh
# Export and use env variables for commodity
export TG_MAP_SRC="git::https://github.vodafone.com/VFDE-SOL/terraform-modules-sol-afms.git"
export TG_MAP_DST="~/VFDE-SOL/30-tf-modules/terraform-modules-sol-afms"

# Naviagte to the terragrunt.hcl file
cd env/dev-afms/eu-central-1/application/example_application

# Run Terragrunt plan with the switch
terragrunt --terragrunt-source-map ${TG_MAP_SRC}=${TG_MAP_DST} plan
```

The command will replace the string in ```${TG_MAP_SRC}``` with the string in ```${TG_MAP_DST}``` in the source of the _terragrunt.hcl_ file. Since the sub-string after the '//' is not changed, local folder structure must resemble the repository structure.\

As a side note: the substitution is done at `runtime`, thus the terragrunt plan might run slower.
