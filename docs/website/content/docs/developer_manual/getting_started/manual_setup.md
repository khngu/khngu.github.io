---
title: Manual setup
description: Create and customize configs manually.
categories: [Tooling]
tags: [git, Onboarding]
weight: 90
---
This guide is aimed at users who are familiar with a shell and able to change configuration files.
The guide serves as an alternative to the script [installer/sh](https://github.vodafone.com/VFDE-SOL/sol-cet-devtools/blob/master/installer/sh).

## Requirements
[List of tools and software](../getting_started/#requirements) to be installed.

***Keep your system updated.***

## 1. Install [VFDE-SOL/sol-cet-devtools](https://github.vodafone.com/VFDE-SOL/sol-cet-devtools)

- Checkout and configure
  - [terraform\_version\_wrapper](https://github.vodafone.com/VFDE-SOL/sol-cet-devtools#terraform_version_wrappersh)
  - [terragrunt\_version\_wrapper](https://github.vodafone.com/VFDE-SOL/sol-cet-devtools#terragrunt_version_wrappersh)
  - [yq\_version\_wrapper](https://github.vodafone.com/VFDE-SOL/sol-cet-devtools#yq_version_wrappersh--yq3--yq4)

## 2. Create FusionC specific configs
Latest version in [VFDE-SOL/sol-cet-devtools](https://github.vodafone.com/VFDE-SOL/sol-cet-devtools/blob/master/installer/conf/.vf_fusionC)
Create the file `$HOME/.vf_fusionC` and adapt it to your local setup:
- `#targetDir#` - location of local install
- `#userRole#` - IF part of FusionC _Systemteam_

```sh
# ------------------------------------------------------------ sol-cet-devtools
export SOL_CET_ROOT_DIR="#targetDir#"
export SOL_CET_DEVTOOLS="${SOL_CET_ROOT_DIR}/90-misc/sol-cet-devtools"
export SOL_CET_K8S_DIR="${SOL_CET_ROOT_DIR}/40-k8s-apps"
export SOL_CET_USER_ROLE="#userRole#"

export VF_TF_VERSION_CMD="${SOL_CET_DEVTOOLS}/helper/terraform_download.sh"
export VF_TF_VERSION_DIR="$HOME/.terraform.versions"
export VF_TG_VERSION_CMD="${SOL_CET_DEVTOOLS}/helper/terragrunt_download.sh"
export VF_TG_VERSION_DIR="$HOME/.terragrunt.versions"

export PATH="${SOL_CET_DEVTOOLS}/bin:${SOL_CET_DEVTOOLS}/helper:${PATH}"

# ----------------------------------------------------------------- ubuntu/snap
[ -d "/snap/bin" ] && export PATH="/snap/bin:$PATH"
[ -d "$HOME/.local/bin" ] && export PATH="$HOME/.local/bin:$PATH"

# -------------------------------------------------------------------------- gh
if command -v "gh" >/dev/null; then
  if GH_ENTERPRISE_TOKEN="$(gh auth token --hostname github.vodafone.com)" >/dev/null 2>&1; then
      export GH_ENTERPRISE_TOKEN
  fi
fi

# ------------------------------------------------------------------------ caws
export CAWS_ACCOUNT_DIRS="${SOL_CET_ROOT_DIR}/90-misc/caws-accounts-sol"
if command -v "caws" >/dev/null; then
  # shellcheck disable=SC1090
  [ -f "$HOME/.caws.hcl" ] && source <(caws setup --config "$HOME/.caws.hcl" 2>/dev/null)
fi

# -------------------------------------------------------------------- saml2aws
export SAML2AWS_DISABLE_KEYCHAIN="true"

# ------------------------------------------------------------------------- aws
export AWS_DEFAULT_REGION="eu-central-1"

# ------------------------------------------------------------------ terragrunt
export TERRAGRUNT_PROVIDER_CACHE=1
export TERRAGRUNT_FORWARD_TF_STDOUT=1
```

### Shell startup

Add FusionC configs (`$HOME/.vf_fusionC`) to your shell (depending on your environment e.g. _~/.localrc_ or  _~/.bashrc_ or _~/.zshrc_ etc), so that env variables and shell aliases are present at every new terminal/shell:

```sh
# interal vf fusionC settings"
[ -f ~/.vf_fusionC ] && source ~/.vf_fusionC
```

## 3. Checkout repos
Checkout [VFDE-SOL/caws-accounts-sol](https://github.vodafone.com/VFDE-SOL/caws-accounts-sol) and other project repositories. Use `gh_install_sol_resources` in [VFDE-SOL/caws-accounts-sol](https://github.vodafone.com/VFDE-SOL/sol-cet-devtools/tree/master?tab=readme-ov-file#gh_install_sol_resources).
Example, downloading default repos (like VFDE-SOL/caws-accounts-sol) and repos related to projects _abp_, _tdm_

```sh
${SOL_CET_DEVTOOLS}/bin/gh_install_sol_resources --filter abp --filter tdm
```

## 3. Configure saml2aws

Saml2aws configuration resides in `$HOME/.saml2aws`

This is how it should look like (Please update the username to your vodafone email `#yourVodafoneMail#`)

```sh
[default]
name                    = sso-de-si
app_id                  = 736c01bb-2416-4c60-a522-921da9cdcae0
url                     = https://account.activedirectory.windowsazure.com
username                = #yourVodafoneMail#@vodafone.com
provider                = AzureAD
mfa                     = Auto
skip_verify             = false
timeout                 = 0
aws_urn                 = urn:amazon:webservices
aws_session_duration    = 10800
aws_profile             = do_not_use
resource_id             =
subdomain               =
role_arn                =
region                  =
http_attempts_count     =
http_retry_delay        =
credentials_file        =
saml_cache              = false
saml_cache_file         =
target_url              =
disable_remember_device = false
disable_sessions        = false
prompter                =

```

Please add the followinig Link to your Bookmarks in your browser:

[AWS Web Console SSO-DE-ISS](https://myapps.microsoft.com/signin/78f5464b-e016-4fdb-9478-ba285b87fb8e?tenantId=68283f3b-8487-4c86-adb3-a5228f18b893)

## 3. Setup caws mapping
Use the provided script `sol_gen_caws_mappings` from [VFDE-SOL/caws-accounts-sol](https://github.vodafone.com/VFDE-SOL/sol-cet-devtools/tree/master?tab=readme-ov-file#sol_gen_caws_mappings). Provide _at least one_ of the switches:
- `-r #userRole#` - if part of a FusionC _Systemteam_, otherwise don't use this switch
- `-p "acme projA"` - list of FusionC project acronyms for the PAM setup


### Example, genenrated "$HOME/.caws.hcl" for the SystemTeam user
Configuring the caws mappings  for a Systemteams user (having permissions on Infra roles) and accessing PAM roles of projects _abp and tdm_:
```sh
${SOL_CET_DEVTOOLS}/bin/sol_gen_caws_mappings \
  -r Infra \
  -p "abp tdm"
```

File `$HOME/.caws.hcl` content
```hcl
# Role assumption from logon account
mapping "sol_logon" {
    selector {
      alias="logon-sol-vfde"
    }

    credential_process {
        role = "Infra"
        session_duration = 28800
        intermediate_profile_pattern = "%ACCOUNT_ID%_%SHORT_ALIAS%_infra-%PROJECT%"
        command = "saml2aws login --session-duration %SESSION_DURATION% --role arn:aws:iam::%ACCOUNT_ID%:role/%ROLE% --profile %INTERMEDIATE_PROFILE%"
    }

    profile_pattern = "%ACCOUNT_ID%_%PROJECT%_%SHORT_ALIAS%_deploy"
    region = "eu-central-1"
    shell_alias = "with_%PROJECT%_%SHORT_ALIAS%"
}

mapping "sol_account" {
    selector {
      project = "^sol$"
      short_alias = "^[^logon].*"
    }

    assume_role {
        role_arn = "arn:aws:iam::%ACCOUNT_ID%:role/Infra"
        source_profile = "226114817602_sol_logon_deploy"
    }

    profile_pattern = "%ACCOUNT_ID%_%SHORT_ALIAS%_infra-%PROJECT%"
    region = "eu-central-1"
    shell_alias = "with_%PROJECT%_%SHORT_ALIAS%"
}

mapping "sol_builder" {
  selector {
    project     = "^sol$"
    short_alias = "mgmt"
  }

  assume_role {
    role_arn       = "arn:aws:iam::196433213517:role/Builder"
    source_profile = "226114817602_sol_logon_deploy"
  }

  profile_pattern = "196433213517_%SHORT_ALIAS%_builder-%PROJECT%"
  region          = "eu-central-1"
  shell_alias     = "with_%PROJECT%_%SHORT_ALIAS%_builder"
}

# GENERATED_SUBPROJECT_MAPPINGS:START #
## ---  project: abp
mapping "abp_inf-devops" {
  selector {
    project     = "^sol$"
    short_alias = ".*abp$"
  }

  credential_process {
    role                         = "INF-DEVOPS"
    session_duration             = 28800
    intermediate_profile_pattern = "%ACCOUNT_ID%_%PROJECT%_%SHORT_ALIAS%_saml"
    command                      = "saml2aws login --session-duration %SESSION_DURATION% --role arn:aws:iam::%ACCOUNT_ID%:role/%ROLE% --profile %INTERMEDIATE_PROFILE%"
  }

  profile_pattern = "%ACCOUNT_ID%_%SHORT_ALIAS%_infdevops-%PROJECT%"
  region          = "eu-central-1"
  shell_alias     = "with_%PROJECT%_%SHORT_ALIAS%_infdevops"
}

mapping "abp_account_admin" {
  selector {
    project     = "^sol$"
    short_alias = ".*abp$"
  }

  assume_role {
    role_arn       = "arn:aws:iam::%ACCOUNT_ID%:role/AccountAdmin"
    source_profile = "%ACCOUNT_ID%_%SHORT_ALIAS%_infdevops-%PROJECT%"
  }

  profile_pattern = "%ACCOUNT_ID%_%SHORT_ALIAS%_accountadmin-%PROJECT%"
  region          = "eu-central-1"
  shell_alias     = "with_%PROJECT%_%SHORT_ALIAS%_admin"
}

mapping "abp_kube_admin" {
  selector {
    project     = "^sol$"
    short_alias = ".*abp$"
  }

  assume_role {
    role_arn       = "arn:aws:iam::%ACCOUNT_ID%:role/KubeAdmin"
    source_profile = "%ACCOUNT_ID%_%SHORT_ALIAS%_infdevops-%PROJECT%"
  }

  profile_pattern = "%ACCOUNT_ID%_%SHORT_ALIAS%_kubeadmin-%PROJECT%"
  region          = "eu-central-1"
  shell_alias     = "with_%PROJECT%_%SHORT_ALIAS%_kubeadmin"
}

# Cross-account toward mgmt
mapping "abp_builder" {
  selector {
    project     = "^sol$"
    short_alias = ".*abp$"
  }

  assume_role {
    role_arn       = "arn:aws:iam::196433213517:role/Builder"
    source_profile = "%ACCOUNT_ID%_%SHORT_ALIAS%_infdevops-%PROJECT%"
  }

  profile_pattern = "196433213517_%SHORT_ALIAS%_builder-%PROJECT%"
  region          = "eu-central-1"
  shell_alias     = "with_%PROJECT%_%SHORT_ALIAS%_builder"
}
## ---
## ---  project: tdm
mapping "tdm_inf-devops" {
  selector {
    project     = "^sol$"
    short_alias = ".*tdm$"
  }

  credential_process {
    role                         = "INF-DEVOPS"
    session_duration             = 28800
    intermediate_profile_pattern = "%ACCOUNT_ID%_%PROJECT%_%SHORT_ALIAS%_saml"
    command                      = "saml2aws login --session-duration %SESSION_DURATION% --role arn:aws:iam::%ACCOUNT_ID%:role/%ROLE% --profile %INTERMEDIATE_PROFILE%"
  }

  profile_pattern = "%ACCOUNT_ID%_%SHORT_ALIAS%_infdevops-%PROJECT%"
  region          = "eu-central-1"
  shell_alias     = "with_%PROJECT%_%SHORT_ALIAS%_infdevops"
}

mapping "tdm_account_admin" {
  selector {
    project     = "^sol$"
    short_alias = ".*tdm$"
  }

  assume_role {
    role_arn       = "arn:aws:iam::%ACCOUNT_ID%:role/AccountAdmin"
    source_profile = "%ACCOUNT_ID%_%SHORT_ALIAS%_infdevops-%PROJECT%"
  }

  profile_pattern = "%ACCOUNT_ID%_%SHORT_ALIAS%_accountadmin-%PROJECT%"
  region          = "eu-central-1"
  shell_alias     = "with_%PROJECT%_%SHORT_ALIAS%_admin"
}

mapping "tdm_kube_admin" {
  selector {
    project     = "^sol$"
    short_alias = ".*tdm$"
  }

  assume_role {
    role_arn       = "arn:aws:iam::%ACCOUNT_ID%:role/KubeAdmin"
    source_profile = "%ACCOUNT_ID%_%SHORT_ALIAS%_infdevops-%PROJECT%"
  }

  profile_pattern = "%ACCOUNT_ID%_%SHORT_ALIAS%_kubeadmin-%PROJECT%"
  region          = "eu-central-1"
  shell_alias     = "with_%PROJECT%_%SHORT_ALIAS%_kubeadmin"
}

# Cross-account toward mgmt
mapping "tdm_builder" {
  selector {
    project     = "^sol$"
    short_alias = ".*tdm$"
  }

  assume_role {
    role_arn       = "arn:aws:iam::196433213517:role/Builder"
    source_profile = "%ACCOUNT_ID%_%SHORT_ALIAS%_infdevops-%PROJECT%"
  }

  profile_pattern = "196433213517_%SHORT_ALIAS%_builder-%PROJECT%"
  region          = "eu-central-1"
  shell_alias     = "with_%PROJECT%_%SHORT_ALIAS%_builder"
}
## ---
# GENERATED_SUBPROJECT_MAPPINGS:END #
```

## 3. Useful scripts & tools
Check out the provided tools and scripts in [VFDE-SOL/sol-cet-devtools](https://github.vodafone.com/VFDE-SOL/sol-cet-devtools?tab=readme-ov-file#provided-scripts-bin) that facilitate some of the daily DevOps tasks, such as _gh_install_sol_resources_, _k8s_create_kubeconfig_, _sol_verify_tooling_, etc.

## Next steps

- Make yourself familiar with our core concepts
- Make yourself familiar with our [Code of Conduct](https://github.vodafone.com/VFDE-SOL/.github/blob/main/CODE_OF_CONDUCT.md#code-of-conduct-)
- Make yourself familar with the [VF-CET](https://github.vodafone.com/VFDE-ISS/cloud-engineering-toolkit) approach
- Continue reading the developer guide
