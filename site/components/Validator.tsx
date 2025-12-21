import React, { useState } from 'react';
import Ajv from 'ajv';
import schema from '../schemas/agent-manifest.json';

const ajv = new Ajv();
const validate = ajv.compile(schema);

export const Validator = () => {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<{valid: boolean; errors: any[]} | null>(null);

  const handleValidate = () => {
    try {
      if (!input.trim()) {
         setResult(null);
         return;
      }
      const json = JSON.parse(input);
      const valid = validate(json);
      setResult({ valid: false, errors: validate.errors || [] }); // Initialize with false/errors if invalid
      if (valid) {
          setResult({ valid: true, errors: [] });
      }
    } catch (e: any) {
      setResult({ valid: false, errors: [{ message: 'Invalid JSON format: ' + e.message, instancePath: '' }] });
    }
  };

  return (
    <div className="validator-container" style={{ padding: '1.5rem', border: '1px solid #333', borderRadius: '8px', marginTop: '1.5rem', background: '#1a1a1a' }}>
      <h3 style={{ marginTop: 0, marginBottom: '1rem', color: '#E0E0E0' }}>Agent Manifest Validator</h3>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder='{
  "did": "did:acl:123",
  "ver": "1.0",
  "capabilities": ["read", "trade"],
  "owner": "tenant-001"
}'
        style={{
          width: '100%',
          height: '200px',
          backgroundColor: '#0F0F0F',
          color: '#E0E0E0',
          border: '1px solid #333',
          padding: '1rem',
          fontFamily: 'monospace',
          fontSize: '14px',
          borderRadius: '4px'
        }}
      />
      <button
        onClick={handleValidate}
        style={{
          marginTop: '1rem',
          padding: '0.75rem 1.5rem',
          backgroundColor: '#D4AF37',
          color: '#121212',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontWeight: 'bold',
          fontSize: '16px',
          transition: 'background-color 0.2s'
        }}
        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#C5A028'}
        onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#D4AF37'}
      >
        Validate Manifest
      </button>

      {result && (
        <div style={{
          marginTop: '1.5rem',
          padding: '1rem',
          borderRadius: '4px',
          backgroundColor: result.valid ? 'rgba(212, 175, 55, 0.1)' : 'rgba(255, 68, 68, 0.1)',
          border: `1px solid ${result.valid ? '#D4AF37' : '#FF4444'}`
        }}>
          {result.valid ? (
            <div style={{ color: '#D4AF37', fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
              <span style={{ fontSize: '1.2rem', marginRight: '0.5rem' }}>✓</span> Success: Valid AIP-1 Manifest
            </div>
          ) : (
            <div style={{ color: '#FF4444' }}>
              <div style={{ fontWeight: 'bold', marginBottom: '0.5rem', display: 'flex', alignItems: 'center' }}>
                <span style={{ fontSize: '1.2rem', marginRight: '0.5rem' }}>✕</span> Validation Failed
              </div>
              <ul style={{ margin: '0 0 0 1.5rem', padding: 0 }}>
                {result.errors.map((err, i) => (
                  <li key={i} style={{ marginBottom: '0.25rem' }}>
                    {err.instancePath ? <code style={{ background: '#330000', padding: '0.2rem', borderRadius: '3px' }}>{err.instancePath}</code> : ''} {err.message}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
