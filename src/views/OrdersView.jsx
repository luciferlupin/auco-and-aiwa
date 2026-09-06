import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ShoppingCart,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  Truck,
  FileText,
  PackageCheck,
  Package,
  Copy,
  Download,
  Calendar,
  Trash2,
  X,
  User,
  IndianRupee,
  MapPin
} from 'lucide-react';
import { formatCurrency, formatDate } from '../utils/formatters';
import { DispatchOrderModal } from '../components/DispatchOrderModal';
import { DeliveryChallanModal } from '../components/DeliveryChallanModal';
import { generateDeliveryChallanPDF } from '../utils/pdfGenerator';

// ─── Status config ────────────────────────────────────────────────────────────
const ORDER_STATUS = {
  'Pending':      { color: '#64748b', bg: '#f8fafc', border: '#e2e8f0', label: '⏳ Pending' },
  'In Progress':  { color: '#d97706', bg: '#fffbeb', border: '#fde68a', label: '🔄 In Progress' },
  'Dispatched':   { color: '#3b82f6', bg: '#eff6ff', border: '#bfdbfe', label: '🚚 Dispatched' },
  'Delivered':    { color: '#059669', bg: '#ecfdf5', border: '#a7f3d0', label: '✓ Delivered' },
  'Cancelled':    { color: '#dc2626', bg: '#fef2f2', border: '#fecaca', label: '✕ Cancelled' },
};
const DISPATCH_STATUS = {
  'Dispatched':       { color: '#3b82f6', bg: '#eff6ff', border: '#bfdbfe' },
  'In Transit':       { color: '#d97706', bg: '#fffbeb', border: '#fde68a' },
  'Out for Delivery': { color: '#8b5cf6', bg: '#f5f3ff', border: '#ddd6fe' },
  'Delivered':        { color: '#059669', bg: '#ecfdf5', border: '#a7f3d0' },
};
const PAYMENT_STATUS = {
  'Paid':           { color: '#059669', bg: '#ecfdf5' },
  'Partially Paid': { color: '#d97706', bg: '#fffbeb' },
  'Unpaid':         { color: '#dc2626', bg: '#fef2f2' },
};
const getOSCfg = (s) => ORDER_STATUS[s] || ORDER_STATUS['Pending'];
const getDSCfg = (s) => DISPATCH_STATUS[s] || DISPATCH_STATUS['Dispatched'];

// ─── Order Card ───────────────────────────────────────────────────────────────
const OrderCard = ({ order, onDispatch, onChallan, onDelete, onNavigate }) => {
  const cfg = getOSCfg(order.deliveryStatus);
  const pCfg = PAYMENT_STATUS[order.paymentStatus] || PAYMENT_STATUS['Unpaid'];
  const hasDispatch = !!order.dispatchDetails;
  const isDelivered = order.deliveryStatus === 'Delivered';

  return (
    <div
      style={{
        background: '#fff', borderRadius: '14px',
        border: `1px solid ${isDelivered ? '#a7f3d0' : '#e2e8f0'}`,
        padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: '14px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)', transition: 'box-shadow 0.15s'
      }}
      onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.09)')}
      onMouseLeave={(e) => (e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)')}
    >
      {/* Top row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#4f46e5', fontFamily: 'monospace', marginBottom: '3px' }}>{order.id}</div>
          <div style={{ fontWeight: 700, fontSize: '1rem', color: '#0f172a' }}>{order.clientName}</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{
            padding: '4px 10px', borderRadius: '20px', fontWeight: 700, fontSize: '0.75rem',
            background: cfg.bg, border: `1px solid ${cfg.border}`, color: cfg.color
          }}>{cfg.label}</span>
          <button onClick={() => onDelete(order)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#cbd5e1', padding: '2px', display: 'flex', borderRadius: '6px', transition: 'color 0.15s' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#ef4444')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#cbd5e1')}>
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      {/* Product + value */}
      <div style={{ display: 'flex', gap: '0', borderRadius: '10px', overflow: 'hidden', border: '1px solid #f1f5f9' }}>
        <div style={{ flex: 2, padding: '10px 14px', background: '#f8fafc', borderRight: '1px solid #f1f5f9' }}>
          <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 600, marginBottom: '3px' }}>PRODUCT</div>
          <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#0f172a' }}>{order.productCode}</div>
          <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '1px' }}>{order.productName}</div>
        </div>
        <div style={{ flex: 1, padding: '10px 14px', background: '#f8fafc', borderRight: '1px solid #f1f5f9', textAlign: 'center' }}>
          <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 600, marginBottom: '3px' }}>QTY</div>
          <div style={{ fontWeight: 800, fontSize: '1.2rem', color: '#0f172a', lineHeight: 1 }}>{order.quantity}</div>
          <div style={{ fontSize: '0.68rem', color: '#94a3b8', marginTop: '1px' }}>units</div>
        </div>
        <div style={{ flex: 2, padding: '10px 14px', background: '#eef2ff', textAlign: 'right' }}>
          <div style={{ fontSize: '0.7rem', color: '#4f46e5', fontWeight: 600, marginBottom: '3px' }}>ORDER VALUE</div>
          <div style={{ fontWeight: 800, fontSize: '1rem', color: '#4f46e5' }}>{formatCurrency(order.orderValue)}</div>
          <span style={{ fontSize: '0.72rem', padding: '2px 7px', borderRadius: '8px', fontWeight: 700, background: pCfg.bg, color: pCfg.color }}>{order.paymentStatus}</span>
        </div>
      </div>

      {/* Meta row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.82rem', color: '#64748b' }}>
          <Calendar size={13} style={{ color: '#94a3b8' }} />
          {formatDate(order.orderDate)}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.82rem', color: '#64748b' }}>
          <User size={13} style={{ color: '#94a3b8' }} />
          {order.assignedTeamMember}
        </div>
        {hasDispatch && (
          <button onClick={() => onChallan(order)} style={{
            display: 'flex', alignItems: 'center', gap: '4px', background: 'none', border: 'none',
            color: '#4f46e5', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', padding: 0
          }}>
            <Truck size={12} />
            🚚 {order.dispatchDetails.courierCarrier} · {order.dispatchDetails.trackingNumber}
          </button>
        )}
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '8px' }}>
        {!hasDispatch ? (
          <button onClick={() => onDispatch(order.id)} style={{
            flex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px',
            padding: '11px', borderRadius: '10px',
            background: 'linear-gradient(135deg,#4f46e5,#6366f1)', color: '#fff', fontWeight: 700, fontSize: '0.9rem',
            border: 'none', cursor: 'pointer', boxShadow: '0 4px 12px rgba(79,70,229,0.3)', transition: 'transform 0.1s'
          }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-1px)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; }}>
            <Truck size={16} /> Dispatch Shipment
          </button>
        ) : (
          <button onClick={() => onChallan(order)} style={{
            flex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px',
            padding: '11px', borderRadius: '10px',
            background: '#f8fafc', border: '1.5px solid #e2e8f0',
            color: '#475569', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer', transition: 'all 0.15s'
          }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#f1f5f9'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = '#f8fafc'; }}>
            <FileText size={16} /> View Dispatch Note
          </button>
        )}
        <button onClick={() => onNavigate('invoices')} style={{
          flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
          padding: '11px', borderRadius: '10px',
          background: '#f8fafc', border: '1.5px solid #e2e8f0',
          color: '#64748b', fontWeight: 600, fontSize: '0.86rem', cursor: 'pointer'
        }}>
          <FileText size={14} /> Invoice
        </button>
      </div>
    </div>
  );
};

// ─── Dispatch Card ────────────────────────────────────────────────────────────
const DispatchCard = ({ disp, onView, onDownload, onDelete, onUpdateStatus, onCopy }) => {
  const cfg = getDSCfg(disp.dispatchStatus);
  const isDelivered = disp.dispatchStatus === 'Delivered';
  const STATUSES = ['Dispatched', 'In Transit', 'Out for Delivery', 'Delivered'];

  return (
    <div style={{
      background: '#fff', borderRadius: '14px',
      border: `1px solid ${isDelivered ? '#a7f3d0' : '#e2e8f0'}`,
      padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: '14px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.04)', transition: 'box-shadow 0.15s'
    }}
      onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.09)')}
      onMouseLeave={(e) => (e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)')}>

      {/* Top */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#4f46e5', fontFamily: 'monospace' }}>{disp.challanNumber || disp.id}</span>
            <span style={{ fontSize: '0.7rem', color: '#94a3b8', fontFamily: 'monospace' }}>← {disp.orderId}</span>
          </div>
          <div style={{ fontWeight: 700, fontSize: '1rem', color: '#0f172a' }}>{disp.companyName || disp.clientName}</div>
          {disp.contactPerson && <div style={{ fontSize: '0.78rem', color: '#64748b' }}>Attn: {disp.contactPerson}</div>}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ padding: '4px 10px', borderRadius: '20px', fontWeight: 700, fontSize: '0.75rem', background: cfg.bg, border: `1px solid ${cfg.border}`, color: cfg.color }}>
            {disp.dispatchStatus}
          </span>
          <button onClick={() => onDelete(disp)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#cbd5e1', padding: '2px', display: 'flex', borderRadius: '6px', transition: 'color 0.15s' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#ef4444')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#cbd5e1')}>
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      {/* Carrier + tracking */}
      <div style={{ display: 'flex', gap: '0', borderRadius: '10px', overflow: 'hidden', border: '1px solid #f1f5f9' }}>
        <div style={{ flex: 2, padding: '10px 14px', background: '#f8fafc', borderRight: '1px solid #f1f5f9' }}>
          <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 600, marginBottom: '3px' }}>CARRIER</div>
          <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0f172a' }}>🚚 {disp.courierCarrier}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '2px' }}>
            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>AWB: <strong style={{ fontFamily: 'monospace' }}>{disp.trackingNumber}</strong></span>
            <button onClick={() => onCopy(disp.trackingNumber)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: '1px', display: 'flex' }}>
              <Copy size={11} />
            </button>
          </div>
        </div>
        <div style={{ flex: 1, padding: '10px 14px', background: '#f0fdf4', borderRight: '1px solid #f1f5f9', textAlign: 'center' }}>
          <div style={{ fontSize: '0.7rem', color: '#059669', fontWeight: 600, marginBottom: '3px' }}>DISPATCHED</div>
          <div style={{ fontWeight: 700, fontSize: '0.82rem', color: '#0f172a' }}>{formatDate(disp.dispatchDate)}</div>
        </div>
        <div style={{ flex: 1, padding: '10px 14px', background: '#eef2ff', textAlign: 'center' }}>
          <div style={{ fontSize: '0.7rem', color: '#4f46e5', fontWeight: 600, marginBottom: '3px' }}>ETA</div>
          <div style={{ fontWeight: 700, fontSize: '0.82rem', color: '#4f46e5' }}>{formatDate(disp.estimatedDelivery)}</div>
        </div>
      </div>

      {/* Packages + E-Way */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
        {disp.packageCount && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.82rem', color: '#64748b' }}>
            <Package size={13} style={{ color: '#94a3b8' }} />
            {disp.packageCount} · {disp.packageWeight}
          </div>
        )}
        {disp.ewayBillNumber && (
          <div style={{ fontSize: '0.82rem', color: '#64748b' }}>
            E-Way: <strong style={{ fontFamily: 'monospace' }}>{disp.ewayBillNumber}</strong>
          </div>
        )}
      </div>

      {/* Status update + Actions */}
      <div style={{ display: 'flex', gap: '8px' }}>
        {!isDelivered ? (
          <div style={{ flex: 1, display: 'flex', gap: '4px', background: '#f8fafc', borderRadius: '10px', padding: '4px', border: '1.5px solid #e2e8f0' }}>
            {STATUSES.filter((s) => s !== 'Delivered').map((s) => (
              <button key={s} onClick={() => onUpdateStatus(disp.id, s)} style={{
                flex: 1, padding: '7px 4px', borderRadius: '7px', fontSize: '0.72rem',
                fontWeight: disp.dispatchStatus === s ? 700 : 500,
                border: 'none', cursor: 'pointer', transition: 'all 0.15s',
                background: disp.dispatchStatus === s ? getDSCfg(s).bg : 'transparent',
                color: disp.dispatchStatus === s ? getDSCfg(s).color : '#94a3b8',
              }}>{s.split(' ')[0]}</button>
            ))}
            <button onClick={() => onUpdateStatus(disp.id, 'Delivered')} style={{
              flex: 1, padding: '7px 4px', borderRadius: '7px', fontSize: '0.72rem', fontWeight: 600,
              border: 'none', cursor: 'pointer', transition: 'all 0.15s',
              background: disp.dispatchStatus === 'Delivered' ? '#ecfdf5' : 'linear-gradient(135deg,#059669,#10b981)',
              color: disp.dispatchStatus === 'Delivered' ? '#059669' : '#fff'
            }}>✓ Done</button>
          </div>
        ) : (
          <div style={{
            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
            padding: '10px', borderRadius: '10px', background: '#ecfdf5',
            border: '1px solid #a7f3d0', color: '#059669', fontWeight: 700, fontSize: '0.88rem'
          }}>
            <CheckCircle2 size={16} /> Delivered
          </div>
        )}
        <button onClick={() => onView(disp)} style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px',
          padding: '10px 14px', borderRadius: '10px', background: '#f8fafc',
          border: '1.5px solid #e2e8f0', color: '#475569', fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer'
        }}>
          <FileText size={14} /> View
        </button>
        <button onClick={() => onDownload(disp)} style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '10px 12px', borderRadius: '10px', background: '#f8fafc',
          border: '1.5px solid #e2e8f0', color: '#475569', cursor: 'pointer'
        }}>
          <Download size={14} />
        </button>
      </div>
    </div>
  );
};

// ─── Main View ────────────────────────────────────────────────────────────────
export const OrdersView = ({ onOpenOrderModal, onNavigate }) => {
  const { orders, dispatches, updateOrderStatus, updateDispatchStatus, deleteOrder, deleteDispatch, matchesCompany, addToast } = useApp();
  const [activeTab, setActiveTab] = useState('orders');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isDispatchModalOpen, setIsDispatchModalOpen] = useState(false);
  const [selectedOrderForDispatch, setSelectedOrderForDispatch] = useState(null);
  const [isChallanModalOpen, setIsChallanModalOpen] = useState(false);
  const [selectedChallanDispatch, setSelectedChallanDispatch] = useState(null);

  const scopedOrders = orders.filter(matchesCompany);
  const scopedDispatches = dispatches.filter(matchesCompany);

  const totalOrderValue = scopedOrders.reduce((a, o) => a + Number(o.orderValue || 0), 0);
  const inProgressCount = scopedOrders.filter((o) => o.deliveryStatus === 'In Progress').length;
  const deliveredCount = scopedOrders.filter((o) => o.deliveryStatus === 'Delivered').length;
  const activeDispCount = scopedDispatches.filter((d) => d.dispatchStatus !== 'Delivered').length;

  const filteredOrders = scopedOrders.filter((o) => {
    const q = searchQuery.toLowerCase();
    const matchSearch = !q || o.id.toLowerCase().includes(q) || o.clientName.toLowerCase().includes(q) || o.productCode.toLowerCase().includes(q);
    const matchStatus = statusFilter === 'ALL' || o.deliveryStatus === statusFilter;
    return matchSearch && matchStatus;
  });

  const filteredDispatches = scopedDispatches.filter((d) => {
    const q = searchQuery.toLowerCase();
    const matchSearch = !q || d.clientName.toLowerCase().includes(q) || d.challanNumber.toLowerCase().includes(q) || d.orderId.toLowerCase().includes(q) || d.trackingNumber.toLowerCase().includes(q);
    const matchStatus = statusFilter === 'ALL' || d.dispatchStatus === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleOpenChallan = (order) => {
    const match = scopedDispatches.find((d) => d.orderId === order.id || d.challanNumber === order.dispatchDetails?.challanNumber);
    if (match) { setSelectedChallanDispatch(match); setIsChallanModalOpen(true); }
    else if (order.dispatchDetails) {
      setSelectedChallanDispatch({ id: `DSP-${order.id}`, brand: order.brand || 'AUCO', challanNumber: order.dispatchDetails.challanNumber || `DC-2026-${order.id.replace(/\D/g, '')}`, orderId: order.id, clientName: order.clientName, companyName: order.clientName, contactPerson: 'Authorized Store Incharge', phone: '+91 98220 12345', email: 'logistics@client.com', shippingAddress: 'Industrial Site Delivery, India', items: order.items || [], courierCarrier: order.dispatchDetails.courierCarrier || 'BlueDart Express', trackingNumber: order.dispatchDetails.trackingNumber || 'AWB-1002003', ewayBillNumber: '2410-4455-6677', dispatchDate: order.dispatchDetails.dispatchDate || order.orderDate, estimatedDelivery: order.dispatchDetails.estimatedDelivery || '2026-08-31', packageCount: '1 Carton', packageWeight: '5.0 kg', vehicleNumber: 'Standard Logistics Carrier', dispatchedBy: order.assignedTeamMember || 'Operations', dispatchStatus: order.deliveryStatus === 'Delivered' ? 'Delivered' : 'Dispatched', notes: 'Handled with electronic transit insurance.' });
      setIsChallanModalOpen(true);
    } else {
      addToast('No Dispatch Record', `Order ${order.id} has not been dispatched yet.`, 'info');
    }
  };

  const handleDispatchSuccess = (dispatchRecord) => {
    setIsDispatchModalOpen(false);
    setSelectedChallanDispatch(dispatchRecord);
    setIsChallanModalOpen(true);
  };

  const handleDeleteOrder = (o) => {
    if (window.confirm(`Delete order ${o.id} for ${o.clientName}?`)) deleteOrder(o.id);
  };

  const handleDeleteDispatch = (d) => {
    if (window.confirm(`Delete dispatch ${d.challanNumber || d.id}?`)) deleteDispatch(d.id);
  };

  const handleUpdateDispatch = (id, status) => {
    updateDispatchStatus(id, status);
    const disp = scopedDispatches.find((d) => d.id === id);
    if (status === 'Delivered' && disp?.orderId) updateOrderStatus(disp.orderId, 'Delivered');
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    addToast('Copied', text, 'info');
  };

  const ORDER_STATUS_TABS = [
    { key: 'ALL', label: 'All' },
    { key: 'In Progress', label: '🔄 In Progress' },
    { key: 'Dispatched', label: '🚚 Dispatched' },
    { key: 'Delivered', label: '✓ Delivered' },
    { key: 'Pending', label: '⏳ Pending' },
  ];
  const DISPATCH_STATUS_TABS = [
    { key: 'ALL', label: 'All' },
    { key: 'Dispatched', label: '📦 Dispatched' },
    { key: 'In Transit', label: '🚚 In Transit' },
    { key: 'Out for Delivery', label: '🛵 Out for Delivery' },
    { key: 'Delivered', label: '✓ Delivered' },
  ];

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '900px', margin: '0 auto' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShoppingCart size={26} style={{ color: '#4f46e5' }} /> Orders & Dispatches
          </h1>
          <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '0.88rem' }}>
            {inProgressCount > 0 ? `${inProgressCount} order${inProgressCount > 1 ? 's' : ''} in progress` : `${scopedOrders.length} total orders`}
            {activeDispCount > 0 ? ` · ${activeDispCount} active shipment${activeDispCount > 1 ? 's' : ''}` : ''}
          </p>
        </div>
        <button onClick={onOpenOrderModal} style={{
          display: 'flex', alignItems: 'center', gap: '8px', padding: '11px 20px', borderRadius: '10px',
          background: 'linear-gradient(135deg,#4f46e5,#6366f1)', color: '#fff', fontWeight: 700,
          fontSize: '0.9rem', border: 'none', cursor: 'pointer', boxShadow: '0 4px 14px rgba(79,70,229,0.3)', flexShrink: 0
        }}>
          <Plus size={18} /> New Order
        </button>
      </div>

      {/* KPI strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '12px' }}>
        {[
          { label: 'Total Orders',  value: scopedOrders.length, color: '#4f46e5', bg: '#eef2ff', icon: ShoppingCart, fmt: (v) => v },
          { label: 'Orders Value',  value: formatCurrency(totalOrderValue), color: '#10b981', bg: '#ecfdf5', icon: IndianRupee, fmt: (v) => v },
          { label: 'In Progress',   value: inProgressCount, color: '#d97706', bg: '#fffbeb', icon: Clock, fmt: (v) => `${v} order${v !== 1 ? 's' : ''}` },
          { label: 'Delivered',     value: deliveredCount, color: '#059669', bg: '#ecfdf5', icon: CheckCircle2, fmt: (v) => `${v} order${v !== 1 ? 's' : ''}` },
        ].map(({ label, value, color, bg, icon: Icon, fmt }) => (
          <div key={label} style={{ background: bg, border: `1.5px solid ${color}25`, borderRadius: '12px', padding: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
              <Icon size={14} style={{ color }} />
              <span style={{ fontSize: '0.74rem', fontWeight: 600, color }}>{label}</span>
            </div>
            <div style={{ fontSize: typeof value === 'string' ? '1rem' : '1.5rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.1 }}>
              {fmt(value)}
            </div>
          </div>
        ))}
      </div>

      {/* Tab switcher */}
      <div style={{ display: 'flex', background: '#f1f5f9', borderRadius: '12px', padding: '4px', gap: '2px' }}>
        {[
          { key: 'orders', label: '📋 Orders', count: scopedOrders.length },
          { key: 'dispatches', label: '🚚 Shipments', count: scopedDispatches.length, badge: activeDispCount },
        ].map((tab) => (
          <button key={tab.key} onClick={() => { setActiveTab(tab.key); setStatusFilter('ALL'); }} style={{
            flex: 1, padding: '10px 16px', borderRadius: '9px', fontWeight: 700, fontSize: '0.88rem',
            border: 'none', cursor: 'pointer', transition: 'all 0.15s',
            background: activeTab === tab.key ? '#fff' : 'transparent',
            color: activeTab === tab.key ? '#0f172a' : '#64748b',
            boxShadow: activeTab === tab.key ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
          }}>
            {tab.label}
            <span style={{ background: activeTab === tab.key ? '#4f46e5' : '#cbd5e1', color: '#fff', borderRadius: '10px', padding: '1px 7px', fontSize: '0.72rem', fontWeight: 700 }}>
              {tab.count}
            </span>
            {tab.badge > 0 && (
              <span style={{ background: '#f59e0b', color: '#fff', borderRadius: '10px', padding: '1px 6px', fontSize: '0.68rem', fontWeight: 700 }}>
                {tab.badge} live
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Search */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#fff', border: '1.5px solid #e2e8f0', borderRadius: '10px', padding: '0 14px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
        <Search size={16} style={{ color: '#94a3b8', flexShrink: 0 }} />
        <input
          placeholder={activeTab === 'orders' ? 'Search by order ID, client, or product…' : 'Search by challan, AWB, carrier, or client…'}
          value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
          style={{ flex: 1, border: 'none', outline: 'none', padding: '12px 0', fontSize: '0.88rem', color: '#0f172a', background: 'transparent', fontFamily: 'var(--font-sans)' }}
        />
        {searchQuery && <button onClick={() => setSearchQuery('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: '2px', display: 'flex' }}><X size={14} /></button>}
      </div>

      {/* Status tabs */}
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
        {(activeTab === 'orders' ? ORDER_STATUS_TABS : DISPATCH_STATUS_TABS).map((tab) => {
          const isActive = statusFilter === tab.key;
          return (
            <button key={tab.key} onClick={() => setStatusFilter(tab.key)} style={{
              padding: '7px 14px', borderRadius: '20px', fontSize: '0.83rem', cursor: 'pointer',
              border: `1.5px solid ${isActive ? '#4f46e5' : '#e2e8f0'}`,
              background: isActive ? '#eef2ff' : '#fff',
              color: isActive ? '#4f46e5' : '#64748b',
              fontWeight: isActive ? 700 : 500, transition: 'all 0.15s'
            }}>{tab.label}</button>
          );
        })}
      </div>

      {/* Cards */}
      {activeTab === 'orders' && (
        filteredOrders.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', padding: '60px 24px', background: '#f8fafc', borderRadius: '16px', border: '1.5px dashed #e2e8f0', color: '#94a3b8', textAlign: 'center' }}>
            <ShoppingCart size={40} style={{ opacity: 0.3 }} />
            <div>
              <div style={{ fontWeight: 700, fontSize: '1rem', color: '#64748b', marginBottom: '4px' }}>No orders found</div>
              <div style={{ fontSize: '0.84rem' }}>Try clearing your filters or create a new order</div>
            </div>
            <button onClick={onOpenOrderModal} style={{ padding: '10px 20px', borderRadius: '10px', background: '#4f46e5', color: '#fff', fontWeight: 700, fontSize: '0.88rem', border: 'none', cursor: 'pointer' }}>+ New Order</button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filteredOrders.map((order) => (
              <OrderCard key={order.id} order={order}
                onDispatch={(id) => { setSelectedOrderForDispatch(id); setIsDispatchModalOpen(true); }}
                onChallan={handleOpenChallan}
                onDelete={handleDeleteOrder}
                onNavigate={onNavigate}
              />
            ))}
          </div>
        )
      )}

      {activeTab === 'dispatches' && (
        filteredDispatches.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', padding: '60px 24px', background: '#f8fafc', borderRadius: '16px', border: '1.5px dashed #e2e8f0', color: '#94a3b8', textAlign: 'center' }}>
            <Truck size={40} style={{ opacity: 0.3 }} />
            <div>
              <div style={{ fontWeight: 700, fontSize: '1rem', color: '#64748b', marginBottom: '4px' }}>No shipments found</div>
              <div style={{ fontSize: '0.84rem' }}>Dispatch an order to create a shipment record</div>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filteredDispatches.map((disp) => (
              <DispatchCard key={disp.id} disp={disp}
                onView={(d) => { setSelectedChallanDispatch(d); setIsChallanModalOpen(true); }}
                onDownload={(d) => { generateDeliveryChallanPDF(d); addToast('PDF Downloaded', `Challan ${d.challanNumber} saved.`, 'success'); }}
                onDelete={handleDeleteDispatch}
                onUpdateStatus={handleUpdateDispatch}
                onCopy={handleCopy}
              />
            ))}
          </div>
        )
      )}

      {/* Modals */}
      <DispatchOrderModal isOpen={isDispatchModalOpen} onClose={() => setIsDispatchModalOpen(false)} initialOrderId={selectedOrderForDispatch} onDispatchSuccess={handleDispatchSuccess} />
      <DeliveryChallanModal isOpen={isChallanModalOpen} onClose={() => setIsChallanModalOpen(false)} dispatch={selectedChallanDispatch} />
    </div>
  );
};
