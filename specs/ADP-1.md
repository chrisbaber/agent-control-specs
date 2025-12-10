---
adp: 1
title: Agent Data Protocol (ADP) - Universal Adapter for Agent Work
status: Draft
type: Standards Track
author: Agent Control Layer (ACL) Team
created: 2025-12-10
---

# Abstract

The Agent Data Protocol (ADP-1) defines a standard JSON representation for **Agent Work**: how an agent receives tasks, takes actions, observes results, reflects, and produces final outputs. The goal is to provide a **framework-agnostic wire format** for agent runs so that tools like LangChain, CrewAI, AutoGen, LangGraph, and custom frameworks can all interoperate on a shared control plane.

ADP-1 is designed to pair with the **Agent Identity Protocol (AIP-1)**:

- AIP-1 answers: **"Who is this agent and what are they allowed to do?"**
- ADP-1 answers: **"What exactly did this agent do?"**

Together, they allow platforms like Agent Control Layer (ACL) to provide cross-framework security, policy enforcement, monitoring, and analytics for autonomous agents.

# 1. Design Goals

1.  **Framework Agnostic** — Support LangChain, CrewAI, AutoGen, custom agents, etc. without privileging any one framework.
2.  **Minimal but Extensible** — Small core schema (Action → Observation → Reflection), with well-defined extension points.
3.  **AIP-Aware** — Every run and step is tied back to cryptographic identity (AIP-1) without requiring consumers to understand PKI details.
4.  **Streaming-Friendly** — Structured so events can be emitted incrementally during a run.
5.  **Audit & Control Ready** — Suitable for security analytics, policy enforcement (e.g., The Gavel), and tamper-evident audit chains.

# 2. Core Concepts

ADP defines two primary objects:

- **Agent Run** — A full execution instance of an agent performing work.
- **Agent Step** — A single Action → Observation → Reflection unit within that run.

## 2.1 Agent Run

An **Agent Run** represents one end-to-end execution of an agent for a given task.

```jsonc
{
  "version": "adp-1",
  "run_id": "e7e5c9a4-1c6f-4e4e-9a9a-52f9f0d7e0f1",
  "tenant_id": "tenant-123",
  "trace": {
    "trace_id": "0af7651916cd43dd8448eb211c80319c",
    "span_id": "b7ad6b7169203331",
    "parent_span_id": "0000000000000000" // optional
  },
  "agent": {
    "agent_id": "coach",
    "agent_version": "v3",
    "framework": "acl",         // e.g., "langchain", "crew-ai", "autogen", "custom"
    "framework_run_id": "abc123", // optional, framework-specific identifier
    "aip": {
      "cert_fingerprint": "0xabc123...",
      "tenant_id": "tenant-123",
      "capabilities": [
        "agent:coach",
        "tenant:tenant-123",
        "service_account:svc-xyz"
      ]
    }
  },
  "context": {
    "task_description": "Draft a security review summary",
    "workflow_key": "demo_workflow",
    "user_id": "user-456",
    "session_id": "sess-789",
    "labels": ["demo", "security_review"]
  },
  "steps": [
    /* AgentStep objects, see below */
  ],
  "final_output": {
    "type": "message",
    "content": "Here is your security review summary...",
    "format": "text/plain"
  },
  "status": "succeeded", // "succeeded" | "failed" | "cancelled" | "timeout"
  "error": null,         // optional structured error if status != succeeded
  "cancellation": null,  // optional cancellation info when status = "cancelled"
  "started_at": "2025-12-10T19:00:00.000Z",
  "completed_at": "2025-12-10T19:00:12.345Z",
  "metadata": {
    "total_tokens": 1234,
    "total_cost_usd": 0.0123,
    "models_used": ["gpt-4.1", "gpt-4o-mini"]
  }
}
```

### 2.1.1 Required Fields

- `version` — MUST be `"adp-1"` for this spec.
- `run_id` — Globally unique ID for this run (UUID recommended).
- `tenant_id` — Logical tenant / customer identifier.
- `agent.agent_id` — Stable logical agent identifier (e.g., `coach`, `support_bot_v2`).
- `agent.aip.cert_fingerprint` — SHA-256 fingerprint (or hex-encoded hash) of the AIP-1 certificate used during this run.
- `steps` — Array of `AgentStep` objects (MAY be empty for trivial runs).
- `status` — Final status of the run.
- `started_at`, `completed_at` — ISO 8601 timestamps.

All other fields are RECOMMENDED but optional.

## 2.2 Agent Step

An **Agent Step** is the core unit of work: **Action → Observation → Reflection**.

```jsonc
{
  "index": 0,
  "parent_step_index": null, // optional: index of parent step for hierarchical workflows
  "timestamp": "2025-12-10T19:00:01.234Z",
  "action": {
    "type": "tool_call",          // "tool_call" | "message" | "plan_update" | "model_inference" | "other"
    "name": "web_search",
    "input": {
      "query": "AIP-1 Agent Identity Protocol summary"
    }
  },
  "observation": {
    "type": "tool_result",        // "tool_result" | "environment" | "user_input" | "error" | "none"
    "output": {
      "results": [
        { "title": "AIP-1 Spec", "url": "https://..." }
      ]
    },
    "error": null
  },
  "reflection": {
    "thought": "I have found the AIP-1 spec; next I should summarize key security properties.",
    "next_action_hint": "Summarize spec for user",
    "uncertainty": 0.2
  },
  "metadata": {
    "model": "gpt-4.1",
    "prompt_tokens": 123,
    "completion_tokens": 45,
    "latency_ms": 350,
    "cost_usd": 0.00045,
    "labels": ["search", "research"]
  }
}
```

### 2.2.1 Required Fields

- `index` — Zero-based step index.
- `timestamp` — ISO 8601 timestamp for when the step completed.
- `action.type` — One of the standard action types (see §2.2.2).
- `observation.type` — One of the standard observation types (see §2.2.3).

`reflection` and most of `metadata` are OPTIONAL but strongly RECOMMENDED for advanced analysis and debugging.

### 2.2.2 Action Types

Standard values for `action.type`:

- `tool_call` — Agent invoked a tool or function.
- `message` — Agent produced or consumed a message (e.g., chat turn).
- `plan_update` — Agent updated its internal plan or task breakdown.
- `model_inference` — Direct LLM call when not better described as a tool.
- `other` — Fallback for framework-specific actions (MAY be further described via `metadata.action_subtype`).

### 2.2.3 Observation Types

Standard values for `observation.type`:

- `tool_result` — Result from a tool/function call.
- `environment` — External environment feedback (e.g., HTTP response, DB write result).
- `user_input` — New input from a human user (e.g., follow-up question).
- `error` — Error/exception details.
- `none` — No meaningful observation (e.g., plan update only).

# 3. Relationship to AIP-1

ADP-1 is explicitly **AIP-aware** but does not require consumers to understand PKI. The `agent.aip` block in the run envelope is the bridge:

```jsonc
{
  "agent": {
    "agent_id": "coach",
    "agent_version": "v3",
    "framework": "acl",
    "aip": {
      "cert_fingerprint": "0xabc123...",
      "tenant_id": "tenant-123",
      "capabilities": [
        "agent:coach",
        "tenant:tenant-123",
        "service_account:svc-xyz"
      ]
    }
  }
}
```

- `cert_fingerprint` — Matches the SHA-256 fingerprint of the AIP-1 X.509 certificate used during the run.
- `tenant_id` — Mirrors AIP `Tenant-ID` (`1.3.6.1.4.1.59999.1.3`) when present.
- `capabilities` — Mirrors or derives from AIP `Capability-Set` (`1.3.6.1.4.1.59999.1.4`).

Implementations MAY include additional AIP-derived metadata (e.g., `agent_role`) in `agent` or `metadata`.

# 4. ACL Reference Mapping (v2.1)

The ACL implementation provides a concrete mapping between its internal execution model and ADP-1.

## 4.1 Run Mapping

- ADP `run_id` → ACL `workflow_run.id` or synthetic ID created by `agent-executor`.
- ADP `tenant_id` → ACL `workflow_runs.tenant_id`.
- ADP `agent.agent_id` → ACL `agentKey` (e.g., `"coach"`, `"analyst"`).
- ADP `agent.agent_version` → ACL `agent_config.active_version`.
- ADP `agent.framework` → `"acl"` for native runs.
- ADP `agent.aip.cert_fingerprint` → `agent_executions.crypto_identity` (fingerprint from `issueAgentCertificate`).
- ADP `context` → Derived from `AnalysisState` and `workflow_runs.metadata_json`.
- ADP `final_output` → Derived from the final `safeOutput` written by `agent-executor`.
- ADP `metadata.total_tokens` → Sum of token usage recorded in `agent_executions`.

## 4.2 Step Mapping

ADP `AgentStep` can be derived from:

- The internal agent state transitions in `lib/workflows/agent-executor.ts`.
- Tool invocations and responses (e.g., HTTP calls, Supabase operations).
- Gavel policy checks (see §5).

ACL MAY emit ADP steps to:

- An internal event stream (for monitoring/analytics).
- A tamper-evident audit log chain (see `lib/security/audit/audit-log-immutability.ts`).

The initial ACL implementation focuses on **run-level** ADP records, with step-level emission added incrementally for higher value workflows.

# 5. Policy Verdicts (The Gavel)

The Gavel (ACL’s policy judge) already returns structured JSON with:

```ts
export interface PolicyEvaluation {
  approved: boolean;
  reasoning: string;
  policy_violations: string[];
  confidence_score: number;
}
```

ADP-1 does not require policy verdicts, but RECOMMENDS representing them as specialized steps:

```jsonc
{
  "index": 3,
  "timestamp": "2025-12-10T19:00:05.678Z",
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
      "approved": false,
      "reasoning": "Draft contained direct SSN.",
      "policy_violations": ["No PII"],
      "confidence_score": 0.98
    }
  },
  "reflection": {
    "thought": "My output violated the PII policy; I must redact and rephrase.",
    "next_action_hint": "Regenerate answer without PII.",
    "uncertainty": 0.1
  },
  "metadata": {
    "kind": "policy_verdict",
    "policy_engine": "the-gavel",
    "latency_ms": 650
  }
}
```

The formal verdict schema is defined in `docs/specs/PVS-1.md`.

# 6. Extension Points

ADP-1 is intentionally small. Implementations MAY extend:

- `agent.framework` and `agent.framework_run_id` for framework-specific identifiers.
- `context` with arbitrary keys under a top-level `context` object.
- `metadata` at both run and step level, using namespaced keys (e.g., `openai.*`, `aws.*`, `acl.*`).

Consumers MUST ignore unknown fields gracefully to maintain forwards compatibility.

# 7. Future Work

Potential future extensions:

- **Signed ADP Streams** — Sign run/step records with the agent’s certificate (AIP-1) for tamper-evident traces.
- **Cross-Framework Tool Taxonomy** — Standard names/types for common tools (search, HTTP, DB, email, etc.).
- **Richer Plan/Task Graphs** — Formal representation of plans and sub-tasks beyond linear steps.

---

_Copyright 2025 Agent Control Layer. Released under standard open-source terms._
