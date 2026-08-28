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
  Trash2,
  CheckCircle2,
  Clock,
  Copy,
  Check
} from 'lucide-react';
import { formatCurrency, formatDate, getStatusBadgeClass, getWhatsAppUrl } from '../utils/formatters';

export const ClientsView = ({ onOpenClientModal, onOpenOrderModal }) => {
  const { clients, orders, invoices, payments, followUps, updateClient, deleteClient, selectedCompany, companyBrands, matchesCompany, addToast } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [stateFilter, setStateFilter] = useState('ALL');
  const [selectedClient, setSelectedClient] = useState(null);
  const [editingClient, setEditingClient] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [activeDrawerTab, setActiveDrawerTab] = useState('overview'); // 'overview' | 'orders' | 'invoices' | 'payments' | 'followups'
  const [quickNote, setQuickNote] = useState('');
  const [copiedId, setCopiedId] = useState(null);

  // Scoped clients by company
  const scopedClients = clients.filter(matchesCompany);

  // Extract unique states for filter
  const uniqueStates = Array.from(new Set(scopedClients.map((c) => c.state).filter(Boolean)));

  // Filter clients
  const filteredClients = scopedClients.filter((client) => {
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

  const clientOrders = selectedClient ? orders.filter((o) => o.clientId === selectedClient.id || o.clientName === selectedClient.companyName) : [];
  const clientInvoices = selectedClient ? invoices.filter((i) => i.clientId === selectedClient.id || i.clientName === selectedClient.companyName) : [];
  const clientPayments = selectedClient ? payments.filter((p) => p.clientId === selectedClient.id || p.clientName === selectedClient.companyName) : [];
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

  const handleStartEdit = (client) => {
    setEditingClient(client);
    setEditFormData({
      companyName: client.companyName || '',
      contactPerson: client.contactPerson || '',
      phone: client.phone || '',
      email: client.email || '',
      address: client.address || '',
      city: client.city || '',
      state: client.state || '',
      clientType: client.clientType || 'Enterprise',
      clientStatus: client.clientStatus || 'Active',
      paymentTerms: client.paymentTerms || 'Net 30'
    });
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editingClient) return;
    updateClient(editingClient.id, editFormData);
    if (selectedClient && selectedClient.id === editingClient.id) {
      setSelectedClient((prev) => ({ ...prev, ...editFormData }));
    }
    setEditingClient(null);
  };

  const handleDeleteClient = (client) => {
    if (window.confirm(`Are you sure you want to delete client account "${client.companyName}" (${client.id})?`)) {
      deleteClient(client.id);
      if (selectedClient && selectedClient.id === client.id) {
        setSelectedClient(null);
      }
    }
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
                      href={getWhatsAppUrl(client.phone, `Hello ${client.contactPerson}, greetings from ${client.brand === 'AIWA' ? 'Aiwa India' : 'Auco Automation'}.`)}
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
            {filteredClients.length === 0 && (
              <tr>
                <td colSpan="10" style={{ textAlign: 'center', padding: '48px 16px', color: 'var(--text-muted)' }}>
                  <Building2 size={36} style={{ margin: '0 auto 10px', opacity: 0.4 }} />
                  <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>No clients found</div>
                  <p style={{ fontSize: '0.8rem', marginTop: '4px' }}>Try adjusting your search query, type filter, or state filter.</p>
                </td>
              </tr>
            )}
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
            <div style={{ padding: '10px 24px', background: 'var(--bg-subtle)', borderBottom: '1px solid var(--border-default)', display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
              <a
                href={getWhatsAppUrl(selectedClient.phone, `Hello ${selectedClient.contactPerson}, following up from ${selectedClient.brand === 'AIWA' ? 'Aiwa India' : 'Auco Automation'} regarding your orders.`)}
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
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => handleStartEdit(selectedClient)}
              >
                <Edit2 size={13} /> Edit Details
              </button>
              <button
                className="btn btn-danger btn-sm"
                onClick={() => handleDeleteClient(selectedClient)}
                style={{ marginLeft: 'auto' }}
              >
                <Trash2 size={13} /> Delete Account
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

      {/* =========================================================================
          EDIT CLIENT MODAL
          ========================================================================= */}
      {editingClient && (
        <div className="modal-backdrop" onClick={() => setEditingClient(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
            <div className="modal-header">
              <div>
                <span className="badge badge-purple">{editingClient.id}</span>
                <h3 style={{ marginTop: '4px' }}>Edit Client Account</h3>
              </div>
              <button className="btn btn-ghost btn-icon" onClick={() => setEditingClient(null)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveEdit}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div className="form-group">
                  <label className="form-label">Company / Account Name *</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    value={editFormData.companyName || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, companyName: e.target.value })}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Contact Person *</label>
                    <input
                      type="text"
                      required
                      className="form-input"
                      value={editFormData.contactPerson || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, contactPerson: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone Number *</label>
                    <input
                      type="text"
                      required
                      className="form-input"
                      value={editFormData.phone || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input
                      type="email"
                      className="form-input"
                      value={editFormData.email || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Client Type</label>
                    <select
                      className="form-select"
                      value={editFormData.clientType || 'Enterprise'}
                      onChange={(e) => setEditFormData({ ...editFormData, clientType: e.target.value })}
                    >
                      <option value="Enterprise">Enterprise</option>
                      <option value="OEM Partner">OEM Partner</option>
                      <option value="Government / PSU">Government / PSU</option>
                      <option value="System Integrator">System Integrator</option>
                      <option value="Distributor">Distributor</option>
                      <option value="SME">SME</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Street / Facility Address</label>
                  <input
                    type="text"
                    className="form-input"
                    value={editFormData.address || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, address: e.target.value })}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">City *</label>
                    <input
                      type="text"
                      required
                      className="form-input"
                      value={editFormData.city || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, city: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">State *</label>
                    <input
                      type="text"
                      required
                      className="form-input"
                      value={editFormData.state || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, state: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Account Status</label>
                    <select
                      className="form-select"
                      value={editFormData.clientStatus || 'Active'}
                      onChange={(e) => setEditFormData({ ...editFormData, clientStatus: e.target.value })}
                    >
                      <option value="Active">Active</option>
                      <option value="Pending KYC">Pending KYC</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Payment Terms</label>
                    <select
                      className="form-select"
                      value={editFormData.paymentTerms || 'Net 30'}
                      onChange={(e) => setEditFormData({ ...editFormData, paymentTerms: e.target.value })}
                    >
                      <option value="Immediate">Immediate / Advance</option>
                      <option value="Net 15">Net 15 Days</option>
                      <option value="Net 30">Net 30 Days</option>
                      <option value="Net 45">Net 45 Days</option>
                      <option value="Net 60">Net 60 Days</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setEditingClient(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

