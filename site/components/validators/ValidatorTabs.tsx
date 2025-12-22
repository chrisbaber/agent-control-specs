import React, { useState } from 'react';
import { AdpValidator } from './AdpValidator';
import { AipValidator } from './AipValidator';
import { PvsValidator } from './PvsValidator';
import { CtxValidator } from './CtxValidator';

type Tab = 'ADP' | 'AIP' | 'PVS' | 'CTX';

export const ValidatorTabs = () => {
  const [activeTab, setActiveTab] = useState<Tab>('ADP');

  return (
    <div className="validator-container" style={{
      marginTop: '2rem',
      background: '#1a1a1a',
      border: '1px solid #333',
      borderRadius: '8px',
      overflow: 'hidden'
    }}>
      {/* Header / Tabs */}
      <div style={{
        display: 'flex',
        borderBottom: '1px solid #333',
        backgroundColor: '#151515'
      }}>
        {(['ADP', 'AIP', 'PVS', 'CTX'] as Tab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              flex: 1,
              padding: '1rem',
              backgroundColor: activeTab === tab ? '#1a1a1a' : 'transparent',
              color: activeTab === tab ? '#D4AF37' : '#888',
              border: 'none',
              borderBottom: activeTab === tab ? '2px solid #D4AF37' : '2px solid transparent',
              cursor: 'pointer',
              fontWeight: activeTab === tab ? 'bold' : 'normal',
              transition: 'all 0.2s',
              outline: 'none',
              fontSize: '14px'
            }}
          >
            {tab}-1 Validator
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div style={{ padding: '1.5rem' }}>
        {activeTab === 'ADP' && <AdpValidator />}
        {activeTab === 'AIP' && <AipValidator />}
        {activeTab === 'PVS' && <PvsValidator />}
        {activeTab === 'CTX' && <CtxValidator />}
      </div>
    </div>
  );
};
