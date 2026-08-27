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
          TAB 3: COMPANY PROFILE
          ========================================================================= */}
      {activeTab === 'company' && (
        <div className="card" style={{ maxWidth: '800px' }}>
          <h3 style={{ marginBottom: '14px' }}>Auco & Aiwa Enterprise Profile</h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', fontSize: '0.85rem' }}>
            <div className="form-group">
              <label className="form-label">Legal Business Entity</label>
              <input type="text" className="form-input" defaultValue="AUCO & AIWA TECHNOLOGIES PVT LTD" readOnly />
            </div>

            <div className="form-group">
              <label className="form-label">GSTIN / Tax ID</label>
              <input type="text" className="form-input" defaultValue="27AABCA1234F1Z8" readOnly />
            </div>

            <div className="form-group">
              <label className="form-label">Corporate Headquarters</label>
              <input type="text" className="form-input" defaultValue="MIDC Industrial Area, Pune, Maharashtra - 411026" readOnly />
            </div>

            <div className="form-group">
              <label className="form-label">Support Email</label>
              <input type="text" className="form-input" defaultValue="operations@auco-aiwa.com" readOnly />
            </div>

            <div className="form-group">
              <label className="form-label">Default Tax Rate (GST)</label>
              <input type="text" className="form-input" defaultValue="18% (CGST 9% + SGST 9%)" readOnly />
            </div>

            <div className="form-group">
              <label className="form-label">Default Payment Terms</label>
              <input type="text" className="form-input" defaultValue="Net 30 Days" readOnly />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
