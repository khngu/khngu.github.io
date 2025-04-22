---
title: How to AWS IDP Transition
description: Tackle the upcoming AWS IDP Transition in your developer setup.
categories: [Tooling]
tags: [How-To, aws]
weight: 91
---

{{< alert color="success" >}}
If you are still using legacy `LandingZone` accounts you do not want to change anything until announced otherwise.
{{< /alert >}}

PCS has announced that the Vodafone [AWS AzureAD IdPs](https://confluence.sp.vodafone.com/display/GPCS/FAQ+-+New+AWS+AzureAD+SAML+IdPs) will change.

From the announcement mail...

>As part of continued effort in improving security, we are deploying new Vodafone AzureAD SAML Identity Providers (IdPs) inside AWS accounts, starting with AWS Accounts belonging to the "VF-DE", "VF-DE SOLSTICE" and "VF-DE KABEL" AWS Organizations.

>The current "Azure" IdP is used to enable authentication with your Federated AWS IAM Roles using Vodafone Active Directory (AD) Security Groups e.g. APP-DE-AWS-112233445566-your\_aws\_role\_name. Two new IdPs will be available inside your AWS Accounts that   will ultimately replace "Azure" - these are named:
>
>- SSO-DE
>- SSO-DE-SI

>They both bring improvements to how the app is configured in Azure, along with "SSO-DE-SI" supporting SourceIdentity - a long awaited feature that improves the security, auditability and traceability of actions made inside your AWS Accounts. You will see these new IdPs deployed in your accounts over the coming weeks and for new AWS accounts created in these AWS Organizations, they will be deployed as part of the account enablement. There will be no interruption to service during this specific activity.

> Like we did in the ADFS to AzureAD Migration, we will also update all Federated AWS IAM Roles that reference the current IdP named "Azure" in their trust policy to refer to "SSO-DE" on your behalf to take advantage of the app improvements. This will be done under a CRQ as per process, details of which can be seen in the Confluence link below as and when they are available.

> The "Azure" IdP will continue to exist in your accounts and be deployed for new accounts in these AWS Organizations for the short-term, after which it will then be removed along with the legacy "ADFS" IdP. We will send another communication to inform you when this will happen with plenty of notice.


> Germany Cloud Center of Excellence (IxC) has created a document with more details [2023 AWS IDP Transition](https://github.vodafone.com/VFDE-ISS/cloud-engineering-toolkit/blob/master/docs/2023-aws-idp-transition.md)


For Solstice VCF/CET Accounts (all accounts that are managed via the github org [VFDE-SOL](https://github.vodafone.com/orgs/VFDE-SOL/repositories?q=terraform-project&type=all&language=&sort=)) we will be using `SSO-DE-SI`.


## Transition Actions

- VF-DE-SOL Accounts have the new providers already available
- The relevant roles in VFCF/CET Accounts have been updated to support SSO-DE-SI
- The final step now is for users to update their client configurations


## SSO-DE-SI Client Configuration

### saml2aws

If you have not done yet please update your saml2aws to use the lates available version from [Versent/saml2aws](https://github.com/Versent/saml2aws) as per PCS/Security Advisory.

Update your Saml2aws configuration with the new `app_id`. (recides in `$HOME/.saml2aws`)

This is how it should look like (Please update the username to your vodafone email)

```sh
[default]
name                    = sso-de-si
app_id                  = 736c01bb-2416-4c60-a522-921da9cdcae0
url                     = https://account.activedirectory.windowsazure.com
username                = <YOUR_VODAFONE_EMAIL>@vodafone.com
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

### Update AWS WebConsole Link
Please add/Update the followinig Link to your Bookmarks in your browser:

[AWS Web Console SSO-DE-SI](https://launcher.myapps.microsoft.com/api/signin/736c01bb-2416-4c60-a522-921da9cdcae0?tenantId=68283f3b-8487-4c86-adb3-a5228f18b893)


### Final
We trust that PCS will announce a final transition date, but you should be prepare for this now if you can.
