import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import {
  Search,
  Building2,
  Users,
  ShoppingCart,
  Boxes,
  FileText,
  CheckSquare,
  Truck,
  ArrowRight,
  X
} from 'lucide-react';
import { formatCurrency, getStatusBadgeClass } from '../utils/formatters';

export const GlobalSearchModal = ({ isOpen, onClose, onNavigate }) => {
  const { clients, leads, orders, inventory, invoices, tasks, dispatches } = useApp();
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else onNavigate(null, true);
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, onNavigate]);

  if (!isOpen) return null;

  const q = query.trim().toLowerCase();

  // Search clients
  const matchedClients = q
    ? clients.filter(
        (c) =>
          c.clientName.toLowerCase().includes(q) ||
          c.companyName.toLowerCase().includes(q) ||
          c.city.toLowerCase().includes(q) ||
          c.phone.includes(q) ||
          c.id.toLowerCase().includes(q)
      )
    : [];

  // Search leads
  const matchedLeads = q
    ? leads.filter(
        (l) =>
          l.company.toLowerCase().includes(q) ||
          l.client.toLowerCase().includes(q) ||
          l.stage.toLowerCase().includes(q) ||
          l.id.toLowerCase().includes(q)
      )
    : [];

  // Search orders
  const matchedOrders = q
    ? orders.filter(
        (o) =>
          o.id.toLowerCase().includes(q) ||
          o.clientName.toLowerCase().includes(q) ||
          o.productCode.toLowerCase().includes(q)
      )
    : [];

  // Search products
  const matchedProducts = q
    ? inventory.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.productCode.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      )
    : [];

  // Search invoices
  const matchedInvoices = q
    ? invoices.filter(
        (i) =>
          i.invoiceNumber.toLowerCase().includes(q) ||
          i.clientName.toLowerCase().includes(q) ||
          i.paymentStatus.toLowerCase().includes(q)
      )
    : [];

  // Search tasks
  const matchedTasks = q
    ? tasks.filter(
        (t) =>
          t.taskName.toLowerCase().includes(q) ||
          t.assignedPerson.toLowerCase().includes(q) ||
          t.client.toLowerCase().includes(q)
      )
    : [];

  // Search dispatches & challans
  const matchedDispatches = q
    ? dispatches.filter(
        (d) =>
          d.challanNumber.toLowerCase().includes(q) ||
          d.trackingNumber.toLowerCase().includes(q) ||
          d.courierCarrier.toLowerCase().includes(q) ||
          d.clientName.toLowerCase().includes(q) ||
          d.orderId.toLowerCase().includes(q)
      )
    : [];

  const totalMatches =
    matchedClients.length +
    matchedLeads.length +
    matchedOrders.length +
    matchedProducts.length +
    matchedInvoices.length +
    matchedTasks.length +
    matchedDispatches.length;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-content modal-content-lg"
        onClick={(e) => e.stopPropagation()}
        style={{ marginTop: '5vh' }}
      >
        {/* Search Input Header */}
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid var(--border-default)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}
        >
          <Search size={20} style={{ color: 'var(--text-muted)' }} />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type client, lead, order, product code (e.g. AUC-101), invoice #, task..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              fontSize: '1rem',
              fontFamily: 'var(--font-sans)',
              color: 'var(--text-primary)',
              background: 'transparent'
            }}
          />
          <button
            onClick={onClose}
            style={{
              background: 'var(--bg-subtle)',
              border: '1px solid var(--border-default)',
              borderRadius: 'var(--radius-sm)',
              padding: '4px 8px',
              fontSize: '0.75rem',
              cursor: 'pointer',
              color: 'var(--text-muted)'
            }}
          >
            ESC
          </button>
        </div>

        {/* Search Results Area */}
        <div style={{ maxHeight: '480px', overflowY: 'auto', padding: '16px 20px' }}>
          {!q && (
            <div style={{ padding: '32px 0', textAlign: 'center', color: 'var(--text-muted)' }}>
              <p style={{ fontSize: '0.9rem', marginBottom: '8px' }}>
                Search across all Auco & Aiwa business data instantly.
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <span className="badge badge-neutral">Clients</span>
                <span className="badge badge-neutral">Leads</span>
                <span className="badge badge-neutral">AUC / AIW Product Codes</span>
                <span className="badge badge-neutral">Orders & Invoices</span>
                <span className="badge badge-neutral">Assigned Tasks</span>
              </div>
            </div>
          )}

          {q && totalMatches === 0 && (
            <div style={{ padding: '32px 0', textAlign: 'center', color: 'var(--text-muted)' }}>
              No records found matching "<strong>{query}</strong>".
            </div>
          )}

          {/* Products */}
          {matchedProducts.length > 0 && (
            <div style={{ marginBottom: '18px' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Boxes size={14} /> Products & Inventory ({matchedProducts.length})
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {matchedProducts.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => { onNavigate('inventory'); onClose(); }}
                    style={{
                      padding: '10px 12px',
                      background: 'var(--bg-subtle)',
                      borderRadius: 'var(--radius-md)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span className={`badge ${p.brand === 'AIWA' || p.productCode?.startsWith('AIW') ? 'badge-purple' : 'badge-info'}`} style={{ fontSize: '0.65rem', padding: '1px 5px' }}>
                          {p.brand === 'AIWA' || p.productCode?.startsWith('AIW') ? 'AIWA' : 'AUCO'}
                        </span>
                        <strong style={{ color: 'var(--primary-600)' }}>[{p.productCode}]</strong>
                        <span>{p.name}</span>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                        SKU: {p.sku} • Stock: {p.availableStock} available • Price: {formatCurrency(p.price)}
                      </div>
                    </div>
                    <ArrowRight size={14} style={{ color: 'var(--text-muted)' }} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Clients */}
          {matchedClients.length > 0 && (
            <div style={{ marginBottom: '18px' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Building2 size={14} /> Clients ({matchedClients.length})
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {matchedClients.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => { onNavigate('clients'); onClose(); }}
                    style={{
                      padding: '10px 12px',
                      background: 'var(--bg-subtle)',
                      borderRadius: 'var(--radius-md)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span className={`badge ${c.brand === 'AIWA' ? 'badge-purple' : (c.brand === 'BOTH' ? 'badge-neutral' : 'badge-info')}`} style={{ fontSize: '0.65rem', padding: '1px 5px' }}>
                          {c.brand || 'AUCO'}
                        </span>
                        <strong>{c.companyName}</strong> ({c.contactPerson})
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                        {c.city}, {c.state} • {c.phone} • {c.totalOrders} Orders ({formatCurrency(c.totalBusinessValue)})
                      </div>
                    </div>
                    <span className="badge badge-success">{c.clientStatus}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Leads */}
          {matchedLeads.length > 0 && (
            <div style={{ marginBottom: '18px' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Users size={14} /> Leads & Prospects ({matchedLeads.length})
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {matchedLeads.map((l) => (
                  <div
                    key={l.id}
                    onClick={() => { onNavigate('leads'); onClose(); }}
                    style={{
                      padding: '10px 12px',
                      background: 'var(--bg-subtle)',
                      borderRadius: 'var(--radius-md)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span className={`badge ${l.brand === 'AIWA' ? 'badge-purple' : 'badge-info'}`} style={{ fontSize: '0.65rem', padding: '1px 5px' }}>
                          {l.brand || 'AUCO'}
                        </span>
                        <strong>{l.company}</strong> — {l.client}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                        Value: {formatCurrency(l.expectedValue)} • Rep: {l.assignedSalesperson}
                      </div>
                    </div>
                    <span className={`badge ${getStatusBadgeClass(l.stage)}`}>{l.stage}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Orders */}
          {matchedOrders.length > 0 && (
            <div style={{ marginBottom: '18px' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ShoppingCart size={14} /> Orders ({matchedOrders.length})
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {matchedOrders.map((o) => (
                  <div
                    key={o.id}
                    onClick={() => { onNavigate('orders'); onClose(); }}
                    style={{
                      padding: '10px 12px',
                      background: 'var(--bg-subtle)',
                      borderRadius: 'var(--radius-md)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span className={`badge ${o.brand === 'AIWA' ? 'badge-purple' : 'badge-info'}`} style={{ fontSize: '0.65rem', padding: '1px 5px' }}>
                          {o.brand || 'AUCO'}
                        </span>
                        <strong>{o.id}</strong> — {o.clientName}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                        Items: {o.productCode} • {formatCurrency(o.orderValue)}
                      </div>
                    </div>
                    <span className={`badge ${getStatusBadgeClass(o.deliveryStatus)}`}>{o.deliveryStatus}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Invoices */}
          {matchedInvoices.length > 0 && (
            <div style={{ marginBottom: '18px' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <FileText size={14} /> Invoices ({matchedInvoices.length})
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {matchedInvoices.map((inv) => (
                  <div
                    key={inv.id}
                    onClick={() => { onNavigate('invoices'); onClose(); }}
                    style={{
                      padding: '10px 12px',
                      background: 'var(--bg-subtle)',
                      borderRadius: 'var(--radius-md)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span className={`badge ${inv.brand === 'AIWA' ? 'badge-purple' : 'badge-info'}`} style={{ fontSize: '0.65rem', padding: '1px 5px' }}>
                          {inv.brand || 'AUCO'}
                        </span>
                        <strong>{inv.invoiceNumber}</strong> — {inv.clientName}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                        Total: {formatCurrency(inv.totalAmount)} • Balance: {formatCurrency(inv.balance)}
                      </div>
                    </div>
                    <span className={`badge ${getStatusBadgeClass(inv.paymentStatus)}`}>{inv.paymentStatus}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tasks */}
          {matchedTasks.length > 0 && (
            <div style={{ marginBottom: '18px' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckSquare size={14} /> Tasks ({matchedTasks.length})
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {matchedTasks.map((t) => (
                  <div
                    key={t.id}
                    onClick={() => { onNavigate('tasks'); onClose(); }}
                    style={{
                      padding: '10px 12px',
                      background: 'var(--bg-subtle)',
                      borderRadius: 'var(--radius-md)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span className={`badge ${t.brand === 'AIWA' ? 'badge-purple' : 'badge-info'}`} style={{ fontSize: '0.65rem', padding: '1px 5px' }}>
                          {t.brand || 'AUCO'}
                        </span>
                        <strong>{t.taskName}</strong>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                        Assigned: {t.assignedPerson} • Client: {t.client}
                      </div>
                    </div>
                    <span className={`badge ${getStatusBadgeClass(t.status)}`}>{t.status}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Dispatches & Delivery Challans */}
          {matchedDispatches.length > 0 && (
            <div style={{ marginBottom: '18px' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Truck size={14} /> Shipments & Dispatches ({matchedDispatches.length})
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {matchedDispatches.map((d) => (
                  <div
                    key={d.id}
                    onClick={() => { onNavigate('orders'); onClose(); }}
                    style={{
                      padding: '10px 12px',
                      background: 'var(--bg-subtle)',
                      borderRadius: 'var(--radius-md)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span className={`badge ${d.brand === 'AIWA' ? 'badge-purple' : 'badge-info'}`} style={{ fontSize: '0.65rem', padding: '1px 5px' }}>
                          {d.brand || 'AUCO'}
                        </span>
                        <strong>{d.challanNumber}</strong> — {d.clientName}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                        Courier: {d.courierCarrier} • AWB: {d.trackingNumber} • Order: {d.orderId}
                      </div>
                    </div>
                    <span className={`badge ${getStatusBadgeClass(d.dispatchStatus)}`}>{d.dispatchStatus}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
