---
title: AWS Workspaces
description: About AWS WorkSpaces
categories: [Tooling]
tags: [Onboarding, TL;DR]
# weight: 10
---

## TL;DR

AWS WorkSpaces are provided as a workaround as vendors and employees at the moment do not come with developer equipment.

## Prerequisites

- You are working in Solstice
- You are a member of the GitHub VFDE-SOL organization
- You are in a team in the GitHub VFDE-SOL organization

## Getting a WorkSpace

Request a WorkSpace by opened an Issue in the [VFDE-SOL/meta-org-workspaces](https://github.vodafone.com/VFDE-SOL/meta-org-workspaces) repository.

{{% alert color="warning" title="Important" %}}
A WorkSpace comes as is. This is not a service with any kind of SLA. The WorkSpace is for developing in Solstice, please put no PII on your machine. You have sudo rights, and you are an adult, please install and configure your work environment as needed.

All data that you want to keep should be committed to a repo. Currently you cannot connect to WorkSpace when you are behind Vodafone VPN.
{{% /alert %}}

This is something for Office IT to enable).

If you are not a Member of a team in the VFDE-SOL Organization, the bot will close your issue. The WorkSpace creation takes at least 30-60min (it's a very special AWS service). When the creation is completed, you will be notified via the Issue you created, with all the instructions you need to gain access to your WorkSpace.

If you find problems, please try to fix them on your own (you can sudo). That being said contribution is very much welcome, just open a ticket with what you found and how you helped yourself.

{{% alert color="warning" title="Warning" %}}
The WorkSpaces are not a bastionhost with access to the hole Solstice infrastructure! The main purpose is to provide a workaround of a development environment for engineers, who don't have the necessary permissions on their local workstations.

You can't use the WorkSpaces to provide access to your final solstice applications.
{{% /alert %}}
