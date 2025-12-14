# Changelog

All notable changes to the Agent Control Layer specifications will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- JSON Schema definitions for ADP-1 and PVS-1
- Example certificates, payloads, and test vectors
- SPEC-0 meta-specification defining specification governance
- Security Considerations sections in all specifications
- RFC 2119 normative language compliance
- Conformance requirements for each specification

### Changed
- Standardized frontmatter across all specifications to IETF RFC/EIP style
- Updated documentation to gold-standard professional presentation

---

## [1.0.0] - 2025-12-14

### Added

#### AIP-1: Agent Identity Protocol
- Initial release of Agent Identity Protocol specification
- X.509 certificate profile with custom AIP OID extensions (1.3.6.1.4.1.59999.1.x)
- Short-lived certificate model (5-15 minute validity)
- Blockchain anchoring for Root CA verification (Ethereum Sepolia)
- Trust architecture: The Verification Triangle
- Environment and Audience validation requirements
- Marketplace interoperability framework

#### ADP-1: Agent Data Protocol
- Initial release of Agent Data Protocol specification
- Agent Run schema for end-to-end execution records
- Agent Step schema (Action → Observation → Reflection)
- AIP-1 integration via `agent.aip` block
- Framework-agnostic design supporting LangChain, CrewAI, AutoGen, etc.
- Policy verdict embedding support

#### PVS-1: Policy Verdict Schema
- Initial release of Policy Verdict Schema specification
- Standard JSON structure for policy enforcement decisions
- The Gavel integration mapping
- ADP-1 embedding format

#### CTX-1: Capability & Trust eXtensions
- Initial release of Capability & Trust eXtensions specification
- Capability string naming conventions
- Reserved prefixes: `agent:`, `tenant:`, `service_account:`, `perm:`, `budget:`
- RBAC to capability mapping guidelines

#### Infrastructure
- Root CA fingerprint anchored on Ethereum Sepolia
- Transaction: `0x9349d41f0c92d128cbc07e8d4697a92fa7d107b2468c1f2fc0e9a3bc6c74a33a`

---

## Version History by Specification

| Specification | Current Version | Initial Release | Last Updated |
|---------------|-----------------|-----------------|--------------|
| AIP-1 | 1.0.0 | 2025-12-09 | 2025-12-14 |
| ADP-1 | 1.0.0 | 2025-12-10 | 2025-12-14 |
| PVS-1 | 1.0.0 | 2025-12-10 | 2025-12-14 |
| CTX-1 | 1.0.0 | 2025-12-10 | 2025-12-14 |

---

## Planned Releases

### v1.1.0 (Q1 2026)
- Ethereum Mainnet Root CA anchoring
- Extended capability vocabulary
- Additional test vectors

### v2.0.0 (Future)
- Post-quantum cryptography support (Dilithium/Kyber)
- Zero-knowledge proof extensions
- Signed ADP streams

---

[Unreleased]: https://github.com/chrisbaber/agent-control-specs/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/chrisbaber/agent-control-specs/releases/tag/v1.0.0
