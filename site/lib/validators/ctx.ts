export interface ValidationResult {
  valid: boolean;
  message: string;
}

const CTX_REGEX = /^(perm|agent|tenant|sys):[a-zA-Z0-9_-]+(:[a-zA-Z0-9_-]+)*$/;

export function validateCtx(input: string): ValidationResult {
  if (!input || !input.trim()) {
      return { valid: false, message: 'Input is empty' };
  }
  
  const valid = CTX_REGEX.test(input);
  if (valid) {
    return { valid: true, message: 'Valid CTX-1 Capability String' };
  } else {
    return { valid: false, message: 'Invalid Format. Must start with perm:, agent:, tenant:, or sys: and contain dot/colon separated segments.' };
  }
}
