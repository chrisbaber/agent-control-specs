---
spec: PVS-1
title: Policy Verdict Schema
subtitle: Standard Output for The Gavel
author: Agent Control Layer (ACL) Team <specs@agentcontrollayer.com>
status: Request for Comment (RFC)
type: Standards Track
category: Policy
created: 2025-12-10
updated: 2025-12-14
requires: ADP-1
replaces: None
---

# PVS-1: Policy Verdict Schema

## Status of This Memo

This document specifies a standards track protocol for the Agent Control Layer ecosystem and requests discussion and suggestions for improvements. Distribution of this memo is unlimited.

## Abstract

The Policy Verdict Schema (PVS-1) defines a standard JSON structure for policy enforcement decisions produced by ACL's **The Gavel** (and compatible policy engines). It is designed to be:

- **Simple** enough to embed inside ADP-1 agent steps
- **Expressive** enough for security, compliance, and monitoring
- **Extensible** for future policy engines and additional metadata

## Table of Contents

1. [Terminology](#1-terminology)
2. [Schema](#2-schema)
3. [The Gavel Integration](#3-the-gavel-integration)
4. [Embedding in ADP-1](#4-embedding-in-adp-1)
5. [Security Considerations](#5-security-considerations)
6. [Conformance](#6-conformance)
7. [Future Work](#7-future-work)
8. [References](#8-references)
9. [Acknowledgments](#9-acknowledgments)

## 1. Terminology

The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT", "SHOULD", "SHOULD NOT", "RECOMMENDED", "NOT RECOMMENDED", "MAY", and "OPTIONAL" in this document are to be interpreted as described in BCP 14 [RFC2119] [RFC8174] when, and only when, they appear in all capitals, as shown here.

**Policy**: A rule or constraint that agent outputs must satisfy.

**Verdict**: The result of evaluating content against one or more policies.

**Policy Engine**: A system that evaluates content against policies and produces verdicts.

**The Gavel**: ACL's reference policy engine implementation.

## 2. Schema

A PVS-1 verdict is a single JSON object with the following fields:

```jsonc
{
  "version": "pvs-1",
  "approved": true,
  "reasoning": "Short explanation of the decision.",
  "policy_violations": [],
  "confidence_score": 0.97,
  "policy_set": ["No PII leakage", "No financial advice"],
  "metadata": {
    "engine": "the-gavel",
    "engine_version": "1.0.0",
    "latency_ms": 520,
    "tenant_id": "tenant-123",
    "agent_id": "coach"
  }
}
```

### 2.1 Required Fields

| Field | Type | Description |
|-------|------|-------------|
| `version` | string | MUST be `"pvs-1"` for this spec |
| `approved` | boolean | `true` if content may proceed, `false` otherwise |
| `reasoning` | string | Human-readable explanation of the decision |
| `policy_violations` | array | Policy descriptions that were violated (empty if approved) |
| `confidence_score` | number | Engine confidence in verdict (0.0 to 1.0) |

### 2.2 Optional Fields

| Field | Type | Description |
|-------|------|-------------|
| `policy_set` | array | Policy names evaluated |
| `metadata` | object | Engine-specific metadata |

Consumers MUST ignore unknown keys in `metadata`.

### 2.3 Constraints

- When `approved` is `true`, `policy_violations` MUST be an empty array.
- `confidence_score` MUST be between 0.0 and 1.0 inclusive.

## 3. The Gavel Integration

The Gavel (ACL's policy engine) uses this TypeScript interface:

```typescript
interface PolicyEvaluation {
  approved: boolean;
  reasoning: string;
  policy_violations: string[];
  confidence_score: number;
}
```

To produce PVS-1 compliant output, The Gavel SHOULD:

- Add `version: "pvs-1"` to its JSON output
- Include `policy_set` with evaluated policy names
- Include `metadata.engine` as `"the-gavel"`
- Include `metadata.engine_version` with semantic version
- Include `metadata.tenant_id` and `metadata.agent_id` when available

## 4. Embedding in ADP-1

PVS verdicts are designed to embed directly inside ADP-1 steps as `observation.output`:

```jsonc
{
  "action": {
    "type": "tool_call",
    "name": "policy_judge",
    "input": {
      "draft_output": "...",
      "policies": ["No PII", "No financial advice"]
    }
  },
  "observation": {
    "type": "tool_result",
    "output": {
      "version": "pvs-1",
      "approved": false,
      "reasoning": "Draft contained direct SSN.",
      "policy_violations": ["No PII"],
      "confidence_score": 0.98,
      "policy_set": ["No PII", "No financial advice"],
      "metadata": {"engine": "the-gavel", "latency_ms": 650}
    }
  }
}
```

This enables downstream systems to:
- Enforce decisions (block/allow)
- Aggregate policy violation statistics
- Audit and explain why output was blocked

## 5. Security Considerations

### 5.1 Threat Model

| Threat | Mitigation |
|--------|------------|
| **Verdict Tampering** | Sign verdicts; store in immutable audit log |
| **Policy Bypass** | Enforce verdicts at policy enforcement points |
| **False Negatives** | Use confidence_score thresholds; human review for low confidence |
| **Information Leakage** | Redact sensitive content from reasoning field |

### 5.2 Verdict Integrity

- Verdicts SHOULD be signed when stored or transmitted
- Systems MUST NOT allow agents to modify their own verdicts
- Audit logs SHOULD include original content hash alongside verdict

### 5.3 Confidence Thresholds

Implementations SHOULD define confidence thresholds:
- `confidence_score >= 0.9`: Auto-enforce verdict
- `confidence_score < 0.9`: Queue for human review

## 6. Conformance

### 6.1 Conformance Levels

**Level 1 (Core)**: An implementation MUST:
- Emit valid JSON conforming to PVS-1 schema
- Include all required fields
- Enforce the approved/policy_violations constraint
- Use valid confidence_score range

**Level 2 (Extended)**: An implementation MUST also:
- Include `policy_set` with evaluated policies
- Include `metadata.engine` identifying the policy engine
- Provide meaningful `reasoning` text

**Level 3 (Complete)**: An implementation MUST also:
- Include `metadata.latency_ms` for performance monitoring
- Support verdict signing for integrity
- Integrate with ADP-1 step embedding

### 6.2 Schema Validation

A JSON Schema for PVS-1 is provided at `schemas/pvs-1.schema.json`. Conforming implementations SHOULD validate verdicts against this schema.

## 7. Future Work

- **Structured Violations**: Objects with IDs, severities, remediation hints
- **Policy Categories**: `privacy`, `financial`, `safety` taxonomies
- **Policy Links**: References to machine-readable policy definitions

## 8. References

### 8.1 Normative References

- **[RFC2119]** Bradner, S., "Key words for use in RFCs to Indicate Requirement Levels", BCP 14, RFC 2119, March 1997.
- **[RFC8174]** Leiba, B., "Ambiguity of Uppercase vs Lowercase in RFC 2119 Key Words", BCP 14, RFC 8174, May 2017.
- **[RFC8259]** Bray, T., Ed., "The JavaScript Object Notation (JSON) Data Interchange Format", STD 90, RFC 8259, December 2017.

### 8.2 Informative References

- **[ADP-1]** Agent Control Layer, "Agent Data Protocol", ADP-1, 2025.

## 9. Acknowledgments

The authors thank the early reviewers and implementers who provided feedback on this specification.

---

_Copyright 2025 Agent Control Layer. Released under the [MIT License](../LICENSE)._
