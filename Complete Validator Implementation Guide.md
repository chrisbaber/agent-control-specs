# Complete Validator Implementation Guide

**To:** Christopher Baber, Founder of AgentControlLayer  
**From:** Manus AI (Technical Architect)  
**Date:** December 21, 2025  
**Subject:** Production-Ready Implementation Plan for All Four Spec Validators

---

## Executive Summary

This document provides a complete, production-ready implementation plan for building a comprehensive validation suite for all four Agent Control Layer specifications. The architecture is designed to be built incrementally without requiring any refactoring between phases. Each validator is self-contained, and the tabbed interface provides a clean, professional user experience.

**Total Implementation Time:** Approximately 2-3 hours for all four validators, or you can implement them in stages over multiple sessions.

---

## Architecture Overview

The validator system consists of a tabbed interface that switches between four independent validator components:

```
┌─────────────────────────────────────────────────────────┐
│  Validator Page (validator.mdx)                          │
├─────────────────────────────────────────────────────────┤
│  ValidatorTabs Component                                 │
│  ┌───────────────────────────────────────────────────┐  │
│  │  [ADP-1] [AIP-1] [PVS-1] [CTX-1]  ← Tab Buttons  │  │
│  ├───────────────────────────────────────────────────┤  │
│  │                                                    │  │
│  │  Currently Active Validator Component             │  │
│  │  (AdpValidator, AipValidator, etc.)               │  │
│  │                                                    │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### Component Breakdown

| Component | Purpose | Complexity | Dependencies |
|:---|:---|:---:|:---|
| **ValidatorTabs.tsx** | Main container with tab switching logic | Low | None (React only) |
| **AdpValidator.tsx** | Validates Agent Run JSON against ADP-1 schema | Low | `ajv`, `ajv-formats`, `adp-1.schema.json` |
| **AipValidator.tsx** | Validates X.509 certificates against AIP-1 rules | High | `@peculiar/x509`, `@peculiar/asn1-schema` |
| **PvsValidator.tsx** | Validates Policy Verdict JSON against PVS-1 schema | Low | `ajv`, `ajv-formats`, `pvs-1.schema.json` |
| **CtxValidator.tsx** | Validates capability strings against CTX-1 regex | Very Low | None (regex only) |

---

## Implementation Plan

### Phase 1: Setup & Dependencies (5 minutes)

**Step 1.1:** Install required npm packages

```bash
cd site
npm install @peculiar/x509 @peculiar/asn1-schema ajv-formats
```

**Step 1.2:** Create the new directory structure

```bash
mkdir -p components/validators
```

**Step 1.3:** Move and rename the existing validator

```bash
mv components/Validator.tsx components/validators/ValidatorTabs.tsx
```

---

### Phase 2: Build the Tab Interface (10 minutes)

**File:** `site/components/validators/ValidatorTabs.tsx`

Replace the entire contents of this file with the code provided in the attached `ValidatorTabs.tsx`.

**Key Features:**
- Simple tab switching with state management
- Gold accent color (#D4AF37) for active tab
- Clean, minimal design that matches the existing site aesthetic

---

### Phase 3: Build ADP-1 Validator (15 minutes)

**File:** `site/components/validators/AdpValidator.tsx`

Create this new file with the code provided in the attached `AdpValidator.tsx`.

**Key Features:**
- Pre-filled with the sample agent run from `examples/adp/sample-run.json`
- Uses the existing `adp-1.schema.json` for validation
- Displays detailed error messages with JSON path highlighting

**Import Path Adjustments:**

Ensure the schema and example imports are correct relative to the new file location:

```typescript
import schema from '../../schemas/adp-1.schema.json';
import sampleRun from '../../../examples/adp/sample-run.json';
```

---

### Phase 4: Build AIP-1 Validator (45-60 minutes)

**File:** `site/components/validators/AipValidator.tsx`

Create this new file with the code provided in the attached `AipValidator.tsx`.

**Key Features:**
- Parses PEM-encoded X.509 certificates
- Validates certificate validity period (must be ≤15 minutes)
- Checks for required AIP OID extensions
- Provides clear error messages for each validation failure

**Validation Rules Implemented:**

1. **Validity Period Check:** Certificate must not be expired and must have a validity period of 15 minutes or less
2. **AIP-Version OID:** Must contain OID `1.3.6.1.4.1.59999.1.1`
3. **Tenant-ID OID:** Must contain OID `1.3.6.1.4.1.59999.1.3`
4. **Capability-Set OID:** Must contain OID `1.3.6.1.4.1.59999.1.4`

**Note:** This is the most complex validator. The `@peculiar/x509` library handles the heavy lifting of parsing PEM and extracting OIDs.

---

### Phase 5: Build PVS-1 Validator (15 minutes)

**File:** `site/components/validators/PvsValidator.tsx`

Create this new file with the code provided in the attached `PvsValidator.tsx`.

**Key Features:**
- Pre-filled with the sample policy verdict from `examples/pvs/sample-verdict-approved.json`
- Uses the existing `pvs-1.schema.json` for validation
- Displays detailed error messages with JSON path highlighting

**Import Path Adjustments:**

```typescript
import schema from '../../schemas/pvs-1.schema.json';
import sampleVerdict from '../../../examples/pvs/sample-verdict-approved.json';
```

---

### Phase 6: Build CTX-1 Validator (10 minutes)

**File:** `site/components/validators/CtxValidator.tsx`

Create this new file with the code provided in the attached `CtxValidator.tsx`.

**Key Features:**
- Simple regex-based validation
- Pre-filled with a sample capability string (`perm:files:read`)
- Validates the format: `prefix:segment1:segment2:...` where prefix is one of `perm`, `agent`, `tenant`, or `sys`

**Validation Regex:**

```typescript
const CTX_REGEX = /^(perm|agent|tenant|sys):[a-zA-Z0-9_-]+(:[a-zA-Z0-9_-]+)*$/;
```

---

### Phase 7: Update the Validator Page (5 minutes)

**File:** `site/pages/validator.mdx`

Replace the entire contents with:

```mdx
import { ValidatorTabs } from "../components/validators/ValidatorTabs";

# Interactive Validators

Use these tools to validate your implementations against the Agent Control Layer specifications.

<ValidatorTabs />
```

---

### Phase 8: Test & Deploy (10 minutes)

**Step 8.1:** Run the development server

```bash
npm run dev
```

**Step 8.2:** Navigate to `http://localhost:3000/validator`

**Step 8.3:** Test each validator:

1. **ADP-1:** Click "Validate ADP-1 Run" with the pre-filled sample data. Should show success.
2. **AIP-1:** Paste a valid PEM certificate (you'll need to generate one or use a test cert). Should validate OIDs and validity period.
3. **PVS-1:** Click "Validate PVS-1 Verdict" with the pre-filled sample data. Should show success.
4. **CTX-1:** Click "Validate CTX-1 String" with the pre-filled sample string. Should show success. Try invalid strings like `invalid:format:` or `perm` (missing colon).

**Step 8.4:** Build and deploy

```bash
npm run build
# Deploy to your hosting platform (Vercel, Netlify, etc.)
```

---

## Troubleshooting

### Issue: "Cannot find module '@peculiar/x509'"

**Solution:** Ensure you ran `npm install @peculiar/x509 @peculiar/asn1-schema` in the `site/` directory.

### Issue: "Cannot find module '../../schemas/adp-1.schema.json'"

**Solution:** Verify the import paths are correct relative to the new file locations in `components/validators/`.

### Issue: Validator results not appearing

**Solution:** This was the original bug. The new code uses a cleaner state update pattern that should resolve this. If it persists, check the browser console for React errors.

### Issue: AIP-1 validator shows "Invalid PEM format"

**Solution:** Ensure the certificate is properly formatted with `-----BEGIN CERTIFICATE-----` and `-----END CERTIFICATE-----` markers, and that there are no extra spaces or line breaks.

---

## Future Enhancements

Once the core validators are working, consider these enhancements:

1. **Blockchain Verification:** Add a button in the AIP-1 validator to verify the Root CA fingerprint against the Ethereum blockchain anchor.
2. **Certificate Generation:** Add a "Generate Test Certificate" button that creates a valid AIP-1 certificate for testing.
3. **Downloadable Reports:** Allow users to download validation results as a PDF or JSON file.
4. **Batch Validation:** Allow users to upload multiple files and validate them all at once.
5. **API Endpoint:** Create a REST API endpoint (e.g., `/api/validate/adp`) so developers can validate programmatically.

---

## Summary

This implementation provides a complete, production-ready validation suite that:

✅ **Validates all four core specifications**  
✅ **Requires zero refactoring between phases**  
✅ **Uses a clean, professional tabbed interface**  
✅ **Provides detailed, actionable error messages**  
✅ **Comes pre-filled with sample data for easy testing**  
✅ **Matches your existing site's aesthetic (charcoal & gold)**

Once deployed, this will be a powerful tool for developers implementing the Agent Control Layer specifications and a strong demonstration of your commitment to practical, usable standards.
