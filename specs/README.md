# Agent Control Layer Specifications

This directory contains the core specifications for the Agent Control Layer (ACL).

## Specifications

| Spec | Title | Type | Description |
|------|-------|------|-------------|
| [SPEC-0](SPEC-0.md) | Specification Process | Informational | Meta-specification defining how ACL specs work |
| [AIP-1](AIP-1.md) | Agent Identity Protocol | Standards Track | X.509 certificates with AIP OIDs for agent identity |
| [ADP-1](ADP-1.md) | Agent Data Protocol | Standards Track | Universal adapter for agent work (Action → Observation → Reflection) |
| [PVS-1](PVS-1.md) | Policy Verdict Schema | Standards Track | Structured output from policy engines |
| [CTX-1](CTX-1.md) | Capability & Trust eXtensions | Informational | Stable capability strings for AIP/ADP |

## Specification Status

All specifications are currently in **Request for Comment (RFC)** status, seeking community feedback before finalization.

## Blockchain Anchoring

The Root CA fingerprint is anchored on Ethereum Sepolia for trustless verification:

- **Transaction**: [`0x9349d41f0c92d128cbc07e8d4697a92fa7d107b2468c1f2fc0e9a3bc6c74a33a`](https://sepolia.etherscan.io/tx/0x9349d41f0c92d128cbc07e8d4697a92fa7d107b2468c1f2fc0e9a3bc6c74a33a)

## Versioning

- Specifications carry explicit version identifiers (e.g., `version: "adp-1"`)
- Breaking changes increment the major version (e.g., `adp-2`)
- Releases are tagged in this repository (e.g., `aip-1.0`, `adp-1.0`)

## Machine-Readable Schemas

JSON Schema definitions are available in the `/schemas` directory:

- `adp-1.schema.json` - Agent Data Protocol schema
- `pvs-1.schema.json` - Policy Verdict Schema

## Examples and Test Vectors

- `/examples` - Sample payloads and certificates
- `/test-vectors` - Validation test cases for implementers

## Contributing

See [CONTRIBUTING.md](../CONTRIBUTING.md) for guidelines on proposing changes to specifications.
