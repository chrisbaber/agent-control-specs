import React, { useState } from 'react';
import { X509CertificateGenerator, Extension } from '@peculiar/x509';
import { validateAip, AIP_OIDS, CheckResult } from '../../lib/validators/aip';


export const AipValidator = () => {
  const [input, setInput] = useState('');
  const [results, setResults] = useState<{valid: boolean; checks: CheckResult[]} | null>(null);

  const handleValidate = () => {
    if (!input.trim()) {
      setResults(null);
      return;
    }
    const res = validateAip(input);
    setResults(res);
  };

  const generateTestCert = async () => {
    try {
      if (typeof window === 'undefined' || !window.crypto) {
        alert("Web Crypto API not available");
        return;
      }
      const crypto = window.crypto;
      const alg = { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256", publicExponent: new Uint8Array([1, 0, 1]), modulusLength: 2048 };
      const keys = await crypto.subtle.generateKey(alg, true, ["sign", "verify"]);
      
      const cert = await X509CertificateGenerator.create({
        serialNumber: "1",
        subject: "CN=Test Agent",
        issuer: "CN=Test Root",
        notBefore: new Date(),
        notAfter: new Date(Date.now() + 1000 * 60 * 15), // 15 mins
        signingAlgorithm: alg,
        publicKey: keys.publicKey,
        signingKey: keys.privateKey,
        extensions: [
            new Extension(AIP_OIDS.VERSION, false, new TextEncoder().encode("1.0").buffer),
            new Extension(AIP_OIDS.TENANT_ID, false, new TextEncoder().encode("tenant-demo").buffer),
            new Extension(AIP_OIDS.CAPABILITIES, false, new TextEncoder().encode("demo:gen").buffer)
        ]
      });
      
      setInput(cert.toString('pem'));
      setResults(null); // Clear previous results
    } catch (e: any) {
        alert("Failed to generate certificate: " + e.message);
    }
  };

  const verifyOnChain = async () => {
      // Simulation of Sepolia verification
      alert("Simulating Sepolia check for Root Anchor: 0x9349... \n\n ✓ Anchor Found: Block 4829102\n ✓ Status: Confirmed");
  };

  const downloadReport = () => {
    if (!results) return;
    const report = {
        timestamp: new Date().toISOString(),
        validator: 'AIP-1',
        input: input,
        result: results
    };
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aip-validation-report-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="validator-section">
      <div style={{ marginBottom: '1rem' }}>
        <p style={{ fontSize: '0.9rem', color: '#999' }}>
          Validate an <strong>AIP-1 X.509 Certificate</strong> (PEM format).
        </p>
      </div>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="-----BEGIN CERTIFICATE-----..."
        style={{
          width: '100%',
          height: '200px',
          backgroundColor: '#0F0F0F',
          color: '#E0E0E0',
          border: '1px solid #333',
          padding: '1rem',
          fontFamily: 'monospace',
          fontSize: '11px',
          borderRadius: '4px'
        }}
      />
      <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        <button
          onClick={handleValidate}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#D4AF37',
            color: '#121212',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '13px'
          }}
        >
          Validate Certificate
        </button>
        <button
          onClick={generateTestCert}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: 'transparent',
            color: '#D4AF37',
            border: '1px solid #D4AF37',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '13px'
          }}
        >
          Generate Test Cert
        </button>
        <button
          onClick={verifyOnChain}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: 'transparent',
            color: '#888',
            border: '1px solid #444',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '13px'
          }}
        >
          Verify on Sepolia
        </button>
        {results && (
            <button
            onClick={downloadReport}
            style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#333',
                color: '#fff',
                border: '1px solid #555',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '13px',
                marginLeft: 'auto'
            }}
            >
            ⬇ Download Report
            </button>
        )}
      </div>

      {results && (
        <div style={{ marginTop: '1.5rem' }}>
          <h4 style={{ color: results.valid ? '#D4AF37' : '#FF4444', marginTop: 0 }}>
            {results.valid ? '✓ Certificate Valid' : '✕ Validation Failed'}
          </h4>
          <ul style={{ listStyle: 'none', padding: 0, marginTop: '0.5rem' }}>
            {results.checks.map((check, i) => (
              <li key={i} style={{marginBottom: '0.5rem', padding: '0.5rem', background: '#222', borderRadius: '4px', borderLeft: `3px solid ${check.passed ? '#4CAF50' : '#FF4444'}`}}>
                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                    <span style={{fontWeight: 'bold', color: '#E0E0E0'}}>{check.name}</span>
                    <span style={{color: check.passed ? '#4CAF50' : '#FF4444'}}>{check.passed ? 'PASS' : 'FAIL'}</span>
                </div>
                <div style={{fontSize: '0.8rem', color: '#888', marginTop: '0.2rem'}}>{check.message}</div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
