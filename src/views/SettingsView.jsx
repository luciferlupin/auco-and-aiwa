import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Settings,
  ShieldCheck,
  TrendingUp,
  CreditCard,
  Wrench,
  Users,
  RotateCcw,
  CheckCircle2,
  Lock,
  Building,
  Sparkles
} from 'lucide-react';

export const SettingsView = () => {
  const { currentRole, currentUser, switchRole, users, resetDemoData } = useApp();
  const [activeTab, setActiveTab] = useState('roles');

  const roleDefinitions = [
    {
      role: 'Admin',
      icon: ShieldCheck,
      color: '#4f46e5',
      description: 'Super-user role with complete command across all financial, sales, inventory, and task delegation modules.',
      permissions: [
        'Full system access across all views',
        'Assign tasks to team members',
        'Track team tasks and delivery progress',
        'Track sales pipeline & win/loss conversions',
        'View overall business revenue & KPI reports',
        'Manage user accounts, roles & permissions'
      ]
    },
    {
      role: 'Sales',
      icon: TrendingUp,
      color: '#10b981',
      description: 'Focused sales pipeline account for prospect acquisition, conversion, order creation, and follow-ups.',
      permissions: [
        'Manage leads and prospects',
        'Manage active client accounts',
        'Track lead stages in Kanban pipeline',
        'Track lead conversion percentage',
        'Manage follow-ups (WhatsApp, Call, Meeting)',
        'View client order history & create orders',
        'Track sales pipeline revenue'
      ]
    },
    {
      role: 'Accounts',
      icon: CreditCard,
      color: '#f59e0b',
      description: 'Finance and billing account for invoicing, collections, tax documentation, and outstanding payment tracking.',
      permissions: [
        'Generate GST tax invoices with line items',
        'Manage client payments & receipts',
        'Track pending payments & balance due',
        'Track payment due dates & aging',
        'Track client payment history',
        'Manage billing records & export PDF invoices',
        'Track total outstanding receivables'
      ]
    },
    {
      role: 'Services',
      icon: Wrench,
      color: '#8b5cf6',
      description: 'Field operations and service delivery account for client equipment deployment, calibration, and task execution.',
      permissions: [
        'Manage client services & hardware orders',
        'Execute assigned service-related tasks',
        'Track task completion status',
        'Track delivery & commissioning progress',
        'View client technical requirements',
        'Update service completion & sign-offs'
      ]
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div className="flex-between">
        <div>
          <h2>System Settings & Role Permissions</h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Enterprise role definitions, permissions matrix, team directory, and system data maintenance.
          </p>
        </div>
        <button
          className="btn btn-danger btn-sm"
          onClick={() => {
            if (window.confirm('Reset all demo data back to default factory state?')) {
              resetDemoData();
            }
          }}
        >
          <RotateCcw size={14} /> Restore Factory Data
        </button>
      </div>

      {/* Tabs */}
      <div className="card" style={{ padding: '0 18px', borderBottom: '1px solid var(--border-default)' }}>
        <div className="tabs-nav" style={{ margin: 0 }}>
          <button
            className={`tab-btn ${activeTab === 'roles' ? 'active' : ''}`}
            onClick={() => setActiveTab('roles')}
          >
            Role Permissions Matrix
          </button>
          <button
            className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            Team Members Directory ({users.length})
          </button>
          <button
            className={`tab-btn ${activeTab === 'company' ? 'active' : ''}`}
            onClick={() => setActiveTab('company')}
          >
            Company Profile (Auco & Aiwa)
          </button>
        </div>
      </div>

      {/* =========================================================================
          TAB 1: ROLES & PERMISSIONS
          ========================================================================= */}
      {activeTab === 'roles' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '20px' }}>
          {roleDefinitions.map((rd) => {
            const Icon = rd.icon;
            const isCurrent = currentRole === rd.role;

            return (
              <div
                key={rd.role}
                className="card"
                style={{
                  border: isCurrent ? `2px solid ${rd.color}` : '1px solid var(--border-default)',
                  position: 'relative'
                }}
              >
                {isCurrent && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '16px',
                      right: '16px',
                      background: rd.color,
                      color: '#fff',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: 'var(--radius-full)'
                    }}
                  >
                    Active Session Role
                  </div>
                )}

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: 'var(--radius-md)',
                      background: `${rd.color}15`,
                      color: rd.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Icon size={22} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.1rem' }}>{rd.role} Account</h3>
                    <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>Security Level: {rd.role === 'Admin' ? 'Tier 1 (Superadmin)' : 'Tier 2 (Operational)'}</span>
                  </div>
                </div>

                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '14px' }}>
                  {rd.description}
                </p>

                <h4 style={{ fontSize: '0.82rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '8px' }}>
                  Granted Feature Capabilities:
                </h4>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '16px' }}>
                  {rd.permissions.map((p, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.8rem' }}>
                      <CheckCircle2 size={14} style={{ color: rd.color, flexShrink: 0, marginTop: '2px' }} />
                      <span>{p}</span>
                    </div>
                  ))}
                </div>

                {!isCurrent && (
                  <button
                    className="btn btn-secondary btn-sm"
                    style={{ width: '100%' }}
                    onClick={() => switchRole(rd.role)}
                  >
                    Switch to {rd.role} View
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* =========================================================================
          TAB 2: TEAM DIRECTORY
          ========================================================================= */}
      {activeTab === 'users' && (
        <div className="card">
          <div className="flex-between" style={{ marginBottom: '16px' }}>
            <div>
              <h3>Enterprise Team Accounts</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Registered personnel across Sales, Accounts, Services, and Admin</p>
            </div>
          </div>

          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Team Member</th>
                  <th>Department</th>
                  <th>Assigned Role</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--primary-600)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.8rem' }}>
                          {u.avatar}
                        </div>
                        <div>
                          <strong>{u.name}</strong>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{u.id}</div>
                        </div>
                      </div>
                    </td>
                    <td>{u.department}</td>
                    <td>
                      <span className={`badge ${u.role === 'Admin' ? 'badge-purple' : (u.role === 'Sales' ? 'badge-success' : (u.role === 'Accounts' ? 'badge-warning' : 'badge-info'))}`}>
                        {u.role} Account
                      </span>
                    </td>
                    <td style={{ fontSize: '0.8rem' }}>{u.email}</td>
                    <td style={{ fontSize: '0.8rem' }}>{u.phone}</td>
                    <td><span className="badge badge-success">Active</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 3: COMPANY PROFILE (AUCO & AIWA DUAL-BRAND DIVISIONS)
          ========================================================================= */}
      {activeTab === 'company' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Dual Brand Division Cards */}
          <div className="grid-2">
            {/* Auco Automation Card */}
            <div className="card" style={{ borderTop: '4px solid #2563eb' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '8px',
                      background: 'linear-gradient(135deg, #2563eb 0%, #0284c7 100%)',
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '0.85rem'
                    }}
                  >
                    AU
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.05rem' }}>Auco Automation</h3>
                    <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Industrial & Robotics Division</span>
                  </div>
                </div>
                <span className="badge badge-info">Code: AUC</span>
              </div>

              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                Specialized in Industrial Automation Controllers, Smart Sensor Arrays, PLC Panels, IoT Gateways, and Servo Drives.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.8rem', background: 'var(--bg-subtle)', padding: '10px', borderRadius: 'var(--radius-md)' }}>
                <div><strong>Catalog Prefix:</strong> AUC-101, AUC-202, AUC-550, AUC-900</div>
                <div><strong>Primary Market:</strong> Automotive, Manufacturing Plants & Machinery OEMs</div>
                <div><strong>GSTIN:</strong> 27AABCA1234F1Z8</div>
              </div>
            </div>

            {/* Aiwa India Card */}
            <div className="card" style={{ borderTop: '4px solid #7c3aed' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '8px',
                      background: 'linear-gradient(135deg, #7c3aed 0%, #db2777 100%)',
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '0.85rem'
                    }}
                  >
                    AW
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.05rem' }}>Aiwa India</h3>
                    <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Commercial AV & Acoustics Division</span>
                  </div>
                </div>
                <span className="badge badge-purple">Code: AIW</span>
              </div>

              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                Specialized in Commercial Audio Arrays, DSP Matrix Mixers, Ceiling Speaker Systems, and Power Amplifiers.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.8rem', background: 'var(--bg-subtle)', padding: '10px', borderRadius: 'var(--radius-md)' }}>
                <div><strong>Catalog Prefix:</strong> AIW-301, AIW-405, AIW-800</div>
                <div><strong>Primary Market:</strong> Auditoriums, Hospitality, IT Tech Parks & Retail Chains</div>
                <div><strong>Legal Entity:</strong> Aiwa Commercial AV India Pvt Ltd</div>
                <div><strong>GSTIN:</strong> 07AAACA5678G2Z1 • New Delhi</div>
              </div>
            </div>
          </div>

          {/* Legal Business Details for both brands */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <span className="badge badge-info">Brand 1</span>
                <h3 style={{ margin: 0, fontSize: '1rem' }}>Auco Automation Legal Profile</h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.82rem' }}>
                <div><span style={{ color: 'var(--text-muted)' }}>Company Name:</span> <strong>Auco Automation India Pvt Ltd</strong></div>
                <div><span style={{ color: 'var(--text-muted)' }}>GSTIN / Tax ID:</span> <strong>27AABCA1234F1Z8</strong></div>
                <div><span style={{ color: 'var(--text-muted)' }}>Registered Office:</span> <strong>Plot 42, MIDC Bhosari, Pune, MH - 411026</strong></div>
                <div><span style={{ color: 'var(--text-muted)' }}>Official Email:</span> <strong>contact@auco-automation.com</strong></div>
                <div><span style={{ color: 'var(--text-muted)' }}>Default Tax Rate:</span> <strong>18% GST (CGST 9% + SGST 9%)</strong></div>
                <div><span style={{ color: 'var(--text-muted)' }}>Payment Terms:</span> <strong>Net 30 Days</strong></div>
              </div>
            </div>

            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <span className="badge badge-purple">Brand 2</span>
                <h3 style={{ margin: 0, fontSize: '1rem' }}>Aiwa India Legal Profile</h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.82rem' }}>
                <div><span style={{ color: 'var(--text-muted)' }}>Company Name:</span> <strong>Aiwa Commercial AV India Pvt Ltd</strong></div>
                <div><span style={{ color: 'var(--text-muted)' }}>GSTIN / Tax ID:</span> <strong>07AAACA5678G2Z1</strong></div>
                <div><span style={{ color: 'var(--text-muted)' }}>Registered Office:</span> <strong>Aiwa House, Okhla Phase III, New Delhi - 110020</strong></div>
                <div><span style={{ color: 'var(--text-muted)' }}>Official Email:</span> <strong>contact@aiwa-india.com</strong></div>
                <div><span style={{ color: 'var(--text-muted)' }}>Default Tax Rate:</span> <strong>18% GST (CGST 9% + SGST 9%)</strong></div>
                <div><span style={{ color: 'var(--text-muted)' }}>Payment Terms:</span> <strong>Net 30 Days</strong></div>
              </div>
            </div>
          </div>

          {/* Portal Architecture Notice */}
          <div className="card" style={{ background: 'var(--bg-subtle)', borderLeft: '4px solid var(--primary-600)' }}>
            <h4 style={{ margin: '0 0 6px 0', fontSize: '0.9rem' }}>Dual-Brand Portal Architecture</h4>
            <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              <strong>Auco</strong> and <strong>Aiwa</strong> operate as two independent brands with isolated product catalogs, delivery challans, GST billing details, and customer registries. This software serves as a unified multi-brand operations portal enabling management to toggle between brands or view combined enterprise metrics.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
