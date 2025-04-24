---
title: How to SemVer
description: How to use Semantic Versioning
categories: [Tooling]
tags: [How-To, git]
weight: 30
---


In [How to Git](../how_to_git/#tag) we discussed on how to publish a tag. But how do we correctly find the right version to tag?

# Determining the Next Version Tag Using Semantic Versioning (SemVer)

Semantic Versioning (SemVer) is a versioning system that helps in version management and dependency management for software development. The versioning scheme follows the `MAJOR.MINOR.PATCH` format. The version increments based on backward-incompatible changes, backward-compatible new features, and backward-compatible bug fixes.

## Determining the Correct Version Tag

To determine the correct version tag from the last tag to the current head, follow the steps below. This guide assumes the use of Angular-style commit messages.

### 1. Analyze Commit Messages

Examine the commit messages from the last tag to the current head. Commit messages should follow the Angular commit message conventions:

- `fix(scope): description` for bug fixes
- `feat(scope): description` for new features
- `BREAKING CHANGE:` in the commit body for breaking changes

### 2. Determine the Type of Changes

Based on the commit messages, identify the type of changes:

- **Patch Changes**: Bug fixes that do not introduce new features or break backward compatibility.
  - Commit type: `fix`
- **Minor Changes**: New features that do not break backward compatibility.
  - Commit type: `feat`
- **Major Changes**: Changes that break backward compatibility.
  - Commit body: Contains `BREAKING CHANGE:`

### 3. Increment the Version

Increment the version number according to the type of changes identified:

#### Patch Release

If all commits are of type `fix`:
- Increment the PATCH version.

Example:
- Last tag: `v0.1.0`
- Commits: `fix(foo): correct something`
- Next tag: `v0.1.1`

#### Minor Release

If there are commits of type `feat` (with or without `fix` commits):
- Increment the MINOR version.
- Reset the PATCH version to `0`.

Example:
- Last tag: `v0.1.0`
- Commits: `feat(foo): add new feature`, `fix(bar): correct something`
- Next tag: `v0.2.0`

#### Major Release

If there are commits with `BREAKING CHANGE:` in the commit body:
- Increment the MAJOR version.
- Reset the MINOR and PATCH versions to `0`.

Example:
- Last tag: `v0.1.0`
- Commits: `feat(foo): add new feature`, `fix(bar): correct something`, `BREAKING CHANGE: refactor API`
- Next tag: `v1.0.0`

### 4. Examples

#### Example 1: Only Fix Commits

- Last tag: `v0.1.0`
- Commits:
  - `fix(foo): correct something`
  - `fix(bar): resolve issue`
- Next tag: `v0.1.1`

#### Example 2: Feature and Fix Commits

- Last tag: `v0.1.0`
- Commits:
  - `feat(foo): add new feature`
  - `fix(bar): correct something`
- Next tag: `v0.2.0`

#### Example 3: Breaking Changes

- Last tag: `v0.1.0`
- Commits:
  - `feat(foo): add new feature`
  - `fix(bar): correct something`
  - `BREAKING CHANGE: update API`
- Next tag: `v1.0.0`

### Summary

- **Patch Release**: Increment PATCH for bug fixes (fix commits).
- **Minor Release**: Increment MINOR for new features (feat commits).
- **Major Release**: Increment MAJOR for breaking changes (commits with `BREAKING CHANGE:`).

Following these guidelines ensures consistent and predictable versioning, aligning with Semantic Versioning principles.

For more information, visit the official [Semantic Versioning website](https://semver.org).
