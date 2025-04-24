---
title: PCS Scheduler
description: >
  PCS team adds a scheduler to each AWS accounts to save money and emissions by stopping compute resources outside of generic office hours (**6 am UTC - 6 pm UTC**).
categories: [Infrastructure]
tags: [aws]
weight: 50
---

{{< button href="https://confluence.sp.vodafone.com/display/GPCS/PCS+Scheduler" >}}
PCS docs in Confluence
{{< /button >}}

{{% alert color="warning" title="Important" %}}
Karpenter-managed EC2 instances are excluded from this behavior.
{{% /alert %}}

## How to change this behavior?

From PCS docs (copied on June 12, 2023):

> **Can we change the schedule so that we can finish work later?**
>
> Yes, as an owner of the account/project you can edit the stop time from PCS Portal. In case you don't have access to the account/project you need to raise Service Request from Service Catalogue here: [Service Catalog - Service Catalogue (vodafone.com)](https://servicecatalogue.vodafone.com/catalogue/?id=sc_cat_item&sys_id=42fe382bdbb1f740ef48b5ca6896198d&sysparm_category=c364b7c1db6a84d8324a19340596196a)

{{% alert color="success" title="Note" %}}
Kindly note that Tesla team is neither responsible for configuring this nor helping individual teams to configure the scheduler themselves. If you need help, please contact PCS directly.
{{% /alert %}}
