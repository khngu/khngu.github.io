---
title: Getting Started
description: The First steps you need to get your development going.
categories: [Tooling]
tags: [Onboarding]
weight: -1
---

Please begin with reading the [core concepts]({{< ref core_concepts>}}). JAAAAAAAAAA

Then explore the [VFDE-SOL](https://github.vodafone.com/VFDE-SOL) organisation.

You should have understood that there are established patterns for repositories in VFDE-SOL so you can search specific points of interest like:

- [meta](https://github.vodafone.com/orgs/VFDE-SOL/repositories?q=meta-&type=source&language=&sort=)
- [terraform-project](https://github.vodafone.com/orgs/VFDE-SOL/repositories?q=terraform-project-&type=source&language=&sort=)
- [terraform-modules](https://github.vodafone.com/orgs/VFDE-SOL/repositories?q=terraform-modules-&type=source&language=&sort=)
- [terraform-component](https://github.vodafone.com/orgs/VFDE-SOL/repositories?q=terraform-component-&type=source&language=&sort=)
- [k8s-modules](https://github.vodafone.com/orgs/VFDE-SOL/repositories?q=k8s-modules-&type=source&language=&sort=)
- [k8s-apps](https://github.vodafone.com/orgs/VFDE-SOL/repositories?q=k8s-apps-&type=source&language=&sort=)
- [images](https://github.vodafone.com/orgs/VFDE-SOL/repositories?q=image-&type=source&language=&sort=)
- [ecr](https://github.vodafone.com/orgs/VFDE-SOL/repositories?q=ecr-&type=source&language=&sort=)
- [packer](https://github.vodafone.com/orgs/VFDE-SOL/repositories?q=packer-&type=source&language=&sort=)
- [actions](https://github.vodafone.com/orgs/VFDE-SOL/repositories?q=actions-&type=source&language=&sort=)
- [lambdalayer](https://github.vodafone.com/orgs/VFDE-SOL/repositories?q=lambdalayer-&type=source&language=&sort=)

## Requirements

You need to have a working installation of the following tools on your local environment:

- [aws-cli](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)
- [bash](https://www.gnu.org/software/bash/) (>= v5)
- [caws](https://github.vodafone.com/VFTech-SDaaS/Tool-caws)
- [curl](https://curl.se/)
- [git-cli](https://git-scm.com/downloads)
- [GitHub CLI](https://cli.github.com/)
- [GNU core utilities](https://www.maizure.org/projects/decoded-gnu-coreutils/)
- [GNU sed](https://www.gnu.org/software/sed/)
- [jq](https://stedolan.github.io/jq/) (>= v1.6)
- [pre-commit](https://pre-commit.com/)
- [saml2aws](https://github.com/Versent/saml2aws) (>= v2.36.13)
- [yq](https://mikefarah.gitbook.io/yq/) (v3/v4)
- [terragrunt-atlantis-config](https://github.com/transcend-io/terragrunt-atlantis-config)


***Keep your system updated.***

## 1. Install [VFDE-SOL/sol-cet-devtools](https://github.vodafone.com/VFDE-SOL/sol-cet-devtools)

- Checkout and configure
  - [terraform\_version\_wrapper](https://github.vodafone.com/VFDE-SOL/sol-cet-devtools#terraform_version_wrappersh)
  - [terragrunt\_version\_wrapper](https://github.vodafone.com/VFDE-SOL/sol-cet-devtools#terragrunt_version_wrappersh)
  - [yq\_version\_wrapper](https://github.vodafone.com/VFDE-SOL/sol-cet-devtools#yq_version_wrappersh--yq3--yq4)

## 2. Run the [installer](https://github.vodafone.com/VFDE-SOL/sol-cet-devtools?tab=readme-ov-file#installer)

The interactive script from [VFDE-SOL/sol-cet-devtools](https://github.vodafone.com/VFDE-SOL/sol-cet-devtools?tab=readme-ov-file#installer) will create the local configurations for a Linux OS or macOS environment. Required tools mentioned above must still be installed beforehand.

### Example of inistaller/sh run
{{< alert color="info" title="Note">}}
The interaction flow and output might change with the script update.
{{< /alert >}}

Using default installation path
```sh
./installer/sh

# ----------------------------------------------------
# VFDE-SOL/sol-cet-devtools/installer/sh v0.3.0
# ----------------------------------------------------

Please enter a target path for the installation [default '/Users/john.smith/Projects/vfsol-infra']:

```

Provide a list of project acronyms or leave empty to clone ALL repos
```sh
# ----------------------------------------------------

Enter a project filter like 'done' or 'ebpa'. Leave empty if you do not want to set a filter: bmt
INFO :: bmt provided. Add another one?
Enter a project filter like 'done' or 'ebpa'. Leave empty if you do not want to set a filter: ebpa
INFO :: ebpa provided. Add another one?
Enter a project filter like 'done' or 'ebpa'. Leave empty if you do not want to set a filter:

# ----------------------------------------------------

All configs set. Continue now installing resources with 'bmt ebpa' as filters? (y/n) y


# ----------------------------------------------------
```

When all required tools are properly installed
```sh
INFO :: Verify local tooling now ...

common tooling:
 ✔  bash 5.2.32
 ✔  docker 27.2.1
 ✔  gh 2.59.0
 ✔  git 2.46.1
 ✔  jq 1.7
 ✔  pre-commit 3.7.0
 ✔  yq 4.44
 ✔  yq3 3.4.1
 ✔  yq4 4.42.1

aws tooling:
 ✔  aws 2.22.3
 ✔  caws 0.7
 ✔  saml2aws 2.36

k8s tooling:
 ✔  kubectl 1.31
 ✔  helm 3.16.1

INFO :: All tools are installed correctly. Skip pkg installation ...
```

Provide your corporate email. If part of a _Systemteam of FusionC_ (i.e. supporting/helping other FusionC teams and projects), provide the role, otherwise leave empty
```sh
# ----------------------------------------------------

Create/update necessary config files in your home directory? (y/n) y

INFO :: create config files ...
Please add your Vodafone email address (John.Smith@vodafone.com): John.Smith@vodafone.com
Please add your FusionC Systemsteam role (Infra, SysAdmin or empty): Infra

Continue now creating config files with values 'userEmail=John.Smith@vodafone.com' and 'userRole=Infra'? (y/n) y

INFO :: processing file '.saml2aws' ...
INFO :: processing file '.vf_fusionC' ...
```

If not part of a _Systemteam of FusionC_, then PAM configs are needed.
The example below skips the project list, as it was already provided in the previous steps (i.e. _bmt_ and _ebpa_ from the example above)
```sh
Add project specific caws config (PAM roles)? (y/n)y
Using template: /var/folders/z8/76b9hl9126g4340vh5c1dkm5x0wsd6/T/sol-cet-devtools-installer.EX2BRxQuas/assets/caws/.caws.hcl.tpl
Generating caws mappings: /Users/john.smith/.caws.hcl

# ----------------------------------------------------

INFO :: Installation completed. Please reload your active shell or start a new one.
Happy coding!
```

Further testing of caws mappings and other examples for (re)generating them, can be found in [PAM](../tutorials/how_to_config_caws_to_use_pam)

## 3. Others
Please add the following Link to your Bookmarks in your browser:

[AWS Web Console SSO-DE-ISS](https://myapps.microsoft.com/signin/78f5464b-e016-4fdb-9478-ba285b87fb8e?tenantId=68283f3b-8487-4c86-adb3-a5228f18b893)

### Useful scripts & tools
Check out the provided tools and scripts in [VFDE-SOL/sol-cet-devtools](https://github.vodafone.com/VFDE-SOL/sol-cet-devtools?tab=readme-ov-file#provided-scripts-bin) that facilitate some of the daily DevOps tasks, such as _gh_install_sol_resources_, _k8s_create_kubeconfig_, _sol_verify_tooling_, etc.

## Next steps

- Make yourself familiar with our core concepts
- Make yourself familiar with our [Code of Conduct](https://github.vodafone.com/VFDE-SOL/.github/blob/main/CODE_OF_CONDUCT.md#code-of-conduct-)
- Make yourself familiar with the [VF-CET](https://github.vodafone.com/VFDE-ISS/cloud-engineering-toolkit) approach
- Continue reading the developer guide


## Links

- [caws](https://github.vodafone.com/VFTech-SDaaS/Tool-caws#caws)
- [VFDE-SOL](https://github.vodafone.com/VFDE-SOL)
- [VFDE-SOL/caws-accounts-sol](https://github.vodafone.com/VFDE-SOL/caws-accounts-sol)
- [VFDE-SOL/sol-cet-devtools](https://github.vodafone.com/VFDE-SOL/sol-cet-devtools)
