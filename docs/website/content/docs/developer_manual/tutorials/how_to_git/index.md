---
title: How to Git
description: Basic Bootcamp for Git Work
categories: [Tooling]
tags: [How-To, git]
weight: 92
---

If you are allowed to use the internet there more than enough of resource on how to skillup your git game.

As appearantly some developers are not feel in a save space to research problems on the internet we will try and do a minimal skill transfer here.

We are shamelessly taking content here from [git-guide](https://rogerdudler.github.io/git-guide).


### Workflow

Your local repository consists of three "trees" maintained by git. the first one is your Working Directory` which holds the actual files. the second one is the `Index` which acts as a staging area and finally the `HEAD` which points to the last commit you've made.

[![](./git_trees.png)](./git_trees.png)

### Pull

Before you even look at a repo that you already have cloned you will want to get the latest and greatest from remote.

{{< alert color="success" >}}
Git is decentral: Your first interaction with a git repo is always pull to ensure you have all the changes from remote (the server).
{{< /alert >}}

```sh
git pull
```

### Branching

Branches are used to develop features isolated from each other. The master branch is the "default" branch when you create a repository. Use other branches for development and merge them back to the master branch upon completion.

[![](./git_branches.png)](./git_branches.png)

A good practice is to prefix your branch (fix,feat,docs,build)

{{< alert color="success" >}}
If you value you coworkers please be considerate and name branches easy to read and type.
{{< /alert >}}

#### Branching example
Create a new branch named "feat/foo" and switch to it using.

```sh
git clone -b feat/foo
```

You can switch back to master with

```sh
git checkout master
```

An delete the local branch again

```sh
git branch -d feat/foo
```

A branch is not available to others unless you push the branch to your remote repository

```sh
git push origin <branch>
```

You can delete a remote branch with

```sh
git push origin :<branch>
```

### Commits

You can propose changes (add it to the Index) using

```sh
git add <filename>
```

A more dangerous way to add changes is via the wildcard

```sh
git add .
```

{{< alert >}}
Try not to use `git add .` will gain you an instant +10 respect from anybody watching. (same goes for using vi/vim)
{{< /alert >}}

if you are only changing existing files the better way is to use

```sh
git add -u
```

if you add new stuff in a specific directory, mentioning that directory is better than '.'

```sh
git add foo/
```

Do not use `git commit -m "."` over and over again... also a bad habbit, just write small commits and figure out a commit message for that small change. It will help you later to remember what you did.

A example work on a module `s3` in your subprojcets modules repo could be

```sh
feat(s3): add kms
feat(s3): add bucket
feat(s3): add bucket policy
feat(s3): add read policy
feat(s3): add outputs
feat(s3): add inputs
```

You can always rewrite your branches commits. But it helps if it is not just `squash me later`.
Squashing is better than 4 commits with some generic commit message, but small commits with sep commit message write nicer changelogs.

If you want to add something to the outputs

```sh
feat(s3): add foo to outputs
```

in the project repo your commit always is scoped by your env and in the message you want to mention the module you are touching:


```sh
feat(dev-fulfill): bump s3 v0.2.0"
```

## Format of the commit message

Our Repositories follow conventional commit style, you can read the specs [here](https://www.conventionalcommits.org/en/v1.0.0).

The commit message should be structured as follows:
```sh
<type>(<scope>): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

### Message subject

The first line cannot be longer than 72 characters and should be followed by a blank line. The type and scope should always be lowercase as shown below.

### Allowed `<type>` values:

- **feat**: for a new feature for the user, not a new feature for build script. Such commit will trigger a release bumping a MINOR version.
- **fix**: for a bug fix for the user, not a fix to a build script. Such commit will trigger a release bumping a PATCH version.
- **perf**: for performance improvements. Such commit will trigger a release bumping a PATCH version.
- **docs**: for changes to the documentation.
- **style**: for formatting changes, missing semicolons, etc.
- **refactor**: for refactoring production code, e.g. renaming a variable.
- **build**: for updating build configuration, development tools or other changes irrelevant to the user.

### Example `<scope>` values:

- init
- dev-done
- kms
- iam
- outputs
- variables
etc.


The `<scope>` can be empty (e.g. if the change is a global or difficult to assign to a single component), in which case the parentheses are omitted. Check the git history of the project you are trying to contribute to.


### Message body

Just as in the `<subject>`, use the imperative, present tense: "change" not "changed" nor "changes". Message body should include motivation for the change and contrasts with previous behavior.

In our repos we see the Message body is optional, but you can use this advise for Pull Request descriptions.

### Message footer

Referencing issues #
Closed issues should be listed on a separate line in the footer prefixed with "Closes" keyword like this:

Closes #234
or in the case of multiple issues:

Closes #123, #245, #992

## Action Words

The following are some suggestion for action words to use in a commit message:

- **add**: Create a capability e.g. feature, resource, dependency.
- **rm**: Remove a capability e.g. feature, resource, dependency.
- **bump**: Increase the version of something e.g. dependency.
- **make**: Change the build process, or tooling, or infra.
- **refactor**: A code change that MUST be just a refactoring.
- **reformat**: Refactor of formatting, e.g. omit whitespace.
- **optimise**: Refactor of performance, e.g. speed up code.
- **document**: Refactor of documentation, e.g. help files.


### Commit comand

```sh
git commit -m "feat(scope): do something"
```

(Try to phrase it like you are telling the machine what it is supposed to do.)

Now the file is committed to the HEAD, but not in your remote repository yet.

### Pre-commit

All repositories in VFDE-SOL use the [pre-commit framework](https://pre-commit.com) to keep our repositiories clean. You can see the configuration in the repo in a commited file called `pre-commit-config.yaml`.

To install the pre-commit hooks you have to run

```sh
pre-commit install
```

once in the specific repo you are working on.

The Pre-commit checks are also run on github when you raise your Pull-Request.

Some pre-commits already fix the found issues automatically, you will in that case see changed files when running git status. To proceede add those and try to commit again.


Here is an example of a pre-commit hook remediating itself:

```sh
Terragrunt hclfmt........................................................Failed
- hook id: terragrunt-hclfmt
- files were modified by this hook

INFO[0000] /home/foo.bar/vfde-sol-projects/terraform-project-sol-asgw/env/test-asgw/eu-central-1/network/privatelink/producing/terragrunt.hcl was updated
```


A `git status` shows you the modified, should you not believe the info message.
To proceed, add the modified file(s) by running `git add -u` and then repeat your `git commit -m ...`.

### Pushing Changes

Your changes are now in the HEAD of your local working copy. To send those changes to your remote repository, execute

```sh
git push
```

### Pull Request

You can create a draft Pull-Request via

```sh
gh pr create -f -d
```

You will get a link to your Pull-Request and can then navigate and update the Description of the PR and when done mark it as ready for review.

Please also see [How to PR](../how_to_pr/).

#### Change Commits after push

{{< alert color="success" >}}
You can only change your commits on your branch. If it is merged you will have to live with whatever you commited.
{{< /alert >}}

You can change the last commit message with

```sh
git commit --amend
```

If you want to change more then one commit you will have to deal with a [squash commmit](https://www.freecodecamp.org/news/git-squash-commits).

NOTE: You can also use [GitHub Desktop]({{< ref "lifehacks#do-squash-commits-via-github-desktop" >}}) to squash commits using GUI.

```sh
git rebase -i HEAD~x
```
(where x is the number of commits you want to change, if you are lazy you can get that from your PR tab commits)

you can also try to get it like this
```sh
git rebase -i $(git merge-base master HEAD)
```

If you need to redo all your commits:

```sh
git reset --soft $(git merge-base master HEAD)
git restore --staged .
git status
```

From there you can begin again to commit.


As you already pushed the commits before, the final step is to push with force...

```sh
git push origin --force
```

or if it is a busy repository/branch the more correct way is

```sh
git push origin --force-with-lease
```

### Tag

A Tag is a immutable marker, we tag on master.

{{< alert color="success" >}}
Again: We tag on master/main after the merge of the PR. Never on the branch.
{{< /alert >}}

After a sucessfull merge, you checkout master and pull your changes.

```sh
git checkout master
git pull
```

This is how you tag

```sh
git tag v0.1.0
```

We use [semantic versioning](https://semver.org), for our monorepos we also have prefixes (i.e. module_name/v0.1.0).

A tag is not available to others unless you push the tag to your remote repository

```sh
git push origin v0.1.0
```

Again Tags are immutable, you can not push a tag that is already pointing to another commit remotely.

See...
```sh
git fetch -p
```

Please refer to [How to SemVer](../how_to_semver/) for more on tagging.
