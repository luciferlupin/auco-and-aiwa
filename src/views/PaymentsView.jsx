import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  CreditCard,
  Search,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Filter,
  DollarSign
} from 'lucide-react';
import { formatCurrency, formatDate, getStatusBadgeClass } from '../utils/formatters';

export const PaymentsView = ({ onNavigate }) => {
  const { payments, recordPayment, selectedCompany, companyBrands, matchesCompany } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [recordPaymentModal, setRecordPaymentModal] = useState(null);
  const [amountInput, setAmountInput] = useState('');
  const [modeInput, setModeInput] = useState('NEFT');

  // Scoped payments by company
  const scopedPayments = payments.filter(matchesCompany);

  // Filter payments
  const filteredPayments = scopedPayments.filter((p) => {
    const matchesSearch =
      p.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.paymentMode && p.paymentMode.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'ALL' || p.paymentStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Financial aggregates
  const totalBilled = scopedPayments.reduce((acc, p) => acc + Number(p.invoiceAmount || 0), 0);
  const totalReceived = scopedPayments.reduce((acc, p) => acc + Number(p.amountPaid || 0), 0);
  const totalOutstanding = scopedPayments.reduce((acc, p) => acc + Number(p.balance || 0), 0);
  const overduePayments = scopedPayments.filter((p) => p.paymentStatus === 'Overdue');
  const overdueBalance = overduePayments.reduce((acc, p) => acc + Number(p.balance || 0), 0);

  const handleRecordPayment = (e) => {
    e.preventDefault();
    if (!recordPaymentModal || !amountInput) return;
    recordPayment(recordPaymentModal.invoiceNumber, amountInput, modeInput);
    setRecordPaymentModal(null);
    setAmountInput('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div className="flex-between">
        <div>
          <h2>Payment & Collections Management</h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Real-time accounts receivable tracking, automated balance calculation (Outstanding = Billed - Paid), and overdue payment monitoring.
          </p>
        </div>
        <button className="btn btn-secondary" onClick={() => onNavigate('invoices')}>
          View Invoices
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid-4">
        <div className="stat-card" style={{ borderLeft: '4px solid #10b981' }}>
          <div className="stat-header">
            <span className="stat-title">Total Collected</span>
            <CheckCircle2 size={18} style={{ color: '#10b981' }} />
          </div>
          <div className="stat-value">{formatCurrency(totalReceived)}</div>
          <div className="stat-subtext">Settled payments</div>
        </div>

        <div className="stat-card" style={{ borderLeft: '4px solid #f59e0b' }}>
          <div className="stat-header">
            <span className="stat-title">Total Outstanding</span>
            <Clock size={18} style={{ color: '#f59e0b' }} />
          </div>
          <div className="stat-value">{formatCurrency(totalOutstanding)}</div>
          <div className="stat-subtext">Across active invoices</div>
        </div>

        <div className="stat-card" style={{ borderLeft: `4px solid ${overduePayments.length > 0 ? 'var(--danger-text)' : 'var(--success-text)'}` }}>
          <div className="stat-header">
            <span className="stat-title">Overdue Amount</span>
            <AlertTriangle size={18} style={{ color: overduePayments.length > 0 ? 'var(--danger-text)' : 'var(--success-text)' }} />
          </div>
          <div className="stat-value" style={{ color: overduePayments.length > 0 ? 'var(--danger-text)' : 'inherit' }}>
            {formatCurrency(overdueBalance)}
          </div>
          <div className="stat-subtext" style={{ color: 'var(--danger-text)', fontWeight: 600 }}>
            {overduePayments.length} accounts past due date
          </div>
        </div>

        <div className="stat-card" style={{ borderLeft: '4px solid var(--primary-600)' }}>
          <div className="stat-header">
            <span className="stat-title">Collection Rate</span>
            <CreditCard size={18} style={{ color: 'var(--primary-600)' }} />
          </div>
          <div className="stat-value">
            {totalBilled > 0 ? Math.round((totalReceived / totalBilled) * 100) : 0}%
          </div>
          <div className="stat-subtext">Of {formatCurrency(totalBilled)} total billed</div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="card" style={{ padding: '14px 18px' }}>
        <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              className="form-input"
              placeholder="Search invoice #, client, payment mode..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: '36px' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Status:</span>
            <select
              className="form-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ width: '160px' }}
            >
              <option value="ALL">All Statuses</option>
              <option value="Overdue">Overdue</option>
              <option value="Pending">Pending</option>
              <option value="Partially Paid">Partially Paid</option>
              <option value="Paid">Paid</option>
            </select>
          </div>
        </div>
      </div>

      {/* Payments Table */}
      <div className="table-container">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Invoice #</th>
              <th>Client Name</th>
              <th>Invoice Amount</th>
              <th>Amount Paid</th>
              <th>Balance (Outstanding)</th>
              <th>Payment Date</th>
              <th>Due Date</th>
              <th>Terms (Days)</th>
              <th>Payment Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredPayments.map((p) => {
              const isOverdue = p.paymentStatus === 'Overdue';
              return (
                <tr key={p.id} style={{ background: isOverdue ? 'rgba(254, 242, 242, 0.4)' : 'inherit' }}>
                  <td>
                    <strong style={{ color: 'var(--primary-600)', fontFamily: 'monospace' }}>{p.invoiceNumber}</strong>
                  </td>
                  <td>
                    <strong>{p.clientName}</strong>
                  </td>
                  <td>
                    {formatCurrency(p.invoiceAmount)}
                  </td>
                  <td style={{ color: 'var(--success-text)', fontWeight: 600 }}>
                    {formatCurrency(p.amountPaid)}
                  </td>
                  <td>
                    <strong style={{ color: p.balance > 0 ? 'var(--danger-text)' : 'var(--text-muted)' }}>
                      {formatCurrency(p.balance)}
                    </strong>
                  </td>
                  <td style={{ fontSize: '0.8rem' }}>
                    {p.paymentDate ? formatDate(p.paymentDate) : '—'}
                  </td>
                  <td style={{ fontSize: '0.8rem', color: isOverdue ? 'var(--danger-text)' : 'inherit', fontWeight: isOverdue ? 700 : 'normal' }}>
                    {formatDate(p.paymentDueDate)}
                  </td>
                  <td style={{ textAlign: 'center', fontSize: '0.8rem' }}>
                    {p.paymentDays || 30} days
                  </td>
                  <td>
                    <span className={`badge ${getStatusBadgeClass(p.paymentStatus)}`}>
                      {p.paymentStatus}
                    </span>
                  </td>
                  <td>
                    {p.balance > 0 ? (
                      <button
                        className="btn btn-success btn-sm"
                        onClick={() => {
                          setRecordPaymentModal(p);
                          setAmountInput(String(p.balance));
                        }}
                      >
                        <CreditCard size={13} /> Collect
                      </button>
                    ) : (
                      <span className="badge badge-success">Settled</span>
                    )}
                  </td>
                </tr>
              );
            })}
            {filteredPayments.length === 0 && (
              <tr>
                <td colSpan="10" style={{ textAlign: 'center', padding: '48px 16px', color: 'var(--text-muted)' }}>
                  <CreditCard size={36} style={{ margin: '0 auto 10px', opacity: 0.4 }} />
                  <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>No payment records found</div>
                  <p style={{ fontSize: '0.8rem', marginTop: '4px' }}>Try adjusting your search query or payment status filter.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Collect Payment Modal */}
      {recordPaymentModal && (
        <div className="modal-backdrop" onClick={() => setRecordPaymentModal(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <form onSubmit={handleRecordPayment}>
              <div className="modal-header">
                <div>
                  <span className="badge badge-success">Collect Payment</span>
                  <h3 style={{ marginTop: '4px' }}>Invoice: {recordPaymentModal.invoiceNumber}</h3>
                </div>
                <button type="button" className="btn btn-ghost btn-icon" onClick={() => setRecordPaymentModal(null)}>✕</button>
              </div>

              <div className="modal-body">
                <div style={{ padding: '12px', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)', marginBottom: '14px', fontSize: '0.85rem' }}>
                  <div className="flex-between">
                    <span>Client:</span>
                    <strong>{recordPaymentModal.clientName}</strong>
                  </div>
                  <div className="flex-between" style={{ marginTop: '4px' }}>
                    <span>Invoice Amount:</span>
                    <strong>{formatCurrency(recordPaymentModal.invoiceAmount)}</strong>
                  </div>
                  <div className="flex-between" style={{ marginTop: '4px' }}>
                    <span>Current Balance:</span>
                    <strong style={{ color: 'var(--danger-text)' }}>{formatCurrency(recordPaymentModal.balance)}</strong>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Payment Amount (INR) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    max={recordPaymentModal.balance}
                    className="form-input"
                    value={amountInput}
                    onChange={(e) => setAmountInput(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Payment Mode</label>
                  <select
                    className="form-select"
                    value={modeInput}
                    onChange={(e) => setModeInput(e.target.value)}
                  >
                    <option value="NEFT">NEFT / RTGS</option>
                    <option value="UPI">UPI</option>
                    <option value="Bank Transfer">Bank Transfer (IMPS)</option>
                    <option value="Cheque">Cheque</option>
                    <option value="Cash">Cash</option>
                  </select>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setRecordPaymentModal(null)}>Cancel</button>
                <button type="submit" className="btn btn-success">Save Payment Receipt</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
