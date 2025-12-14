# Security Policy

## Reporting a Vulnerability

The Agent Control Layer team takes security issues seriously. We appreciate your efforts to responsibly disclose your findings.

### How to Report

**DO NOT** create a public GitHub issue for security vulnerabilities.

Instead, please report security vulnerabilities by emailing:

**security@agentcontrollayer.com**

Include the following information:

1. **Description**: A clear description of the vulnerability
2. **Impact**: The potential impact of the vulnerability
3. **Affected Specs**: Which specifications are affected (AIP-1, ADP-1, PVS-1, CTX-1)
4. **Reproduction**: Steps to reproduce or proof-of-concept
5. **Suggested Fix**: If you have suggestions for how to fix the issue

### Response Timeline

| Action | Timeline |
|--------|----------|
| Initial Response | Within 48 hours |
| Status Update | Within 7 days |
| Resolution Target | Within 90 days |

### What to Expect

1. **Acknowledgment**: We will acknowledge receipt of your report
2. **Assessment**: We will assess the vulnerability and its impact
3. **Communication**: We will keep you informed of our progress
4. **Credit**: We will credit you in the fix (unless you prefer anonymity)

## Security Considerations in Specifications

Each ACL specification includes a Security Considerations section addressing:

- **AIP-1**: Certificate lifecycle, key management, blockchain anchor integrity
- **ADP-1**: Data integrity, AIP linkage verification, audit trail security
- **PVS-1**: Policy bypass prevention, verdict integrity
- **CTX-1**: Capability escalation prevention, namespace security

## Supported Versions

| Version | Supported |
|---------|-----------|
| 1.x.x   | Yes       |

## PGP Key

For encrypted communications, our PGP key is available at:
https://agentcontrollayer.com/.well-known/pgp-key.txt
