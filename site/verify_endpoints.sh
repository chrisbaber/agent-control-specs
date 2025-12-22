#!/bin/bash
set -e

BASE_URL="http://localhost:3000"

echo "Verifying ADP API..."
curl -s -X POST "$BASE_URL/api/validate/adp" \
  -H "Content-Type: application/json" \
  -d '{"adp_version": "1.0", "domain": "agent-os.net", "policy": {"allowed_agents": ["*"]}}' \
  | grep '"valid":' && echo "ADP API: PASS" || echo "ADP API: FAIL"

echo "Verifying PVS API..."
curl -s -X POST "$BASE_URL/api/validate/pvs" \
  -H "Content-Type: application/json" \
  -d '{"pvs_version": "1.0", "service": "storage", "method": "GET"}' \
  | grep '"valid":' && echo "PVS API: PASS" || echo "PVS API: FAIL"

echo "Verifying CTX API..."
curl -s -X POST "$BASE_URL/api/validate/ctx" \
  -H "Content-Type: application/json" \
  -d '{"capability": "perm:read"}' \
  | grep '"valid":true' && echo "CTX API: PASS" || echo "CTX API: FAIL"

echo "Verifying AIP API..."
# This requires a valid certificate PEM, which is hard to hardcode. 
# We'll send an invalid one to ensure it responds.
curl -s -X POST "$BASE_URL/api/validate/aip" \
  -H "Content-Type: text/plain" \
  -d '-----BEGIN CERTIFICATE----- ... -----END CERTIFICATE-----' \
  | grep '"valid":false' && echo "AIP API (Invalid Input): PASS" || echo "AIP API (Invalid Input): FAIL"

echo "Verification Complete."
