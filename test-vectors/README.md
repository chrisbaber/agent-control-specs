# Test Vectors

This directory contains test vectors for validating implementations of ACL specifications.

## Files

| File | Specification | Description |
|------|---------------|-------------|
| `adp-1-vectors.json` | ADP-1 | Agent Data Protocol validation test cases |
| `pvs-1-vectors.json` | PVS-1 | Policy Verdict Schema validation test cases |

## Test Vector Format

Each test vector file contains:

```json
{
  "$schema": "schema-url",
  "description": "Description of test suite",
  "vectors": [
    {
      "id": "unique-test-id",
      "description": "What this test validates",
      "valid": true,
      "data": { ... }
    }
  ]
}
```

## Using Test Vectors

### Running Validation Tests

```javascript
const Ajv = require('ajv');
const addFormats = require('ajv-formats');
const vectors = require('./pvs-1-vectors.json');
const schema = require('../schemas/pvs-1.schema.json');

const ajv = new Ajv({ strict: false });
addFormats(ajv);
const validate = ajv.compile(schema);

let passed = 0;
let failed = 0;

for (const vector of vectors.vectors) {
  const result = validate(vector.data);
  const expected = vector.valid;
  
  if (result === expected) {
    passed++;
    console.log(`PASS: ${vector.id}`);
  } else {
    failed++;
    console.log(`FAIL: ${vector.id} - expected ${expected}, got ${result}`);
    if (!result) console.log(validate.errors);
  }
}

console.log(`\nResults: ${passed} passed, ${failed} failed`);
```

## Conformance Testing

Implementations claiming conformance to ACL specifications SHOULD:

1. Pass all `valid: true` test vectors (accept valid inputs)
2. Reject all `valid: false` test vectors (reject invalid inputs)
3. Document any deviations with rationale

## Contributing

When adding test vectors:

1. Include both positive (valid) and negative (invalid) cases
2. Cover edge cases and boundary conditions
3. Provide clear descriptions for each vector
4. Ensure vectors align with the specification text
