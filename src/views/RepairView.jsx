import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Wrench,
  Plus,
  Phone,
  User,
  Calendar,
  ChevronRight,
  X,
  CheckCircle2,
  Clock,
  AlertCircle,
  Truck,
  Search,
  Trash2,
  ClipboardList
} from 'lucide-react';
import { formatDate } from '../utils/formatters';

// ─── Status pipeline config ───────────────────────────────────────────────────
const STATUSES = [
  { key: 'Pending Diagnosis', label: 'Diagnosing',  color: '#f59e0b', bg: '#fffbeb', border: '#fde68a', icon: AlertCircle },
  { key: 'In Repair',         label: 'In Repair',   color: '#3b82f6', bg: '#eff6ff', border: '#bfdbfe', icon: Wrench },
  { key: 'Ready for Pickup',  label: 'Ready',        color: '#10b981', bg: '#ecfdf5', border: '#a7f3d0', icon: CheckCircle2 },
  { key: 'Delivered',         label: 'Delivered',    color: '#6366f1', bg: '#eef2ff', border: '#c7d2fe', icon: Truck },
];

const WARRANTY = ['In Warranty', 'Out of Warranty'];

const getStatusCfg = (key) => STATUSES.find((s) => s.key === key) || STATUSES[0];

const NEXT_STATUS = {
  'Pending Diagnosis': 'In Repair',
  'In Repair':         'Ready for Pickup',
  'Ready for Pickup':  'Delivered',
};

// ─── Status Pill ─────────────────────────────────────────────────────────────
const StatusPill = ({ status }) => {
  const cfg = getStatusCfg(status);
  const Icon = cfg.icon;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '5px',
      padding: '4px 10px', borderRadius: '20px',
      background: cfg.bg, border: `1px solid ${cfg.border}`,
      color: cfg.color, fontSize: '0.75rem', fontWeight: 700, whiteSpace: 'nowrap'
    }}>
      <Icon size={12} />{cfg.label}
    </span>
  );
};

// ─── Repair Card ─────────────────────────────────────────────────────────────
const RepairCard = ({ repair, onStatusAdvance, onDelete }) => {
  const next = NEXT_STATUS[repair.repairStatus];
  const nextCfg = next ? getStatusCfg(next) : null;
  const isOverdue =
    repair.estimatedCompletion &&
    repair.repairStatus !== 'Delivered' &&
    new Date(repair.estimatedCompletion) < new Date();

  return (
    <div
      style={{
        background: '#fff', borderRadius: '14px', border: '1px solid #e2e8f0',
        padding: '18px 20px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        display: 'flex', flexDirection: 'column', gap: '14px', transition: 'box-shadow 0.15s ease'
      }}
      onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.09)')}
      onMouseLeave={(e) => (e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)')}
    >
      {/* Top row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.04em' }}>#{repair.id}</span>
            <span style={{
              fontSize: '0.68rem', fontWeight: 600, padding: '2px 7px', borderRadius: '10px',
              background: repair.warrantyStatus === 'In Warranty' ? '#ecfdf5' : '#fef2f2',
              color: repair.warrantyStatus === 'In Warranty' ? '#059669' : '#dc2626',
              border: `1px solid ${repair.warrantyStatus === 'In Warranty' ? '#a7f3d0' : '#fecaca'}`
            }}>
              {repair.warrantyStatus === 'In Warranty' ? '✓ Warranty' : '✗ No Warranty'}
            </span>
            {isOverdue && (
              <span style={{
                fontSize: '0.68rem', fontWeight: 700, padding: '2px 7px', borderRadius: '10px',
                background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca'
              }}>⚠ Overdue</span>
            )}
          </div>
          <div style={{ fontWeight: 700, fontSize: '1rem', color: '#0f172a', marginBottom: '2px' }}>
            {repair.productName || repair.productCode || 'Unknown Product'}
          </div>
          {repair.productCode && repair.productName && (
            <div style={{ fontSize: '0.78rem', color: '#64748b' }}>{repair.productCode}</div>
          )}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
          <StatusPill status={repair.repairStatus} />
          <button
            onClick={() => onDelete(repair.id)}
            title="Delete Job"
            style={{
              background: 'none', border: 'none', cursor: 'pointer', color: '#cbd5e1',
              padding: '2px', display: 'flex', alignItems: 'center', borderRadius: '6px', transition: 'color 0.15s'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#ef4444')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#cbd5e1')}
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      {/* Info row */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#475569', fontSize: '0.83rem' }}>
          <User size={14} style={{ color: '#94a3b8' }} />
          <span style={{ fontWeight: 600 }}>{repair.customerName}</span>
          {repair.customerPhone && (
            <a href={`tel:${repair.customerPhone}`} style={{ color: '#3b82f6', fontWeight: 600, textDecoration: 'none', fontSize: '0.8rem' }}>
              <Phone size={12} style={{ display: 'inline', marginRight: '3px' }} />{repair.customerPhone}
            </a>
          )}
        </div>
        {repair.assignedTechnician && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#475569', fontSize: '0.83rem' }}>
            <User size={14} style={{ color: '#94a3b8' }} />
            <span>Tech: <strong>{repair.assignedTechnician}</strong></span>
          </div>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#475569', fontSize: '0.83rem' }}>
          <Calendar size={14} style={{ color: '#94a3b8' }} />
          <span>Received: <strong>{formatDate(repair.receivedDate)}</strong></span>
        </div>
        {repair.estimatedCompletion && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.83rem',
            color: isOverdue ? '#dc2626' : '#475569', fontWeight: isOverdue ? 700 : 400
          }}>
            <Clock size={14} style={{ color: isOverdue ? '#dc2626' : '#94a3b8' }} />
            <span>ETA: <strong>{formatDate(repair.estimatedCompletion)}</strong></span>
          </div>
        )}
      </div>

      {/* Issue */}
      {repair.issueDescription && (
        <div style={{
          background: '#f8fafc', border: '1px solid #f1f5f9', borderRadius: '8px',
          padding: '10px 12px', fontSize: '0.84rem', color: '#475569', lineHeight: 1.5
        }}>
          <span style={{ fontWeight: 600, color: '#64748b' }}>Issue: </span>{repair.issueDescription}
        </div>
      )}

      {/* Action */}
      {next ? (
        <button
          onClick={() => onStatusAdvance(repair.id, next)}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            padding: '11px 16px', borderRadius: '10px',
            background: nextCfg.bg, border: `1.5px solid ${nextCfg.border}`,
            color: nextCfg.color, fontWeight: 700, fontSize: '0.88rem',
            cursor: 'pointer', transition: 'all 0.15s ease', width: '100%'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = nextCfg.color; e.currentTarget.style.color = '#fff'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = nextCfg.bg; e.currentTarget.style.color = nextCfg.color; }}
        >
          Mark as "{next}" <ChevronRight size={16} />
        </button>
      ) : (
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
          padding: '10px', borderRadius: '10px', background: '#ecfdf5',
          border: '1px solid #a7f3d0', color: '#059669', fontWeight: 700, fontSize: '0.88rem'
        }}>
          <CheckCircle2 size={16} />
          Delivered {repair.actualCompletionDate ? `on ${formatDate(repair.actualCompletionDate)}` : ''}
        </div>
      )}
    </div>
  );
};

// ─── Create Modal ─────────────────────────────────────────────────────────────
const CreateRepairModal = ({ isOpen, onClose, onSubmit, currentUser, selectedCompany }) => {
  const { inventory } = useApp();
  const today = new Date().toISOString().split('T')[0];
  const defaultEta = new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0];

  const blank = {
    customerName: '', customerPhone: '', productCode: '', productName: '',
    issueDescription: '', receivedDate: today, estimatedCompletion: defaultEta,
    assignedTechnician: currentUser?.name || '', warrantyStatus: 'Out of Warranty', brand: selectedCompany || 'AUCO'
  };
  const [form, setForm] = useState(blank);
  const [errors, setErrors] = useState({});

  if (!isOpen) return null;

  const set = (key, val) => {
    setForm((f) => ({ ...f, [key]: val }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: '' }));
    if (key === 'productCode' && val.length >= 3) {
      const match = inventory?.find((p) => p.productCode?.toUpperCase().includes(val.toUpperCase()));
      if (match) setForm((f) => ({ ...f, productCode: val, productName: match.name }));
    }
  };

  const validate = () => {
    const e = {};
    if (!form.customerName.trim()) e.customerName = 'Required';
    if (!form.customerPhone.trim()) e.customerPhone = 'Required';
    if (!form.issueDescription.trim()) e.issueDescription = 'Describe the issue';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(form);
    setForm(blank);
    setErrors({});
    onClose();
  };

  const handleClose = () => { setForm(blank); setErrors({}); onClose(); };

  const inp = (hasError) => ({
    padding: '10px 13px', borderRadius: '8px',
    border: `1.5px solid ${hasError ? '#fca5a5' : '#e2e8f0'}`,
    fontSize: '0.88rem', outline: 'none', background: '#fff', color: '#0f172a',
    fontFamily: 'var(--font-sans)', width: '100%', boxSizing: 'border-box'
  });

  const Field = ({ label, required, error, children }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
      <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#374151' }}>
        {label}{required && <span style={{ color: '#ef4444' }}> *</span>}
      </label>
      {children}
      {error && <span style={{ fontSize: '0.74rem', color: '#ef4444' }}>{error}</span>}
    </div>
  );

  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3000, padding: '16px' }}
      onClick={(e) => e.target === e.currentTarget && handleClose()}
    >
      <div style={{ background: '#fff', borderRadius: '18px', width: '100%', maxWidth: '520px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 24px 64px rgba(0,0,0,0.18)' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px 16px', borderBottom: '1px solid #f1f5f9' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>New Repair Job</h2>
            <p style={{ margin: '2px 0 0', fontSize: '0.8rem', color: '#94a3b8' }}>Log a product return for repair</p>
          </div>
          <button onClick={handleClose} style={{ background: '#f1f5f9', border: 'none', borderRadius: '8px', padding: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#64748b' }}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Customer section */}
          <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '14px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#94a3b8', letterSpacing: '0.06em' }}>CUSTOMER</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <Field label="Customer Name" required error={errors.customerName}>
                <input style={inp(errors.customerName)} placeholder="e.g. Amit Shah" value={form.customerName} onChange={(e) => set('customerName', e.target.value)} />
              </Field>
              <Field label="Phone" required error={errors.customerPhone}>
                <input style={inp(errors.customerPhone)} placeholder="9876543210" value={form.customerPhone} onChange={(e) => set('customerPhone', e.target.value)} />
              </Field>
            </div>
          </div>

          {/* Product section */}
          <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '14px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#94a3b8', letterSpacing: '0.06em' }}>PRODUCT</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <Field label="Product Code">
                <input style={inp(false)} placeholder="AUC-INV-001" value={form.productCode} onChange={(e) => set('productCode', e.target.value)} />
              </Field>
              <Field label="Product Name">
                <input style={inp(false)} placeholder="Auto-filled or type" value={form.productName} onChange={(e) => set('productName', e.target.value)} />
              </Field>
            </div>
            <Field label="Warranty">
              <div style={{ display: 'flex', gap: '8px' }}>
                {WARRANTY.map((w) => (
                  <button type="button" key={w} onClick={() => set('warrantyStatus', w)} style={{
                    flex: 1, padding: '9px', borderRadius: '8px',
                    border: `2px solid ${form.warrantyStatus === w ? (w === 'In Warranty' ? '#10b981' : '#f59e0b') : '#e2e8f0'}`,
                    background: form.warrantyStatus === w ? (w === 'In Warranty' ? '#ecfdf5' : '#fffbeb') : '#fff',
                    color: form.warrantyStatus === w ? (w === 'In Warranty' ? '#059669' : '#d97706') : '#64748b',
                    fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer', transition: 'all 0.15s'
                  }}>
                    {w === 'In Warranty' ? '✓ In Warranty' : '✗ No Warranty'}
                  </button>
                ))}
              </div>
            </Field>
          </div>

          {/* Issue */}
          <Field label="Issue Description" required error={errors.issueDescription}>
            <textarea style={{ ...inp(errors.issueDescription), minHeight: '80px', resize: 'vertical', lineHeight: 1.5 }}
              placeholder="What is wrong with the product?"
              value={form.issueDescription} onChange={(e) => set('issueDescription', e.target.value)}
            />
          </Field>

          {/* Dates + Technician */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
            <Field label="Received On">
              <input type="date" style={inp(false)} value={form.receivedDate} onChange={(e) => set('receivedDate', e.target.value)} />
            </Field>
            <Field label="Expected By">
              <input type="date" style={inp(false)} value={form.estimatedCompletion} onChange={(e) => set('estimatedCompletion', e.target.value)} />
            </Field>
            <Field label="Technician">
              <input style={inp(false)} placeholder="Assigned to" value={form.assignedTechnician} onChange={(e) => set('assignedTechnician', e.target.value)} />
            </Field>
          </div>

          <button type="submit" style={{
            marginTop: '4px', padding: '13px', borderRadius: '10px',
            background: 'linear-gradient(135deg, #4f46e5, #6366f1)',
            color: '#fff', fontWeight: 800, fontSize: '0.95rem',
            border: 'none', cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(79,70,229,0.35)'
          }}>
            + Log Repair Job
          </button>
        </form>
      </div>
    </div>
  );
};

// ─── Main View ────────────────────────────────────────────────────────────────
export const RepairView = () => {
  const { repairs, createRepair, updateRepair, deleteRepair, selectedCompany, matchesCompany, currentUser } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const scopedRepairs = repairs.filter(matchesCompany);

  const counts = {
    ALL: scopedRepairs.length,
    'Pending Diagnosis': scopedRepairs.filter((r) => r.repairStatus === 'Pending Diagnosis').length,
    'In Repair':         scopedRepairs.filter((r) => r.repairStatus === 'In Repair').length,
    'Ready for Pickup':  scopedRepairs.filter((r) => r.repairStatus === 'Ready for Pickup').length,
    'Delivered':         scopedRepairs.filter((r) => r.repairStatus === 'Delivered').length,
  };

  const activeJobs = counts['Pending Diagnosis'] + counts['In Repair'] + counts['Ready for Pickup'];

  const filtered = scopedRepairs.filter((r) => {
    const matchesFilter = activeFilter === 'ALL' || r.repairStatus === activeFilter;
    const q = searchQuery.toLowerCase();
    const matchesSearch = !q ||
      r.customerName.toLowerCase().includes(q) ||
      r.customerPhone.includes(q) ||
      (r.productCode || '').toLowerCase().includes(q) ||
      (r.productName || '').toLowerCase().includes(q) ||
      r.id.toLowerCase().includes(q);
    return matchesFilter && matchesSearch;
  });

  const handleDelete = (id) => { if (window.confirm('Remove this repair job?')) deleteRepair(id); };
  const handleStatusAdvance = (id, next) => updateRepair(id, { repairStatus: next });
  const handleSubmit = (formData) => createRepair({ ...formData, brand: selectedCompany });

  const tabs = [
    { key: 'ALL',               label: 'All Jobs' },
    { key: 'Pending Diagnosis', label: 'Diagnosing' },
    { key: 'In Repair',         label: 'In Repair' },
    { key: 'Ready for Pickup',  label: 'Ready' },
    { key: 'Delivered',         label: 'Delivered' },
  ];

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1000px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Wrench size={26} style={{ color: '#4f46e5' }} /> Repair Jobs
          </h1>
          <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '0.88rem' }}>
            {activeJobs > 0 ? `${activeJobs} job${activeJobs !== 1 ? 's' : ''} active` : 'No active repair jobs'}
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px', padding: '11px 20px', borderRadius: '10px',
            background: 'linear-gradient(135deg, #4f46e5, #6366f1)', color: '#fff', fontWeight: 700,
            fontSize: '0.9rem', border: 'none', cursor: 'pointer', boxShadow: '0 4px 14px rgba(79,70,229,0.3)', flexShrink: 0
          }}
        >
          <Plus size={18} /> New Repair Job
        </button>
      </div>

      {/* KPI Strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
        {[
          { label: 'Diagnosing', count: counts['Pending Diagnosis'], color: '#f59e0b', bg: '#fffbeb', icon: AlertCircle },
          { label: 'In Repair',  count: counts['In Repair'],         color: '#3b82f6', bg: '#eff6ff', icon: Wrench },
          { label: 'Ready',      count: counts['Ready for Pickup'],  color: '#10b981', bg: '#ecfdf5', icon: CheckCircle2 },
          { label: 'Delivered',  count: counts['Delivered'],         color: '#6366f1', bg: '#eef2ff', icon: Truck },
        ].map(({ label, count, color, bg, icon: Icon }) => (
          <div key={label} style={{ background: bg, border: `1.5px solid ${color}30`, borderRadius: '12px', padding: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
              <Icon size={14} style={{ color }} />
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color }}>{label}</span>
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.1 }}>{count}</div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#fff', border: '1.5px solid #e2e8f0', borderRadius: '10px', padding: '0 14px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
        <Search size={16} style={{ color: '#94a3b8', flexShrink: 0 }} />
        <input
          placeholder="Search by customer, product, or job ID…"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ flex: 1, border: 'none', outline: 'none', padding: '12px 0', fontSize: '0.88rem', color: '#0f172a', background: 'transparent', fontFamily: 'var(--font-sans)' }}
        />
        {searchQuery && (
          <button onClick={() => setSearchQuery('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: '2px', display: 'flex' }}>
            <X size={14} />
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
        {tabs.map((tab) => {
          const isActive = activeFilter === tab.key;
          const cfg = tab.key === 'ALL' ? null : getStatusCfg(tab.key);
          return (
            <button
              key={tab.key}
              onClick={() => setActiveFilter(tab.key)}
              style={{
                padding: '7px 16px', borderRadius: '20px',
                border: `1.5px solid ${isActive ? (cfg?.color || '#4f46e5') : '#e2e8f0'}`,
                background: isActive ? (cfg?.bg || '#eef2ff') : '#fff',
                color: isActive ? (cfg?.color || '#4f46e5') : '#64748b',
                fontWeight: isActive ? 700 : 500, fontSize: '0.83rem', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '6px', transition: 'all 0.15s'
              }}
            >
              {tab.label}
              {counts[tab.key] > 0 && (
                <span style={{
                  background: isActive ? (cfg?.color || '#4f46e5') : '#e2e8f0',
                  color: isActive ? '#fff' : '#64748b',
                  borderRadius: '10px', padding: '0 6px', fontSize: '0.72rem', fontWeight: 700, minWidth: '18px', textAlign: 'center'
                }}>
                  {counts[tab.key]}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Cards */}
      {filtered.length === 0 ? (
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          gap: '14px', padding: '60px 24px', background: '#f8fafc', borderRadius: '16px',
          border: '1.5px dashed #e2e8f0', color: '#94a3b8', textAlign: 'center'
        }}>
          <ClipboardList size={40} style={{ opacity: 0.4 }} />
          <div>
            <div style={{ fontWeight: 700, fontSize: '1rem', color: '#64748b', marginBottom: '4px' }}>
              {searchQuery || activeFilter !== 'ALL' ? 'No matching jobs found' : 'No repair jobs yet'}
            </div>
            <div style={{ fontSize: '0.84rem' }}>
              {searchQuery || activeFilter !== 'ALL' ? 'Try a different filter or clear search' : 'Click "New Repair Job" to log the first one'}
            </div>
          </div>
          {!searchQuery && activeFilter === 'ALL' && (
            <button onClick={() => setIsModalOpen(true)} style={{
              padding: '10px 20px', borderRadius: '10px', background: '#4f46e5',
              color: '#fff', fontWeight: 700, fontSize: '0.88rem', border: 'none', cursor: 'pointer', marginTop: '4px'
            }}>
              + New Repair Job
            </button>
          )}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filtered.map((repair) => (
            <RepairCard key={repair.id} repair={repair} onStatusAdvance={handleStatusAdvance} onDelete={handleDelete} />
          ))}
        </div>
      )}

      <CreateRepairModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        currentUser={currentUser}
        selectedCompany={selectedCompany}
      />
    </div>
  );
};
