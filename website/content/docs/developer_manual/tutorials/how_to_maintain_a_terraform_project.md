---
title: How to maintain a Terraform Project Repository
description: Learn how to maintain your subprojcet's terraform/terragrunt project Repository.
categories: [Tooling]
tags: [How-To, terraform]
weight: 3
---

In this section we want to explain how to maintain a Terraform project.
Pre-requisites for effectively understanding the tutorial:  understanding of the [infrastructure repositories](../../infrastructure/infrastructure_development/), know the basics [core concepts]({{< ref "/docs/core_concepts/aws/terraform" >}}).


## Recap

A terraform project repo defines what infrastructure is deployed in you projects account. Changes are managed by Pull-Requests. The [Pull-Request Automation](https://www.runatlantis.io) plans the change of the PR in the targeted account or accounts and after a review process, you can via the comment `atlantis apply` apply the change to the relevant account or accounts. Atlantis merges the Pull Request automatically after a successfull apply.

## Development Workflow

### Modules Repository

- Create feature branch for your project's terraform-modules-sol
- Develop the feature and plan and apply locally
- Commit your changes (early and often)
- Create the Pull Request and update the PR Description
- Make the Pull Request pass the automated checks
- Pass the Code Review
- See the PR merged
- Switch master/git pull and tag your module using [semantic versioning](https://semver.org)

You develop a change on your module via your module repository (these are prefixed with terraform-modules-sol). For this you create a Feature Branch on that repo for your change.
Then you would do as many [local plan and apply]({{< ref "how_to_terragrunt_local_apply#terragrunt-local-testing" >}} ) cycles on your dev account until your are happy with the results.

After your development phase you open a Pull-Request on the module repo. You update the PullRequest description and check the checkboxes, make sure you pass all the required automated checks and wait for the Code Review.

The smaller the change and the better your PR description the faster the review.

After a passed review bulldozer will automatically merge your change into the main branch.

### Project Repository

- Create a feature branch for your project repo (terraform-project-sol-)
- Change the module to your new version (maybe update the input variables if needed)
- Commit your changes (early and often)
- Create the Pull Request and update the PR Description
- Make the Pull Request pass the automated checks
- Pass the Code Review
- Comment `atlantis apply` and see your change go live
- See the PR merged

In project repo you want to merge tags and not feature branches.

If you can you want to keep your module versions the same over all of your projects accounts. If you need to pass a specific change through the stages as they are dependent on the software version that is deployed in that account, you should try to realize this via variables, and be a bit smart about it via defaults.

You will have to find a understanding of what you want to configure per account or what you want to configure per module (and its version). There is no one size fits all. If you get it wrong, or do not want to think about this you will just be slower and have more snow-flake environments.
