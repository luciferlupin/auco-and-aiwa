import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Building2,
  Plus,
  Search,
  Phone,
  Mail,
  MapPin,
  Calendar,
  ShoppingCart,
  MessageSquare,
  ChevronRight,
  X,
  Edit2,
  Trash2,
  CheckCircle2,
  User,
  IndianRupee,
  ArrowRight
} from 'lucide-react';
import { formatCurrency, formatDate, getStatusBadgeClass, getWhatsAppUrl } from '../utils/formatters';

// ─── Client type config ───────────────────────────────────────────────────────
const TYPE_CFG = {
  'Enterprise':        { color: '#7c3aed', bg: '#f5f3ff' },
  'OEM Partner':       { color: '#0284c7', bg: '#f0f9ff' },
  'SME':               { color: '#0369a1', bg: '#eff6ff' },
  'Distributor':       { color: '#d97706', bg: '#fffbeb' },
  'Government / PSU':  { color: '#059669', bg: '#ecfdf5' },
  'System Integrator': { color: '#4f46e5', bg: '#eef2ff' },
};
const getTCfg = (t) => TYPE_CFG[t] || { color: '#64748b', bg: '#f8fafc' };

// ─── Initials avatar ──────────────────────────────────────────────────────────
const Avatar = ({ name, size = 44 }) => {
  const initials = name ? name.split(' ').filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase() : '?';
  const colors = ['#4f46e5', '#0284c7', '#059669', '#d97706', '#dc2626', '#7c3aed', '#0369a1'];
  const color = colors[name?.charCodeAt(0) % colors.length] || '#4f46e5';
  return (
    <div style={{ width: size, height: size, minWidth: size, borderRadius: '12px', background: color + '18', border: `2px solid ${color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: size * 0.35, fontWeight: 800, color, fontFamily: 'var(--font-sans)', letterSpacing: '-0.5px' }}>
      {initials}
    </div>
  );
};

// ─── Client Card ──────────────────────────────────────────────────────────────
const ClientCard = ({ client, onSelect, onWhatsApp }) => {
  const tc = getTCfg(client.clientType);
  const hasPending = (client.pendingAmount || 0) > 0;

  return (
    <div
      onClick={() => onSelect(client)}
      style={{
        background: '#fff', borderRadius: '14px',
        border: `1px solid ${hasPending ? '#fecaca' : '#e2e8f0'}`,
        padding: '18px 20px', cursor: 'pointer',
        display: 'flex', flexDirection: 'column', gap: '14px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)', transition: 'all 0.15s'
      }}
      onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.09)'; e.currentTarget.style.borderColor = hasPending ? '#fca5a5' : '#c7d2fe'; }}
      onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)'; e.currentTarget.style.borderColor = hasPending ? '#fecaca' : '#e2e8f0'; }}
    >
      {/* Top */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
        <Avatar name={client.companyName} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '2px' }}>
            <span style={{ fontWeight: 700, fontSize: '1rem', color: '#0f172a' }}>{client.companyName}</span>
            <span style={{ padding: '2px 8px', borderRadius: '10px', fontWeight: 600, fontSize: '0.7rem', background: tc.bg, color: tc.color }}>
              {client.clientType}
            </span>
          </div>
          <div style={{ fontSize: '0.78rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <User size={11} style={{ color: '#94a3b8' }} />
            {client.contactPerson}
            {client.phone && <span style={{ color: '#94a3b8' }}>· {client.phone}</span>}
          </div>
          <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <MapPin size={11} style={{ color: '#cbd5e1' }} />
            {client.city}, {client.state}
          </div>
        </div>
        <ChevronRight size={16} style={{ color: '#94a3b8', flexShrink: 0, marginTop: '4px' }} />
      </div>

      {/* Metrics row */}
      <div style={{ display: 'flex', gap: '0', borderRadius: '10px', overflow: 'hidden', border: '1px solid #f1f5f9' }}>
        <div style={{ flex: 1, padding: '9px 12px', background: '#f8fafc', borderRight: '1px solid #f1f5f9', textAlign: 'center' }}>
          <div style={{ fontSize: '0.66rem', color: '#94a3b8', fontWeight: 600, marginBottom: '2px' }}>TOTAL VALUE</div>
          <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#0f172a' }}>{formatCurrency(client.totalBusinessValue)}</div>
        </div>
        <div style={{ flex: 1, padding: '9px 12px', background: hasPending ? '#fef2f2' : '#f0fdf4', borderRight: '1px solid #f1f5f9', textAlign: 'center' }}>
          <div style={{ fontSize: '0.66rem', color: hasPending ? '#dc2626' : '#059669', fontWeight: 600, marginBottom: '2px' }}>PENDING AR</div>
          <div style={{ fontWeight: 800, fontSize: '0.92rem', color: hasPending ? '#dc2626' : '#059669' }}>
            {hasPending ? formatCurrency(client.pendingAmount) : '✓ Settled'}
          </div>
        </div>
        <div style={{ flex: 1, padding: '9px 12px', background: '#f8fafc', textAlign: 'center' }}>
          <div style={{ fontSize: '0.66rem', color: '#94a3b8', fontWeight: 600, marginBottom: '2px' }}>ORDERS</div>
          <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#0f172a' }}>{client.totalOrders || 0}</div>
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '8px' }} onClick={(e) => e.stopPropagation()}>
        <a
          href={getWhatsAppUrl(client.phone, `Hello ${client.contactPerson}, greetings from ${client.brand === 'AIWA' ? 'Aiwa India' : 'Auco Automation'}.`)}
          target="_blank" rel="noreferrer"
          style={{
            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px',
            padding: '10px', borderRadius: '10px',
            background: '#ecfdf5', border: '1.5px solid #86efac',
            color: '#16a34a', fontWeight: 700, fontSize: '0.86rem', textDecoration: 'none', transition: 'all 0.15s'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = '#dcfce7'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = '#ecfdf5'; }}
        >
          <MessageSquare size={15} /> WhatsApp
        </a>
        <a href={`tel:${client.phone}`} style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '10px 14px', borderRadius: '10px',
          background: '#eff6ff', border: '1.5px solid #93c5fd',
          color: '#2563eb', textDecoration: 'none', transition: 'all 0.15s'
        }}>
          <Phone size={15} />
        </a>
        <button onClick={() => onSelect(client)} style={{
          flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
          padding: '10px', borderRadius: '10px',
          background: '#f8fafc', border: '1.5px solid #e2e8f0',
          color: '#475569', fontWeight: 600, fontSize: '0.86rem', cursor: 'pointer', transition: 'all 0.15s'
        }}
          onMouseEnter={(e) => { e.currentTarget.style.background = '#f1f5f9'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = '#f8fafc'; }}>
          View Details <ChevronRight size={13} />
        </button>
      </div>
    </div>
  );
};

// ─── Client Detail Drawer ─────────────────────────────────────────────────────
const ClientDrawer = ({ client, orders, invoices, payments, followUps, onClose, onEdit, onDelete, onNewOrder, updateClient }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [quickNote, setQuickNote] = useState('');
  const clientOrders   = orders.filter((o) => o.clientId === client.id || o.clientName === client.companyName);
  const clientInvoices = invoices.filter((i) => i.clientId === client.id || i.clientName === client.companyName);
  const clientPayments = payments.filter((p) => p.clientId === client.id || p.clientName === client.companyName);
  const clientFollowUps = followUps.filter((f) => f.clientId === client.id || f.clientName === client.companyName);
  const hasPending = (client.pendingAmount || 0) > 0;

  const handleSaveNote = () => {
    if (!quickNote.trim()) return;
    const updated = client.notes ? `${client.notes}\n• [${new Date().toLocaleDateString('en-IN')}] ${quickNote}` : `• [${new Date().toLocaleDateString('en-IN')}] ${quickNote}`;
    updateClient(client.id, { notes: updated });
    setQuickNote('');
  };

  const TABS = [
    { key: 'overview',  label: 'Overview' },
    { key: 'orders',    label: `Orders (${clientOrders.length})` },
    { key: 'invoices',  label: `Invoices (${clientInvoices.length})` },
    { key: 'payments',  label: `Payments (${clientPayments.length})` },
    { key: 'followups', label: `Follow-ups (${clientFollowUps.length})` },
  ];

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 2000, display: 'flex', alignItems: 'stretch', justifyContent: 'flex-end' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={{ width: '100%', maxWidth: '520px', background: '#fff', display: 'flex', flexDirection: 'column', boxShadow: '-8px 0 40px rgba(0,0,0,0.15)', overflowY: 'auto' }}>

        {/* Header */}
        <div style={{ padding: '24px 24px 16px', borderBottom: '1px solid #f1f5f9', background: '#fff' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
            <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start', flex: 1 }}>
              <Avatar name={client.companyName} size={52} />
              <div>
                <div style={{ fontWeight: 800, fontSize: '1.15rem', color: '#0f172a', lineHeight: 1.2 }}>{client.companyName}</div>
                <div style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '4px' }}>{client.contactPerson}</div>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <MapPin size={12} /> {client.city}, {client.state}
                </div>
              </div>
            </div>
            <button onClick={onClose} style={{ background: '#f1f5f9', border: 'none', borderRadius: '8px', padding: '6px', cursor: 'pointer', display: 'flex', color: '#64748b', flexShrink: 0 }}>
              <X size={18} />
            </button>
          </div>

          {/* Metric cells */}
          <div style={{ display: 'flex', gap: '0', borderRadius: '10px', overflow: 'hidden', border: '1px solid #f1f5f9', marginTop: '16px' }}>
            <div style={{ flex: 1, padding: '10px 12px', background: '#eef2ff', textAlign: 'center', borderRight: '1px solid #f1f5f9' }}>
              <div style={{ fontSize: '0.66rem', color: '#4f46e5', fontWeight: 600, marginBottom: '2px' }}>TOTAL VALUE</div>
              <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#4f46e5' }}>{formatCurrency(client.totalBusinessValue)}</div>
            </div>
            <div style={{ flex: 1, padding: '10px 12px', background: hasPending ? '#fef2f2' : '#ecfdf5', textAlign: 'center', borderRight: '1px solid #f1f5f9' }}>
              <div style={{ fontSize: '0.66rem', color: hasPending ? '#dc2626' : '#059669', fontWeight: 600, marginBottom: '2px' }}>PENDING AR</div>
              <div style={{ fontWeight: 800, fontSize: '0.95rem', color: hasPending ? '#dc2626' : '#059669' }}>
                {hasPending ? formatCurrency(client.pendingAmount) : '✓ Settled'}
              </div>
            </div>
            <div style={{ flex: 1, padding: '10px 12px', background: '#f8fafc', textAlign: 'center' }}>
              <div style={{ fontSize: '0.66rem', color: '#94a3b8', fontWeight: 600, marginBottom: '2px' }}>ORDERS</div>
              <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#0f172a' }}>{client.totalOrders || 0}</div>
            </div>
          </div>

          {/* Action bar */}
          <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
            <a href={getWhatsAppUrl(client.phone, `Hello ${client.contactPerson}, following up from ${client.brand === 'AIWA' ? 'Aiwa India' : 'Auco Automation'}.`)}
              target="_blank" rel="noreferrer"
              style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '10px', borderRadius: '9px', background: '#ecfdf5', border: '1.5px solid #86efac', color: '#16a34a', fontWeight: 700, fontSize: '0.83rem', textDecoration: 'none' }}>
              <MessageSquare size={14} /> WhatsApp
            </a>
            <a href={`tel:${client.phone}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10px 14px', borderRadius: '9px', background: '#eff6ff', border: '1.5px solid #93c5fd', color: '#2563eb', textDecoration: 'none' }}>
              <Phone size={14} />
            </a>
            <button onClick={onNewOrder} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '10px', borderRadius: '9px', background: 'linear-gradient(135deg,#4f46e5,#6366f1)', color: '#fff', fontWeight: 700, fontSize: '0.83rem', border: 'none', cursor: 'pointer' }}>
              <ShoppingCart size={14} /> New Order
            </button>
            <button onClick={() => onEdit(client)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10px 14px', borderRadius: '9px', background: '#f8fafc', border: '1.5px solid #e2e8f0', color: '#475569', cursor: 'pointer' }}>
              <Edit2 size={14} />
            </button>
            <button onClick={() => onDelete(client)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10px 14px', borderRadius: '9px', background: '#fef2f2', border: '1.5px solid #fecaca', color: '#dc2626', cursor: 'pointer' }}>
              <Trash2 size={14} />
            </button>
          </div>
        </div>

        {/* Tab strip */}
        <div style={{ display: 'flex', gap: '0', borderBottom: '2px solid #f1f5f9', background: '#fafafa', overflowX: 'auto' }}>
          {TABS.map((tab) => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{
              padding: '12px 16px', whiteSpace: 'nowrap', fontWeight: activeTab === tab.key ? 700 : 500, fontSize: '0.83rem',
              border: 'none', background: 'transparent', cursor: 'pointer', transition: 'all 0.15s',
              color: activeTab === tab.key ? '#4f46e5' : '#64748b',
              borderBottom: activeTab === tab.key ? '2px solid #4f46e5' : '2px solid transparent',
              marginBottom: '-2px'
            }}>{tab.label}</button>
          ))}
        </div>

        {/* Drawer body */}
        <div style={{ flex: 1, padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>

          {/* OVERVIEW */}
          {activeTab === 'overview' && (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '0.83rem' }}>
                {[
                  { label: 'Contact', value: client.contactPerson },
                  { label: 'Phone', value: client.phone },
                  { label: 'Email', value: client.email || '—' },
                  { label: 'Sales Rep', value: client.assignedSalesPerson },
                  { label: 'Payment Terms', value: `${client.paymentTerms || 'Net 30'} (${client.paymentDays || 30} days)` },
                  { label: 'Frequency', value: client.orderFrequency || 'Monthly' },
                  { label: 'Lead Source', value: client.leadSource || '—' },
                  { label: 'Next Order', value: client.nextExpectedOrder ? formatDate(client.nextExpectedOrder) : '—' },
                ].map(({ label, value }) => (
                  <div key={label} style={{ background: '#f8fafc', borderRadius: '8px', padding: '10px 12px', border: '1px solid #f1f5f9' }}>
                    <div style={{ fontSize: '0.68rem', color: '#94a3b8', fontWeight: 600, marginBottom: '3px' }}>{label.toUpperCase()}</div>
                    <div style={{ fontWeight: 600, color: '#0f172a' }}>{value}</div>
                  </div>
                ))}
              </div>

              {/* Notes */}
              <div style={{ background: '#f8fafc', borderRadius: '10px', padding: '14px', border: '1px solid #f1f5f9' }}>
                <div style={{ fontWeight: 700, fontSize: '0.83rem', color: '#374151', marginBottom: '8px' }}>Notes</div>
                <div style={{ fontSize: '0.82rem', color: '#475569', whiteSpace: 'pre-line', lineHeight: 1.55, minHeight: '40px' }}>
                  {client.notes || <span style={{ color: '#94a3b8' }}>No notes yet.</span>}
                </div>
                <div style={{ display: 'flex', gap: '8px', marginTop: '10px', borderTop: '1px solid #f1f5f9', paddingTop: '10px' }}>
                  <input placeholder="Add a quick note…" value={quickNote} onChange={(e) => setQuickNote(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleSaveNote(); }}
                    style={{ flex: 1, padding: '8px 12px', borderRadius: '8px', border: '1.5px solid #e2e8f0', fontSize: '0.84rem', outline: 'none', background: '#fff', fontFamily: 'var(--font-sans)', color: '#0f172a' }} />
                  <button onClick={handleSaveNote} style={{ padding: '8px 14px', borderRadius: '8px', background: '#4f46e5', color: '#fff', fontWeight: 700, fontSize: '0.82rem', border: 'none', cursor: 'pointer' }}>Save</button>
                </div>
              </div>
            </>
          )}

          {/* ORDERS */}
          {activeTab === 'orders' && (
            clientOrders.length === 0
              ? <div style={{ textAlign: 'center', padding: '48px 0', color: '#94a3b8' }}><ShoppingCart size={32} style={{ margin: '0 auto 8px', opacity: 0.3 }} /><div>No orders yet</div></div>
              : clientOrders.map((ord) => (
                <div key={ord.id} style={{ background: '#f8fafc', borderRadius: '10px', padding: '14px 16px', border: '1px solid #f1f5f9' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                    <strong style={{ color: '#4f46e5', fontFamily: 'monospace', fontSize: '0.88rem' }}>{ord.id}</strong>
                    <span style={{ padding: '2px 9px', borderRadius: '10px', fontWeight: 700, fontSize: '0.72rem', background: ord.deliveryStatus === 'Delivered' ? '#ecfdf5' : '#fffbeb', color: ord.deliveryStatus === 'Delivered' ? '#059669' : '#d97706', border: `1px solid ${ord.deliveryStatus === 'Delivered' ? '#a7f3d0' : '#fde68a'}` }}>{ord.deliveryStatus}</span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '6px' }}>
                    {ord.productCode} · {ord.quantity} units · {formatDate(ord.orderDate)}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '6px', borderTop: '1px solid #f1f5f9' }}>
                    <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Rep: {ord.assignedTeamMember}</span>
                    <strong style={{ color: '#4f46e5' }}>{formatCurrency(ord.orderValue)}</strong>
                  </div>
                </div>
              ))
          )}

          {/* INVOICES */}
          {activeTab === 'invoices' && (
            clientInvoices.length === 0
              ? <div style={{ textAlign: 'center', padding: '48px 0', color: '#94a3b8' }}><IndianRupee size={32} style={{ margin: '0 auto 8px', opacity: 0.3 }} /><div>No invoices yet</div></div>
              : clientInvoices.map((inv) => (
                <div key={inv.id} style={{ background: '#f8fafc', borderRadius: '10px', padding: '14px 16px', border: '1px solid #f1f5f9' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <strong style={{ fontFamily: 'monospace', fontSize: '0.88rem', color: '#0f172a' }}>{inv.invoiceNumber}</strong>
                    <span style={{ padding: '2px 9px', borderRadius: '10px', fontWeight: 700, fontSize: '0.72rem', background: inv.paymentStatus === 'Paid' ? '#ecfdf5' : '#fef2f2', color: inv.paymentStatus === 'Paid' ? '#059669' : '#dc2626', border: `1px solid ${inv.paymentStatus === 'Paid' ? '#a7f3d0' : '#fecaca'}` }}>{inv.paymentStatus}</span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '6px' }}>Due: {formatDate(inv.paymentDueDate)} · {inv.paymentTerms}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '6px', borderTop: '1px solid #f1f5f9' }}>
                    <div style={{ fontSize: '0.8rem' }}>Total: <strong>{formatCurrency(inv.totalAmount)}</strong></div>
                    <div style={{ fontSize: '0.8rem', color: inv.balance > 0 ? '#dc2626' : '#059669', fontWeight: 700 }}>
                      {inv.balance > 0 ? `Balance: ${formatCurrency(inv.balance)}` : '✓ Settled'}
                    </div>
                  </div>
                </div>
              ))
          )}

          {/* PAYMENTS */}
          {activeTab === 'payments' && (
            clientPayments.length === 0
              ? <div style={{ textAlign: 'center', padding: '48px 0', color: '#94a3b8' }}><IndianRupee size={32} style={{ margin: '0 auto 8px', opacity: 0.3 }} /><div>No payments yet</div></div>
              : clientPayments.map((p) => (
                <div key={p.id} style={{ background: '#f8fafc', borderRadius: '10px', padding: '14px 16px', border: '1px solid #f1f5f9' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <strong style={{ fontFamily: 'monospace', fontSize: '0.88rem', color: '#0f172a' }}>{p.invoiceNumber}</strong>
                    <span style={{ fontSize: '0.78rem', color: '#64748b' }}>{p.paymentMode}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '6px', borderTop: '1px solid #f1f5f9' }}>
                    <div style={{ fontSize: '0.82rem', color: '#059669', fontWeight: 700 }}>Paid: {formatCurrency(p.amountPaid)}</div>
                    <div style={{ fontSize: '0.82rem', color: p.balance > 0 ? '#dc2626' : '#059669', fontWeight: 700 }}>
                      {p.balance > 0 ? `Bal: ${formatCurrency(p.balance)}` : '✓ Clear'}
                    </div>
                  </div>
                </div>
              ))
          )}

          {/* FOLLOW-UPS */}
          {activeTab === 'followups' && (
            clientFollowUps.length === 0
              ? <div style={{ textAlign: 'center', padding: '48px 0', color: '#94a3b8' }}><Calendar size={32} style={{ margin: '0 auto 8px', opacity: 0.3 }} /><div>No follow-ups yet</div></div>
              : clientFollowUps.map((flw) => (
                <div key={flw.id} style={{ background: '#f8fafc', borderRadius: '10px', padding: '14px 16px', border: '1px solid #f1f5f9' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.82rem', color: '#4f46e5' }}>{flw.followUpType}</span>
                    <span style={{ padding: '2px 9px', borderRadius: '10px', fontWeight: 700, fontSize: '0.72rem', background: flw.status === 'Completed' ? '#ecfdf5' : flw.status === 'Missed' ? '#fef2f2' : '#fffbeb', color: flw.status === 'Completed' ? '#059669' : flw.status === 'Missed' ? '#dc2626' : '#d97706' }}>{flw.status}</span>
                  </div>
                  <div style={{ fontSize: '0.83rem', color: '#374151', marginBottom: '6px' }}>{flw.notes}</div>
                  <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>📅 {formatDate(flw.followUpDate)} · {flw.assignedSalesperson}</div>
                </div>
              ))
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Edit Modal ───────────────────────────────────────────────────────────────
const EditModal = ({ client, onClose, onSave }) => {
  const [form, setForm] = useState({
    companyName: client.companyName || '',
    contactPerson: client.contactPerson || '',
    phone: client.phone || '',
    email: client.email || '',
    city: client.city || '',
    state: client.state || '',
    clientType: client.clientType || 'Enterprise',
    clientStatus: client.clientStatus || 'Active',
    paymentTerms: client.paymentTerms || 'Net 30'
  });
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
      <div style={{ background: '#fff', borderRadius: '18px', width: '100%', maxWidth: '520px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 24px 64px rgba(0,0,0,0.18)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px 16px', borderBottom: '1px solid #f1f5f9' }}>
          <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>Edit Client — {client.companyName}</h2>
          <button onClick={onClose} style={{ background: '#f1f5f9', border: 'none', borderRadius: '8px', padding: '6px', cursor: 'pointer', display: 'flex', color: '#64748b' }}><X size={18} /></button>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); onSave(client.id, form); onClose(); }}
          style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <Field label="Company Name" required><input style={inp} required value={form.companyName} onChange={(e) => setForm({ ...form, companyName: e.target.value })} /></Field>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <Field label="Contact Person" required><input style={inp} required value={form.contactPerson} onChange={(e) => setForm({ ...form, contactPerson: e.target.value })} /></Field>
            <Field label="Phone" required><input style={inp} required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></Field>
          </div>
          <Field label="Email"><input type="email" style={inp} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></Field>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <Field label="City" required><input style={inp} required value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} /></Field>
            <Field label="State" required><input style={inp} required value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} /></Field>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <Field label="Client Type">
              <select style={inp} value={form.clientType} onChange={(e) => setForm({ ...form, clientType: e.target.value })}>
                {['Enterprise','OEM Partner','Government / PSU','System Integrator','Distributor','SME'].map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </Field>
            <Field label="Payment Terms">
              <select style={inp} value={form.paymentTerms} onChange={(e) => setForm({ ...form, paymentTerms: e.target.value })}>
                {['Immediate','Net 15','Net 30','Net 45','Net 60'].map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </Field>
          </div>
          <button type="submit" style={{ marginTop: '4px', padding: '13px', borderRadius: '10px', background: 'linear-gradient(135deg,#4f46e5,#6366f1)', color: '#fff', fontWeight: 800, fontSize: '0.95rem', border: 'none', cursor: 'pointer', boxShadow: '0 4px 14px rgba(79,70,229,0.3)' }}>Save Changes</button>
        </form>
      </div>
    </div>
  );
};

// ─── Main View ────────────────────────────────────────────────────────────────
export const ClientsView = ({ onOpenClientModal, onOpenOrderModal }) => {
  const { clients, orders, invoices, payments, followUps, updateClient, deleteClient, selectedCompany, matchesCompany } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [selectedClient, setSelectedClient] = useState(null);
  const [editingClient, setEditingClient] = useState(null);

  const scopedClients = clients.filter(matchesCompany);
  const totalAR = scopedClients.reduce((a, c) => a + Number(c.pendingAmount || 0), 0);
  const totalValue = scopedClients.reduce((a, c) => a + Number(c.totalBusinessValue || 0), 0);
  const clientsWithAR = scopedClients.filter((c) => (c.pendingAmount || 0) > 0).length;

  const filteredClients = scopedClients.filter((c) => {
    const q = searchQuery.toLowerCase();
    const matchSearch = !q || c.companyName.toLowerCase().includes(q) || c.clientName.toLowerCase().includes(q) || c.contactPerson.toLowerCase().includes(q) || c.city.toLowerCase().includes(q) || c.phone.includes(q);
    const matchType = typeFilter === 'ALL' || c.clientType === typeFilter;
    return matchSearch && matchType;
  });

  const CLIENT_TYPES = Array.from(new Set(scopedClients.map((c) => c.clientType).filter(Boolean)));

  const handleDelete = (client) => {
    if (window.confirm(`Delete client "${client.companyName}"?`)) {
      deleteClient(client.id);
      if (selectedClient?.id === client.id) setSelectedClient(null);
    }
  };

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1000px', margin: '0 auto' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Building2 size={26} style={{ color: '#4f46e5' }} /> Client Directory
          </h1>
          <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '0.88rem' }}>
            {scopedClients.length} clients · {clientsWithAR > 0 ? `${clientsWithAR} with pending payments` : 'all accounts settled'}
          </p>
        </div>
        <button onClick={onOpenClientModal} style={{
          display: 'flex', alignItems: 'center', gap: '8px', padding: '11px 20px', borderRadius: '10px',
          background: 'linear-gradient(135deg,#4f46e5,#6366f1)', color: '#fff', fontWeight: 700,
          fontSize: '0.9rem', border: 'none', cursor: 'pointer', boxShadow: '0 4px 14px rgba(79,70,229,0.3)', flexShrink: 0
        }}>
          <Plus size={18} /> New Client
        </button>
      </div>

      {/* KPI strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '12px' }}>
        {[
          { label: 'Total Clients', value: scopedClients.length, color: '#4f46e5', bg: '#eef2ff', fmt: (v) => v },
          { label: 'Portfolio Value', value: formatCurrency(totalValue), color: '#059669', bg: '#ecfdf5', fmt: (v) => v },
          { label: 'Pending AR', value: totalAR, color: clientsWithAR > 0 ? '#dc2626' : '#059669', bg: clientsWithAR > 0 ? '#fef2f2' : '#ecfdf5', fmt: (v) => v > 0 ? formatCurrency(v) : '✓ All Settled' },
        ].map(({ label, value, color, bg, fmt }) => (
          <div key={label} style={{ background: bg, border: `1.5px solid ${color}25`, borderRadius: '12px', padding: '16px' }}>
            <div style={{ fontSize: '0.74rem', fontWeight: 600, color, marginBottom: '6px' }}>{label}</div>
            <div style={{ fontSize: typeof value === 'string' ? '1rem' : '2rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.1 }}>{fmt(value)}</div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#fff', border: '1.5px solid #e2e8f0', borderRadius: '10px', padding: '0 14px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
        <Search size={16} style={{ color: '#94a3b8', flexShrink: 0 }} />
        <input
          placeholder="Search by company, contact, city, or phone…"
          value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
          style={{ flex: 1, border: 'none', outline: 'none', padding: '12px 0', fontSize: '0.88rem', color: '#0f172a', background: 'transparent', fontFamily: 'var(--font-sans)' }}
        />
        {searchQuery && <button onClick={() => setSearchQuery('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: '2px', display: 'flex' }}><X size={14} /></button>}
      </div>

      {/* Type filter pills */}
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
        {['ALL', ...CLIENT_TYPES].map((type) => {
          const isActive = typeFilter === type;
          const cfg = type !== 'ALL' ? getTCfg(type) : null;
          return (
            <button key={type} onClick={() => setTypeFilter(type)} style={{
              padding: '7px 14px', borderRadius: '20px', fontSize: '0.83rem', cursor: 'pointer',
              border: `1.5px solid ${isActive ? (cfg?.color || '#4f46e5') : '#e2e8f0'}`,
              background: isActive ? (cfg?.bg || '#eef2ff') : '#fff',
              color: isActive ? (cfg?.color || '#4f46e5') : '#64748b',
              fontWeight: isActive ? 700 : 500, transition: 'all 0.15s'
            }}>{type === 'ALL' ? 'All Clients' : type}</button>
          );
        })}
      </div>

      {/* Cards grid */}
      {filteredClients.length === 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', padding: '60px 24px', background: '#f8fafc', borderRadius: '16px', border: '1.5px dashed #e2e8f0', color: '#94a3b8', textAlign: 'center' }}>
          <Building2 size={40} style={{ opacity: 0.3 }} />
          <div>
            <div style={{ fontWeight: 700, fontSize: '1rem', color: '#64748b', marginBottom: '4px' }}>No clients found</div>
            <div style={{ fontSize: '0.84rem' }}>Try clearing the search or add a new client</div>
          </div>
          <button onClick={onOpenClientModal} style={{ padding: '10px 20px', borderRadius: '10px', background: '#4f46e5', color: '#fff', fontWeight: 700, fontSize: '0.88rem', border: 'none', cursor: 'pointer' }}>+ New Client</button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '12px' }}>
          {filteredClients.map((client) => (
            <ClientCard key={client.id} client={client} onSelect={(c) => setSelectedClient(c)} />
          ))}
        </div>
      )}

      {/* Detail drawer */}
      {selectedClient && (
        <ClientDrawer
          client={selectedClient}
          orders={orders} invoices={invoices} payments={payments} followUps={followUps}
          onClose={() => setSelectedClient(null)}
          onEdit={(c) => { setEditingClient(c); }}
          onDelete={(c) => { handleDelete(c); setSelectedClient(null); }}
          onNewOrder={() => { setSelectedClient(null); onOpenOrderModal(); }}
          updateClient={updateClient}
        />
      )}

      {/* Edit modal */}
      {editingClient && (
        <EditModal client={editingClient} onClose={() => setEditingClient(null)} onSave={(id, data) => { updateClient(id, data); setSelectedClient((prev) => prev ? { ...prev, ...data } : null); }} />
      )}
    </div>
  );
};
