---
title: Infrastructure Development
description: How to write Terraform modules within Solstice and how to deploy them to AWS.
categories: [Infrastructure]
tags: [aws, terraform, IaC, Onboarding]
weight: 30
---
## Pre-Requisites

You have read [Core Concepts Infrastructure as Code]({{< ref "/docs/core_concepts/aws/terraform" >}})


## Project Repositories

As mentioned in core conceps, the project repository of a project is the single source of truth for all infrastructure that is deployed to the environments of the project. Every single project has one single project repository. For providing you an understanding of project repositories we first have a look at the folder structure and continue with looking at the functional files inside this kind of repositories.

### Folder Structure
Project repositories are organized in the following structure

```sh
repo/
├─ env/
│  ├─ <env-name>/
│  │  ├─ <eu-central-1>/
│  │  │  ├─ application/
│  │  │  ├─ foundation/
│  │  │  ├─ network/
│  │  │  ├─ platform/
│  │  ├─ <eu-west-1>/
├─ live/
│  ├─ account_config
├─ modules/
│  ├─ account_index
```
The key folder for deploying infrastructure to environments of a project is `env`. It contains at least one subfolder that holds the infrastructure configurations for one environment and is named as the environments short name (one subfolder per env).\
This folder again has two subfolders `eu-central-1` and `eu-west-1`. This subfolders are named after the two AWS regions as they host infrastructure configurations for those two regions.

**!!! `eu-central-1` holds the infrastructure of Solstice projects while `eu-west-1` onlys holds security related GuardDuty configurations and thus should only be touched by members of team Tesla !!!**

In `eu-central-1` you will find 4 folders - application, foundation, network and platform. Those are meant to organize the different Terraform modules that are used to deploy infrastructure to the environment. In the following we will also refer to them as layers.
- application: Is for the project related modules (this is where most of your modules should be placed as an application team).
- foundation: Holds Terraform modules that build the foundation of the environment, e.g. tfremotestate for deploying the Terragrunt state bucket, account_config for holding Solstice related informations about the environment like name and short name of the environment or config for deploying AWS quotas to the environment.
- network: As the name indicates this folder holds network related Terraform modules like vpc for deploying the VPC to the environment or dns to deploy the necessary Rout53 resources for dns.
- platform: If your environment uses AWS EKS to run your services, this folder contains the configuration of EKS itself.

Beside the env folder there are also the `live` and the `modules` folder. Those folders contain project/environment related configurations and only Team Tesla is allowed to commit changes to those.

### Terragrunt File

A minimum terragrunt file looks like this in Vodafone.

```hcl

terraform {
  source = "<your-source>"
}


include {
  path = find_in_parent_folders()
}

dependency "account_config" {
  config_path = "../../foundation/account_config"
}

dependency "tfremotestate" {
  config_path  = "../../foundation/tfremotestate"
  skip_outputs = true
}


inputs = {
  tags        = dependency.account_config.outputs.mandatory_tags
}
```

- source: you need to define what to apply
- include: terragrunt internal
- dependency: account_config (you need at least the tags)
- dependency: tfremotestate (we are using s3 for terraform state, and dynamodb for locking)

Further reading: [terragrunt-docs](https://terragrunt.gruntwork.io/docs)

### Functional Files (incomplete)

Beside the folders which host the infrastructure configuration files, the repository also consists of several files that are used for simplifying development workflows and reducing maintenance efforts. In the following we will have a look a the most important ones.

```sh
repo/
├─ env/
├─ live/
├─ modules/
├─ .policy.yml
├─ .pre-commit-config.yaml
├─ .settingsbot.yml
├─ .templatesyncignore
├─ .tfswitchrc
├─ .tgswitchrc
├─ README.md
```

- .policy.yml: Defines approval policies on pull requests that are enforced by the policy bot. It basically defines who is able to merge PRs. For detailed description have a look at [https://github.com/palantir/policy-bot](https://github.com/palantir/policy-bot).
- .pre-commit-config.yaml: Defines the pre-commit-hooks which need to run succesfully before commits can get contributed to a branch. For more details on those hooks, have a look into the file itself. Every single hook leads to its corresponding git repository, there you should find additional details.
- .settingsbot.yml: Configures git related settings for this repository like merge strategies, branch protection, etc. For further details have a look at [https://github.vodafone.com/VFDE-ISS/tool-settingsbot](https://github.vodafone.com/VFDE-ISS/tool-settingsbot).
- .templatesyncignore: This file configures our central sync action. With this action, Tesla can sync changes to all Solstice repositories. All files mentioned in this file are not in scope of the snyc action and hence will not be synchronized.
- .tfswitchrc: This file contains the Terraform version that is used to work with this repository. For developing infrastructure in Solstice we advice using the [cet devtools](https://github.vodafone.com/VFDE-SOL/sol-cet-devtools) as they allow you to work with the Terraform version that is pinned in this file. The devtools read this file, download and execute the appropriate Terraform version in an automated way for you.
- .tgswitchrc: This file contains the Terragrunt version that is used to work with this repository. For developing infrastructure in Solstice we advice using the [cet devtools](https://github.vodafone.com/VFDE-SOL/sol-cet-devtools) as they allow you to work with the Terragrunt version that is pinned in this file. The devtools read this file, download and execute the appropriate Terragrunt version in an automated way for you.
- README.md: The name says it all ¯\\_(ツ)_/¯

## Module Repositories

Module repositories are organized in the following structure

```sh
repo/
├─ modules/
│  ├─ <module_name>/
│  ├─ <module_name2>/
....

```


### Anatomy of a module

```sh
repo/
├─ module/
│  ├─ s3_example/
│  │  ├─ inputs.tf
│  │  ├─ outputs.tf
│  │  ├─ main.tf
│  │  ├─ version.tf
│  │  ├─ variables.tf
│  │  ├─ README.md
```

The module should be configurable for what is envrionment specific, but contain what is not.

For example our s3 example here, the name of the bucket should be part of the module, but maybe you want to have env specific data retention rules.

Some best practices:

- naming of the module use underscore as a delimiter (click on foo_bar vs foo-bar)
- naming of the resources contained in the module should be grouped
- use a kms key per module
- do not name resources if not needed (we use default not this)
- follow minimal permissions principle
- every resource that supports tagging gets a tag
- every resource that supports encryption gets encrypted
- use iam roles not users (understand role assumption)
- add a tag that points to your module, check [VFDE-SOL/terraform-modules-sol-reference](https://github.vodafone.com/VFDE-SOL/terraform-modules-sol-reference)
- use existing in your module [terraform-components](https://github.vodafone.com/orgs/VFDE-SOL/repositories?q=terraform-components&type=all&language=&sort=)
- use existing base modules in your module [VFDE-SOL/terraform-modules-base](https://github.vodafone.com/VFDE-SOL/terraform-modules-base) [VFDE-ISS/terraform-modules-base](https://github.vodafone.com/VFDE-ISS/terraform-modules-base)
- look around in [VFDE-SOL](https://github.vodafone.com/orgs/VFDE-SOL)
- try to find consistency (i.e. look around what the naming patterns are in your account)
- ask for help in your PRs description: if you mention that you are not sure about it the reviewer will help you


### Tagging

After succesfully local apply you will create a tag.

In our example `s3_example/v0.1.0`.

You can use this tag then when you create your Pull Requests to the project repos corresponding env.

# Follow the tutorials:

- [How to git]({{< ref "/docs/developer_manual/tutorials/how_to_git" >}})
- [How to PR]({{< ref "/docs/developer_manual/tutorials/how_to_pr" >}})
- [How to semver]({{< ref "/docs/developer_manual/tutorials/how_to_semver" >}})
- [How to create a Terraform module]({{< ref "/docs/developer_manual/tutorials/how_to_create_a_terraform_module" >}})
- [How to maintain a Terraform project]({{< ref "/docs/developer_manual/tutorials/how_to_maintain_a_terraform_project" >}})
- [How to terragrunt local apply]({{< ref "/docs/developer_manual/tutorials/how_to_terragrunt_local_apply" >}})

# Do your research

IaC is a complex topic and experienced engineers are notoriously busy and also expensive.

Spend some time on research before you ping people. If you are just starting out start with creating something small like a s3 bucket or a ssm entry to just get the hang of it.

If you have a hello world module you want to discuss, then ping.
