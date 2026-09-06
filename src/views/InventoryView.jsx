import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Boxes,
  Plus,
  Search,
  AlertTriangle,
  ArrowUp,
  ArrowDown,
  Package,
  Layers,
  Edit2,
  Trash2,
  X,
  CheckCircle2,
  Tag,
  Building2
} from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

// ─── Stock level bar ──────────────────────────────────────────────────────────
const StockBar = ({ available, max, min }) => {
  const pct = max > 0 ? Math.min(100, Math.round((available / max) * 100)) : 0;
  const isLow = available <= min;
  const color = isLow ? '#ef4444' : pct > 50 ? '#10b981' : '#f59e0b';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <div style={{ flex: 1, height: '6px', background: '#e2e8f0', borderRadius: '10px', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: '10px', transition: 'width 0.4s' }} />
      </div>
      <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', minWidth: '32px' }}>{pct}%</span>
    </div>
  );
};

// ─── Product Card ─────────────────────────────────────────────────────────────
const ProductCard = ({ p, onAdjust, onEdit, onDelete }) => {
  const isLow = p.availableStock <= p.minStockLevel;
  const maxStock = Math.max(p.currentStock, p.availableStock, p.minStockLevel * 3, 1);

  return (
    <div
      style={{
        background: '#fff',
        borderRadius: '14px',
        border: `1px solid ${isLow ? '#fecaca' : '#e2e8f0'}`,
        padding: '18px 20px',
        boxShadow: isLow ? '0 2px 8px rgba(220,38,38,0.06)' : '0 2px 8px rgba(0,0,0,0.04)',
        display: 'flex', flexDirection: 'column', gap: '14px',
        transition: 'box-shadow 0.15s'
      }}
      onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.09)')}
      onMouseLeave={(e) => (e.currentTarget.style.boxShadow = isLow ? '0 2px 8px rgba(220,38,38,0.06)' : '0 2px 8px rgba(0,0,0,0.04)')}
    >
      {/* Top */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#4f46e5', fontFamily: 'monospace', letterSpacing: '0.03em' }}>
              {p.productCode}
            </span>
            <span style={{
              fontSize: '0.68rem', padding: '2px 8px', borderRadius: '10px', fontWeight: 600,
              background: '#f1f5f9', color: '#64748b', border: '1px solid #e2e8f0'
            }}>
              {p.category}
            </span>
          </div>
          <div style={{ fontWeight: 700, fontSize: '1rem', color: '#0f172a', lineHeight: 1.3 }}>{p.name}</div>
          {p.sku && (
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '1px' }}>SKU: {p.sku}</div>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{
            padding: '4px 10px', borderRadius: '20px', fontWeight: 700, fontSize: '0.75rem',
            background: isLow ? '#fef2f2' : '#ecfdf5',
            border: `1px solid ${isLow ? '#fecaca' : '#a7f3d0'}`,
            color: isLow ? '#dc2626' : '#059669'
          }}>
            {isLow ? '⚠ Low Stock' : '✓ In Stock'}
          </span>
          <button
            onClick={() => onDelete(p)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#cbd5e1', padding: '2px', display: 'flex', borderRadius: '6px', transition: 'color 0.15s' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#ef4444')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#cbd5e1')}
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      {/* Stock numbers */}
      <div style={{ display: 'flex', gap: '0', borderRadius: '10px', overflow: 'hidden', border: '1px solid #f1f5f9' }}>
        <div style={{ flex: 1, padding: '10px 12px', background: '#f8fafc', borderRight: '1px solid #f1f5f9', textAlign: 'center' }}>
          <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 600, marginBottom: '2px' }}>Available</div>
          <div style={{ fontWeight: 800, fontSize: '1.3rem', color: isLow ? '#dc2626' : '#0f172a', lineHeight: 1 }}>{p.availableStock}</div>
          <div style={{ fontSize: '0.68rem', color: '#94a3b8', marginTop: '1px' }}>units</div>
        </div>
        <div style={{ flex: 1, padding: '10px 12px', background: '#f0fdf4', borderRight: '1px solid #f1f5f9', textAlign: 'center' }}>
          <div style={{ fontSize: '0.7rem', color: '#059669', fontWeight: 600, marginBottom: '2px' }}>In</div>
          <div style={{ fontWeight: 700, fontSize: '1rem', color: '#059669', lineHeight: 1 }}>+{p.stockIn}</div>
          <div style={{ fontSize: '0.68rem', color: '#94a3b8', marginTop: '1px' }}>received</div>
        </div>
        <div style={{ flex: 1, padding: '10px 12px', background: '#fef9f0', borderRight: '1px solid #f1f5f9', textAlign: 'center' }}>
          <div style={{ fontSize: '0.7rem', color: '#d97706', fontWeight: 600, marginBottom: '2px' }}>Out</div>
          <div style={{ fontWeight: 700, fontSize: '1rem', color: '#d97706', lineHeight: 1 }}>-{p.stockOut}</div>
          <div style={{ fontSize: '0.68rem', color: '#94a3b8', marginTop: '1px' }}>dispatched</div>
        </div>
        <div style={{ flex: 1, padding: '10px 12px', background: '#f8fafc', textAlign: 'center' }}>
          <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 600, marginBottom: '2px' }}>Price</div>
          <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#0f172a', lineHeight: 1 }}>{formatCurrency(p.price)}</div>
          <div style={{ fontSize: '0.68rem', color: '#94a3b8', marginTop: '1px' }}>per unit</div>
        </div>
      </div>

      {/* Stock bar */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
            Min threshold: <strong style={{ color: isLow ? '#dc2626' : '#64748b' }}>{p.minStockLevel} units</strong>
          </span>
          {p.supplier && (
            <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Building2 size={11} style={{ color: '#cbd5e1' }} /> {p.supplier}
            </span>
          )}
        </div>
        <StockBar available={p.availableStock} max={maxStock} min={p.minStockLevel} />
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '8px' }}>
        <button
          onClick={() => onAdjust(p)}
          style={{
            flex: 2,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px',
            padding: '11px', borderRadius: '10px',
            background: isLow ? 'linear-gradient(135deg,#4f46e5,#6366f1)' : 'linear-gradient(135deg,#0f172a,#1e293b)',
            color: '#fff', fontWeight: 700, fontSize: '0.9rem',
            border: 'none', cursor: 'pointer',
            boxShadow: isLow ? '0 4px 12px rgba(79,70,229,0.3)' : '0 4px 12px rgba(0,0,0,0.12)',
            transition: 'transform 0.1s'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-1px)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; }}
        >
          <ArrowUp size={15} style={{ opacity: 0.8 }} />
          Adjust Stock
        </button>
        <button
          onClick={() => onEdit(p)}
          style={{
            flex: 1,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
            padding: '11px', borderRadius: '10px',
            background: '#f8fafc', border: '1.5px solid #e2e8f0',
            color: '#475569', fontWeight: 600, fontSize: '0.86rem',
            cursor: 'pointer', transition: 'all 0.15s'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = '#f1f5f9'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = '#f8fafc'; }}
        >
          <Edit2 size={14} /> Edit
        </button>
      </div>
    </div>
  );
};

// ─── Adjust Stock Modal ───────────────────────────────────────────────────────
const AdjustModal = ({ p, onClose, onSubmit }) => {
  const [type, setType] = useState('ADD');
  const [amount, setAmount] = useState('10');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) return;
    const delta = type === 'ADD' ? Number(amount) : -Math.abs(Number(amount));
    onSubmit(p.productCode, delta, `Manual ${type}`);
    onClose();
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3000, padding: '16px' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={{ background: '#fff', borderRadius: '18px', width: '100%', maxWidth: '400px', boxShadow: '0 24px 64px rgba(0,0,0,0.18)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px 16px', borderBottom: '1px solid #f1f5f9' }}>
          <div>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#4f46e5', fontFamily: 'monospace', marginBottom: '2px' }}>{p.productCode}</div>
            <h2 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>{p.name}</h2>
          </div>
          <button onClick={onClose} style={{ background: '#f1f5f9', border: 'none', borderRadius: '8px', padding: '6px', cursor: 'pointer', display: 'flex', color: '#64748b' }}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Current stock */}
          <div style={{ display: 'flex', borderRadius: '10px', overflow: 'hidden', border: '1px solid #f1f5f9' }}>
            <div style={{ flex: 1, padding: '12px', background: '#f8fafc', textAlign: 'center', borderRight: '1px solid #f1f5f9' }}>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600, marginBottom: '2px' }}>CURRENT</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: p.availableStock <= p.minStockLevel ? '#dc2626' : '#0f172a' }}>{p.availableStock}</div>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>available</div>
            </div>
            <div style={{ flex: 1, padding: '12px', background: '#fffbeb', textAlign: 'center' }}>
              <div style={{ fontSize: '0.72rem', color: '#d97706', fontWeight: 600, marginBottom: '2px' }}>MINIMUM</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#d97706' }}>{p.minStockLevel}</div>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>threshold</div>
            </div>
          </div>

          {/* Type toggle */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <button type="button" onClick={() => setType('ADD')} style={{
              padding: '12px', borderRadius: '10px', fontWeight: 700, fontSize: '0.9rem',
              border: `2px solid ${type === 'ADD' ? '#10b981' : '#e2e8f0'}`,
              background: type === 'ADD' ? '#ecfdf5' : '#fff',
              color: type === 'ADD' ? '#059669' : '#64748b', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', transition: 'all 0.15s'
            }}>
              <ArrowUp size={16} /> Stock In
            </button>
            <button type="button" onClick={() => setType('REMOVE')} style={{
              padding: '12px', borderRadius: '10px', fontWeight: 700, fontSize: '0.9rem',
              border: `2px solid ${type === 'REMOVE' ? '#ef4444' : '#e2e8f0'}`,
              background: type === 'REMOVE' ? '#fef2f2' : '#fff',
              color: type === 'REMOVE' ? '#dc2626' : '#64748b', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', transition: 'all 0.15s'
            }}>
              <ArrowDown size={16} /> Stock Out
            </button>
          </div>

          {/* Amount */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#374151' }}>Number of Units <span style={{ color: '#ef4444' }}>*</span></label>
            <input
              type="number" required min="1"
              value={amount} onChange={(e) => setAmount(e.target.value)}
              style={{ padding: '12px 14px', borderRadius: '8px', border: '1.5px solid #e2e8f0', fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', outline: 'none', background: '#fff', textAlign: 'center' }}
            />
          </div>

          <button type="submit" style={{
            marginTop: '4px', padding: '13px', borderRadius: '10px',
            background: type === 'ADD' ? 'linear-gradient(135deg,#059669,#10b981)' : 'linear-gradient(135deg,#dc2626,#ef4444)',
            color: '#fff', fontWeight: 800, fontSize: '0.95rem', border: 'none', cursor: 'pointer',
            boxShadow: type === 'ADD' ? '0 4px 14px rgba(16,185,129,0.3)' : '0 4px 14px rgba(220,38,38,0.25)'
          }}>
            {type === 'ADD' ? `+ Add ${amount || 0} Units` : `- Remove ${amount || 0} Units`}
          </button>
        </form>
      </div>
    </div>
  );
};

// ─── Add/Edit Product Modal ───────────────────────────────────────────────────
const ProductModal = ({ title, data, setData, onClose, onSubmit, selectedCompany }) => {
  const CATEGORIES = ['Automation Hardware', 'Sensors & IOT', 'Commercial AV', 'Acoustics & Testing', 'Edge Computing', 'Services'];

  const inp = { padding: '10px 13px', borderRadius: '8px', border: '1.5px solid #e2e8f0', fontSize: '0.88rem', outline: 'none', background: '#fff', color: '#0f172a', fontFamily: 'var(--font-sans)', width: '100%', boxSizing: 'border-box' };

  const Field = ({ label, required, children }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
      <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#374151' }}>
        {label}{required && <span style={{ color: '#ef4444' }}> *</span>}
      </label>
      {children}
    </div>
  );

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3000, padding: '16px' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={{ background: '#fff', borderRadius: '18px', width: '100%', maxWidth: '520px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 24px 64px rgba(0,0,0,0.18)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px 16px', borderBottom: '1px solid #f1f5f9' }}>
          <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>{title}</h2>
          <button onClick={onClose} style={{ background: '#f1f5f9', border: 'none', borderRadius: '8px', padding: '6px', cursor: 'pointer', display: 'flex', color: '#64748b' }}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={onSubmit} style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <Field label="Product Name" required>
            <input style={inp} required placeholder="e.g. Auco Servo Drive Controller" value={data.name || ''} onChange={(e) => setData({ ...data, name: e.target.value })} />
          </Field>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <Field label="Product Code" required>
              <input style={inp} required placeholder="AUC-600" value={data.productCode || ''} onChange={(e) => setData({ ...data, productCode: e.target.value.toUpperCase() })} />
            </Field>
            <Field label="SKU">
              <input style={inp} placeholder="AUC-SD-600-PRO" value={data.sku || ''} onChange={(e) => setData({ ...data, sku: e.target.value.toUpperCase() })} />
            </Field>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <Field label="Category">
              <select style={inp} value={data.category || 'Automation Hardware'} onChange={(e) => setData({ ...data, category: e.target.value })}>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </Field>
            <Field label="Unit Price (₹)" required>
              <input type="number" style={inp} required min="0" value={data.price || ''} onChange={(e) => setData({ ...data, price: Number(e.target.value) })} />
            </Field>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <Field label="Initial Stock">
              <input type="number" style={inp} min="0" value={data.currentStock ?? 20} onChange={(e) => setData({ ...data, currentStock: Number(e.target.value) })} />
            </Field>
            <Field label="Min Alert Level">
              <input type="number" style={inp} min="1" value={data.minStockLevel ?? 5} onChange={(e) => setData({ ...data, minStockLevel: Number(e.target.value) })} />
            </Field>
          </div>

          <Field label="Supplier">
            <input style={inp} placeholder="e.g. Auco Dynamics, Pune" value={data.supplier || ''} onChange={(e) => setData({ ...data, supplier: e.target.value })} />
          </Field>

          <button type="submit" style={{
            marginTop: '4px', padding: '13px', borderRadius: '10px',
            background: 'linear-gradient(135deg,#4f46e5,#6366f1)', color: '#fff',
            fontWeight: 800, fontSize: '0.95rem', border: 'none', cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(79,70,229,0.3)'
          }}>
            Save Product
          </button>
        </form>
      </div>
    </div>
  );
};

// ─── Main View ────────────────────────────────────────────────────────────────
export const InventoryView = () => {
  const { inventory, addProduct, updateProduct, deleteProduct, adjustProductStock, selectedCompany, matchesCompany } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [stockFilter, setStockFilter] = useState('ALL'); // ALL | LOW | OK
  const [showAddModal, setShowAddModal] = useState(false);
  const [adjustTarget, setAdjustTarget] = useState(null);
  const [editTarget, setEditTarget] = useState(null);

  const defaultNew = { name: '', productCode: '', sku: '', category: 'Automation Hardware', currentStock: 20, minStockLevel: 5, supplier: '', price: 0, brand: selectedCompany || 'AUCO' };
  const [newData, setNewData] = useState(defaultNew);
  const [editData, setEditData] = useState({});

  const scopedInventory = inventory.filter(matchesCompany);
  const categories = Array.from(new Set(scopedInventory.map((p) => p.category).filter(Boolean)));

  const totalSKUs = scopedInventory.length;
  const totalUnits = scopedInventory.reduce((a, p) => a + Number(p.currentStock || 0), 0);
  const totalValuation = scopedInventory.reduce((a, p) => a + Number(p.currentStock || 0) * Number(p.price || 0), 0);
  const lowStockItems = scopedInventory.filter((p) => p.availableStock <= p.minStockLevel);

  const filtered = scopedInventory.filter((p) => {
    const q = searchQuery.toLowerCase();
    const matchSearch = !q ||
      p.name.toLowerCase().includes(q) ||
      p.productCode.toLowerCase().includes(q) ||
      (p.sku || '').toLowerCase().includes(q) ||
      (p.supplier || '').toLowerCase().includes(q);
    const matchCat = categoryFilter === 'ALL' || p.category === categoryFilter;
    const matchStock = stockFilter === 'ALL' || (stockFilter === 'LOW' ? p.availableStock <= p.minStockLevel : p.availableStock > p.minStockLevel);
    return matchSearch && matchCat && matchStock;
  });

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newData.name || !newData.productCode) return;
    addProduct({ ...newData, brand: selectedCompany || 'AUCO' });
    setShowAddModal(false);
    setNewData(defaultNew);
  };

  const handleEdit = (e) => {
    e.preventDefault();
    updateProduct(editTarget.id || editTarget.productCode, editData);
    setEditTarget(null);
  };

  const handleDelete = (p) => {
    if (window.confirm(`Delete [${p.productCode}] "${p.name}"?`)) deleteProduct(p.id || p.productCode);
  };

  const startEdit = (p) => {
    setEditTarget(p);
    setEditData({ name: p.name, price: p.price, minStockLevel: p.minStockLevel, supplier: p.supplier, category: p.category });
  };

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1000px', margin: '0 auto' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Boxes size={26} style={{ color: '#4f46e5' }} /> Inventory
          </h1>
          <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '0.88rem' }}>
            {lowStockItems.length > 0
              ? `⚠ ${lowStockItems.length} item${lowStockItems.length > 1 ? 's' : ''} below minimum stock`
              : `${totalSKUs} products · all stock levels healthy`}
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px', padding: '11px 20px', borderRadius: '10px',
            background: 'linear-gradient(135deg,#4f46e5,#6366f1)', color: '#fff', fontWeight: 700,
            fontSize: '0.9rem', border: 'none', cursor: 'pointer', boxShadow: '0 4px 14px rgba(79,70,229,0.3)', flexShrink: 0
          }}
        >
          <Plus size={18} /> Add SKU
        </button>
      </div>

      {/* KPI strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '12px' }}>
        {[
          { label: 'Total SKUs',   value: totalSKUs,                          color: '#4f46e5', bg: '#eef2ff', icon: Boxes,         fmt: (v) => v },
          { label: 'Total Units',  value: totalUnits,                         color: '#10b981', bg: '#ecfdf5', icon: Package,        fmt: (v) => v.toLocaleString('en-IN') },
          { label: 'Valuation',    value: formatCurrency(totalValuation),     color: '#8b5cf6', bg: '#faf5ff', icon: Layers,         fmt: (v) => v },
          { label: 'Low Stock',    value: lowStockItems.length,               color: lowStockItems.length > 0 ? '#dc2626' : '#059669', bg: lowStockItems.length > 0 ? '#fef2f2' : '#ecfdf5', icon: AlertTriangle, fmt: (v) => `${v} SKU${v !== 1 ? 's' : ''}` },
        ].map(({ label, value, color, bg, icon: Icon, fmt }) => (
          <div key={label} style={{ background: bg, border: `1.5px solid ${color}25`, borderRadius: '12px', padding: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
              <Icon size={14} style={{ color }} />
              <span style={{ fontSize: '0.74rem', fontWeight: 600, color }}>{label}</span>
            </div>
            <div style={{ fontSize: typeof value === 'string' ? '1rem' : '1.6rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.1 }}>
              {fmt(value)}
            </div>
          </div>
        ))}
      </div>

      {/* Low stock banner */}
      {lowStockItems.length > 0 && (
        <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '12px', padding: '14px 18px', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
          <AlertTriangle size={18} style={{ color: '#d97706', flexShrink: 0, marginTop: '1px' }} />
          <div>
            <div style={{ fontWeight: 700, color: '#92400e', fontSize: '0.88rem', marginBottom: '3px' }}>Low Inventory — Restock Needed</div>
            <div style={{ fontSize: '0.8rem', color: '#78350f', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {lowStockItems.map((p) => (
                <span key={p.id} style={{ background: '#fef3c7', padding: '2px 8px', borderRadius: '8px', border: '1px solid #fde68a' }}>
                  {p.productCode}: {p.availableStock} left (min {p.minStockLevel})
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Search + filters */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#fff', border: '1.5px solid #e2e8f0', borderRadius: '10px', padding: '0 14px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
          <Search size={16} style={{ color: '#94a3b8', flexShrink: 0 }} />
          <input
            placeholder="Search by product name, code, SKU, or supplier…"
            value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            style={{ flex: 1, border: 'none', outline: 'none', padding: '12px 0', fontSize: '0.88rem', color: '#0f172a', background: 'transparent', fontFamily: 'var(--font-sans)' }}
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: '2px', display: 'flex' }}>
              <X size={14} />
            </button>
          )}
        </div>

        {/* Filter pills */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {[{ key: 'ALL', label: 'All Stock' }, { key: 'LOW', label: '⚠ Low Stock' }, { key: 'OK', label: '✓ Healthy' }].map((f) => (
            <button key={f.key} onClick={() => setStockFilter(f.key)} style={{
              padding: '7px 14px', borderRadius: '20px', fontSize: '0.83rem', cursor: 'pointer',
              border: `1.5px solid ${stockFilter === f.key ? (f.key === 'LOW' ? '#dc2626' : f.key === 'OK' ? '#059669' : '#4f46e5') : '#e2e8f0'}`,
              background: stockFilter === f.key ? (f.key === 'LOW' ? '#fef2f2' : f.key === 'OK' ? '#ecfdf5' : '#eef2ff') : '#fff',
              color: stockFilter === f.key ? (f.key === 'LOW' ? '#dc2626' : f.key === 'OK' ? '#059669' : '#4f46e5') : '#64748b',
              fontWeight: stockFilter === f.key ? 700 : 500, transition: 'all 0.15s'
            }}>{f.label}</button>
          ))}
          <div style={{ width: '1px', background: '#e2e8f0', margin: '0 2px' }} />
          {['ALL', ...categories].map((cat) => {
            const isActive = categoryFilter === cat;
            return (
              <button key={cat} onClick={() => setCategoryFilter(cat)} style={{
                padding: '7px 14px', borderRadius: '20px', fontSize: '0.83rem', cursor: 'pointer',
                border: `1.5px solid ${isActive ? '#64748b' : '#e2e8f0'}`,
                background: isActive ? '#f1f5f9' : '#fff',
                color: isActive ? '#0f172a' : '#94a3b8',
                fontWeight: isActive ? 700 : 500, transition: 'all 0.15s'
              }}>{cat === 'ALL' ? 'All Categories' : cat}</button>
            );
          })}
        </div>
      </div>

      {/* Cards grid */}
      {filtered.length === 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', padding: '60px 24px', background: '#f8fafc', borderRadius: '16px', border: '1.5px dashed #e2e8f0', color: '#94a3b8', textAlign: 'center' }}>
          <Boxes size={40} style={{ opacity: 0.3 }} />
          <div>
            <div style={{ fontWeight: 700, fontSize: '1rem', color: '#64748b', marginBottom: '4px' }}>No products found</div>
            <div style={{ fontSize: '0.84rem' }}>Try clearing your filters or add a new product</div>
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(420px, 1fr))', gap: '12px' }}>
          {filtered.map((p) => (
            <ProductCard key={p.id || p.productCode} p={p} onAdjust={setAdjustTarget} onEdit={startEdit} onDelete={handleDelete} />
          ))}
        </div>
      )}

      {/* Modals */}
      {adjustTarget && (
        <AdjustModal p={adjustTarget} onClose={() => setAdjustTarget(null)} onSubmit={adjustProductStock} />
      )}
      {showAddModal && (
        <ProductModal title="Add New Product" data={newData} setData={setNewData} onClose={() => setShowAddModal(false)} onSubmit={handleAdd} selectedCompany={selectedCompany} />
      )}
      {editTarget && (
        <ProductModal title={`Edit — ${editTarget.productCode}`} data={editData} setData={setEditData} onClose={() => setEditTarget(null)} onSubmit={handleEdit} selectedCompany={selectedCompany} />
      )}
    </div>
  );
};
