import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  CreditCard,
  Search,
  AlertTriangle,
  CheckCircle2,
  Clock,
  X,
  IndianRupee,
  Building2,
  Calendar,
  Banknote
} from 'lucide-react';
import { formatCurrency, formatDate } from '../utils/formatters';

// ─── Status config ────────────────────────────────────────────────────────────
const STATUS_CFG = {
  'Paid':           { color: '#059669', bg: '#ecfdf5', border: '#a7f3d0', label: '✓ Paid' },
  'Partially Paid': { color: '#d97706', bg: '#fffbeb', border: '#fde68a', label: '½ Partial' },
  'Pending':        { color: '#3b82f6', bg: '#eff6ff', border: '#bfdbfe', label: '⏳ Pending' },
  'Overdue':        { color: '#dc2626', bg: '#fef2f2', border: '#fecaca', label: '⚠ Overdue' },
};

const getStatusCfg = (s) => STATUS_CFG[s] || STATUS_CFG['Pending'];

const PAYMENT_MODES = ['NEFT / RTGS', 'UPI', 'Bank Transfer', 'Cheque', 'Cash'];

// ─── Progress bar helper ──────────────────────────────────────────────────────
const PaymentProgress = ({ paid, total }) => {
  const pct = total > 0 ? Math.min(100, Math.round((paid / total) * 100)) : 0;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <div style={{ flex: 1, height: '6px', background: '#e2e8f0', borderRadius: '10px', overflow: 'hidden' }}>
        <div style={{
          height: '100%', width: `${pct}%`,
          background: pct === 100 ? '#10b981' : pct > 50 ? '#f59e0b' : '#ef4444',
          borderRadius: '10px', transition: 'width 0.4s ease'
        }} />
      </div>
      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', minWidth: '32px' }}>{pct}%</span>
    </div>
  );
};

// ─── Payment Card ─────────────────────────────────────────────────────────────
const PaymentCard = ({ payment, onCollect }) => {
  const cfg = getStatusCfg(payment.paymentStatus);
  const isOverdue = payment.paymentStatus === 'Overdue';
  const isSettled = payment.balance <= 0;

  return (
    <div
      style={{
        background: '#fff',
        borderRadius: '14px',
        border: `1px solid ${isOverdue ? '#fecaca' : '#e2e8f0'}`,
        padding: '18px 20px',
        boxShadow: isOverdue ? '0 2px 8px rgba(220,38,38,0.06)' : '0 2px 8px rgba(0,0,0,0.04)',
        display: 'flex', flexDirection: 'column', gap: '14px',
        transition: 'box-shadow 0.15s'
      }}
      onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.09)')}
      onMouseLeave={(e) => (e.currentTarget.style.boxShadow = isOverdue ? '0 2px 8px rgba(220,38,38,0.06)' : '0 2px 8px rgba(0,0,0,0.04)')}
    >
      {/* Top: client + status */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.03em', fontFamily: 'monospace' }}>
              {payment.invoiceNumber}
            </span>
          </div>
          <div style={{ fontWeight: 700, fontSize: '1rem', color: '#0f172a' }}>{payment.clientName}</div>
        </div>
        <span style={{
          padding: '4px 10px', borderRadius: '20px',
          background: cfg.bg, border: `1px solid ${cfg.border}`,
          color: cfg.color, fontSize: '0.75rem', fontWeight: 700, whiteSpace: 'nowrap'
        }}>
          {cfg.label}
        </span>
      </div>

      {/* Amounts */}
      <div style={{ display: 'flex', gap: '0', borderRadius: '10px', overflow: 'hidden', border: '1px solid #f1f5f9' }}>
        <div style={{ flex: 1, padding: '10px 14px', background: '#f8fafc', borderRight: '1px solid #f1f5f9', textAlign: 'center' }}>
          <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600, marginBottom: '2px' }}>Invoice</div>
          <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0f172a' }}>{formatCurrency(payment.invoiceAmount)}</div>
        </div>
        <div style={{ flex: 1, padding: '10px 14px', background: '#f0fdf4', borderRight: '1px solid #f1f5f9', textAlign: 'center' }}>
          <div style={{ fontSize: '0.72rem', color: '#059669', fontWeight: 600, marginBottom: '2px' }}>Paid</div>
          <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#059669' }}>{formatCurrency(payment.amountPaid)}</div>
        </div>
        <div style={{ flex: 1, padding: '10px 14px', background: payment.balance > 0 ? '#fef9f0' : '#f0fdf4', textAlign: 'center' }}>
          <div style={{ fontSize: '0.72rem', color: payment.balance > 0 ? '#d97706' : '#059669', fontWeight: 600, marginBottom: '2px' }}>Balance</div>
          <div style={{ fontWeight: 800, fontSize: '0.95rem', color: payment.balance > 0 ? '#dc2626' : '#059669' }}>
            {formatCurrency(payment.balance)}
          </div>
        </div>
      </div>

      {/* Progress */}
      <PaymentProgress paid={payment.amountPaid} total={payment.invoiceAmount} />

      {/* Due date row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
        {payment.paymentDueDate && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.82rem', color: isOverdue ? '#dc2626' : '#64748b', fontWeight: isOverdue ? 700 : 400 }}>
            <Calendar size={13} style={{ color: isOverdue ? '#dc2626' : '#94a3b8' }} />
            Due: <strong>{formatDate(payment.paymentDueDate)}</strong>
            {isOverdue && <span style={{ fontSize: '0.72rem', background: '#fef2f2', color: '#dc2626', padding: '1px 6px', borderRadius: '8px', border: '1px solid #fecaca' }}>Past Due</span>}
          </div>
        )}
        {payment.paymentDate && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.82rem', color: '#64748b' }}>
            <CheckCircle2 size={13} style={{ color: '#10b981' }} />
            Last paid: <strong>{formatDate(payment.paymentDate)}</strong>
          </div>
        )}
        {payment.paymentMode && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.82rem', color: '#64748b' }}>
            <Banknote size={13} style={{ color: '#94a3b8' }} />
            {payment.paymentMode}
          </div>
        )}
      </div>

      {/* Action */}
      {isSettled ? (
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
          padding: '10px', borderRadius: '10px', background: '#ecfdf5',
          border: '1px solid #a7f3d0', color: '#059669', fontWeight: 700, fontSize: '0.88rem'
        }}>
          <CheckCircle2 size={16} /> Payment Complete
        </div>
      ) : (
        <button
          onClick={() => onCollect(payment)}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            padding: '12px', borderRadius: '10px',
            background: isOverdue ? 'linear-gradient(135deg,#dc2626,#ef4444)' : 'linear-gradient(135deg,#059669,#10b981)',
            color: '#fff', fontWeight: 700, fontSize: '0.9rem',
            border: 'none', cursor: 'pointer', width: '100%',
            boxShadow: isOverdue ? '0 4px 12px rgba(220,38,38,0.25)' : '0 4px 12px rgba(16,185,129,0.25)',
            transition: 'transform 0.1s, box-shadow 0.1s'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-1px)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; }}
        >
          <CreditCard size={17} />
          Collect {formatCurrency(payment.balance)}
        </button>
      )}
    </div>
  );
};

// ─── Collect Modal ────────────────────────────────────────────────────────────
const CollectModal = ({ payment, onClose, onSubmit }) => {
  const [amount, setAmount] = useState(String(payment.balance));
  const [mode, setMode] = useState('NEFT / RTGS');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) return;
    onSubmit(payment.invoiceNumber, amount, mode);
    onClose();
  };

  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3000, padding: '16px' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div style={{ background: '#fff', borderRadius: '18px', width: '100%', maxWidth: '420px', boxShadow: '0 24px 64px rgba(0,0,0,0.18)' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px 16px', borderBottom: '1px solid #f1f5f9' }}>
          <div>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.04em', fontFamily: 'monospace', marginBottom: '2px' }}>{payment.invoiceNumber}</div>
            <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>Collect Payment</h2>
            <p style={{ margin: '2px 0 0', fontSize: '0.8rem', color: '#94a3b8' }}>{payment.clientName}</p>
          </div>
          <button onClick={onClose} style={{ background: '#f1f5f9', border: 'none', borderRadius: '8px', padding: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#64748b' }}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Summary */}
          <div style={{ background: '#f8fafc', borderRadius: '10px', padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#64748b' }}>Total Invoice</span>
              <strong>{formatCurrency(payment.invoiceAmount)}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#64748b' }}>Already Paid</span>
              <strong style={{ color: '#059669' }}>{formatCurrency(payment.amountPaid)}</strong>
            </div>
            <div style={{ height: '1px', background: '#e2e8f0', margin: '2px 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontWeight: 700 }}>Balance Due</span>
              <strong style={{ color: '#dc2626', fontSize: '1rem' }}>{formatCurrency(payment.balance)}</strong>
            </div>
          </div>

          {/* Amount */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#374151' }}>Amount Received (₹) <span style={{ color: '#ef4444' }}>*</span></label>
            <input
              type="number" required min="1" max={payment.balance}
              value={amount} onChange={(e) => setAmount(e.target.value)}
              style={{ padding: '11px 13px', borderRadius: '8px', border: '1.5px solid #e2e8f0', fontSize: '1rem', fontWeight: 700, color: '#0f172a', outline: 'none', background: '#fff', fontFamily: 'var(--font-sans)' }}
            />
          </div>

          {/* Mode */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#374151' }}>Payment Mode</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              {PAYMENT_MODES.map((m) => (
                <button
                  type="button" key={m} onClick={() => setMode(m)}
                  style={{
                    padding: '9px 10px', borderRadius: '8px', fontSize: '0.82rem', fontWeight: mode === m ? 700 : 500,
                    border: `2px solid ${mode === m ? '#4f46e5' : '#e2e8f0'}`,
                    background: mode === m ? '#eef2ff' : '#fff',
                    color: mode === m ? '#4f46e5' : '#64748b', cursor: 'pointer', transition: 'all 0.15s'
                  }}
                >{m}</button>
              ))}
            </div>
          </div>

          <button type="submit" style={{
            marginTop: '4px', padding: '13px', borderRadius: '10px',
            background: 'linear-gradient(135deg,#059669,#10b981)', color: '#fff',
            fontWeight: 800, fontSize: '0.95rem', border: 'none', cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(16,185,129,0.3)'
          }}>
            ✓ Save Payment
          </button>
        </form>
      </div>
    </div>
  );
};

// ─── Main View ────────────────────────────────────────────────────────────────
export const PaymentsView = ({ onNavigate }) => {
  const { payments, recordPayment, matchesCompany } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [collectTarget, setCollectTarget] = useState(null);

  const scopedPayments = payments.filter(matchesCompany);

  // Aggregates
  const totalBilled      = scopedPayments.reduce((a, p) => a + Number(p.invoiceAmount || 0), 0);
  const totalReceived    = scopedPayments.reduce((a, p) => a + Number(p.amountPaid || 0), 0);
  const totalOutstanding = scopedPayments.reduce((a, p) => a + Number(p.balance || 0), 0);
  const overdueCount     = scopedPayments.filter((p) => p.paymentStatus === 'Overdue').length;
  const overdueBalance   = scopedPayments.filter((p) => p.paymentStatus === 'Overdue').reduce((a, p) => a + Number(p.balance || 0), 0);
  const collectionRate   = totalBilled > 0 ? Math.round((totalReceived / totalBilled) * 100) : 0;

  const filtered = scopedPayments.filter((p) => {
    const matchStatus = statusFilter === 'ALL' || p.paymentStatus === statusFilter;
    const q = searchQuery.toLowerCase();
    const matchSearch = !q ||
      p.invoiceNumber.toLowerCase().includes(q) ||
      p.clientName.toLowerCase().includes(q) ||
      (p.paymentMode || '').toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  const handleCollect = (invoiceNumber, amount, mode) => {
    recordPayment(invoiceNumber, amount, mode);
  };

  const STATUS_TABS = [
    { key: 'ALL',           label: 'All' },
    { key: 'Overdue',       label: '⚠ Overdue' },
    { key: 'Partially Paid',label: '½ Partial' },
    { key: 'Pending',       label: '⏳ Pending' },
    { key: 'Paid',          label: '✓ Paid' },
  ];

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '900px', margin: '0 auto' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <CreditCard size={26} style={{ color: '#4f46e5' }} /> Payments
          </h1>
          <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '0.88rem' }}>
            {overdueCount > 0
              ? `${overdueCount} overdue account${overdueCount > 1 ? 's' : ''} — needs attention`
              : 'All accounts up to date'}
          </p>
        </div>
        <button
          onClick={() => onNavigate('invoices')}
          style={{
            padding: '9px 16px', borderRadius: '9px', background: '#f1f5f9',
            border: '1.5px solid #e2e8f0', color: '#475569', fontWeight: 600,
            fontSize: '0.85rem', cursor: 'pointer', flexShrink: 0
          }}
        >
          View Invoices →
        </button>
      </div>

      {/* KPI strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '12px' }}>
        {[
          { label: 'Collected',    value: formatCurrency(totalReceived),    color: '#10b981', bg: '#ecfdf5', sub: `${collectionRate}% collection rate`, icon: CheckCircle2 },
          { label: 'Outstanding',  value: formatCurrency(totalOutstanding),  color: '#f59e0b', bg: '#fffbeb', sub: 'Across all invoices',                icon: Clock },
          { label: 'Overdue',      value: formatCurrency(overdueBalance),    color: '#dc2626', bg: '#fef2f2', sub: `${overdueCount} account(s) past due`, icon: AlertTriangle },
          { label: 'Collection %', value: `${collectionRate}%`,              color: '#4f46e5', bg: '#eef2ff', sub: `of ${formatCurrency(totalBilled)} billed`, icon: IndianRupee },
        ].map(({ label, value, color, bg, sub, icon: Icon }) => (
          <div key={label} style={{ background: bg, border: `1.5px solid ${color}25`, borderRadius: '12px', padding: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
              <Icon size={14} style={{ color }} />
              <span style={{ fontSize: '0.74rem', fontWeight: 600, color }}>{label}</span>
            </div>
            <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.1, marginBottom: '3px' }}>{value}</div>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{sub}</div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#fff', border: '1.5px solid #e2e8f0', borderRadius: '10px', padding: '0 14px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
        <Search size={16} style={{ color: '#94a3b8', flexShrink: 0 }} />
        <input
          placeholder="Search by client, invoice number…"
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

      {/* Status filter tabs */}
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
        {STATUS_TABS.map((tab) => {
          const isActive = statusFilter === tab.key;
          const cfg = STATUS_CFG[tab.key];
          return (
            <button
              key={tab.key}
              onClick={() => setStatusFilter(tab.key)}
              style={{
                padding: '7px 14px', borderRadius: '20px', fontSize: '0.83rem', cursor: 'pointer',
                border: `1.5px solid ${isActive ? (cfg?.color || '#4f46e5') : '#e2e8f0'}`,
                background: isActive ? (cfg?.bg || '#eef2ff') : '#fff',
                color: isActive ? (cfg?.color || '#4f46e5') : '#64748b',
                fontWeight: isActive ? 700 : 500, transition: 'all 0.15s'
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Cards */}
      {filtered.length === 0 ? (
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px',
          padding: '60px 24px', background: '#f8fafc', borderRadius: '16px',
          border: '1.5px dashed #e2e8f0', color: '#94a3b8', textAlign: 'center'
        }}>
          <CreditCard size={40} style={{ opacity: 0.3 }} />
          <div>
            <div style={{ fontWeight: 700, fontSize: '1rem', color: '#64748b', marginBottom: '4px' }}>No payments found</div>
            <div style={{ fontSize: '0.84rem' }}>Try changing your filter or search term</div>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filtered.map((p) => (
            <PaymentCard
              key={p.id}
              payment={p}
              onCollect={(pay) => setCollectTarget(pay)}
            />
          ))}
        </div>
      )}

      {/* Collect modal */}
      {collectTarget && (
        <CollectModal
          payment={collectTarget}
          onClose={() => setCollectTarget(null)}
          onSubmit={handleCollect}
        />
      )}
    </div>
  );
};
