---
aip: 1
title: Agent Identity Protocol (AIP) - The Standard for Autonomous Trust
status: Draft
type: Standards Track
author: Agent Control Layer (ACL) Team
created: 2025-12-09
---

# Abstract

The Agent Identity Protocol (AIP) establishes a universal standard for the cryptographic identification, verification, and authorization of Autonomous AI Agents. It moves the industry beyond API keys and static tokens toward a **Zero Trust** model based on short-lived, verifiable X.509 certificates anchored to a public blockchain. This protocol enables a secure, interoperable "Agent Marketplace" where agents from disparate platforms can safely collaborate, transact, and enforce policy without prior trust.

# 1. Motivation

As AI Agents transition from chat interfaces to autonomous actors capable of financial transactions and infrastructure mutation, the current identity model (API Keys, OAuth User Tokens) is insufficient.

1.  **Identity Crises**: An agent is not a user. An agent is a software process acting _on behalf_ of a user, but with distinct constraints.
2.  **No Interoperability**: An agent on "Platform A" has no way to prove its identity or capabilities to an agent on "Platform B".
3.  **The Marketplace Problem**: To build a global economy of agents, we need a standard "Passport" that proves an agent is who they say they are, and that they are "good standing" members of a trusted network.

# 2. Specification

The AIP relies on **Mutual TLS (mTLS)** and **X.509 v3 Certificates** with custom extensions.

## 2.1 The Agent Certificate Profile

All AIP-compliant agents MUST identify themselves using an X.509 Certificate that adheres to the following profile.

### 2.1.1 Subject Distinguished Name (DN)

The `Subject` field MUST uniquely identify the agent. Implementations MAY choose how much semantics to encode in the DN itself vs. custom extensions. A recommended profile is:

-   `CN` (Common Name): The unique Agent ID (UUID or stable key).
-   `O` (Organization): The Tenant or Platform Name (e.g., "Acme Corp").
-   `OU` (Organizational Unit): The Agent Role (e.g., "Level 2 Support").

The ACL reference implementation primarily encodes semantics in custom AIP extensions (below) and uses `CN="Agent:<id>"` with static `O`/`OU` values for internal agents.

### 2.1.2 Custom AIP Extensions (OIDs)

We define the `1.3.6.1.4.1.59999` (Private Enterprise Number - Placeholder for ACL) arc for AIP specific data.

| OID                     | Name                 | Data Type    | Description                                                                    |
| :---------------------- | :------------------- | :----------- | :----------------------------------------------------------------------------- |
| `1.3.6.1.4.1.59999.1.1` | **AIP-Version**      | `INTEGER`    | Protocol version (e.g., `1`).                                                  |
| `1.3.6.1.4.1.59999.1.2` | **Agent-Role**       | `UTF8String` | Semantic role (e.g., `researcher`, `market-maker`).                            |
| `1.3.6.1.4.1.59999.1.3` | **Tenant-ID**        | `UTF8String` | The UUID of the owner/tenant (`tenant_id`).                                    |
| `1.3.6.1.4.1.59999.1.4` | **Capability-Set**   | `IA5String`  | JSON array of approved capabilities (e.g., `["read_email", "execute_trade"]`). |
| `1.3.6.1.4.1.59999.1.5` | **Anchor-Chain**     | `UTF8String` | Blockchain used for Root Trust (e.g., `ethereum:sepolia`).                     |
| `1.3.6.1.4.1.59999.1.6` | **AIP-Audience**     | `UTF8String` | Intended verifier / audience (e.g., `api.acme.com`).                           |
| `1.3.6.1.4.1.59999.1.7` | **AIP-Environment**  | `UTF8String` | Deployment environment (`production`, `staging`, `development`, etc.).         |

### 2.1.3 Validity Period

-   **Maximum Validity**: 15 minutes.
-   **Recommended Validity**: 5 minutes.
-   **Reasoning**: Short-lived certificates render revocation lists (CRLs) largely unnecessary, significantly reducing infrastructure complexity ("Blast Radius Reduction").
-   **Clock Skew Tolerance**: Issuers SHOULD backdate the `notBefore` time by 1–2 minutes to account for clock skew. Verifiers SHOULD allow a grace period of ±60 seconds when enforcing validity, and all participating systems MUST synchronize to NTP with drift <30 seconds.

### 2.1.4 Environment and Audience

-   **AIP-Environment** (`.7`) MUST reflect the deployment environment in which the cert is valid (e.g., `production`, `staging`, `development`). Verifiers SHOULD reject certificates whose environment does not match their own.
-   **AIP-Audience** (`.6`) MAY be used to scope certificates to a specific verifier or service (e.g., `api.acme.com`). When present, verifiers SHOULD ensure that the audience matches their configured identity (similar to OIDC `aud` checks).

## 2.2 Trust Architecture: "The Verification Triangle"

Trust is established through three points:

1.  **The Agent (Prover)**: Holds the private key and Certificate.
2.  **The Verifier (Service/Peer)**: Validates the Certificate signature.
3.  **The Anchor (Blockchain)**: The public immutable ledger that stores the **Hash of the Root CA**.

### 2.2.1 The Anchoring Process

To become a trusted "Identity Provider" (IdP) in the AIP network:

1.  Generate a Root CA.
2.  Calculate `SHA-256(Root_CA_Public_Key)`.
3.  Publish this hash to a recognized blockchain (e.g., Ethereum) to a smart contract or as a transaction payload.
4.  This creates a **Time-Stamped Proof of Existence**.

### 2.2.2 The Verification Process

When Agent A connects to Agent B:

1.  **Handshake**: Perform standard TLS Handshake requesting Client Certificate.
2.  **Chain Validation**: Agent B validates Agent A's cert path to the Root CA.
3.  **Public Check**: Agent B (optionally) queries the Blockchain. "Does this Root CA hash exist on-chain?"
4.  **Claim Inspection**: Agent B parses the `Capability-Set` OID. "Is Agent A allowed to `execute_trade`?"
5.  **Environment / Audience Check**: Agent B validates that the `AIP-Environment` matches its own environment and, if present, that `AIP-Audience` includes or equals its configured service identity.

> **Note on Load Balancers and TLS Termination**  
> In many deployments, mutual TLS is terminated at a load balancer or edge proxy. In this topology, the verifier logic runs behind the LB and receives the client certificate (or a hash thereof) via trusted headers (e.g., `X-Client-Cert`, `X-Client-Cert-Hash`). Implementations MUST only trust these headers if they are injected by a trusted front-end and MUST still perform full AIP verification (signature, validity period, environment, audience, and Capability-Set) against the forwarded certificate data.

# 3. Marketplace Interoperability

AIP enables a decentralized marketplace. An agent from **Company X** can hire an agent from **Company Y** without API key integration.

**The Flow:**

1.  **Discovery**: Company X finds "Tax Bot" (Company Y) in a registry.
2.  **Connection**: Company X initiates mTLS to Company Y's endpoint.
3.  **Payment**: Company X includes a "Payment-Token" or "Budget-Proof" in the `Capability-Set` extension.
4.  **Execution**: Company Y's agent verifies the budget and executes the task.

# 4. Future Proofing & Security

## 4.1 Quantum Readiness

AIP v1.0 relies on RSA/ECDSA. AIP v2.0 will introduce support for **Dilithium** or **Kyber** (Post-Quantum Cryptography) simply by updating the allowed algorithms in the cipher suite. The protocol structure (X.509 OIDs) is algorithm-agnostic.

## 4.2 Privacy (Zero-Knowledge)

Future iterations may allow ZK-Proofs within the `Capability-Set` OID, allowing an agent to prove "I am over 21" or "I am accredited" without revealing the underlying Tenant ID.

# 5. Reference Implementation

The **Agent Control Layer (ACL)** serves as the canonical reference implementation of AIP.

-   **CA Logic**: `lib/security/identity/ca.ts`
-   **Verifier**: `lib/security/identity/verifier.ts`
-   **Anchoring Script**: `scripts/publish-root-ca.ts` (anchors Root CA fingerprint to Ethereum Sepolia)

## 5.1 Implementation Status (ACL v2.1)

The current ACL implementation conforms to the AIP-1 profile with the following behaviors:

-   **Short-Lived Certificates**: Agent certificates are issued with a configurable lifetime, clamped between 1 and 15 minutes (default 5).
-   **AIP Extensions**:
    -   `AIP-Version` (`.1`): Hardcoded to `"1"` for all issued certificates.
    -   `Agent-Role` (`.2`): Populated from the logical agent key (e.g., `"analyst"`, `"coach"`) when available.
    -   `Tenant-ID` (`.3`): Populated with the tenant identifier when the issuing context provides it.
    -   `Capability-Set` (`.4`): Populated as a JSON array. By default, ACL embeds coarse-grained capabilities such as `["agent:<id>", "tenant:<id>", "service_account:<id>"]` and may be extended with more granular permissions.
    -   `Anchor-Chain` (`.5`): Set to `"ethereum:sepolia"` to reflect the default anchoring chain used by `scripts/publish-root-ca.ts`.
-   **Verification**:
    -   Runtime verification currently checks signature validity, certificate lifetime, and derives the Agent ID from the `CN` field.
    -   On-chain verification of the Root CA fingerprint is defined but intentionally **not** executed on the hot path yet. Operators can use `scripts/publish-root-ca.ts` and future tooling for offline/periodic verification.

Future releases will expand how ACL maps internal RBAC permissions into the `Capability-Set` and may introduce optional mTLS handshakes between agents based directly on AIP certificates.

---

_Copyright 2025 Agent Control Layer. Released under standard open-source terms._
