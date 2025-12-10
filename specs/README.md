# Agent Control Layer Specs

This directory holds the core public-facing standards for ACL:

- `AIP-1.md` — Agent Identity Protocol (short-lived X.509 with AIP OIDs for role, tenant, capabilities, environment, audience; anchored on Ethereum Sepolia).
- `ADP-1.md` — Agent Data Protocol (Universal Adapter for Agent Work: Action → Observation → Reflection + AIP linkage).
- `PVS-1.md` — Policy Verdict Schema (structured output from The Gavel).
- `CTX-1.md` — Capability & Trust eXtensions (stable capability strings for AIP/ADP).
- `LM_REVIEW_REQUEST.md` — What we ask LMs to review.
- `LM_REVIEW_RESPONSE.md` / `LM_REVIEW_FEEDBACK.md` — External LM feedback for history.

## Public repo

These specs are mirrored publicly at `https://github.com/chrisbaber/agent-control-specs` so external teams can adopt them without pulling the full ACL codebase. Suggested repo description: “Open standards for the Agent Control Layer: AIP (identity), ADP (agent data), PVS (policy verdicts), and CTX (capabilities).”

## Anchoring (Trustless Verification)

The Root CA fingerprint is anchored on Ethereum Sepolia for independent verification:

- Tx: `0x9349d41f0c92d128cbc07e8d4697a92fa7d107b2468c1f2fc0e9a3bc6c74a33a`
- Verify on Etherscan: https://sepolia.etherscan.io/tx/0x9349d41f0c92d128cbc07e8d4697a92fa7d107b2468c1f2fc0e9a3bc6c74a33a

## Versioning

- Specs carry explicit `version` fields in examples (e.g., `version: "adp-1"`, `version: "pvs-1"`).
- Use new major numbers for breaking changes (e.g., `adp-2`) and tag releases in the public repo (`aip-1.0`, `adp-1.0`, etc.).

## Publishing guidance

- Mirror `docs/specs/*.md` to the public repo (manual copy or small sync script).
- Keep a simple CHANGELOG in the public repo noting spec-level changes.
- Link the public repo from product/marketing sites (AgentControlLayer.com, OSforAgents.com, etc.) and from relevant docs (`DEEP_MOAT_LAUNCH_KIT`, `TECHNICAL_FEATURES`).

