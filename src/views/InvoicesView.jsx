import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  FileText,
  Plus,
  Search,
  Download,
  Printer,
  DollarSign,
  AlertCircle,
  CheckCircle2,
  Clock,
  Eye,
  CreditCard,
  Trash2,
  X
} from 'lucide-react';
import { formatCurrency, formatDate, getStatusBadgeClass } from '../utils/formatters';
import { generateInvoicePDF } from '../utils/pdfGenerator';

export const InvoicesView = ({ onOpenInvoiceModal }) => {
  const { invoices, recordPayment, deleteInvoice, selectedCompany, companyBrands, matchesCompany } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [previewInvoice, setPreviewInvoice] = useState(null);
  const [recordPaymentInvoice, setRecordPaymentInvoice] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMode, setPaymentMode] = useState('NEFT');

  // Scoped invoices by company
  const scopedInvoices = invoices.filter(matchesCompany);

  // Filter invoices
  const filteredInvoices = scopedInvoices.filter((inv) => {
    const matchesSearch =
      inv.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (inv.orderId && inv.orderId.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'ALL' || inv.paymentStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Financial aggregates
  const totalInvoiced = scopedInvoices.reduce((acc, i) => acc + Number(i.totalAmount || 0), 0);
  const totalPaid = scopedInvoices.reduce((acc, i) => acc + Number(i.amountPaid || 0), 0);
  const totalOutstanding = scopedInvoices.reduce((acc, i) => acc + Number(i.balance || 0), 0);
  const overdueCount = scopedInvoices.filter((i) => i.paymentStatus === 'Overdue').length;

  const handleRecordPaymentSubmit = (e) => {
    e.preventDefault();
    if (!recordPaymentInvoice || !paymentAmount) return;
    recordPayment(recordPaymentInvoice.invoiceNumber, paymentAmount, paymentMode);
    setRecordPaymentInvoice(null);
    setPaymentAmount('');
  };

  const handleDeleteInvoice = (inv) => {
    if (window.confirm(`Are you sure you want to delete invoice "${inv.invoiceNumber}" for ${inv.clientName}?`)) {
      deleteInvoice(inv.invoiceNumber);
      if (previewInvoice && previewInvoice.invoiceNumber === inv.invoiceNumber) {
        setPreviewInvoice(null);
      }
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div className="flex-between">
        <div>
          <h2>Invoice & Billing Management</h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            GST-compliant invoicing system with automated payment status tracking and PDF invoice generation.
          </p>
        </div>
        <button className="btn btn-primary" onClick={onOpenInvoiceModal}>
          <Plus size={16} /> Create Tax Invoice
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid-4">
        <div className="stat-card" style={{ borderLeft: '4px solid var(--primary-600)' }}>
          <div className="stat-header">
            <span className="stat-title">Total Invoiced Value</span>
            <FileText size={18} style={{ color: 'var(--primary-600)' }} />
          </div>
          <div className="stat-value">{formatCurrency(totalInvoiced)}</div>
          <div className="stat-subtext">{scopedInvoices.length} invoices generated</div>
        </div>

        <div className="stat-card" style={{ borderLeft: '4px solid #10b981' }}>
          <div className="stat-header">
            <span className="stat-title">Total Payments Collected</span>
            <CheckCircle2 size={18} style={{ color: '#10b981' }} />
          </div>
          <div className="stat-value">{formatCurrency(totalPaid)}</div>
          <div className="stat-subtext">Settled into bank accounts</div>
        </div>

        <div className="stat-card" style={{ borderLeft: '4px solid #f59e0b' }}>
          <div className="stat-header">
            <span className="stat-title">Total Outstanding Balance</span>
            <CreditCard size={18} style={{ color: '#f59e0b' }} />
          </div>
          <div className="stat-value">{formatCurrency(totalOutstanding)}</div>
          <div className="stat-subtext">Accounts receivable pipeline</div>
        </div>

        <div className="stat-card" style={{ borderLeft: `4px solid ${overdueCount > 0 ? 'var(--danger-text)' : 'var(--success-text)'}` }}>
          <div className="stat-header">
            <span className="stat-title">Overdue Invoices</span>
            <AlertCircle size={18} style={{ color: overdueCount > 0 ? 'var(--danger-text)' : 'var(--success-text)' }} />
          </div>
          <div className="stat-value" style={{ color: overdueCount > 0 ? 'var(--danger-text)' : 'inherit' }}>
            {overdueCount} Invoices
          </div>
          <div className="stat-subtext">Past due payment terms</div>
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
              placeholder="Search invoice #, client name, order ref..."
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
              <option value="Sent">Sent</option>
              <option value="Paid">Paid</option>
              <option value="Partially Paid">Partially Paid</option>
              <option value="Overdue">Overdue</option>
              <option value="Draft">Draft</option>
            </select>
          </div>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="table-container">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Invoice #</th>
              <th>Client Name</th>
              <th>Order Ref</th>
              <th>Issue Date</th>
              <th>Due Date</th>
              <th>Total Amount</th>
              <th>Amount Paid</th>
              <th>Balance Due</th>
              <th>Payment Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredInvoices.map((inv) => (
              <tr key={inv.id}>
                <td>
                  <strong style={{ color: 'var(--primary-600)', fontFamily: 'monospace' }}>{inv.invoiceNumber}</strong>
                </td>
                <td>
                  <strong>{inv.clientName}</strong>
                </td>
                <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {inv.orderId || '—'}
                </td>
                <td style={{ fontSize: '0.8rem' }}>
                  {formatDate(inv.issueDate)}
                </td>
                <td style={{ fontSize: '0.8rem' }}>
                  {formatDate(inv.paymentDueDate)}
                </td>
                <td>
                  <strong>{formatCurrency(inv.totalAmount)}</strong>
                </td>
                <td style={{ color: 'var(--success-text)', fontSize: '0.85rem' }}>
                  {formatCurrency(inv.amountPaid)}
                </td>
                <td>
                  <strong style={{ color: inv.balance > 0 ? 'var(--danger-text)' : 'var(--text-muted)' }}>
                    {formatCurrency(inv.balance)}
                  </strong>
                </td>
                <td>
                  <span className={`badge ${getStatusBadgeClass(inv.paymentStatus)}`}>
                    {inv.paymentStatus}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => setPreviewInvoice(inv)}
                      title="Preview / Print / Export PDF"
                    >
                      <Eye size={13} /> View
                    </button>
                    {inv.balance > 0 && (
                      <button
                        className="btn btn-success btn-sm"
                        onClick={() => {
                          setRecordPaymentInvoice(inv);
                          setPaymentAmount(String(inv.balance));
                        }}
                        title="Record Payment"
                        style={{ padding: '4px 8px' }}
                      >
                        <CreditCard size={13} /> Pay
                      </button>
                    )}
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={() => handleDeleteInvoice(inv)}
                      title="Delete Invoice"
                      style={{ padding: '4px 8px', color: 'var(--danger-text)' }}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredInvoices.length === 0 && (
              <tr>
                <td colSpan="10" style={{ textAlign: 'center', padding: '48px 16px', color: 'var(--text-muted)' }}>
                  <FileText size={36} style={{ margin: '0 auto 10px', opacity: 0.4 }} />
                  <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>No invoices found</div>
                  <p style={{ fontSize: '0.8rem', marginTop: '4px' }}>Try adjusting your search query or status filter.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* =========================================================================
          INVOICE PREVIEW MODAL & PDF EXPORT
          ========================================================================= */}
      {previewInvoice && (
        <div className="modal-backdrop" onClick={() => setPreviewInvoice(null)}>
          <div className="modal-content modal-content-lg" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <span className={`badge ${getStatusBadgeClass(previewInvoice.paymentStatus)}`}>
                  {previewInvoice.paymentStatus}
                </span>
                <h3 style={{ marginTop: '4px' }}>Tax Invoice: {previewInvoice.invoiceNumber}</h3>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => window.print()}
                >
                  <Printer size={14} /> Print
                </button>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => generateInvoicePDF(previewInvoice)}
                >
                  <Download size={14} /> Download PDF
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDeleteInvoice(previewInvoice)}
                >
                  <Trash2 size={14} /> Delete
                </button>
                <button className="btn btn-ghost btn-icon" onClick={() => setPreviewInvoice(null)}>
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="modal-body">
              {/* Company Header */}
              {(() => {
                const isAiwa = previewInvoice.brand === 'AIWA' || (previewInvoice.items && previewInvoice.items[0]?.productCode?.startsWith('AIW'));
                const brandTitle = isAiwa ? 'AIWA INDIA' : 'AUCO AUTOMATION';
                const brandLegal = isAiwa ? 'Aiwa Commercial AV India Pvt Ltd' : 'Auco Automation India Pvt Ltd';
                const brandGstin = isAiwa ? '07AAACA5678G2Z1 • New Delhi' : '27AABCA1234F1Z8 • Pune, Maharashtra';
                const brandTag = isAiwa ? 'Commercial AV, Sound & Acoustic Calibration' : 'Industrial Automation, Sensors & IoT Division';

                return (
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '16px', borderBottom: '1px solid var(--border-default)' }}>
                    <div>
                      <h2 style={{ color: isAiwa ? '#7c3aed' : '#2563eb', margin: 0 }}>{brandTitle}</h2>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                        {brandLegal} • {brandTag}<br />
                        GSTIN: {brandGstin}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Invoice Date: <strong>{formatDate(previewInvoice.issueDate)}</strong></div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Due Date: <strong>{formatDate(previewInvoice.paymentDueDate)}</strong></div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Terms: <strong>{previewInvoice.paymentTerms}</strong></div>
                    </div>
                  </div>
                );
              })()}

              {/* Bill To */}
              <div style={{ margin: '16px 0', padding: '12px', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>BILLED TO:</div>
                <strong style={{ fontSize: '0.95rem' }}>{previewInvoice.clientName}</strong>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  {previewInvoice.billingAddress}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  Contact: {previewInvoice.contactPerson} • {previewInvoice.phone}
                </div>
              </div>

              {/* Items List */}
              <table className="custom-table" style={{ margin: '14px 0' }}>
                <thead>
                  <tr>
                    <th>Product Code</th>
                    <th>Item Description</th>
                    <th>Qty</th>
                    <th>Unit Price</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {(previewInvoice.items || []).map((item, idx) => (
                    <tr key={idx}>
                      <td><strong>{item.productCode}</strong></td>
                      <td>{item.name}</td>
                      <td>{item.quantity}</td>
                      <td>{formatCurrency(item.price)}</td>
                      <td><strong>{formatCurrency(item.total || (item.price * item.quantity))}</strong></td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Subtotals & Balances */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
                <div style={{ width: '280px', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.85rem' }}>
                  <div className="flex-between">
                    <span style={{ color: 'var(--text-muted)' }}>Subtotal:</span>
                    <strong>{formatCurrency(previewInvoice.subtotal)}</strong>
                  </div>
                  <div className="flex-between">
                    <span style={{ color: 'var(--text-muted)' }}>GST (18%):</span>
                    <strong>{formatCurrency(previewInvoice.taxAmount)}</strong>
                  </div>
                  <div className="flex-between" style={{ paddingTop: '6px', borderTop: '2px solid var(--border-default)', fontSize: '1rem' }}>
                    <strong>Total Amount:</strong>
                    <strong style={{ color: 'var(--primary-600)' }}>{formatCurrency(previewInvoice.totalAmount)}</strong>
                  </div>
                  <div className="flex-between" style={{ color: 'var(--success-text)' }}>
                    <span>Amount Paid:</span>
                    <strong>{formatCurrency(previewInvoice.amountPaid)}</strong>
                  </div>
                  <div className="flex-between" style={{ color: previewInvoice.balance > 0 ? 'var(--danger-text)' : 'var(--text-muted)' }}>
                    <span>Balance Due:</span>
                    <strong>{formatCurrency(previewInvoice.balance)}</strong>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="btn btn-primary"
                onClick={() => generateInvoicePDF(previewInvoice)}
              >
                <Download size={15} /> Download Official PDF
              </button>
              <button className="btn btn-secondary" onClick={() => setPreviewInvoice(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          RECORD PAYMENT MODAL
          ========================================================================= */}
      {recordPaymentInvoice && (
        <div className="modal-backdrop" onClick={() => setRecordPaymentInvoice(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <form onSubmit={handleRecordPaymentSubmit}>
              <div className="modal-header">
                <div>
                  <span className="badge badge-success">Record Payment</span>
                  <h3 style={{ marginTop: '4px' }}>Invoice: {recordPaymentInvoice.invoiceNumber}</h3>
                </div>
                <button type="button" className="btn btn-ghost btn-icon" onClick={() => setRecordPaymentInvoice(null)}>✕</button>
              </div>

              <div className="modal-body">
                <div style={{ padding: '12px', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)', marginBottom: '14px', fontSize: '0.85rem' }}>
                  <div className="flex-between">
                    <span>Client:</span>
                    <strong>{recordPaymentInvoice.clientName}</strong>
                  </div>
                  <div className="flex-between" style={{ marginTop: '4px' }}>
                    <span>Total Invoiced:</span>
                    <strong>{formatCurrency(recordPaymentInvoice.totalAmount)}</strong>
                  </div>
                  <div className="flex-between" style={{ marginTop: '4px' }}>
                    <span>Current Outstanding:</span>
                    <strong style={{ color: 'var(--danger-text)' }}>{formatCurrency(recordPaymentInvoice.balance)}</strong>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Payment Amount Received (INR) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    max={recordPaymentInvoice.balance}
                    className="form-input"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Payment Mode</label>
                  <select
                    className="form-select"
                    value={paymentMode}
                    onChange={(e) => setPaymentMode(e.target.value)}
                  >
                    <option value="NEFT">NEFT / RTGS</option>
                    <option value="UPI">UPI Transfer</option>
                    <option value="Bank Transfer">Direct Bank Transfer (IMPS)</option>
                    <option value="Cheque">Cheque Settlement</option>
                    <option value="Cash">Cash Receipt</option>
                  </select>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setRecordPaymentInvoice(null)}>Cancel</button>
                <button type="submit" className="btn btn-success">Confirm Payment</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
