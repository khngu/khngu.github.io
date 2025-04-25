---
title: Toolchain Guide
description: An overview on Tools used.
categories: [Tooling]
tags: [git, GitHub Actions]
weight: 10
---

## Vodafone GitHub Enterprise

{{< alert color="success" title="Why we moved to github.vodafone.com">}}
Vodafone Strategy is that all Vodafone entities should be able to share and use code. Thus repos are public if they are production ready.

We have the assurance that `github.vodafone.com` is here to stay.
(See the GitHub Team Wiki)
{{< /alert >}}

### Apps

[GitHub-Documentation](https://docs.github.com/en/enterprise-server@3.7/developers/apps/getting-started-with-apps/about-apps)

#### OAuth Apps

For technical endpoints (URLs) we also heavily rely on GitHub OAuth as SSO, which gives us MFA. Which will allow us to to make them public.
(Sadly we can't use this for non-technical endpoints as user will require the GitHub User Role.)

[GitHub-Documentation-Oauth-App](https://docs.github.com/en/enterprise-server@3.7/developers/apps/building-oauth-apps/creating-an-oauth-app)

#### GitHub Apps

GitHub Apps are first-class actors within GitHub. A GitHub App acts on its own behalf, taking actions via the API directly using its own identity, which means you don't need to maintain a bot or service account as a separate user


With GitHub Apps we can safely allow for automation tasks without the need of technical users and all the overhead that comes with them.

[GitHub-Documentation-GitHub-App](https://docs.github.com/en/enterprise-server@3.7/developers/apps/building-github-apps/creating-a-github-app)

### Bots

These bots are part of all of our repositories and configured by the related dotfile at root level of the repo

#### policy-bot

[policy-bot](https://github.com/palantir/policy-bot) is a GitHub App for enforcing approval policies on pull requests. It does this by creating a status check, which can be configured as a required status check.

#### settings-bot

[settings-bot](https://github.vodafone.com/VFDE-ISS/tool-settingsbot) is a GitHub App enables GitOps for github repository settings. Based on a config inside the repository itself, the repository is configured through the github api.

#### review-waiter-bot

[review-waiter-bot](https://github.vodafone.com/VFDE-SOL/tool-reviewwaiter-bot) is a GitHub App for marking pull request as "reviewable" and to handle a "first/second approver" workflow.

### GitHub Actions

We have different workflows and actions to automate our workloads, all are gitops driven (so no clickops).

[GitHub-Documentation-GitHub-Actions](https://docs.github.com/en/enterprise-server@3.7/actions)

### Authentication to Github Enterprise via CLI

You usually only have to do this once.

SSH authentication is disabled for `github.vodafone.com`.
PAT is also on the way out. Please just use `github-cli`, it only brings you joy.

[github-cli](https://cli.github.com/) is the most convenient way to give yourself access in a save way.

in your `.gitconfig` (gh needs to be in PATH)

```sh
[credential "https://github.vodafone.com"]
    helper = !gh auth git-credential
```

then you only need to run

```sh
gh auth login --hostname github.vodafone.com
```

{{< alert color="success" title="MacOS Keychain">}}
To disable Git's use of Keychain Access on macOS, change its credential helper setting. Run `git config --system credential.helper` in the terminal. For additional details, refer to the [AWS documentation on troubleshooting](https://docs.aws.amazon.com/codecommit/latest/userguide/troubleshooting-ch.html).
{{< /alert >}}

---

## Conventional Commits

We use [conventional-commits](https://www.conventionalcommits.org/en/v1.0.0) in all of our repositories and run also checks to force these specification for adding human and machine readable meaning commit messages.

The conventional-commits specification is a lightweight convention on top of commit messages. It provides an easy set of rules for creating an explicit commit history; which makes it easier to write automated tools on top of.

```sh
<type>(scope): <description>
```

---

## pre-commit

We heavily believe in [pre-commit](https://pre-commit.com) hooks. If you work on a repo that has a
`.pre-commit-config.yaml`.

You install the pre-commit hooks *inside* your repo with:

```sh
cd <your repo>
pre-commit install
```

There is also a special hook-type `commit-msg`, you install it with:

```sh
pre-commit install --hook-type commit-msg
```

You can run [pre-commit] against all files *inside* your repo with:

```sh
cd <your repo>
pre-commit run -a
```

You can also run [pre-commit] against the files in your current git index:

```sh
cd <your repo>
pre-commit run
```

{{< alert color="success" title="pre-commit hooks">}}
All GitHub repositories have required checks to pass all [pre-commit] hooks. If you don't install this, you will likely not be able to merge any changes.
{{< /alert >}}
