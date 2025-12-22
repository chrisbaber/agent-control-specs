import { X509Certificate } from '@peculiar/x509';

export const AIP_OIDS = {
  VERSION: '1.3.6.1.4.1.59999.1.1',
  ROLE: '1.3.6.1.4.1.59999.1.2',
  TENANT_ID: '1.3.6.1.4.1.59999.1.3',
  CAPABILITIES: '1.3.6.1.4.1.59999.1.4',
  ANCHOR_CHAIN: '1.3.6.1.4.1.59999.1.5',
  AUDIENCE: '1.3.6.1.4.1.59999.1.6',
  ENVIRONMENT: '1.3.6.1.4.1.59999.1.7',
};

export interface CheckResult {
    name: string;
    passed: boolean;
    message: string;
}

export interface ValidationResult {
  valid: boolean;
  checks: CheckResult[];
}

export function validateAip(pem: string): ValidationResult {
    const checks: CheckResult[] = [];
    let isValid = true;

    try {
      if (!pem || !pem.trim()) throw new Error("Empty Input");

      // 1. Parse Certificate
      const cert = new X509Certificate(pem);
      checks.push({ name: 'Format', passed: true, message: 'Valid X.509 Certificate Format' });

      // 2. Validity Period Check (Max 15 minutes)
      const notBefore = cert.notBefore.getTime();
      const notAfter = cert.notAfter.getTime();
      const durationMs = notAfter - notBefore;
      const durationMinutes = durationMs / (1000 * 60);

      const now = new Date().getTime();
      const isExpired = now > notAfter;
      const isNotYetValid = now < notBefore;

      if (isExpired) {
        checks.push({ name: 'Expiration', passed: false, message: `Certificate Expired at ${cert.notAfter.toISOString()}` });
        isValid = false;
      } else if (isNotYetValid) {
         checks.push({ name: 'Activation', passed: false, message: `Certificate not valid until ${cert.notBefore.toISOString()}` });
         isValid = false;
      } else {
        checks.push({ name: 'Validity', passed: true, message: 'Certificate is currently within validity window' });
      }

      if (durationMinutes > 15) {
        checks.push({ name: 'Lifetime', passed: false, message: `Duration is ${durationMinutes.toFixed(1)} mins (Max allowed: 15 mins)` });
        isValid = false;
      } else {
        checks.push({ name: 'Lifetime', passed: true, message: `Duration is ${durationMinutes.toFixed(1)} mins (<= 15 mins)` });
      }

      // 3. Check Required OIDs
      const extensions = cert.extensions;
      const checkOid = (oid: string, name: string) => {
        const found = extensions.find(e => e.type === oid);
        if (found) {
          checks.push({ name: `OID: ${name}`, passed: true, message: `Found ${oid}` });
        } else {
          checks.push({ name: `OID: ${name}`, passed: false, message: `Missing required extension ${oid}` });
          isValid = false;
        }
      };

      checkOid(AIP_OIDS.VERSION, 'AIP-Version');
      checkOid(AIP_OIDS.TENANT_ID, 'Tenant-ID');
      checkOid(AIP_OIDS.CAPABILITIES, 'Capability-Set');

    } catch (e: any) {
      checks.push({ name: 'Format', passed: false, message: 'Failed to parse certificate: ' + e.message });
      isValid = false;
    }

    return { valid: isValid, checks };
}
