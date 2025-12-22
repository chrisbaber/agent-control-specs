import React, { useState } from 'react';
import { validateAdp } from '../../lib/validators/adp';
import sampleRun from '../../examples/adp/sample-run.json';

export const AdpValidator = () => {
  const [input, setInput] = useState(JSON.stringify(sampleRun, null, 2));
  const [result, setResult] = useState<{valid: boolean; errors: any[]} | null>(null);

  const handleValidate = () => {
    try {
      if (!input.trim()) {
         setResult(null);
         return;
      }
      const json = JSON.parse(input);
      const res = validateAdp(json);
      setResult(res);
    } catch (e: any) {
      setResult({ valid: false, errors: [{ message: 'Invalid JSON format: ' + e.message, instancePath: '' }] });
    }
  };

  const downloadReport = () => {
      if (!result) return;
      const report = {
          timestamp: new Date().toISOString(),
          validator: 'ADP-1',
          input: JSON.parse(input),
          result: result
      };
      const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `adp-validation-report-${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
  };

  return (
    <div className="validator-section">
      <div style={{ marginBottom: '1rem' }}>
        <p style={{ fontSize: '0.9rem', color: '#999' }}>
          Validate an <strong>Agent Run</strong> against the ADP-1 Schema.
        </p>
      </div>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        spellCheck="false"
        style={{
          width: '100%',
          height: '300px',
          backgroundColor: '#0F0F0F',
          color: '#E0E0E0',
          border: '1px solid #333',
          padding: '1rem',
          fontFamily: 'monospace',
          fontSize: '13px',
          borderRadius: '4px',
          resize: 'vertical'
        }}
      />
      <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', flexWrap: 'wrap' }}>
        <button
          onClick={handleValidate}
          style={{
            padding: '0.5rem 1.5rem',
            backgroundColor: '#D4AF37',
            color: '#121212',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '14px'
          }}
        >
          Validate ADP-1 Run
        </button>
        <button
          onClick={() => setInput(JSON.stringify(sampleRun, null, 2))}
          style={{
            padding: '0.5rem 1.5rem',
            backgroundColor: 'transparent',
            color: '#888',
            border: '1px solid #444',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          Reset to Sample
        </button>
        {result && (
            <button
            onClick={downloadReport}
            style={{
                padding: '0.5rem 1.5rem',
                backgroundColor: '#333',
                color: '#fff',
                border: '1px solid #555',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px',
                marginLeft: 'auto'
            }}
            >
            ⬇ Download Report
            </button>
        )}
      </div>

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
              <span style={{ fontSize: '1.2rem', marginRight: '0.5rem' }}>✓</span> Success: Valid ADP-1 Agent Run
            </div>
          ) : (
            <div style={{ color: '#FF4444' }}>
              <div style={{ fontWeight: 'bold', marginBottom: '0.5rem', display: 'flex', alignItems: 'center' }}>
                <span style={{ fontSize: '1.2rem', marginRight: '0.5rem' }}>✕</span> Validation Failed
              </div>
              <ul style={{ margin: '0 0 0 1.5rem', padding: 0, fontSize: '0.9rem' }}>
                {result.errors.map((err, i) => (
                  <li key={i} style={{ marginBottom: '0.25rem' }}>
                    {err.instancePath ? <code style={{ background: '#330000', padding: '0.1rem 0.3rem', borderRadius: '3px', marginRight: '0.3rem', border: '1px solid #550000' }}>{err.instancePath}</code> : ''}
                    {err.message}
                    {err.params && JSON.stringify(err.params) !== '{}' ? <span style={{ opacity: 0.7, marginLeft: '0.5rem', fontSize: '0.8rem' }}>{JSON.stringify(err.params)}</span> : ''}
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
