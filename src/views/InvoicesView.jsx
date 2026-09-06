import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  FileText,
  Plus,
  Search,
  Download,
  Printer,
  AlertCircle,
  CheckCircle2,
  Clock,
  Eye,
  CreditCard,
  Trash2,
  X,
  Calendar,
  Banknote,
  IndianRupee
} from 'lucide-react';
import { formatCurrency, formatDate } from '../utils/formatters';
import { generateInvoicePDF } from '../utils/pdfGenerator';

// ─── Status config ────────────────────────────────────────────────────────────
const STATUS_CFG = {
  'Paid':           { color: '#059669', bg: '#ecfdf5', border: '#a7f3d0', label: '✓ Paid' },
  'Partially Paid': { color: '#d97706', bg: '#fffbeb', border: '#fde68a', label: '½ Partial' },
  'Sent':           { color: '#3b82f6', bg: '#eff6ff', border: '#bfdbfe', label: '📤 Sent' },
  'Draft':          { color: '#64748b', bg: '#f8fafc', border: '#e2e8f0', label: '📝 Draft' },
  'Overdue':        { color: '#dc2626', bg: '#fef2f2', border: '#fecaca', label: '⚠ Overdue' },
};
const getStatusCfg = (s) => STATUS_CFG[s] || STATUS_CFG['Sent'];

const PAYMENT_MODES = ['NEFT / RTGS', 'UPI', 'Bank Transfer', 'Cheque', 'Cash'];

// ─── Progress bar ─────────────────────────────────────────────────────────────
const PayBar = ({ paid, total }) => {
  const pct = total > 0 ? Math.min(100, Math.round((paid / total) * 100)) : 0;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <div style={{ flex: 1, height: '5px', background: '#e2e8f0', borderRadius: '10px', overflow: 'hidden' }}>
        <div style={{
          height: '100%', width: `${pct}%`,
          background: pct === 100 ? '#10b981' : pct > 50 ? '#f59e0b' : '#ef4444',
          borderRadius: '10px', transition: 'width 0.4s ease'
        }} />
      </div>
      <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', minWidth: '32px' }}>{pct}%</span>
    </div>
  );
};

// ─── Invoice Card ─────────────────────────────────────────────────────────────
const InvoiceCard = ({ inv, onView, onPay, onDelete }) => {
  const cfg = getStatusCfg(inv.paymentStatus);
  const isOverdue = inv.paymentStatus === 'Overdue';
  const isSettled = inv.balance <= 0;

  return (
    <div
      style={{
        background: '#fff', borderRadius: '14px',
        border: `1px solid ${isOverdue ? '#fecaca' : '#e2e8f0'}`,
        padding: '18px 20px',
        boxShadow: isOverdue ? '0 2px 8px rgba(220,38,38,0.06)' : '0 2px 8px rgba(0,0,0,0.04)',
        display: 'flex', flexDirection: 'column', gap: '14px',
        transition: 'box-shadow 0.15s'
      }}
      onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.09)')}
      onMouseLeave={(e) => (e.currentTarget.style.boxShadow = isOverdue ? '0 2px 8px rgba(220,38,38,0.06)' : '0 2px 8px rgba(0,0,0,0.04)')}
    >
      {/* Top row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', fontFamily: 'monospace', marginBottom: '3px' }}>
            {inv.invoiceNumber}{inv.orderId ? ` • Ref: ${inv.orderId}` : ''}
          </div>
          <div style={{ fontWeight: 700, fontSize: '1rem', color: '#0f172a' }}>{inv.clientName}</div>
          {inv.contactPerson && (
            <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '1px' }}>{inv.contactPerson}</div>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{
            padding: '4px 10px', borderRadius: '20px',
            background: cfg.bg, border: `1px solid ${cfg.border}`,
            color: cfg.color, fontSize: '0.75rem', fontWeight: 700, whiteSpace: 'nowrap'
          }}>
            {cfg.label}
          </span>
          <button
            onClick={() => onDelete(inv)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#cbd5e1', padding: '2px', display: 'flex', borderRadius: '6px', transition: 'color 0.15s' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#ef4444')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#cbd5e1')}
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      {/* Amounts grid */}
      <div style={{ display: 'flex', gap: '0', borderRadius: '10px', overflow: 'hidden', border: '1px solid #f1f5f9' }}>
        <div style={{ flex: 1, padding: '10px 12px', background: '#f8fafc', borderRight: '1px solid #f1f5f9', textAlign: 'center' }}>
          <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 600, marginBottom: '2px' }}>Invoice</div>
          <div style={{ fontWeight: 700, fontSize: '0.92rem', color: '#0f172a' }}>{formatCurrency(inv.totalAmount)}</div>
        </div>
        <div style={{ flex: 1, padding: '10px 12px', background: '#f0fdf4', borderRight: '1px solid #f1f5f9', textAlign: 'center' }}>
          <div style={{ fontSize: '0.7rem', color: '#059669', fontWeight: 600, marginBottom: '2px' }}>Paid</div>
          <div style={{ fontWeight: 700, fontSize: '0.92rem', color: '#059669' }}>{formatCurrency(inv.amountPaid)}</div>
        </div>
        <div style={{ flex: 1, padding: '10px 12px', background: inv.balance > 0 ? '#fef9f0' : '#f0fdf4', textAlign: 'center' }}>
          <div style={{ fontSize: '0.7rem', color: inv.balance > 0 ? '#d97706' : '#059669', fontWeight: 600, marginBottom: '2px' }}>Balance</div>
          <div style={{ fontWeight: 800, fontSize: '0.92rem', color: inv.balance > 0 ? '#dc2626' : '#059669' }}>
            {formatCurrency(inv.balance)}
          </div>
        </div>
      </div>

      {/* Payment progress */}
      <PayBar paid={inv.amountPaid} total={inv.totalAmount} />

      {/* Dates */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.82rem', color: '#64748b' }}>
          <Calendar size={13} style={{ color: '#94a3b8' }} />
          Issued: <strong>{formatDate(inv.issueDate)}</strong>
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.82rem',
          color: isOverdue ? '#dc2626' : '#64748b', fontWeight: isOverdue ? 700 : 400
        }}>
          <Clock size={13} style={{ color: isOverdue ? '#dc2626' : '#94a3b8' }} />
          Due: <strong>{formatDate(inv.paymentDueDate)}</strong>
          {isOverdue && (
            <span style={{ fontSize: '0.7rem', background: '#fef2f2', color: '#dc2626', padding: '1px 6px', borderRadius: '8px', border: '1px solid #fecaca' }}>
              Past Due
            </span>
          )}
        </div>
        {inv.paymentTerms && (
          <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>{inv.paymentTerms}</div>
        )}
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '8px' }}>
        <button
          onClick={() => onView(inv)}
          style={{
            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
            padding: '10px', borderRadius: '10px',
            background: '#f8fafc', border: '1.5px solid #e2e8f0',
            color: '#475569', fontWeight: 600, fontSize: '0.86rem', cursor: 'pointer',
            transition: 'all 0.15s'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = '#f1f5f9'; e.currentTarget.style.borderColor = '#cbd5e1'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.borderColor = '#e2e8f0'; }}
        >
          <Eye size={15} /> View & PDF
        </button>
        {!isSettled && (
          <button
            onClick={() => onPay(inv)}
            style={{
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
              padding: '10px', borderRadius: '10px',
              background: isOverdue ? 'linear-gradient(135deg,#dc2626,#ef4444)' : 'linear-gradient(135deg,#059669,#10b981)',
              color: '#fff', fontWeight: 700, fontSize: '0.86rem',
              border: 'none', cursor: 'pointer',
              boxShadow: isOverdue ? '0 3px 10px rgba(220,38,38,0.2)' : '0 3px 10px rgba(16,185,129,0.2)',
              transition: 'transform 0.1s'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-1px)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; }}
          >
            <CreditCard size={15} /> Collect {formatCurrency(inv.balance)}
          </button>
        )}
        {isSettled && (
          <div style={{
            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
            padding: '10px', borderRadius: '10px', background: '#ecfdf5',
            border: '1px solid #a7f3d0', color: '#059669', fontWeight: 700, fontSize: '0.86rem'
          }}>
            <CheckCircle2 size={15} /> Paid in Full
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Payment Modal ────────────────────────────────────────────────────────────
const PayModal = ({ inv, onClose, onSubmit }) => {
  const [amount, setAmount] = useState(String(inv.balance));
  const [mode, setMode] = useState('NEFT / RTGS');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) return;
    onSubmit(inv.invoiceNumber, amount, mode);
    onClose();
  };

  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3000, padding: '16px' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div style={{ background: '#fff', borderRadius: '18px', width: '100%', maxWidth: '420px', boxShadow: '0 24px 64px rgba(0,0,0,0.18)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px 16px', borderBottom: '1px solid #f1f5f9' }}>
          <div>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', fontFamily: 'monospace', marginBottom: '2px' }}>{inv.invoiceNumber}</div>
            <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>Collect Payment</h2>
            <p style={{ margin: '2px 0 0', fontSize: '0.8rem', color: '#94a3b8' }}>{inv.clientName}</p>
          </div>
          <button onClick={onClose} style={{ background: '#f1f5f9', border: 'none', borderRadius: '8px', padding: '6px', cursor: 'pointer', display: 'flex', color: '#64748b' }}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Summary */}
          <div style={{ background: '#f8fafc', borderRadius: '10px', padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#64748b' }}>Total Invoice</span>
              <strong>{formatCurrency(inv.totalAmount)}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#64748b' }}>Already Paid</span>
              <strong style={{ color: '#059669' }}>{formatCurrency(inv.amountPaid)}</strong>
            </div>
            <div style={{ height: '1px', background: '#e2e8f0', margin: '2px 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontWeight: 700 }}>Balance Due</span>
              <strong style={{ color: '#dc2626', fontSize: '1rem' }}>{formatCurrency(inv.balance)}</strong>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#374151' }}>Amount Received (₹) <span style={{ color: '#ef4444' }}>*</span></label>
            <input
              type="number" required min="1" max={inv.balance}
              value={amount} onChange={(e) => setAmount(e.target.value)}
              style={{ padding: '11px 13px', borderRadius: '8px', border: '1.5px solid #e2e8f0', fontSize: '1rem', fontWeight: 700, color: '#0f172a', outline: 'none', background: '#fff' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#374151' }}>Payment Mode</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              {PAYMENT_MODES.map((m) => (
                <button type="button" key={m} onClick={() => setMode(m)} style={{
                  padding: '9px 10px', borderRadius: '8px', fontSize: '0.82rem',
                  fontWeight: mode === m ? 700 : 500,
                  border: `2px solid ${mode === m ? '#4f46e5' : '#e2e8f0'}`,
                  background: mode === m ? '#eef2ff' : '#fff',
                  color: mode === m ? '#4f46e5' : '#64748b', cursor: 'pointer', transition: 'all 0.15s'
                }}>{m}</button>
              ))}
            </div>
          </div>

          <button type="submit" style={{
            marginTop: '4px', padding: '13px', borderRadius: '10px',
            background: 'linear-gradient(135deg,#059669,#10b981)', color: '#fff',
            fontWeight: 800, fontSize: '0.95rem', border: 'none', cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(16,185,129,0.3)'
          }}>✓ Save Payment</button>
        </form>
      </div>
    </div>
  );
};

// ─── Invoice Preview Modal (for PDF) ─────────────────────────────────────────
const PreviewModal = ({ inv, onClose, onDelete }) => {
  const isAiwa = inv.brand === 'AIWA' || (inv.items && inv.items[0]?.productCode?.startsWith('AIW'));
  const brandTitle = isAiwa ? 'AIWA INDIA' : 'AUCO AUTOMATION';
  const brandLegal = isAiwa ? 'Aiwa Commercial AV India Pvt Ltd' : 'Auco Automation India Pvt Ltd';
  const brandGstin = isAiwa ? '07AAACA5678G2Z1 • New Delhi' : '27AABCA1234F1Z8 • Pune, Maharashtra';

  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3000, padding: '16px', overflowY: 'auto' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div style={{ background: '#fff', borderRadius: '16px', width: '100%', maxWidth: '700px', maxHeight: '90vh', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 24px 64px rgba(0,0,0,0.2)' }}>
        {/* Modal header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', borderBottom: '1px solid #f1f5f9', flexShrink: 0 }}>
          <div>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', fontFamily: 'monospace', marginBottom: '2px' }}>{inv.invoiceNumber}</div>
            <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>{inv.clientName}</h2>
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button onClick={() => generateInvoicePDF(inv)} style={{
              display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px',
              borderRadius: '8px', background: 'linear-gradient(135deg,#4f46e5,#6366f1)',
              color: '#fff', fontWeight: 700, fontSize: '0.84rem', border: 'none', cursor: 'pointer'
            }}>
              <Download size={14} /> Download PDF
            </button>
            <button onClick={() => { onDelete(inv); onClose(); }} style={{
              display: 'flex', alignItems: 'center', gap: '4px', padding: '8px 12px',
              borderRadius: '8px', background: '#fef2f2', border: '1px solid #fecaca',
              color: '#dc2626', fontWeight: 600, fontSize: '0.84rem', cursor: 'pointer'
            }}>
              <Trash2 size={14} />
            </button>
            <button onClick={onClose} style={{ background: '#f1f5f9', border: 'none', borderRadius: '8px', padding: '8px', cursor: 'pointer', display: 'flex', color: '#64748b' }}>
              <X size={18} />
            </button>
          </div>
        </div>

        <div style={{ overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Brand header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '16px', borderBottom: '1px solid #e2e8f0' }}>
            <div>
              <h3 style={{ color: isAiwa ? '#7c3aed' : '#2563eb', margin: 0, fontSize: '1.2rem', fontWeight: 800 }}>{brandTitle}</h3>
              <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '3px' }}>
                {brandLegal}<br />GSTIN: {brandGstin}
              </div>
            </div>
            <div style={{ textAlign: 'right', fontSize: '0.82rem', color: '#64748b' }}>
              <div>Issued: <strong>{formatDate(inv.issueDate)}</strong></div>
              <div>Due: <strong>{formatDate(inv.paymentDueDate)}</strong></div>
              <div>Terms: <strong>{inv.paymentTerms}</strong></div>
            </div>
          </div>

          {/* Bill to */}
          <div style={{ background: '#f8fafc', borderRadius: '10px', padding: '12px 14px' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', marginBottom: '4px', letterSpacing: '0.05em' }}>BILLED TO</div>
            <strong style={{ fontSize: '0.95rem' }}>{inv.clientName}</strong>
            <div style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '3px' }}>{inv.billingAddress}</div>
            {inv.contactPerson && <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '2px' }}>Contact: {inv.contactPerson} • {inv.phone}</div>}
          </div>

          {/* Items */}
          <div style={{ borderRadius: '10px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 4fr 1fr 2fr 2fr', background: '#f8fafc', padding: '10px 14px', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', borderBottom: '1px solid #e2e8f0' }}>
              <span>Code</span><span>Description</span><span style={{ textAlign: 'center' }}>Qty</span><span style={{ textAlign: 'right' }}>Unit Price</span><span style={{ textAlign: 'right' }}>Total</span>
            </div>
            {(inv.items || []).map((item, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 4fr 1fr 2fr 2fr', padding: '10px 14px', fontSize: '0.84rem', borderBottom: i < inv.items.length - 1 ? '1px solid #f1f5f9' : 'none', background: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                <span style={{ fontFamily: 'monospace', fontSize: '0.78rem', color: '#4f46e5', fontWeight: 700 }}>{item.productCode}</span>
                <span>{item.name}</span>
                <span style={{ textAlign: 'center' }}>{item.quantity}</span>
                <span style={{ textAlign: 'right' }}>{formatCurrency(item.price)}</span>
                <span style={{ textAlign: 'right', fontWeight: 700 }}>{formatCurrency(item.total || item.price * item.quantity)}</span>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <div style={{ width: '280px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.86rem', background: '#f8fafc', borderRadius: '10px', padding: '14px 16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Subtotal</span>
                <strong>{formatCurrency(inv.subtotal)}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>GST (18%)</span>
                <strong>{formatCurrency(inv.taxAmount)}</strong>
              </div>
              <div style={{ height: '1px', background: '#e2e8f0', margin: '2px 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1rem' }}>
                <strong>Total</strong>
                <strong style={{ color: '#4f46e5' }}>{formatCurrency(inv.totalAmount)}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#059669' }}>
                <span>Paid</span>
                <strong>{formatCurrency(inv.amountPaid)}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: inv.balance > 0 ? '#dc2626' : '#059669' }}>
                <span>Balance</span>
                <strong>{formatCurrency(inv.balance)}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Main View ────────────────────────────────────────────────────────────────
export const InvoicesView = ({ onOpenInvoiceModal }) => {
  const { invoices, recordPayment, deleteInvoice, matchesCompany } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [previewInv, setPreviewInv] = useState(null);
  const [payInv, setPayInv] = useState(null);

  const scopedInvoices = invoices.filter(matchesCompany);

  // Aggregates
  const totalInvoiced    = scopedInvoices.reduce((a, i) => a + Number(i.totalAmount || 0), 0);
  const totalPaid        = scopedInvoices.reduce((a, i) => a + Number(i.amountPaid || 0), 0);
  const totalOutstanding = scopedInvoices.reduce((a, i) => a + Number(i.balance || 0), 0);
  const overdueCount     = scopedInvoices.filter((i) => i.paymentStatus === 'Overdue').length;

  const filtered = scopedInvoices.filter((inv) => {
    const matchStatus = statusFilter === 'ALL' || inv.paymentStatus === statusFilter;
    const q = searchQuery.toLowerCase();
    const matchSearch = !q ||
      inv.invoiceNumber.toLowerCase().includes(q) ||
      inv.clientName.toLowerCase().includes(q) ||
      (inv.orderId || '').toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  const handleDelete = (inv) => {
    if (window.confirm(`Delete invoice ${inv.invoiceNumber} for ${inv.clientName}?`)) {
      deleteInvoice(inv.invoiceNumber);
      if (previewInv?.invoiceNumber === inv.invoiceNumber) setPreviewInv(null);
    }
  };

  const handlePay = (invNumber, amount, mode) => {
    recordPayment(invNumber, amount, mode);
  };

  const STATUS_TABS = [
    { key: 'ALL',            label: 'All' },
    { key: 'Overdue',        label: '⚠ Overdue' },
    { key: 'Partially Paid', label: '½ Partial' },
    { key: 'Sent',           label: '📤 Sent' },
    { key: 'Paid',           label: '✓ Paid' },
    { key: 'Draft',          label: '📝 Draft' },
  ];

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '900px', margin: '0 auto' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FileText size={26} style={{ color: '#4f46e5' }} /> Invoices
          </h1>
          <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '0.88rem' }}>
            {overdueCount > 0 ? `${overdueCount} overdue invoice${overdueCount > 1 ? 's' : ''} — needs action` : `${scopedInvoices.length} total invoices`}
          </p>
        </div>
        <button
          onClick={onOpenInvoiceModal}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px', padding: '11px 20px', borderRadius: '10px',
            background: 'linear-gradient(135deg,#4f46e5,#6366f1)', color: '#fff', fontWeight: 700,
            fontSize: '0.9rem', border: 'none', cursor: 'pointer', boxShadow: '0 4px 14px rgba(79,70,229,0.3)', flexShrink: 0
          }}
        >
          <Plus size={18} /> New Invoice
        </button>
      </div>

      {/* KPI strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '12px' }}>
        {[
          { label: 'Total Billed',   value: formatCurrency(totalInvoiced),    color: '#4f46e5', bg: '#eef2ff', icon: FileText },
          { label: 'Collected',      value: formatCurrency(totalPaid),         color: '#10b981', bg: '#ecfdf5', icon: CheckCircle2 },
          { label: 'Outstanding',    value: formatCurrency(totalOutstanding),  color: '#f59e0b', bg: '#fffbeb', icon: Clock },
          { label: 'Overdue',        value: `${overdueCount} invoice${overdueCount !== 1 ? 's' : ''}`, color: overdueCount > 0 ? '#dc2626' : '#059669', bg: overdueCount > 0 ? '#fef2f2' : '#ecfdf5', icon: AlertCircle },
        ].map(({ label, value, color, bg, icon: Icon }) => (
          <div key={label} style={{ background: bg, border: `1.5px solid ${color}25`, borderRadius: '12px', padding: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
              <Icon size={14} style={{ color }} />
              <span style={{ fontSize: '0.74rem', fontWeight: 600, color }}>{label}</span>
            </div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.1 }}>{value}</div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#fff', border: '1.5px solid #e2e8f0', borderRadius: '10px', padding: '0 14px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
        <Search size={16} style={{ color: '#94a3b8', flexShrink: 0 }} />
        <input
          placeholder="Search by client, invoice number, or order ref…"
          value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
          style={{ flex: 1, border: 'none', outline: 'none', padding: '12px 0', fontSize: '0.88rem', color: '#0f172a', background: 'transparent', fontFamily: 'var(--font-sans)' }}
        />
        {searchQuery && (
          <button onClick={() => setSearchQuery('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: '2px', display: 'flex' }}>
            <X size={14} />
          </button>
        )}
      </div>

      {/* Status tabs */}
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
        {STATUS_TABS.map((tab) => {
          const isActive = statusFilter === tab.key;
          const cfg = STATUS_CFG[tab.key];
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
      {filtered.length === 0 ? (
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px',
          padding: '60px 24px', background: '#f8fafc', borderRadius: '16px',
          border: '1.5px dashed #e2e8f0', color: '#94a3b8', textAlign: 'center'
        }}>
          <FileText size={40} style={{ opacity: 0.3 }} />
          <div>
            <div style={{ fontWeight: 700, fontSize: '1rem', color: '#64748b', marginBottom: '4px' }}>No invoices found</div>
            <div style={{ fontSize: '0.84rem' }}>Try a different filter or create a new invoice</div>
          </div>
          <button onClick={onOpenInvoiceModal} style={{
            padding: '10px 20px', borderRadius: '10px', background: '#4f46e5',
            color: '#fff', fontWeight: 700, fontSize: '0.88rem', border: 'none', cursor: 'pointer', marginTop: '4px'
          }}>+ New Invoice</button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filtered.map((inv) => (
            <InvoiceCard
              key={inv.id || inv.invoiceNumber}
              inv={inv}
              onView={setPreviewInv}
              onPay={setPayInv}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      {payInv && (
        <PayModal
          inv={payInv}
          onClose={() => setPayInv(null)}
          onSubmit={handlePay}
        />
      )}
      {previewInv && (
        <PreviewModal
          inv={previewInv}
          onClose={() => setPreviewInv(null)}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};
