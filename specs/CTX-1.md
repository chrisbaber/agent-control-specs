---
ctx: 1
title: Capability & Trust eXtensions (CTX) - Standard Capability Strings for AIP & ADP
status: Draft
type: Informational
author: Agent Control Layer (ACL) Team
created: 2025-12-10
---

# Abstract

The Capability & Trust Context (CTX-1, formerly CAP-1) defines a common vocabulary and naming convention for **capability strings** used in:

- AIP-1 `Capability-Set` X.509 extension (`1.3.6.1.4.1.59999.1.4`).
- ADP-1 `agent.aip.capabilities`.

Its goals are:

- Provide a **stable, readable set of capability names** that map cleanly onto ACL’s RBAC model.
- Enable **cross-framework understanding** of what an agent is allowed to do.
- Avoid overfitting to any single product or internal table structure.

CTX-1 is intentionally small and composable. It defines:

- A **naming convention** for capabilities.
- A set of **reserved prefixes**.
- A set of **recommended base capabilities**.

# 1. Naming Convention

Capabilities are simple strings with the following pattern:

```text
<namespace>:<name>[:<qualifier>...]
```

Examples:

- `agent:coach`
- `tenant:tenant-123`
- `service_account:svc-xyz`
- `perm:workflows:read`
- `perm:inputs:write`
- `budget:usd:100`

Rules:

- Names MUST be lowercase ASCII letters, digits, `-`, or `_`.
- Names SHOULD be stable over time; when behavior changes significantly, prefer a new capability name.
- Unknown capabilities MUST be ignored (fail-safe) by consumers who do not understand them.

# 2. Reserved Prefixes

The following prefixes are reserved and SHOULD be interpreted consistently across implementations:

- `agent:` — Identifies a logical agent.
  - Example: `agent:coach`, `agent:analyst`.
- `tenant:` — Identifies a tenant / organization.
  - Example: `tenant:tenant-123`.
- `service_account:` — Identifies a backing service account.
  - Example: `service_account:svc-xyz`.
- `perm:` — Encodes a permission derived from RBAC or similar.
  - Format: `perm:<resource>:<action>`.
  - Examples: `perm:workflows:read`, `perm:workflows:write`, `perm:inputs:list`.
- `budget:` — Encodes budget-related constraints.
  - Examples: `budget:usd:100`, `budget:tokens:100000`.

Other prefixes MAY be defined by implementations as long as they do not conflict with the above.

# 3. Recommended Base Capabilities (ACL v2.1)

ACL v2.1 uses the following base capabilities when issuing agent certificates:

- `agent:<agent_key>` — Logical agent identifier (e.g., `agent:coach`).
- `tenant:<tenant_id>` — Tenant identifier.
- `service_account:<service_account_id>` — Backing service account identifier (if present).

These are currently populated in:

- AIP-1 `Capability-Set` extension (`1.3.6.1.4.1.59999.1.4`).
- ADP-1 `agent.aip.capabilities`.

Future versions MAY add `perm:*` entries based on ACL’s RBAC permissions (e.g., `perm:workflows:read`) when issuing certificates for agents whose permissions are statically known.

# 4. Mapping from RBAC to CAP

ACL’s RBAC model (`lib/security/authorization/rbac.ts`) uses `{ resource: string; action: string }` pairs.

The mapping to CTX-1 `perm:` capabilities is straightforward:

```text
RBAC { resource: "workflows", action: "read" }  ->  "perm:workflows:read"
RBAC { resource: "inputs",    action: "write" } ->  "perm:inputs:write"
```

Guidelines:

- For now, ACL MAY include only a small, high-value subset of permissions as capabilities (e.g., `workflows`, `inputs`, `files`) to avoid leaking implementation details.
- Permissions that are highly dynamic or contextual SHOULD remain in RBAC and **not** be encoded directly in capabilities.

# 5. Relationship to AIP-1 and ADP-1

- **AIP-1**:
  - `Capability-Set` (`1.3.6.1.4.1.59999.1.4`) SHOULD contain an array of CTX-1 capability strings.
  - ACL currently populates identifier capabilities (`agent:*`, `tenant:*`, `service_account:*`) and MAY add `perm:*` capabilities in future versions.

- **ADP-1**:
  - `agent.aip.capabilities` SHOULD mirror or be derived from the AIP-1 `Capability-Set`.
  - Consumers can make coarse-grained decisions based on identifiers and, where present, `perm:*` capabilities.

# 6. Future Extensions

Potential additions:

- Capability categories (e.g., `perm:workflows:read` → category `"data_read"`).
- Capability bundles (e.g., `"role:analyst"` expands to a set of `perm:*` capabilities).
- Negative/deny capabilities (e.g., `deny:files:write`).

These can be added in a backwards-compatible way by introducing new prefixes or conventions.

---

_Copyright 2025 Agent Control Layer. Released under standard open-source terms._
