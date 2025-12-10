# Agent Control Layer Standards

Open specifications for the Agent Control Layer (ACL). These docs define how autonomous agents identify themselves, describe their work, and convey policy outcomes.

## What’s included
- **AIP-1** — Agent Identity Protocol (short-lived X.509 with AIP OIDs for role, tenant, capabilities, environment, audience; blockchain-anchored root).
- **ADP-1** — Agent Data Protocol (Action → Observation → Reflection “Universal Adapter” for cross-framework interoperability).
- **PVS-1** — Policy Verdict Schema (structured verdicts from policy engines like The Gavel).
- **CTX-1** — Capability & Trust eXtensions (stable capability strings for AIP/ADP).
- **LM review materials** — Requests and responses from external model reviewers.

See `specs/README.md` for the quick index and publishing guidance.

## Trustless verification
The current Root CA fingerprint is anchored on Ethereum Sepolia:
- Tx: `0x9349d41f0c92d128cbc07e8d4697a92fa7d107b2468c1f2fc0e9a3bc6c74a33a`
- Verify: https://sepolia.etherscan.io/tx/0x9349d41f0c92d128cbc07e8d4697a92fa7d107b2468c1f2fc0e9a3bc6c74a33a

A mainnet anchor will be added next; both anchors will be documented here once published.

## Versioning
Specs declare their version in examples (e.g., `version: "adp-1"`). Breaking changes will bump the major (e.g., `adp-2`). Tag releases in this repo (e.g., `aip-1.0`, `adp-1.0`).

## Contributing / adoption
- File issues with questions or compatibility notes.
- Open PRs for errata or clarifications (keep scope tight; new features should target a future major version).
- Reference these docs directly or mirror them into your own systems; they’re designed to be implementation-agnostic.

## Related project
The reference implementation lives in the private ACL codebase; this repo is the public spec mirror for anyone to adopt.
