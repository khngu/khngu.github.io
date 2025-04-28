---
title: Request access
description: |
  Provides a quick guide on how to request access on the fundamental services, necessary for daily activity of any Dev/\*Ops.
# categories: []
tags: [aws, git, Onboarding]
aliases:
  - /docs/developer_guide/request_access.html
weight: 20
---

## GitHub access
In order to access GitHub ([github.vodafone.com](https://github.vodafone.com/)) a user needs to have the appropriate Active Directory Security Group membership. It can be requested:

- access the internal [ARC portal](https://collaborate.vodafone.com/sites/GO_User_Access_Management/SitePages/Home.aspx)
- Click _New Access/Account_
- Search for "VOIS"
- Click on _VOIS Testing and DevOps Tool_
- Click on "_Grant new Access_"
- Select service "_GitHub_"
- Select role "_GitHub User_"
- Select Environment "_Production_"

{{< alert >}}
Vodafone Employees, can request this by themselves.
Non-Vodafone Employees, need to ask their Product Owner (PO) to raise this request on their behalf
{{< /alert >}}

For other types of requests: GitHub Enterprise is managed by a dedicated team, who is supporting it via [Teams Channel](https://teams.microsoft.com/l/team/19%3a4b3e90404a964ad5b642565dfff84fb3%40thread.tacv2/conversations?groupId=00b526ae-44d0-48fc-8ac8-bb7157b5a90f&tenantId=68283f3b-8487-4c86-adb3-a5228f18b893), Channels Wiki.


## AWS account access
 In order for a user to access any AWS account, it must be member of at least 1 Active Directory Security Group. A federation of identities allows users of Vodafone's Azure AD to assume specific AWS IAM Roles, in a specific AWS account. The authentication flow is described in the [core concepts](../../infrastructure/aws_authn_and_authz/).

Before users can access any AWS account they must request membership to specific AD Groups, through the self-service portal:

1. access the internal portal [service page of nGUM](https://ngum.vodafone.com/)
2. Click _Manage_ on the top right corner
3. Click _Applications and Access Rights_, then _Manage Applications_
4. Click _Access Rights (1 user)_ and select your own user
5. From the list of applications, select _AWS_, then _AWS Infrastructure Groups_
6. Chose the relevant FusionC sub-project
7. Select again the user of interest, then _Manage access rights_
8. Click _New_ and add all the needed nGUM Groups
9. Pay attention to the Names of the groups (see next section)

Once the request is opened, the line manager will be notified and will have to approve/reject the request.

### Naming convention of nGUM Groups
In the nGUM web-interface a list of FusionC sub projects is provided under  _AWS Infrastructure Groups_. Each sub project contains a list of nGUM group allowing access to specific AWS accounts or applications of that sub projects. The item has a _Name_ and a _Description_. While the description is an arbitrary additional information, the name has a specific format, described and maintained [here](https://de.confluence.agile.vodafone.com/display/SOLS/NGUM+Role+Overview+-+INF-DEVOPS-Roles)

_Hits:_ each nGUM role has a technical name usually part of the Description
```
APP-DE-AWS-\<_ACCOUNT_ID_\>-\<_ROLE_NAME_\>
```

Knowing the AWS Account ID and the IAM Role name, allow the identification of the proper nGUM Role to requests.


### General rule of thumb for FusionC
Depending on the role and activities performed, one of the two scenarios for requesting access applies. If the user is:

- assigned to a specific sub project of FusionC
  - request multiple nGUM groups (1 per each stage/aws account belonging to the sub project) for _INF-DEVOPS_ role

- supporting other teams in FusionC, required to access multiple sub projects
  - request the _Infra_ role in the _logon account (226114817602)_


## Deprecated notes
{{< alert color="success" >}}
Previous \*\*Infra roles (e.g. VodafoneInfra, AmazonInfra, etc) are being deprecated, thus new request are rejected.
{{< /alert >}}
