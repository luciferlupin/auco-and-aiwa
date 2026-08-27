import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Plus,
  Trash2,
  Search,
  Building2,
  Users,
  ShoppingCart,
  FileText,
  CheckSquare,
  AlertTriangle
} from 'lucide-react';
import { formatCurrency, generateId } from '../utils/formatters';

// =========================================================================
// 1. CREATE LEAD MODAL
// =========================================================================
export const CreateLeadModal = ({ isOpen, onClose }) => {
  const { addLead, currentUser } = useApp();
  const [formData, setFormData] = useState({
    company: '',
    client: '',
    phone: '',
    email: '',
    city: 'Pune',
    state: 'Maharashtra',
    leadSource: 'WhatsApp',
    leadType: 'Inbound',
    expectedValue: 150000,
    assignedSalesperson: currentUser.name,
    followUpDate: new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0],
    nextAction: 'Schedule product demo and share brochure',
    notes: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.company || !formData.client) return;
    addLead(formData);
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          <div className="modal-header">
            <h3>Add New Lead to Pipeline</h3>
            <button type="button" className="btn btn-ghost btn-icon" onClick={onClose}>✕</button>
          </div>

          <div className="modal-body">
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Company / Business Name *</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  placeholder="e.g. Acme Automation Corp"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Contact Person Name *</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  placeholder="e.g. Ramesh Patel"
                  value={formData.client}
                  onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                />
              </div>
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Phone Number *</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  placeholder="e.g. +91 98220 12345"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="e.g. ramesh@acme.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">City</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">State</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                />
              </div>
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Lead Source</label>
                <select
                  className="form-select"
                  value={formData.leadSource}
                  onChange={(e) => setFormData({ ...formData, leadSource: e.target.value })}
                >
                  <option value="WhatsApp">WhatsApp Inquiry</option>
                  <option value="Website">Website Form</option>
                  <option value="Cold Outreach">Cold Outreach</option>
                  <option value="Referral">Partner Referral</option>
                  <option value="Exhibition">Trade Exhibition</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Expected Deal Value (INR) *</label>
                <input
                  type="number"
                  required
                  min="0"
                  className="form-input"
                  value={formData.expectedValue}
                  onChange={(e) => setFormData({ ...formData, expectedValue: Number(e.target.value) })}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Next Action / Next Step</label>
              <input
                type="text"
                className="form-input"
                value={formData.nextAction}
                onChange={(e) => setFormData({ ...formData, nextAction: e.target.value })}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Save Lead</button>
          </div>
        </form>
      </div>
    </div>
  );
};

// =========================================================================
// 2. CREATE CLIENT MODAL
// =========================================================================
export const CreateClientModal = ({ isOpen, onClose }) => {
  const { addClient, currentUser } = useApp();
  const [formData, setFormData] = useState({
    companyName: '',
    clientName: '',
    contactPerson: '',
    phone: '',
    email: '',
    address: '',
    city: 'Mumbai',
    state: 'Maharashtra',
    clientType: 'Enterprise',
    leadSource: 'Website',
    leadType: 'Inbound',
    assignedSalesPerson: currentUser.name,
    paymentTerms: 'Net 30',
    paymentDays: 30,
    orderFrequency: 'Monthly',
    notes: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.companyName || !formData.phone) return;
    addClient(formData);
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content modal-content-lg" onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          <div className="modal-header">
            <h3>Add New Enterprise Client</h3>
            <button type="button" className="btn btn-ghost btn-icon" onClick={onClose}>✕</button>
          </div>

          <div className="modal-body">
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Company Name *</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  placeholder="e.g. Apex Industrial Systems Ltd"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value, clientName: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Primary Contact Person *</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  placeholder="e.g. Amit Kothari (Director)"
                  value={formData.contactPerson}
                  onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                />
              </div>
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Phone (WhatsApp enabled) *</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  placeholder="e.g. +91 98220 99887"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Billing Email</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="e.g. accounts@apexsys.in"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Billing Address</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Plot 15, TTC Industrial Area, Mahape"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">City *</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">State *</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                />
              </div>
            </div>

            <div className="grid-3">
              <div className="form-group">
                <label className="form-label">Client Type</label>
                <select
                  className="form-select"
                  value={formData.clientType}
                  onChange={(e) => setFormData({ ...formData, clientType: e.target.value })}
                >
                  <option value="Enterprise">Enterprise</option>
                  <option value="SME">SME</option>
                  <option value="Distributor">Distributor</option>
                  <option value="Retail">Retail</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Payment Terms</label>
                <select
                  className="form-select"
                  value={formData.paymentTerms}
                  onChange={(e) => {
                    const days = e.target.value === 'Net 15' ? 15 : e.target.value === 'Net 45' ? 45 : 30;
                    setFormData({ ...formData, paymentTerms: e.target.value, paymentDays: days });
                  }}
                >
                  <option value="Net 30">Net 30 Days</option>
                  <option value="Net 15">Net 15 Days</option>
                  <option value="Net 45">Net 45 Days</option>
                  <option value="Immediate">Immediate Settlement</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Order Frequency</label>
                <select
                  className="form-select"
                  value={formData.orderFrequency}
                  onChange={(e) => setFormData({ ...formData, orderFrequency: e.target.value })}
                >
                  <option value="Monthly">Monthly</option>
                  <option value="Bi-weekly">Bi-weekly</option>
                  <option value="Quarterly">Quarterly</option>
                  <option value="One-time">One-time</option>
                </select>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Save Client</button>
          </div>
        </form>
      </div>
    </div>
  );
};

// =========================================================================
// 3. CREATE ORDER MODAL (WITH PRODUCT CODE MATCHING & AUTO STOCK DEDUCTION)
// =========================================================================
export const CreateOrderModal = ({ isOpen, onClose }) => {
  const { clients, inventory, lookupProductByCode, createOrder, currentUser } = useApp();
  const [selectedClientId, setSelectedClientId] = useState('');
  const [items, setItems] = useState([
    { productCode: 'AUC-101', name: 'Auco Industrial Automation Controller X1', quantity: 1, price: 45000, availableStock: 45 }
  ]);
  const [deliveryStatus, setDeliveryStatus] = useState('In Progress');
  const [assignedMember, setAssignedMember] = useState(currentUser.name);

  if (!isOpen) return null;

  const handleProductCodeChange = (index, code) => {
    const matched = lookupProductByCode(code);
    const updated = [...items];
    if (matched) {
      updated[index] = {
        productCode: matched.productCode,
        name: matched.name,
        price: matched.price,
        availableStock: matched.availableStock,
        quantity: updated[index].quantity || 1
      };
    } else {
      updated[index] = {
        ...updated[index],
        productCode: code.toUpperCase()
      };
    }
    setItems(updated);
  };

  const handleQuantityChange = (index, qty) => {
    const updated = [...items];
    updated[index].quantity = Math.max(1, Number(qty));
    setItems(updated);
  };

  const handleAddItem = () => {
    const firstProd = inventory[0] || { productCode: 'AUC-101', name: 'Product', price: 10000, availableStock: 10 };
    setItems([...items, { productCode: firstProd.productCode, name: firstProd.name, price: firstProd.price, availableStock: firstProd.availableStock, quantity: 1 }]);
  };

  const handleRemoveItem = (index) => {
    if (items.length <= 1) return;
    setItems(items.filter((_, idx) => idx !== index));
  };

  const totalOrderValue = items.reduce((acc, i) => acc + (Number(i.price || 0) * Number(i.quantity || 1)), 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    const client = clients.find((c) => c.id === selectedClientId) || clients[0];
    if (!client) return;

    createOrder({
      clientId: client.id,
      clientName: client.companyName,
      items: items.map(i => ({ productCode: i.productCode, name: i.name, quantity: i.quantity, price: i.price, total: i.price * i.quantity })),
      orderValue: totalOrderValue,
      deliveryStatus,
      assignedTeamMember: assignedMember
    });

    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content modal-content-lg" onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          <div className="modal-header">
            <div>
              <span className="badge badge-purple">Automated Inventory Stock Deduction</span>
              <h3 style={{ marginTop: '4px' }}>Create New Client Order</h3>
            </div>
            <button type="button" className="btn btn-ghost btn-icon" onClick={onClose}>✕</button>
          </div>

          <div className="modal-body">
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Select Client *</label>
                <select
                  required
                  className="form-select"
                  value={selectedClientId}
                  onChange={(e) => setSelectedClientId(e.target.value)}
                >
                  <option value="">-- Choose Client Company --</option>
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>{c.companyName} ({c.city})</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Assigned Delivery / Sales Member</label>
                <input
                  type="text"
                  className="form-input"
                  value={assignedMember}
                  onChange={(e) => setAssignedMember(e.target.value)}
                />
              </div>
            </div>

            {/* Product Code Line Items */}
            <div style={{ marginTop: '10px', marginBottom: '14px' }}>
              <div className="flex-between" style={{ marginBottom: '8px' }}>
                <label className="form-label" style={{ margin: 0 }}>
                  Order Line Items (Search by Product Code)
                </label>
                <button type="button" className="btn btn-secondary btn-sm" onClick={handleAddItem}>
                  <Plus size={14} /> Add Line Item
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {items.map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '130px 1.5fr 70px 110px 110px 36px',
                      gap: '8px',
                      alignItems: 'center',
                      background: 'var(--bg-subtle)',
                      padding: '8px 10px',
                      borderRadius: 'var(--radius-md)'
                    }}
                  >
                    {/* Product Code input */}
                    <div>
                      <input
                        type="text"
                        placeholder="Code (e.g. AUC-101)"
                        className="form-input"
                        style={{ padding: '6px 8px', fontSize: '0.8rem', fontWeight: 700 }}
                        value={item.productCode}
                        onChange={(e) => handleProductCodeChange(idx, e.target.value)}
                      />
                    </div>

                    {/* Product Name & Available Stock indicator */}
                    <div>
                      <div style={{ fontSize: '0.82rem', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {item.name || 'Product not matched'}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: (item.availableStock || 0) <= 5 ? 'var(--danger-text)' : 'var(--text-muted)' }}>
                        Stock: {item.availableStock ?? '—'} available
                      </div>
                    </div>

                    {/* Qty */}
                    <div>
                      <input
                        type="number"
                        min="1"
                        className="form-input"
                        style={{ padding: '6px 8px', fontSize: '0.8rem', textAlign: 'center' }}
                        value={item.quantity}
                        onChange={(e) => handleQuantityChange(idx, e.target.value)}
                      />
                    </div>

                    {/* Unit Price */}
                    <div style={{ fontSize: '0.8rem', textAlign: 'right' }}>
                      {formatCurrency(item.price)}
                    </div>

                    {/* Total Price */}
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, textAlign: 'right', color: 'var(--primary-600)' }}>
                      {formatCurrency((item.price || 0) * (item.quantity || 1))}
                    </div>

                    {/* Delete */}
                    <div>
                      <button
                        type="button"
                        className="btn btn-ghost btn-icon"
                        style={{ width: '28px', height: '28px' }}
                        onClick={() => handleRemoveItem(idx)}
                        disabled={items.length <= 1}
                      >
                        <Trash2 size={14} style={{ color: 'var(--danger-text)' }} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Total Order Summary */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px', padding: '12px', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Total Order Value: </span>
                <strong style={{ fontSize: '1.25rem', color: 'var(--primary-600)' }}>{formatCurrency(totalOrderValue)}</strong>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Confirm & Deduct Stock</button>
          </div>
        </form>
      </div>
    </div>
  );
};

// =========================================================================
// 4. CREATE INVOICE MODAL
// =========================================================================
export const CreateInvoiceModal = ({ isOpen, onClose }) => {
  const { clients, inventory, lookupProductByCode, createInvoice } = useApp();
  const [selectedClientId, setSelectedClientId] = useState('');
  const [items, setItems] = useState([
    { productCode: 'AUC-101', name: 'Auco Industrial Automation Controller X1', quantity: 1, price: 45000 }
  ]);
  const [taxRate, setTaxRate] = useState(18);
  const [paymentTerms, setPaymentTerms] = useState('Net 30');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleProductCodeChange = (index, code) => {
    const matched = lookupProductByCode(code);
    const updated = [...items];
    if (matched) {
      updated[index] = {
        productCode: matched.productCode,
        name: matched.name,
        price: matched.price,
        quantity: updated[index].quantity || 1
      };
    } else {
      updated[index] = {
        ...updated[index],
        productCode: code.toUpperCase()
      };
    }
    setItems(updated);
  };

  const handleQuantityChange = (index, qty) => {
    const updated = [...items];
    updated[index].quantity = Math.max(1, Number(qty));
    setItems(updated);
  };

  const handleAddItem = () => {
    const firstProd = inventory[0] || { productCode: 'AUC-101', name: 'Product', price: 10000 };
    setItems([...items, { productCode: firstProd.productCode, name: firstProd.name, price: firstProd.price, quantity: 1 }]);
  };

  const subtotal = items.reduce((acc, i) => acc + (Number(i.price || 0) * Number(i.quantity || 1)), 0);
  const taxAmount = Math.round(subtotal * (Number(taxRate) / 100));
  const totalAmount = subtotal + taxAmount;

  const handleSubmit = (e) => {
    e.preventDefault();
    const client = clients.find((c) => c.id === selectedClientId) || clients[0];
    if (!client) return;

    createInvoice({
      clientId: client.id,
      clientName: client.companyName,
      contactPerson: client.contactPerson,
      phone: client.phone,
      email: client.email,
      billingAddress: `${client.address}, ${client.city}, ${client.state}`,
      items: items.map(i => ({ productCode: i.productCode, name: i.name, quantity: i.quantity, price: i.price, total: i.price * i.quantity })),
      taxRate: Number(taxRate),
      paymentTerms,
      notes
    });

    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content modal-content-lg" onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          <div className="modal-header">
            <div>
              <span className="badge badge-purple">GST Tax Invoicing</span>
              <h3 style={{ marginTop: '4px' }}>Generate New Tax Invoice</h3>
            </div>
            <button type="button" className="btn btn-ghost btn-icon" onClick={onClose}>✕</button>
          </div>

          <div className="modal-body">
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Billed Client *</label>
                <select
                  required
                  className="form-select"
                  value={selectedClientId}
                  onChange={(e) => setSelectedClientId(e.target.value)}
                >
                  <option value="">-- Choose Client Company --</option>
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>{c.companyName} ({c.city})</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Payment Terms</label>
                <select
                  className="form-select"
                  value={paymentTerms}
                  onChange={(e) => setPaymentTerms(e.target.value)}
                >
                  <option value="Net 30">Net 30 Days</option>
                  <option value="Net 15">Net 15 Days</option>
                  <option value="Net 45">Net 45 Days</option>
                  <option value="Immediate">Due on Receipt</option>
                </select>
              </div>
            </div>

            {/* Line Items */}
            <div style={{ marginTop: '10px', marginBottom: '14px' }}>
              <div className="flex-between" style={{ marginBottom: '8px' }}>
                <label className="form-label" style={{ margin: 0 }}>Invoice Items (Auto-matched by Product Code)</label>
                <button type="button" className="btn btn-secondary btn-sm" onClick={handleAddItem}>
                  <Plus size={14} /> Add Item
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {items.map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '130px 1.6fr 70px 110px 110px 36px',
                      gap: '8px',
                      alignItems: 'center',
                      background: 'var(--bg-subtle)',
                      padding: '8px 10px',
                      borderRadius: 'var(--radius-md)'
                    }}
                  >
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Code (e.g. AUC-101)"
                      style={{ padding: '6px 8px', fontSize: '0.8rem', fontWeight: 700 }}
                      value={item.productCode}
                      onChange={(e) => handleProductCodeChange(idx, e.target.value)}
                    />

                    <div style={{ fontSize: '0.82rem', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {item.name || 'Custom item'}
                    </div>

                    <input
                      type="number"
                      min="1"
                      className="form-input"
                      style={{ padding: '6px 8px', fontSize: '0.8rem', textAlign: 'center' }}
                      value={item.quantity}
                      onChange={(e) => handleQuantityChange(idx, e.target.value)}
                    />

                    <div style={{ fontSize: '0.8rem', textAlign: 'right' }}>
                      {formatCurrency(item.price)}
                    </div>

                    <div style={{ fontSize: '0.85rem', fontWeight: 700, textAlign: 'right', color: 'var(--primary-600)' }}>
                      {formatCurrency((item.price || 0) * (item.quantity || 1))}
                    </div>

                    <button
                      type="button"
                      className="btn btn-ghost btn-icon"
                      style={{ width: '28px', height: '28px' }}
                      onClick={() => setItems(items.filter((_, i) => i !== idx))}
                      disabled={items.length <= 1}
                    >
                      <Trash2 size={14} style={{ color: 'var(--danger-text)' }} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Invoicing Tax Totals */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '14px' }}>
              <div style={{ width: '280px', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.85rem' }}>
                <div className="flex-between">
                  <span style={{ color: 'var(--text-muted)' }}>Subtotal:</span>
                  <strong>{formatCurrency(subtotal)}</strong>
                </div>
                <div className="flex-between">
                  <span style={{ color: 'var(--text-muted)' }}>GST (18%):</span>
                  <strong>{formatCurrency(taxAmount)}</strong>
                </div>
                <div className="flex-between" style={{ paddingTop: '6px', borderTop: '2px solid var(--border-default)', fontSize: '1.05rem' }}>
                  <strong>Invoice Total:</strong>
                  <strong style={{ color: 'var(--primary-600)' }}>{formatCurrency(totalAmount)}</strong>
                </div>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Generate Tax Invoice</button>
          </div>
        </form>
      </div>
    </div>
  );
};

// =========================================================================
// 5. ASSIGN TASK MODAL
// =========================================================================
export const CreateTaskModal = ({ isOpen, onClose }) => {
  const { addTask, users, clients } = useApp();
  const [taskData, setTaskData] = useState({
    taskName: '',
    description: '',
    assignedPerson: users[0]?.name || 'Rajesh Sharma',
    client: clients[0]?.companyName || 'General Operations',
    priority: 'Medium',
    dueDate: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
    status: 'To Do'
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!taskData.taskName) return;
    addTask(taskData);
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          <div className="modal-header">
            <h3>Assign New Team Task</h3>
            <button type="button" className="btn btn-ghost btn-icon" onClick={onClose}>✕</button>
          </div>

          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Task Objective / Name *</label>
              <input
                type="text"
                required
                className="form-input"
                placeholder="e.g. Conduct on-site acoustic testing and firmware calibration"
                value={taskData.taskName}
                onChange={(e) => setTaskData({ ...taskData, taskName: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Detailed Description</label>
              <textarea
                className="form-textarea"
                placeholder="Scope of work, deliverables, client requirements..."
                value={taskData.description}
                onChange={(e) => setTaskData({ ...taskData, description: e.target.value })}
              />
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Assign To Team Member *</label>
                <select
                  className="form-select"
                  value={taskData.assignedPerson}
                  onChange={(e) => setTaskData({ ...taskData, assignedPerson: e.target.value })}
                >
                  {users.map((u) => (
                    <option key={u.id} value={u.name}>{u.name} ({u.role} - {u.department})</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Associated Client / Project</label>
                <input
                  type="text"
                  className="form-input"
                  value={taskData.client}
                  onChange={(e) => setTaskData({ ...taskData, client: e.target.value })}
                />
              </div>
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Priority Level</label>
                <select
                  className="form-select"
                  value={taskData.priority}
                  onChange={(e) => setTaskData({ ...taskData, priority: e.target.value })}
                >
                  <option value="Urgent">Urgent (SLA critical)</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Due Date *</label>
                <input
                  type="date"
                  required
                  className="form-input"
                  value={taskData.dueDate}
                  onChange={(e) => setTaskData({ ...taskData, dueDate: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Assign Task</button>
          </div>
        </form>
      </div>
    </div>
  );
};
