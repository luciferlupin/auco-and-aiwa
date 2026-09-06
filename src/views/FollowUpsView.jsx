import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  CalendarClock,
  Plus,
  Search,
  MessageSquare,
  Phone,
  Video,
  Mail,
  CheckCircle2,
  AlertCircle,
  Clock,
  Trash2,
  X,
  User,
  ArrowRight
} from 'lucide-react';
import { formatDate, getWhatsAppUrl } from '../utils/formatters';

// ─── Channel config ───────────────────────────────────────────────────────────
const CHANNELS = {
  WhatsApp: { icon: MessageSquare, color: '#16a34a', bg: '#f0fdf4', border: '#86efac', label: 'WhatsApp' },
  Call:     { icon: Phone,        color: '#2563eb', bg: '#eff6ff', border: '#93c5fd', label: 'Call' },
  Meeting:  { icon: Video,        color: '#9333ea', bg: '#faf5ff', border: '#d8b4fe', label: 'Meeting' },
  Email:    { icon: Mail,         color: '#d97706', bg: '#fffbeb', border: '#fde68a', label: 'Email' },
};
const getCh = (type) => CHANNELS[type] || { icon: CalendarClock, color: '#64748b', bg: '#f8fafc', border: '#e2e8f0', label: type };

// ─── Status config ────────────────────────────────────────────────────────────
const STATUS_CFG = {
  Pending:   { color: '#d97706', bg: '#fffbeb', border: '#fde68a', label: '⏳ Pending' },
  Missed:    { color: '#dc2626', bg: '#fef2f2', border: '#fecaca', label: '⚠ Missed' },
  Completed: { color: '#059669', bg: '#ecfdf5', border: '#a7f3d0', label: '✓ Done' },
};
const getSCfg = (s) => STATUS_CFG[s] || STATUS_CFG.Pending;

// ─── Follow-up Card ───────────────────────────────────────────────────────────
const FollowCard = ({ flw, onUpdate, onDelete, resolvedPhone }) => {
  const ch = getCh(flw.followUpType);
  const sc = getSCfg(flw.status);
  const Icon = ch.icon;
  const isCompleted = flw.status === 'Completed';
  const isMissed = flw.status === 'Missed';
  const whatsappUrl = resolvedPhone
    ? getWhatsAppUrl(resolvedPhone, `Hello ${flw.clientName}, following up from ${flw.brand === 'AIWA' ? 'Aiwa India' : 'Auco Automation'} on our scheduled discussion.`)
    : null;

  return (
    <div
      style={{
        background: '#fff', borderRadius: '14px',
        border: `1px solid ${isMissed ? '#fecaca' : isCompleted ? '#a7f3d0' : '#e2e8f0'}`,
        padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: '14px',
        boxShadow: isMissed ? '0 2px 8px rgba(220,38,38,0.06)' : '0 2px 8px rgba(0,0,0,0.04)',
        transition: 'box-shadow 0.15s', opacity: isCompleted ? 0.8 : 1
      }}
      onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.09)')}
      onMouseLeave={(e) => (e.currentTarget.style.boxShadow = isMissed ? '0 2px 8px rgba(220,38,38,0.06)' : '0 2px 8px rgba(0,0,0,0.04)')}
    >
      {/* Top row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: '1rem', color: '#0f172a' }}>{flw.clientName}</div>
          {flw.contactPerson && (
            <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '1px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <User size={11} style={{ color: '#94a3b8' }} /> {flw.contactPerson}
            </div>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Channel pill */}
          <span style={{
            display: 'flex', alignItems: 'center', gap: '5px',
            padding: '4px 10px', borderRadius: '20px', fontWeight: 700, fontSize: '0.75rem',
            background: ch.bg, border: `1px solid ${ch.border}`, color: ch.color
          }}>
            <Icon size={12} /> {ch.label}
          </span>
          {/* Status pill */}
          <span style={{
            padding: '4px 10px', borderRadius: '20px', fontWeight: 700, fontSize: '0.75rem',
            background: sc.bg, border: `1px solid ${sc.border}`, color: sc.color
          }}>
            {sc.label}
          </span>
          <button onClick={() => onDelete(flw)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#cbd5e1', padding: '2px', display: 'flex', borderRadius: '6px', transition: 'color 0.15s' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#ef4444')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#cbd5e1')}>
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      {/* Notes */}
      {flw.notes && (
        <div style={{ fontSize: '0.85rem', color: '#374151', lineHeight: 1.55, background: '#f8fafc', padding: '10px 14px', borderRadius: '9px', border: '1px solid #f1f5f9' }}>
          {flw.notes}
        </div>
      )}

      {/* Next action */}
      {flw.nextAction && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: '#4f46e5', fontWeight: 600 }}>
          <ArrowRight size={13} style={{ flexShrink: 0 }} />
          Next: {flw.nextAction}
        </div>
      )}

      {/* Meta row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap', fontSize: '0.82rem', color: '#64748b' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontWeight: isMissed ? 700 : 400, color: isMissed ? '#dc2626' : '#64748b' }}>
          <CalendarClock size={13} style={{ color: isMissed ? '#dc2626' : '#94a3b8' }} />
          {formatDate(flw.followUpDate)}
          {isMissed && <span style={{ fontSize: '0.7rem', background: '#fef2f2', color: '#dc2626', padding: '1px 6px', borderRadius: '8px', border: '1px solid #fecaca' }}>Past Due</span>}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <User size={13} style={{ color: '#94a3b8' }} />
          {flw.assignedSalesperson}
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '8px' }}>
        {/* Status toggle buttons */}
        {!isCompleted ? (
          <>
            <button onClick={() => onUpdate(flw.id, { status: 'Completed' })} style={{
              flex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px',
              padding: '11px', borderRadius: '10px',
              background: 'linear-gradient(135deg,#059669,#10b981)', color: '#fff', fontWeight: 700, fontSize: '0.9rem',
              border: 'none', cursor: 'pointer', boxShadow: '0 4px 12px rgba(16,185,129,0.25)', transition: 'transform 0.1s'
            }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; }}>
              <CheckCircle2 size={16} /> Mark Done
            </button>
            {flw.status !== 'Missed' && (
              <button onClick={() => onUpdate(flw.id, { status: 'Missed' })} style={{
                padding: '11px 14px', borderRadius: '10px',
                background: '#fef2f2', border: '1.5px solid #fecaca',
                color: '#dc2626', fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer'
              }}>Miss</button>
            )}
          </>
        ) : (
          <div style={{
            flex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
            padding: '11px', borderRadius: '10px', background: '#ecfdf5',
            border: '1px solid #a7f3d0', color: '#059669', fontWeight: 700, fontSize: '0.88rem'
          }}>
            <CheckCircle2 size={16} /> Completed
          </div>
        )}

        {/* WhatsApp button */}
        {whatsappUrl ? (
          <a href={whatsappUrl} target="_blank" rel="noreferrer" style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
            padding: '11px 14px', borderRadius: '10px',
            background: '#ecfdf5', border: '1.5px solid #86efac',
            color: '#16a34a', fontWeight: 700, fontSize: '0.86rem', textDecoration: 'none',
            transition: 'all 0.15s'
          }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#dcfce7'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = '#ecfdf5'; }}>
            <MessageSquare size={15} /> WhatsApp
          </a>
        ) : (
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '11px 14px', borderRadius: '10px', background: '#f8fafc',
            border: '1.5px solid #e2e8f0', color: '#cbd5e1', fontSize: '0.82rem'
          }}>
            <MessageSquare size={15} />
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Add Modal ────────────────────────────────────────────────────────────────
const AddModal = ({ onClose, onSubmit, currentUser, selectedCompany }) => {
  const [data, setData] = useState({
    clientName: '', brand: selectedCompany || 'AUCO', phone: '',
    assignedSalesperson: currentUser.name,
    followUpDate: new Date().toISOString().split('T')[0],
    followUpType: 'WhatsApp', notes: '', nextAction: '', status: 'Pending'
  });
  const CHANNEL_OPTS = ['WhatsApp', 'Call', 'Meeting', 'Email'];
  const inp = { padding: '10px 13px', borderRadius: '8px', border: '1.5px solid #e2e8f0', fontSize: '0.88rem', outline: 'none', background: '#fff', color: '#0f172a', fontFamily: 'var(--font-sans)', width: '100%', boxSizing: 'border-box' };
  const Field = ({ label, required, children }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
      <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#374151' }}>{label}{required && <span style={{ color: '#ef4444' }}> *</span>}</label>
      {children}
    </div>
  );

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3000, padding: '16px' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={{ background: '#fff', borderRadius: '18px', width: '100%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 24px 64px rgba(0,0,0,0.18)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px 16px', borderBottom: '1px solid #f1f5f9' }}>
          <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>New Follow-Up</h2>
          <button onClick={onClose} style={{ background: '#f1f5f9', border: 'none', borderRadius: '8px', padding: '6px', cursor: 'pointer', display: 'flex', color: '#64748b' }}><X size={18} /></button>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); if (!data.clientName) return; onSubmit(data); onClose(); }}
          style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>

          <Field label="Client / Company Name" required>
            <input style={inp} required placeholder="e.g. Mehta Precision Engineering" value={data.clientName} onChange={(e) => setData({ ...data, clientName: e.target.value })} />
          </Field>

          {/* Channel type as pill buttons */}
          <Field label="Channel">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
              {CHANNEL_OPTS.map((c) => {
                const cfg = getCh(c);
                const CI = cfg.icon;
                return (
                  <button type="button" key={c} onClick={() => setData({ ...data, followUpType: c })} style={{
                    padding: '9px 6px', borderRadius: '9px', fontWeight: data.followUpType === c ? 700 : 500, fontSize: '0.8rem',
                    border: `2px solid ${data.followUpType === c ? cfg.color : '#e2e8f0'}`,
                    background: data.followUpType === c ? cfg.bg : '#fff',
                    color: data.followUpType === c ? cfg.color : '#64748b', cursor: 'pointer',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', transition: 'all 0.15s'
                  }}>
                    <CI size={16} />
                    {c}
                  </button>
                );
              })}
            </div>
          </Field>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <Field label="Scheduled Date" required>
              <input type="date" style={inp} required value={data.followUpDate} onChange={(e) => setData({ ...data, followUpDate: e.target.value })} />
            </Field>
            <Field label="Phone (for WhatsApp)">
              <input style={inp} placeholder="+91 98220 14589" value={data.phone} onChange={(e) => setData({ ...data, phone: e.target.value })} />
            </Field>
          </div>

          <Field label="Assigned Rep">
            <input style={inp} value={data.assignedSalesperson} onChange={(e) => setData({ ...data, assignedSalesperson: e.target.value })} />
          </Field>

          <Field label="Notes / Agenda" required>
            <textarea required style={{ ...inp, height: '80px', resize: 'vertical' }}
              placeholder="What will you discuss? Quote follow-up, demo, payment..." value={data.notes}
              onChange={(e) => setData({ ...data, notes: e.target.value })} />
          </Field>

          <Field label="Next Action">
            <input style={inp} placeholder="e.g. Send pricing sheet" value={data.nextAction} onChange={(e) => setData({ ...data, nextAction: e.target.value })} />
          </Field>

          <button type="submit" style={{
            marginTop: '4px', padding: '13px', borderRadius: '10px',
            background: 'linear-gradient(135deg,#4f46e5,#6366f1)', color: '#fff',
            fontWeight: 800, fontSize: '0.95rem', border: 'none', cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(79,70,229,0.3)'
          }}>Save Follow-Up</button>
        </form>
      </div>
    </div>
  );
};

// ─── Main View ────────────────────────────────────────────────────────────────
export const FollowUpsView = () => {
  const { followUps, addFollowUp, updateFollowUp, deleteFollowUp, clients, leads, currentUser, selectedCompany, matchesCompany } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [showAddModal, setShowAddModal] = useState(false);

  const scopedFollowUps = followUps.filter(matchesCompany);
  const pendingCount   = scopedFollowUps.filter((f) => f.status === 'Pending').length;
  const missedCount    = scopedFollowUps.filter((f) => f.status === 'Missed').length;
  const completedCount = scopedFollowUps.filter((f) => f.status === 'Completed').length;

  const filtered = scopedFollowUps.filter((f) => {
    const q = searchQuery.toLowerCase();
    const matchSearch = !q || f.clientName.toLowerCase().includes(q) || (f.contactPerson || '').toLowerCase().includes(q) || (f.notes || '').toLowerCase().includes(q);
    const matchStatus = statusFilter === 'ALL' || f.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const resolvePhone = (flw) =>
    flw.phone ||
    clients.find((c) => c.companyName === flw.clientName || c.clientName === flw.clientName)?.phone ||
    leads.find((l) => l.company === flw.clientName || l.client === flw.clientName)?.phone;

  const handleDelete = (flw) => {
    if (window.confirm(`Delete follow-up with "${flw.clientName}"?`)) deleteFollowUp(flw.id);
  };

  const STATUS_TABS = [
    { key: 'ALL',       label: 'All' },
    { key: 'Missed',    label: '⚠ Missed' },
    { key: 'Pending',   label: '⏳ Pending' },
    { key: 'Completed', label: '✓ Done' },
  ];

  // Sort: missed first, then pending by date, then completed
  const sortedFiltered = [...filtered].sort((a, b) => {
    const order = { Missed: 0, Pending: 1, Completed: 2 };
    if (order[a.status] !== order[b.status]) return order[a.status] - order[b.status];
    return new Date(a.followUpDate) - new Date(b.followUpDate);
  });

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '800px', margin: '0 auto' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <CalendarClock size={26} style={{ color: '#4f46e5' }} /> Follow-Ups
          </h1>
          <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '0.88rem' }}>
            {missedCount > 0
              ? `⚠ ${missedCount} missed — call them now`
              : pendingCount > 0 ? `${pendingCount} upcoming follow-up${pendingCount > 1 ? 's' : ''}` : 'All follow-ups complete'}
          </p>
        </div>
        <button onClick={() => setShowAddModal(true)} style={{
          display: 'flex', alignItems: 'center', gap: '8px', padding: '11px 20px', borderRadius: '10px',
          background: 'linear-gradient(135deg,#4f46e5,#6366f1)', color: '#fff', fontWeight: 700,
          fontSize: '0.9rem', border: 'none', cursor: 'pointer', boxShadow: '0 4px 14px rgba(79,70,229,0.3)', flexShrink: 0
        }}>
          <Plus size={18} /> New Follow-Up
        </button>
      </div>

      {/* KPI strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '12px' }}>
        {[
          { label: 'Pending',   value: pendingCount,   color: '#d97706', bg: '#fffbeb', icon: Clock },
          { label: 'Missed',    value: missedCount,    color: missedCount > 0 ? '#dc2626' : '#059669', bg: missedCount > 0 ? '#fef2f2' : '#ecfdf5', icon: AlertCircle },
          { label: 'Completed', value: completedCount, color: '#059669', bg: '#ecfdf5', icon: CheckCircle2 },
        ].map(({ label, value, color, bg, icon: Icon }) => (
          <div key={label} style={{ background: bg, border: `1.5px solid ${color}25`, borderRadius: '12px', padding: '16px', cursor: 'pointer' }}
            onClick={() => setStatusFilter(label === statusFilter ? 'ALL' : label)}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
              <Icon size={14} style={{ color }} />
              <span style={{ fontSize: '0.74rem', fontWeight: 600, color }}>{label}</span>
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', lineHeight: 1 }}>{value}</div>
          </div>
        ))}
      </div>

      {/* Missed alert banner */}
      {missedCount > 0 && (
        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '12px', padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <AlertCircle size={18} style={{ color: '#dc2626', flexShrink: 0 }} />
          <div>
            <div style={{ fontWeight: 700, color: '#991b1b', fontSize: '0.88rem' }}>Action Required — Missed Follow-Ups</div>
            <div style={{ fontSize: '0.8rem', color: '#b91c1c', marginTop: '2px' }}>
              {scopedFollowUps.filter((f) => f.status === 'Missed').map((f) => f.clientName).join(', ')}
            </div>
          </div>
        </div>
      )}

      {/* Search */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#fff', border: '1.5px solid #e2e8f0', borderRadius: '10px', padding: '0 14px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
        <Search size={16} style={{ color: '#94a3b8', flexShrink: 0 }} />
        <input
          placeholder="Search by client, notes, or contact name…"
          value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
          style={{ flex: 1, border: 'none', outline: 'none', padding: '12px 0', fontSize: '0.88rem', color: '#0f172a', background: 'transparent', fontFamily: 'var(--font-sans)' }}
        />
        {searchQuery && <button onClick={() => setSearchQuery('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: '2px', display: 'flex' }}><X size={14} /></button>}
      </div>

      {/* Status filter tabs */}
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
        {STATUS_TABS.map((tab) => {
          const isActive = statusFilter === tab.key;
          const cfg = tab.key !== 'ALL' ? getSCfg(tab.key) : null;
          return (
            <button key={tab.key} onClick={() => setStatusFilter(tab.key)} style={{
              padding: '7px 14px', borderRadius: '20px', fontSize: '0.83rem', cursor: 'pointer',
              border: `1.5px solid ${isActive ? (cfg?.color || '#4f46e5') : '#e2e8f0'}`,
              background: isActive ? (cfg?.bg || '#eef2ff') : '#fff',
              color: isActive ? (cfg?.color || '#4f46e5') : '#64748b',
              fontWeight: isActive ? 700 : 500, transition: 'all 0.15s'
            }}>{tab.label}</button>
          );
        })}
      </div>

      {/* Cards */}
      {sortedFiltered.length === 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', padding: '60px 24px', background: '#f8fafc', borderRadius: '16px', border: '1.5px dashed #e2e8f0', color: '#94a3b8', textAlign: 'center' }}>
          <CalendarClock size={40} style={{ opacity: 0.3 }} />
          <div>
            <div style={{ fontWeight: 700, fontSize: '1rem', color: '#64748b', marginBottom: '4px' }}>No follow-ups here</div>
            <div style={{ fontSize: '0.84rem' }}>Schedule a new follow-up to stay on top of clients</div>
          </div>
          <button onClick={() => setShowAddModal(true)} style={{ padding: '10px 20px', borderRadius: '10px', background: '#4f46e5', color: '#fff', fontWeight: 700, fontSize: '0.88rem', border: 'none', cursor: 'pointer' }}>+ New Follow-Up</button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {sortedFiltered.map((flw) => (
            <FollowCard
              key={flw.id}
              flw={flw}
              resolvedPhone={resolvePhone(flw)}
              onUpdate={updateFollowUp}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Modal */}
      {showAddModal && (
        <AddModal
          onClose={() => setShowAddModal(false)}
          onSubmit={(data) => { addFollowUp(data); }}
          currentUser={currentUser}
          selectedCompany={selectedCompany}
        />
      )}
    </div>
  );
};
