---
pvs: 1
title: Policy Verdict Schema (PVS) - Standard Output for The Gavel
status: Draft
type: Standards Track
author: Agent Control Layer (ACL) Team
created: 2025-12-10
---

# Abstract

The Policy Verdict Schema (PVS-1) defines a standard JSON structure for policy enforcement decisions produced by ACL’s **The Gavel** (and compatible policy engines). It is designed to be:

- **Simple** enough to embed inside ADP-1 agent steps.
- **Expressive** enough for security, compliance, and monitoring.
- **Extensible** for future policy engines and additional metadata.

# 1. Schema

A PVS-1 verdict is a single JSON object with the following fields:

```jsonc
{
  "version": "pvs-1",
  "approved": true,
  "reasoning": "Short explanation of the decision.",
  "policy_violations": [],
  "confidence_score": 0.97,
  "policy_set": [
    "No PII leakage",
    "No financial advice"
  ],
  "metadata": {
    "engine": "the-gavel",
    "engine_version": "1.0.0",
    "latency_ms": 520,
    "tenant_id": "tenant-123",
    "agent_id": "coach"
  }
}
```

## 1.1 Required Fields

- `version` — MUST be `"pvs-1"` for this spec.
- `approved` — `true` if the content is allowed to proceed, `false` otherwise.
- `reasoning` — Human-readable explanation of the decision (MAY be brief).
- `policy_violations` — Array of human-readable policy descriptions that were violated. MUST be an empty array if `approved` is `true`.
- `confidence_score` — Number between `0.0` and `1.0` representing the engine’s confidence in the verdict.

## 1.2 Optional Fields

- `policy_set` — Array of policy names/descriptions that were in scope for this evaluation.
- `metadata` — Free-form object for engine- or deployment-specific metadata (e.g., latency, engine name, tenant, agent).

Consumers MUST ignore unknown keys in `metadata`.

# 2. The Gavel Mapping (ACL v2.1)

The current implementation of The Gavel in ACL (`lib/agents/the-gavel.ts`) uses the following TypeScript interface:

```ts
export interface PolicyEvaluation {
  approved: boolean;
  reasoning: string;
  policy_violations: string[];
  confidence_score: number;
}
```

The Gavel is invoked by `agent-executor` and returns JSON parsed into this interface. To align with PVS-1:

- The engine SHOULD add `version: "pvs-1"` to its JSON output.
- The engine MAY include:
  - `policy_set` — The list of policies used for this evaluation (e.g., from configuration).
  - `metadata.engine` — `"the-gavel"`.
  - `metadata.engine_version` — Semantic version of the policy engine.
  - `metadata.tenant_id`, `metadata.agent_id` — When available from the calling context.

Existing code that relies only on `approved`, `reasoning`, `policy_violations`, and `confidence_score` remains valid.

# 3. Embedding PVS in ADP-1

PVS verdicts are designed to embed directly inside ADP-1 steps as the `observation.output` for policy-related actions:

```jsonc
{
  "action": {
    "type": "tool_call",
    "name": "policy_judge",
    "input": {
      "draft_output": "…",
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
      "metadata": {
        "engine": "the-gavel",
        "latency_ms": 650
      }
    }
  }
}
```

This makes it easy for downstream systems to:

- Enforce decisions (block/allow).
- Aggregate policy violation statistics.
- Audit and explain why a given output was blocked.

# 4. Future Extensions

Possible future additions (non-breaking):

- Structured violation objects (with IDs, severities, and remediation hints).
- Policy categories (e.g., `"privacy"`, `"financial"`, `"safety"`).
- Links to policy documents or machine-readable policy definitions.

---

_Copyright 2025 Agent Control Layer. Released under standard open-source terms._

