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
  Sparkles,
  Clock,
  Zap,
  Download,
  Calendar,
  Filter,
  Search,
  FileText,
  MapPin
} from 'lucide-react';
import { formatDate } from '../utils/formatters';

export const SettingsView = () => {
  const { currentRole, currentUser, switchRole, users, resetDemoData, attendance, activities, companyBrands, addToast } = useApp();
  const [activeTab, setActiveTab] = useState('roles');
  
  // Attendance filters
  const [attDateFilter, setAttDateFilter] = useState('ALL');
  const [attUserFilter, setAttUserFilter] = useState('ALL');

  // Activity log filters
  const [actUserFilter, setActUserFilter] = useState('ALL');
  const [actBrandFilter, setActBrandFilter] = useState('ALL');
  const [actTypeFilter, setActTypeFilter] = useState('ALL');

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
        'Track lead stages & sales pipeline progression',
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
      <div className="flex-between" style={{ flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2>Settings & Roles</h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Role permissions matrix, team directory, and system logs
          </p>
        </div>
        <button
          className="btn btn-danger btn-sm"
          onClick={() => {
            if (window.confirm('Reset workspace records to clean initial state?')) {
              resetDemoData();
            }
          }}
        >
          <RotateCcw size={14} /> Reset Data
        </button>
      </div>

      {/* Tabs (Segmented Control) */}
      <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch', paddingBottom: '4px' }}>
        <div className="segmented-control">
          <button
            className={`segmented-btn ${activeTab === 'roles' ? 'active' : ''}`}
            onClick={() => setActiveTab('roles')}
          >
            Role Permissions
          </button>
          <button
            className={`segmented-btn ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            Team Directory ({users.length})
          </button>
          <button
            className={`segmented-btn ${activeTab === 'attendance' ? 'active' : ''}`}
            onClick={() => setActiveTab('attendance')}
          >
            Attendance ({attendance.length})
          </button>
          <button
            className={`segmented-btn ${activeTab === 'audit' ? 'active' : ''}`}
            onClick={() => setActiveTab('audit')}
          >
            Audit Trail ({activities.length})
          </button>
          <button
            className={`segmented-btn ${activeTab === 'company' ? 'active' : ''}`}
            onClick={() => setActiveTab('company')}
          >
            Company Profile
          </button>
        </div>
      </div>

      {/* =========================================================================
          TAB 1: ROLES & PERMISSIONS
          ========================================================================= */}
      {activeTab === 'roles' && (
        <div className="grid-2">
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
          TAB 3: STAFF ATTENDANCE REGISTER & WORK LOGS
          ========================================================================= */}
      {activeTab === 'attendance' && (
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="flex-between">
            <div>
              <h3>Staff Attendance & Daily Shift Register</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Track real-time check-in, check-out, working modes, and on-duty durations
              </p>
            </div>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => {
                let csv = 'Attendance ID,Date,Staff Name,Role,Department,Check-In,Check-Out,Work Mode,Location,Status,Shift Duration,Notes\n';
                attendance.forEach((a) => {
                  csv += `"${a.id}","${a.date}","${a.userName}","${a.userRole}","${a.department}","${a.checkInTime}","${a.checkOutTime || 'On Duty'}","${a.workMode}","${a.location}","${a.status}","${a.shiftDuration}","${(a.notes || '').replace(/"/g, '""')}"\n`;
                });
                const blob = new Blob([csv], { type: 'text/csv' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `Staff_Attendance_Report_${new Date().toISOString().split('T')[0]}.csv`;
                a.click();
                addToast('CSV Exported', 'Staff attendance register downloaded.', 'success');
              }}
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Download size={14} /> Export Attendance CSV
            </button>
          </div>

          {/* Filters */}
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap', background: 'var(--bg-subtle)', padding: '10px 14px', borderRadius: 'var(--radius-md)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Staff:</span>
              <select
                className="form-select"
                value={attUserFilter}
                onChange={(e) => setAttUserFilter(e.target.value)}
                style={{ width: '170px', padding: '4px 8px', fontSize: '0.78rem' }}
              >
                <option value="ALL">All Staff Members</option>
                {users.map((u) => (
                  <option key={u.id} value={u.name}>{u.name} ({u.role})</option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Date:</span>
              <select
                className="form-select"
                value={attDateFilter}
                onChange={(e) => setAttDateFilter(e.target.value)}
                style={{ width: '160px', padding: '4px 8px', fontSize: '0.78rem' }}
              >
                <option value="ALL">All Recorded Dates</option>
                {Array.from(new Set(attendance.map((a) => a.date))).map((d) => (
                  <option key={d} value={d}>{formatDate(d)}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Staff Member</th>
                  <th>Department / Role</th>
                  <th>Check-In</th>
                  <th>Check-Out</th>
                  <th>Work Mode & Location</th>
                  <th>Status</th>
                  <th>Shift Summary / Notes</th>
                </tr>
              </thead>
              <tbody>
                {attendance
                  .filter((a) => attUserFilter === 'ALL' || a.userName.includes(attUserFilter))
                  .filter((a) => attDateFilter === 'ALL' || a.date === attDateFilter)
                  .map((att) => {
                    const isOnDuty = att.status === 'Checked In';
                    return (
                      <tr key={att.id}>
                        <td><strong>{formatDate(att.date)}</strong></td>
                        <td>
                          <div style={{ fontWeight: 600 }}>{att.userName}</div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>ID: {att.userId}</div>
                        </td>
                        <td>
                          <span className="badge badge-purple" style={{ fontSize: '0.72rem' }}>
                            {att.department}
                          </span>
                        </td>
                        <td><strong style={{ color: 'var(--primary-600)' }}>{att.checkInTime}</strong></td>
                        <td>{att.checkOutTime ? <strong>{att.checkOutTime}</strong> : <span style={{ color: 'var(--text-muted)' }}>— (Active)</span>}</td>
                        <td>
                          <div style={{ fontWeight: 600, fontSize: '0.8rem' }}>{att.workMode}</div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{att.location}</div>
                        </td>
                        <td>
                          <span className={`badge ${isOnDuty ? 'badge-success' : 'badge-neutral'}`}>
                            {isOnDuty ? '🟢 On Duty' : '⚪ Completed'}
                          </span>
                        </td>
                        <td style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', maxWidth: '240px' }}>
                          {att.notes || 'Standard daily shift.'}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 4: ACTIVITY AUDIT TRAIL
          ========================================================================= */}
      {activeTab === 'audit' && (
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="flex-between">
            <div>
              <h3>Real-Time Staff Activity Audit Log</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Immutable timeline of all operations performed across Auco and Aiwa
              </p>
            </div>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => {
                let csv = 'Activity ID,Timestamp,Staff Name,Role,Brand,Action Type,Entity,Entity ID,Description\n';
                activities.forEach((act) => {
                  csv += `"${act.id}","${act.timestamp}","${act.userName}","${act.userRole}","${act.brand}","${act.actionType}","${act.entityType}","${act.entityId}","${(act.description || '').replace(/"/g, '""')}"\n`;
                });
                const blob = new Blob([csv], { type: 'text/csv' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `Staff_Activity_Audit_Log_${new Date().toISOString().split('T')[0]}.csv`;
                a.click();
                addToast('CSV Exported', 'Staff activity audit log downloaded.', 'success');
              }}
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Download size={14} /> Export Audit Log CSV
            </button>
          </div>

          {/* Filters */}
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap', background: 'var(--bg-subtle)', padding: '10px 14px', borderRadius: 'var(--radius-md)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Brand:</span>
              <select
                className="form-select"
                value={actBrandFilter}
                onChange={(e) => setActBrandFilter(e.target.value)}
                style={{ width: '130px', padding: '4px 8px', fontSize: '0.78rem' }}
              >
                <option value="ALL">All Brands</option>
                <option value="AUCO">AUCO</option>
                <option value="AIWA">AIWA</option>
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Staff:</span>
              <select
                className="form-select"
                value={actUserFilter}
                onChange={(e) => setActUserFilter(e.target.value)}
                style={{ width: '160px', padding: '4px 8px', fontSize: '0.78rem' }}
              >
                <option value="ALL">All Staff Members</option>
                {users.map((u) => (
                  <option key={u.id} value={u.name}>{u.name}</option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Action:</span>
              <select
                className="form-select"
                value={actTypeFilter}
                onChange={(e) => setActTypeFilter(e.target.value)}
                style={{ width: '170px', padding: '4px 8px', fontSize: '0.78rem' }}
              >
                <option value="ALL">All Action Types</option>
                <option value="LEAD_CREATED">Leads Created</option>
                <option value="LEAD_CONVERTED">Leads Converted</option>
                <option value="ORDER_CREATED">Orders Booked</option>
                <option value="SHIPMENT_DISPATCHED">Dispatches</option>
                <option value="INVOICE_GENERATED">Invoices Issued</option>
                <option value="PAYMENT_RECORDED">Payments Collected</option>
                <option value="STOCK_ADJUSTMENT">Stock Adjustments</option>
                <option value="TASK_COMPLETED">Tasks Completed</option>
                <option value="STAFF_CHECK_IN">Check-Ins</option>
                <option value="STAFF_CHECK_OUT">Check-Outs</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Staff Member</th>
                  <th>Brand</th>
                  <th>Action Type</th>
                  <th>Entity</th>
                  <th>Activity Description</th>
                </tr>
              </thead>
              <tbody>
                {activities
                  .filter((a) => actBrandFilter === 'ALL' || a.brand === actBrandFilter)
                  .filter((a) => actUserFilter === 'ALL' || a.userName.includes(actUserFilter))
                  .filter((a) => actTypeFilter === 'ALL' || a.actionType === actTypeFilter)
                  .map((act) => {
                    const isAiwa = act.brand === 'AIWA';
                    const timeFormatted = new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ', ' + formatDate(act.timestamp);

                    return (
                      <tr key={act.id}>
                        <td style={{ fontSize: '0.78rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                          {timeFormatted}
                        </td>
                        <td>
                          <div style={{ fontWeight: 600 }}>{act.userName}</div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{act.userRole}</div>
                        </td>
                        <td>
                          <span className={`badge ${isAiwa ? 'badge-purple' : 'badge-info'}`} style={{ fontSize: '0.72rem' }}>
                            {act.brand || 'AUCO'}
                          </span>
                        </td>
                        <td>
                          <span className="badge badge-neutral" style={{ fontSize: '0.72rem', fontFamily: 'monospace' }}>
                            {act.actionType}
                          </span>
                        </td>
                        <td>
                          <strong>{act.entityType}</strong> {act.entityId && <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>({act.entityId})</span>}
                        </td>
                        <td style={{ fontSize: '0.82rem', color: 'var(--text-primary)', lineHeight: 1.4 }}>
                          {act.description}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 5: COMPANY PROFILE (AUCO & AIWA DUAL-BRAND DIVISIONS)
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
              <strong>Auco</strong> and <strong>Aiwa</strong> operate as two independent brands with isolated product catalogs, dispatch shipments, GST billing details, and customer registries. This software serves as a unified multi-brand operations portal enabling management to toggle between brands or view combined enterprise metrics.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
