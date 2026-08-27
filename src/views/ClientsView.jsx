import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Building2,
  Plus,
  Search,
  Filter,
  Phone,
  Mail,
  MapPin,
  Calendar,
  CreditCard,
  ShoppingCart,
  MessageSquare,
  ChevronRight,
  X,
  ExternalLink,
  Edit2,
  CheckCircle2,
  Clock,
  Copy,
  Check
} from 'lucide-react';
import { formatCurrency, formatDate, getStatusBadgeClass, getWhatsAppUrl } from '../utils/formatters';

export const ClientsView = ({ onOpenClientModal, onOpenOrderModal }) => {
  const { clients, orders, invoices, payments, followUps, updateClient } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [stateFilter, setStateFilter] = useState('ALL');
  const [selectedClient, setSelectedClient] = useState(null);
  const [activeDrawerTab, setActiveDrawerTab] = useState('overview'); // 'overview' | 'orders' | 'invoices' | 'payments' | 'followups'
  const [quickNote, setQuickNote] = useState('');
  const [copiedId, setCopiedId] = useState(null);

  // Extract unique states for filter
  const uniqueStates = Array.from(new Set(clients.map((c) => c.state).filter(Boolean)));

  // Filter clients
  const filteredClients = clients.filter((client) => {
    const matchesSearch =
      client.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.phone.includes(searchQuery);

    const matchesType = typeFilter === 'ALL' || client.clientType === typeFilter;
    const matchesState = stateFilter === 'ALL' || client.state === stateFilter;

    return matchesSearch && matchesType && matchesState;
  });

  const clientOrders = selectedClient ? orders.filter((o) => o.clientId === selectedClient.id) : [];
  const clientInvoices = selectedClient ? invoices.filter((i) => i.clientId === selectedClient.id) : [];
  const clientPayments = selectedClient ? payments.filter((p) => p.clientId === selectedClient.id) : [];
  const clientFollowUps = selectedClient ? followUps.filter((f) => f.clientId === selectedClient.id || f.clientName === selectedClient.companyName) : [];

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSaveNote = () => {
    if (!quickNote.trim() || !selectedClient) return;
    const updatedNotes = selectedClient.notes ? `${selectedClient.notes}\n• [${new Date().toLocaleDateString('en-IN')}] ${quickNote}` : `• [${new Date().toLocaleDateString('en-IN')}] ${quickNote}`;
    updateClient(selectedClient.id, { notes: updatedNotes });
    setSelectedClient((prev) => ({ ...prev, notes: updatedNotes }));
    setQuickNote('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div className="flex-between">
        <div>
          <h2>Client Directory & Central Accounts</h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Central repository for Indian client accounts, order frequencies, payment terms, and WhatsApp engagement.
          </p>
        </div>
        <button className="btn btn-primary" onClick={onOpenClientModal}>
          <Plus size={16} /> Add New Client
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="card" style={{ padding: '14px 18px' }}>
        <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              className="form-input"
              placeholder="Search company, contact person, city, phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: '36px' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Type:</span>
            <select
              className="form-select"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              style={{ width: '150px' }}
            >
              <option value="ALL">All Types</option>
              <option value="Enterprise">Enterprise</option>
              <option value="SME">SME</option>
              <option value="Distributor">Distributor</option>
              <option value="Retail">Retail</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>State:</span>
            <select
              className="form-select"
              value={stateFilter}
              onChange={(e) => setStateFilter(e.target.value)}
              style={{ width: '160px' }}
            >
              <option value="ALL">All States</option>
              {uniqueStates.map((st) => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Clients Table */}
      <div className="table-container">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Company & Client</th>
              <th>Contact Person</th>
              <th>City / State</th>
              <th>Type</th>
              <th>Total Orders</th>
              <th>Frequency</th>
              <th>Total Value</th>
              <th>Pending AR</th>
              <th>WhatsApp</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredClients.map((client) => {
              const hasPending = (client.pendingAmount || 0) > 0;
              return (
                <tr
                  key={client.id}
                  onClick={() => { setSelectedClient(client); setActiveDrawerTab('overview'); }}
                  style={{ cursor: 'pointer' }}
                >
                  <td>
                    <div>
                      <strong style={{ fontSize: '0.9rem', color: 'var(--primary-700)' }}>{client.companyName}</strong>
                      <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '1px' }}>
                        <span>{client.id}</span>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleCopy(client.id, client.id); }}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0 2px', color: 'var(--text-muted)' }}
                          title="Copy ID"
                        >
                          {copiedId === client.id ? <Check size={11} style={{ color: 'var(--success-text)' }} /> : <Copy size={11} />}
                        </button>
                        <span>• Rep: {client.assignedSalesPerson}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div>
                      <div style={{ fontWeight: 600 }}>{client.contactPerson}</div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>{client.phone}</div>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <MapPin size={13} style={{ color: 'var(--text-muted)' }} />
                      <span>{client.city}, {client.state}</span>
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${client.clientType === 'Enterprise' ? 'badge-purple' : 'badge-neutral'}`}>
                      {client.clientType}
                    </span>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <span style={{ fontWeight: 700 }}>{client.totalOrders || 0}</span>
                  </td>
                  <td>
                    <span className="badge badge-neutral" style={{ fontSize: '0.72rem' }}>
                      {client.orderFrequency || 'Monthly'}
                    </span>
                  </td>
                  <td>
                    <strong style={{ color: 'var(--text-primary)' }}>
                      {formatCurrency(client.totalBusinessValue)}
                    </strong>
                  </td>
                  <td>
                    {hasPending ? (
                      <strong style={{ color: 'var(--danger-text)' }}>
                        {formatCurrency(client.pendingAmount)}
                      </strong>
                    ) : (
                      <span className="badge badge-success">Settled</span>
                    )}
                  </td>
                  <td onClick={(e) => e.stopPropagation()}>
                    <a
                      href={getWhatsAppUrl(client.phone, `Hello ${client.contactPerson}, greetings from Auco & Aiwa.`)}
                      target="_blank"
                      rel="noreferrer"
                      className="badge badge-whatsapp"
                      title="Open WhatsApp Chat"
                    >
                      <MessageSquare size={13} /> Chat
                    </a>
                  </td>
                  <td>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedClient(client);
                        setActiveDrawerTab('overview');
                      }}
                    >
                      Inspect <ChevronRight size={14} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* =========================================================================
          CLIENT DETAIL DRAWER
          ========================================================================= */}
      {selectedClient && (
        <div className="drawer-backdrop" onClick={() => setSelectedClient(null)}>
          <div className="drawer-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-default)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="badge badge-purple">{selectedClient.clientType}</span>
                  <span className="badge badge-success">{selectedClient.clientStatus}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{selectedClient.id}</span>
                </div>
                <h2 style={{ marginTop: '6px', fontSize: '1.25rem' }}>{selectedClient.companyName}</h2>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                  <MapPin size={13} /> {selectedClient.address}, {selectedClient.city}, {selectedClient.state}
                </div>
              </div>
              <button className="btn btn-ghost btn-icon" onClick={() => setSelectedClient(null)}>
                <X size={18} />
              </button>
            </div>

            {/* Quick Action Toolbar */}
            <div style={{ padding: '10px 24px', background: 'var(--bg-subtle)', borderBottom: '1px solid var(--border-default)', display: 'flex', gap: '10px' }}>
              <a
                href={getWhatsAppUrl(selectedClient.phone, `Hello ${selectedClient.contactPerson}, following up from Auco & Aiwa regarding your orders.`)}
                target="_blank"
                rel="noreferrer"
                className="btn btn-sm badge-whatsapp"
              >
                <MessageSquare size={14} /> WhatsApp Client
              </a>
              <a href={`tel:${selectedClient.phone}`} className="btn btn-secondary btn-sm">
                <Phone size={14} /> Call ({selectedClient.phone})
              </a>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => {
                  setSelectedClient(null);
                  onOpenOrderModal();
                }}
              >
                <ShoppingCart size={14} /> New Order
              </button>
            </div>

            {/* Tab Navigation */}
            <div style={{ padding: '0 24px', borderBottom: '1px solid var(--border-default)' }}>
              <div className="tabs-nav" style={{ margin: 0 }}>
                <button
                  className={`tab-btn ${activeDrawerTab === 'overview' ? 'active' : ''}`}
                  onClick={() => setActiveDrawerTab('overview')}
                >
                  Overview & Leads
                </button>
                <button
                  className={`tab-btn ${activeDrawerTab === 'orders' ? 'active' : ''}`}
                  onClick={() => setActiveDrawerTab('orders')}
                >
                  Orders ({clientOrders.length})
                </button>
                <button
                  className={`tab-btn ${activeDrawerTab === 'invoices' ? 'active' : ''}`}
                  onClick={() => setActiveDrawerTab('invoices')}
                >
                  Invoices ({clientInvoices.length})
                </button>
                <button
                  className={`tab-btn ${activeDrawerTab === 'payments' ? 'active' : ''}`}
                  onClick={() => setActiveDrawerTab('payments')}
                >
                  Payments ({clientPayments.length})
                </button>
                <button
                  className={`tab-btn ${activeDrawerTab === 'followups' ? 'active' : ''}`}
                  onClick={() => setActiveDrawerTab('followups')}
                >
                  Follow-ups ({clientFollowUps.length})
                </button>
              </div>
            </div>

            {/* Drawer Body Content */}
            <div style={{ padding: '20px 24px', overflowY: 'auto', flex: 1 }}>
              {/* TAB 1: OVERVIEW */}
              {activeDrawerTab === 'overview' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div className="grid-3">
                    <div style={{ padding: '12px', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)' }}>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700 }}>TOTAL VALUE</div>
                      <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--primary-600)' }}>
                        {formatCurrency(selectedClient.totalBusinessValue)}
                      </div>
                    </div>
                    <div style={{ padding: '12px', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)' }}>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700 }}>PENDING BALANCE</div>
                      <div style={{ fontSize: '1.15rem', fontWeight: 800, color: selectedClient.pendingAmount > 0 ? 'var(--danger-text)' : 'var(--success-text)' }}>
                        {formatCurrency(selectedClient.pendingAmount)}
                      </div>
                    </div>
                    <div style={{ padding: '12px', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)' }}>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700 }}>ORDER FREQUENCY</div>
                      <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                        {selectedClient.orderFrequency || 'Monthly'}
                      </div>
                    </div>
                  </div>

                  <div className="card" style={{ background: 'var(--bg-subtle)' }}>
                    <h4 style={{ marginBottom: '10px', fontSize: '0.85rem' }}>Client Lead & Acquisition Tracking</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '0.82rem' }}>
                      <div><span style={{ color: 'var(--text-muted)' }}>Lead Source:</span> <strong>{selectedClient.leadSource}</strong></div>
                      <div><span style={{ color: 'var(--text-muted)' }}>Lead Type:</span> <strong>{selectedClient.leadType}</strong></div>
                      <div><span style={{ color: 'var(--text-muted)' }}>Sales Rep:</span> <strong>{selectedClient.assignedSalesPerson}</strong></div>
                      <div><span style={{ color: 'var(--text-muted)' }}>Conversion:</span> <span className="badge badge-success">Converted (100%)</span></div>
                      <div><span style={{ color: 'var(--text-muted)' }}>Payment Terms:</span> <strong>{selectedClient.paymentTerms} ({selectedClient.paymentDays} days)</strong></div>
                      <div><span style={{ color: 'var(--text-muted)' }}>Next Expected Order:</span> <strong>{formatDate(selectedClient.nextExpectedOrder)}</strong></div>
                    </div>
                  </div>

                  <div className="card">
                    <h4 style={{ marginBottom: '10px', fontSize: '0.85rem' }}>Contact & Billing Details</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '0.82rem' }}>
                      <div><span style={{ color: 'var(--text-muted)' }}>Primary Contact:</span> <strong>{selectedClient.contactPerson}</strong></div>
                      <div><span style={{ color: 'var(--text-muted)' }}>Phone:</span> <strong>{selectedClient.phone}</strong></div>
                      <div><span style={{ color: 'var(--text-muted)' }}>Email:</span> <strong>{selectedClient.email || '—'}</strong></div>
                      <div><span style={{ color: 'var(--text-muted)' }}>Last Order:</span> <strong>{formatDate(selectedClient.lastOrder)}</strong></div>
                    </div>
                  </div>

                  <div className="card">
                    <h4 style={{ marginBottom: '8px', fontSize: '0.85rem' }}>Client Notes & Activity Log</h4>
                    <div style={{ fontSize: '0.82rem', whiteSpace: 'pre-line', color: 'var(--text-secondary)', background: 'var(--bg-app)', padding: '10px', borderRadius: 'var(--radius-sm)', maxHeight: '140px', overflowY: 'auto' }}>
                      {selectedClient.notes || 'No notes logged yet.'}
                    </div>

                    <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Append quick note to client record..."
                        value={quickNote}
                        onChange={(e) => setQuickNote(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') handleSaveNote(); }}
                      />
                      <button className="btn btn-secondary btn-sm" onClick={handleSaveNote}>
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: ORDERS */}
              {activeDrawerTab === 'orders' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {clientOrders.length > 0 ? (
                    clientOrders.map((ord) => (
                      <div key={ord.id} className="card" style={{ padding: '14px' }}>
                        <div className="flex-between">
                          <strong>{ord.id}</strong>
                          <span className={`badge ${getStatusBadgeClass(ord.deliveryStatus)}`}>{ord.deliveryStatus}</span>
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                          📅 {formatDate(ord.orderDate)} • Assigned: {ord.assignedTeamMember}
                        </div>
                        <div style={{ margin: '8px 0', fontSize: '0.82rem' }}>
                          <strong>Items:</strong> {ord.productCode} ({ord.quantity} units)
                        </div>
                        <div className="flex-between" style={{ paddingTop: '6px', borderTop: '1px solid var(--border-subtle)' }}>
                          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Payment: {ord.paymentStatus}</span>
                          <strong style={{ color: 'var(--primary-600)' }}>{formatCurrency(ord.orderValue)}</strong>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div style={{ padding: '32px 0', textAlign: 'center', color: 'var(--text-muted)' }}>
                      No orders placed by this client yet.
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: INVOICES */}
              {activeDrawerTab === 'invoices' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {clientInvoices.length > 0 ? (
                    clientInvoices.map((inv) => (
                      <div key={inv.id} className="card" style={{ padding: '14px' }}>
                        <div className="flex-between">
                          <strong>{inv.invoiceNumber}</strong>
                          <span className={`badge ${getStatusBadgeClass(inv.paymentStatus)}`}>{inv.paymentStatus}</span>
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                          Due Date: {formatDate(inv.paymentDueDate)} ({inv.paymentTerms})
                        </div>
                        <div className="flex-between" style={{ marginTop: '8px' }}>
                          <div>
                            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Total Invoiced</div>
                            <strong>{formatCurrency(inv.totalAmount)}</strong>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Balance Due</div>
                            <strong style={{ color: inv.balance > 0 ? 'var(--danger-text)' : 'var(--success-text)' }}>
                              {formatCurrency(inv.balance)}
                            </strong>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div style={{ padding: '32px 0', textAlign: 'center', color: 'var(--text-muted)' }}>
                      No invoices issued for this client.
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: PAYMENTS */}
              {activeDrawerTab === 'payments' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {clientPayments.length > 0 ? (
                    clientPayments.map((p) => (
                      <div key={p.id} className="card" style={{ padding: '14px' }}>
                        <div className="flex-between">
                          <strong>{p.invoiceNumber}</strong>
                          <span className={`badge ${getStatusBadgeClass(p.paymentStatus)}`}>{p.paymentStatus}</span>
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                          Mode: {p.paymentMode} • Due: {formatDate(p.paymentDueDate)}
                        </div>
                        <div className="flex-between" style={{ marginTop: '8px' }}>
                          <div>
                            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Paid Amount</div>
                            <strong style={{ color: 'var(--success-text)' }}>{formatCurrency(p.amountPaid)}</strong>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Outstanding</div>
                            <strong style={{ color: p.balance > 0 ? 'var(--danger-text)' : 'var(--text-muted)' }}>
                              {formatCurrency(p.balance)}
                            </strong>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div style={{ padding: '32px 0', textAlign: 'center', color: 'var(--text-muted)' }}>
                      No payment records for this client.
                    </div>
                  )}
                </div>
              )}

              {/* TAB 5: FOLLOW-UPS */}
              {activeDrawerTab === 'followups' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {clientFollowUps.length > 0 ? (
                    clientFollowUps.map((flw) => (
                      <div key={flw.id} className="card" style={{ padding: '14px' }}>
                        <div className="flex-between">
                          <span className="badge badge-purple">{flw.followUpType}</span>
                          <span className={`badge ${getStatusBadgeClass(flw.status)}`}>{flw.status}</span>
                        </div>
                        <p style={{ fontSize: '0.84rem', color: 'var(--text-primary)', marginTop: '6px' }}>
                          {flw.notes}
                        </p>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '6px' }}>
                          📅 Scheduled: {formatDate(flw.followUpDate)} • Rep: {flw.assignedSalesperson}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div style={{ padding: '32px 0', textAlign: 'center', color: 'var(--text-muted)' }}>
                      No follow-ups logged for this client.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
