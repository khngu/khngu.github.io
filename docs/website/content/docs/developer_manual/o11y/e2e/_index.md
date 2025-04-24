---
title: End-To-End (E2E)
description: These pages hold concepts for end-to-end (E2E) observability in FusionC projects.
categories: [Observability]
tags: [CET, EKS, o11y]
---

## Introduction

This is the documentation of E2E observability from Tesla side. It contains the technical documentation of what Tesla team provides to the overarching concept and implementation of E2E O11y. Thus, this is not containing all the E2E documentation.

## Purpose

The purpose of E2E observability is to collect essential information from various applications across different runtime environments. To facilitate this, a centralized and separate account has been established for the E2E solution.
It’s important to note that default system and infrastructure metrics are excluded from E2E observability. Instead, the focus is on business-relevant metrics and custom metrics that provide meaningful insights into service performance and user impact. Examples include Business Functions such as customer orders, contract cancellations, and invoicing flows, as outlined in [SE-003](https://de.confluence.agile.vodafone.com/display/SOLS/SE-003+Implementation+of+E2E+Monitoring+for+Invoicing+Flow) and [SE-009](https://de.confluence.agile.vodafone.com/display/SOLS/SE-009+Implementation+of+E2E+Monitoring+for+Customer+View+and+Changes+FlowCustomer+View+and+Changes+Flow).

## E2E Accounts

<style>
  table.accounts {

    width: 100%;

    tr {
      width: 100%;
    }

    th {
        white-space: nowrap;
    }

    td {
        white-space: nowrap;
        padding: 0.5rem!important;
    }

    td:last-child {
        width: 100%;
    }

    ul {
        margin-bottom: 0;
    }
  }
</style>

<table class="accounts">
<thead>
    <tr>
        <th>Short Alias</th>
        <th>AWS Account ID</th>
        <th>Description</th>
    </tr>
</thead>
<tbody>
    <tr>
        <td>dev-e2e</td>
        <td>992382654038</td>
        <td><ul>
            <li>E2E account for all <code>dev</code> and <code>sbox</code> accounts</li>
            <li>Development stage for O11y and E2E</li>
            <li>Expected to have interruptions</li>
            <li>Short retention time</li>
            <li>Uptime is currently in discussion, eventually only up during business hours</li>
            <li>Public endpoint: <code>https://o11y.dev.e2e.pub.sol-vf.de/</code></li>
            <li>Private endpoint: <code>https://o11y.dev.e2e.sol-vf.de/</code></li>
        </ul></td>
    </tr>
    <tr>
        <td>test-e2e</td>
        <td>739275476570</td>
        <td><ul>
            <li>E2E account for all <code>test</code> and <code>e2e</code> (workload stage) accounts</li>
            <li>Testing stage for O11y and E2E</li>
            <li>Expected to have interruptions</li>
            <li>Short retention time</li>
            <li>Uptime is currently in discussion, eventually only up during business hours</li>
            <li>Public endpoint: <code>https://o11y.test.e2e.pub.sol-vf.de/</code></li>
            <li>Private endpoint: <code>https://o11y.test.e2e.sol-vf.de/</code></li>
        </ul></td>
    </tr>
    <tr>
        <td>prod-e2e</td>
        <td>337909752808</td>
        <td><ul>
            <li>E2E account for all <code>prod</code> accounts</li>
            <li>Production stage for O11y and E2E</li>
            <li>Default retention time</li>
            <li>Uptime is 24/7</li>
            <li>Public endpoint: <code>https://o11y.prod.e2e.pub.sol-vf.de/</code></li>
            <li>Private endpoint: <code>https://o11y.prod.e2e.sol-vf.de/</code></li>
        </ul></td>
    </tr>
</tbody>
</table>

## See Also

- [Argus Team on E2E](https://de.confluence.agile.vodafone.com/display/SOLS/E2E+monitoring+using+open+source+solution+-+Design+and+PoC) *(Tesla team does vouch for any Argus team docs)*
- [VFDE-SOL/k8s-modules-sol-e2e](https://github.vodafone.com/VFDE-SOL/k8s-modules-sol-e2e): E2E Helm charts
- [VFDE-SOL/terraform-modules-sol-e2e](https://github.vodafone.com/VFDE-SOL/terraform-modules-sol-e2e): E2E terraform modules
