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
  Filter,
  ArrowRight,
  PackageCheck,
  Package,
  Copy,
  ExternalLink,
  Download,
  Printer,
  Sparkles,
  MapPin,
  Calendar,
  Trash2
} from 'lucide-react';
import { formatCurrency, formatDate, getStatusBadgeClass } from '../utils/formatters';
import { DispatchOrderModal } from '../components/DispatchOrderModal';
import { DeliveryChallanModal } from '../components/DeliveryChallanModal';
import { generateDeliveryChallanPDF } from '../utils/pdfGenerator';

export const OrdersView = ({ onOpenOrderModal, onNavigate }) => {
  const { orders, dispatches, updateOrderStatus, updateDispatchStatus, deleteOrder, deleteDispatch, selectedCompany, companyBrands, matchesCompany, addToast } = useApp();
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'dispatches'
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [carrierFilter, setCarrierFilter] = useState('ALL');

  // Modals state
  const [isDispatchModalOpen, setIsDispatchModalOpen] = useState(false);
  const [selectedOrderForDispatch, setSelectedOrderForDispatch] = useState(null);
  const [isChallanModalOpen, setIsChallanModalOpen] = useState(false);
  const [selectedChallanDispatch, setSelectedChallanDispatch] = useState(null);

  // Scoped orders & dispatches by company
  const scopedOrders = orders.filter(matchesCompany);
  const scopedDispatches = dispatches.filter(matchesCompany);

  // Filter orders
  const filteredOrders = scopedOrders.filter((o) => {
    const matchesSearch =
      o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.productCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.assignedTeamMember.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (o.dispatchDetails?.trackingNumber && o.dispatchDetails.trackingNumber.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (o.dispatchDetails?.challanNumber && o.dispatchDetails.challanNumber.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'ALL' || o.deliveryStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Filter dispatches
  const filteredDispatches = scopedDispatches.filter((d) => {
    const matchesSearch =
      d.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.challanNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.trackingNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.courierCarrier.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || d.dispatchStatus === statusFilter;
    const matchesCarrier = carrierFilter === 'ALL' || d.courierCarrier === carrierFilter;
    return matchesSearch && matchesStatus && matchesCarrier;
  });

  // Calculate order metrics
  const totalOrdersCount = scopedOrders.length;
  const totalOrderValue = scopedOrders.reduce((acc, o) => acc + Number(o.orderValue || 0), 0);
  const activeDispatchesCount = scopedDispatches.filter((d) => d.dispatchStatus !== 'Delivered').length;
  const deliveredDispatchesCount = scopedDispatches.filter((d) => d.dispatchStatus === 'Delivered').length;
  const inProgressCount = scopedOrders.filter((o) => o.deliveryStatus === 'In Progress').length;
  const deliveredOrdersCount = scopedOrders.filter((o) => o.deliveryStatus === 'Delivered').length;

  const handleOpenDispatchForOrder = (orderId) => {
    setSelectedOrderForDispatch(orderId);
    setIsDispatchModalOpen(true);
  };

  const handleOpenChallanForOrder = (order) => {
    // Find matching dispatch record
    const match = scopedDispatches.find((d) => d.orderId === order.id || d.challanNumber === order.dispatchDetails?.challanNumber);
    if (match) {
      setSelectedChallanDispatch(match);
      setIsChallanModalOpen(true);
    } else if (order.dispatchDetails) {
      // Synthesize dispatch record
      const syntheticDispatch = {
        id: order.dispatchDetails.dispatchId || `DSP-${order.id}`,
        brand: order.brand || (order.items?.[0]?.productCode?.startsWith('AIW') ? 'AIWA' : 'AUCO'),
        challanNumber: order.dispatchDetails.challanNumber || `DC-2026-${order.id.replace(/\D/g, '')}`,
        orderId: order.id,
        clientName: order.clientName,
        companyName: order.clientName,
        contactPerson: 'Authorized Store Incharge',
        phone: '+91 98220 12345',
        email: 'logistics@client.com',
        shippingAddress: 'Industrial Site Delivery, Maharashtra, India',
        items: order.items || [],
        courierCarrier: order.dispatchDetails.courierCarrier || 'BlueDart Express',
        trackingNumber: order.dispatchDetails.trackingNumber || 'AWB-1002003',
        ewayBillNumber: '2410-4455-6677',
        dispatchDate: order.dispatchDetails.dispatchDate || order.orderDate,
        estimatedDelivery: order.dispatchDetails.estimatedDelivery || '2026-08-31',
        packageCount: '1 Carton',
        packageWeight: '5.0 kg',
        vehicleNumber: 'Standard Logistics Carrier',
        dispatchedBy: order.assignedTeamMember || 'Operations Dispatcher',
        dispatchStatus: order.deliveryStatus === 'Delivered' ? 'Delivered' : 'Dispatched',
        notes: 'Handled with electronic transit insurance.'
      };
      setSelectedChallanDispatch(syntheticDispatch);
      setIsChallanModalOpen(true);
    } else {
      addToast('No Dispatch Record', `Order ${order.id} has not been dispatched yet. Click "Dispatch" to create shipping record.`, 'info');
    }
  };

  const handleDispatchSuccess = (dispatchRecord) => {
    setIsDispatchModalOpen(false);
    setSelectedChallanDispatch(dispatchRecord);
    setIsChallanModalOpen(true);
  };

  const handleDeleteOrder = (order) => {
    if (window.confirm(`Are you sure you want to delete order "${order.id}" for ${order.clientName}?`)) {
      deleteOrder(order.id);
    }
  };

  const handleDeleteDispatch = (disp) => {
    if (window.confirm(`Are you sure you want to delete Dispatch record "${disp.challanNumber || disp.id}" (${disp.courierCarrier} AWB #${disp.trackingNumber})?`)) {
      deleteDispatch(disp.id);
    }
  };

  const handleMarkDelivered = (dispatch) => {
    updateDispatchStatus(dispatch.id, 'Delivered', new Date().toISOString().split('T')[0]);
    if (dispatch.orderId) {
      updateOrderStatus(dispatch.orderId, 'Delivered');
    }
    addToast('Shipment Delivered', `Delivery confirmed for Dispatch #${dispatch.challanNumber || dispatch.id}.`, 'success');
  };

  const handleCopyText = (text, label) => {
    navigator.clipboard.writeText(text);
    addToast('Copied to Clipboard', `${label || 'Text'} (${text}) copied.`, 'info');
  };

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    addToast('Copied to Clipboard', text, 'info');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div className="flex-between" style={{ flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2>Orders & Dispatches</h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Client orders, fulfillment, and carrier logistics
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button className="btn btn-secondary btn-sm" onClick={() => setActiveTab('dispatches')}>
            <Truck size={14} /> Shipments
          </button>
          <button className="btn btn-primary btn-sm" onClick={onOpenOrderModal} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Plus size={14} /> New Order
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid-4">
        <div className="stat-card" style={{ borderLeft: '4px solid var(--primary-600)' }}>
          <div className="stat-header">
            <span className="stat-title">Total Orders</span>
            <ShoppingCart size={18} style={{ color: 'var(--primary-600)' }} />
          </div>
          <div className="stat-value">{totalOrdersCount}</div>
          <div className="stat-subtext">Booked customer orders</div>
        </div>

        <div className="stat-card" style={{ borderLeft: '4px solid #10b981' }}>
          <div className="stat-header">
            <span className="stat-title">Total Orders Value</span>
            <PackageCheck size={18} style={{ color: '#10b981' }} />
          </div>
          <div className="stat-value">{formatCurrency(totalOrderValue)}</div>
          <div className="stat-subtext">Cumulative booked revenue</div>
        </div>

        <div className="stat-card" style={{ borderLeft: '4px solid #f59e0b' }}>
          <div className="stat-header">
            <span className="stat-title">In-Transit / Dispatched</span>
            <Truck size={18} style={{ color: '#f59e0b' }} />
          </div>
          <div className="stat-value">{activeDispatchesCount} Dispatched</div>
          <div className="stat-subtext">{inProgressCount} orders pending / in progress</div>
        </div>

        <div className="stat-card" style={{ borderLeft: '4px solid #8b5cf6' }}>
          <div className="stat-header">
            <span className="stat-title">Delivered & Fulfilled</span>
            <CheckCircle2 size={18} style={{ color: '#8b5cf6' }} />
          </div>
          <div className="stat-value">{deliveredOrdersCount} Delivered</div>
          <div className="stat-subtext">{deliveredDispatchesCount} completed shipments</div>
        </div>
      </div>

      {/* View Switcher Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--border-default)', gap: '4px' }}>
        <button
          onClick={() => setActiveTab('orders')}
          style={{
            padding: '10px 18px',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'orders' ? '2px solid var(--primary-600)' : '2px solid transparent',
            color: activeTab === 'orders' ? 'var(--primary-600)' : 'var(--text-secondary)',
            fontWeight: activeTab === 'orders' ? 700 : 500,
            fontSize: '0.9rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.15s ease'
          }}
        >
          <ShoppingCart size={16} />
          Orders Directory ({scopedOrders.length})
        </button>

        <button
          onClick={() => setActiveTab('dispatches')}
          style={{
            padding: '10px 18px',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'dispatches' ? '2px solid var(--primary-600)' : '2px solid transparent',
            color: activeTab === 'dispatches' ? 'var(--primary-600)' : 'var(--text-secondary)',
            fontWeight: activeTab === 'dispatches' ? 700 : 500,
            fontSize: '0.9rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.15s ease'
          }}
        >
          <Truck size={16} />
          Shipments & Dispatches ({scopedDispatches.length})
          {activeDispatchesCount > 0 && (
            <span
              style={{
                background: '#f59e0b',
                color: '#fff',
                borderRadius: '10px',
                padding: '2px 7px',
                fontSize: '0.7rem',
                fontWeight: 700
              }}
            >
              {activeDispatchesCount} Live
            </span>
          )}
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
              placeholder={activeTab === 'orders' ? "Search order ID, client name, product code, AWB #..." : "Search Dispatch Ref, AWB tracking, courier, client name, order ID..."}
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
              <option value="In Progress">In Progress</option>
              <option value="Dispatched">Dispatched</option>
              <option value="In Transit">In Transit</option>
              <option value="Out for Delivery">Out for Delivery</option>
              <option value="Delivered">Delivered</option>
              <option value="Pending">Pending</option>
            </select>
          </div>

          {activeTab === 'dispatches' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Carrier:</span>
              <select
                className="form-select"
                value={carrierFilter}
                onChange={(e) => setCarrierFilter(e.target.value)}
                style={{ width: '160px' }}
              >
                <option value="ALL">All Carriers</option>
                <option value="BlueDart Express">BlueDart Express</option>
                <option value="Delhivery Surface">Delhivery Surface</option>
                <option value="Safexpress Logistics">Safexpress Logistics</option>
                <option value="V-Trans Freight">V-Trans Freight</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {/* TAB 1: ORDERS DIRECTORY */}
      {activeTab === 'orders' && (
        <>
          {/* Desktop Orders Table */}
          <div className="table-container desktop-only">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Client Name</th>
                  <th>Products / Codes</th>
                  <th>Qty</th>
                  <th>Order Value</th>
                  <th>Order Date</th>
                  <th>Fulfillment & Dispatch</th>
                  <th>Payment</th>
                  <th>Assigned Rep</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => {
                  const hasDispatch = !!order.dispatchDetails;
                  return (
                    <tr key={order.id}>
                      <td>
                        <strong style={{ color: 'var(--primary-600)' }}>{order.id}</strong>
                      </td>
                      <td>
                        <strong style={{ color: 'var(--text-primary)' }}>{order.clientName}</strong>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600, fontSize: '0.84rem' }}>{order.productCode}</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{order.productName}</div>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <span style={{ fontWeight: 700 }}>{order.quantity}</span>
                      </td>
                      <td>
                        <strong>{formatCurrency(order.orderValue)}</strong>
                      </td>
                      <td style={{ fontSize: '0.82rem', whiteSpace: 'nowrap' }}>
                        {formatDate(order.orderDate)}
                      </td>
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <span className={`badge ${getStatusBadgeClass(order.deliveryStatus)}`}>
                            {order.deliveryStatus}
                          </span>
                          {hasDispatch && (
                            <button
                              onClick={() => handleOpenChallanForOrder(order)}
                              style={{
                                background: 'none',
                                border: 'none',
                                padding: 0,
                                color: 'var(--primary-600)',
                                fontSize: '0.72rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                                textAlign: 'left',
                                textDecoration: 'underline'
                              }}
                            >
                              🚚 {order.dispatchDetails.courierCarrier} ({order.dispatchDetails.trackingNumber})
                            </button>
                          )}
                        </div>
                      </td>
                      <td>
                        <span className={`badge ${getStatusBadgeClass(order.paymentStatus)}`}>
                          {order.paymentStatus}
                        </span>
                      </td>
                      <td style={{ fontSize: '0.82rem' }}>{order.assignedTeamMember}</td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px' }}>
                          {hasDispatch ? (
                            <button
                              className="btn btn-secondary btn-sm"
                              onClick={() => handleOpenChallanForOrder(order)}
                              title="View Shipment Dispatch Note"
                              style={{ padding: '4px 8px', fontSize: '0.76rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                            >
                              <FileText size={13} /> Dispatch Note
                            </button>
                          ) : (
                            <button
                              className="btn btn-primary btn-sm"
                              onClick={() => handleOpenDispatchForOrder(order.id)}
                              title="Dispatch Shipment"
                              style={{ padding: '4px 8px', fontSize: '0.76rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                            >
                              <Truck size={13} /> Dispatch
                            </button>
                          )}

                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => onNavigate('invoices')}
                            title="View Invoice"
                            style={{ padding: '4px 8px', fontSize: '0.76rem' }}
                          >
                            <FileText size={13} />
                          </button>

                          <button
                            className="btn btn-ghost btn-sm"
                            onClick={() => handleDeleteOrder(order)}
                            title="Delete Order"
                            style={{ padding: '4px 8px', fontSize: '0.76rem', color: 'var(--danger-text)' }}
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {filteredOrders.length === 0 && (
                  <tr>
                    <td colSpan="10" style={{ textAlign: 'center', padding: '48px 16px', color: 'var(--text-muted)' }}>
                      <ShoppingCart size={36} style={{ margin: '0 auto 10px', opacity: 0.4 }} />
                      <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>No orders found</div>
                      <p style={{ fontSize: '0.8rem', marginTop: '4px' }}>Try adjusting your search query or status filter.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Orders Card Feed */}
          <div className="mobile-only" style={{ flexDirection: 'column', gap: '12px' }}>
            {filteredOrders.map((order) => {
              const hasDispatch = !!order.dispatchDetails;
              return (
                <div key={order.id} className="card" style={{ padding: '14px 16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <strong style={{ color: 'var(--primary-600)', fontSize: '0.9rem' }}>{order.id}</strong>
                        <span className={`badge ${getStatusBadgeClass(order.deliveryStatus)}`} style={{ fontSize: '0.68rem' }}>
                          {order.deliveryStatus}
                        </span>
                      </div>
                      <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-primary)', marginTop: '2px' }}>{order.clientName}</div>
                    </div>
                    <span className="badge badge-purple" style={{ fontWeight: 800, fontSize: '0.82rem' }}>
                      {formatCurrency(order.orderValue)}
                    </span>
                  </div>

                  <div style={{ background: 'var(--bg-subtle)', padding: '8px 10px', borderRadius: 'var(--radius-sm)', fontSize: '0.78rem', marginBottom: '10px' }}>
                    <div><strong>{order.productCode}</strong> — {order.productName} (Qty: {order.quantity})</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.72rem', marginTop: '2px' }}>
                      Date: {formatDate(order.orderDate)} • Rep: {order.assignedTeamMember}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', paddingTop: '8px', borderTop: '1px solid var(--border-default)' }}>
                    {hasDispatch ? (
                      <button
                        className="btn btn-secondary btn-sm"
                        style={{ height: '32px', padding: '0 10px', display: 'flex', alignItems: 'center', gap: '4px', flex: 1 }}
                        onClick={() => handleOpenChallanForOrder(order)}
                      >
                        <FileText size={13} />
                        <span>Dispatch Note</span>
                      </button>
                    ) : (
                      <button
                        className="btn btn-primary btn-sm"
                        style={{ height: '32px', padding: '0 10px', display: 'flex', alignItems: 'center', gap: '4px', flex: 1 }}
                        onClick={() => handleOpenDispatchForOrder(order.id)}
                      >
                        <Truck size={13} />
                        <span>Dispatch</span>
                      </button>
                    )}

                    <button
                      className="btn btn-secondary btn-sm"
                      style={{ height: '32px', padding: '0 10px' }}
                      onClick={() => onNavigate('invoices')}
                    >
                      <FileText size={13} />
                    </button>
                  </div>
                </div>
              );
            })}
            {filteredOrders.length === 0 && (
              <div className="card" style={{ padding: '36px 16px', textAlign: 'center', color: 'var(--text-muted)' }}>
                <ShoppingCart size={32} style={{ margin: '0 auto 8px', opacity: 0.4 }} />
                <div style={{ fontWeight: 700 }}>No orders found</div>
              </div>
            )}
          </div>
        </>
      )}

      {/* TAB 2: SHIPMENTS & DISPATCHES */}
      {activeTab === 'dispatches' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Desktop Dispatches Table */}
          <div className="table-container desktop-only">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Dispatch Ref</th>
                  <th>Order Ref</th>
                  <th>Consignee / Client</th>
                  <th>Transporter & AWB</th>
                  <th>E-Way Bill #</th>
                  <th>Dispatch Date</th>
                  <th>Est. Arrival</th>
                  <th>Packages / Weight</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredDispatches.map((disp) => (
                  <tr key={disp.id}>
                    <td>
                      <strong style={{ color: 'var(--primary-600)' }}>{disp.challanNumber || disp.id}</strong>
                    </td>
                    <td>
                      <span style={{ fontWeight: 600 }}>{disp.orderId}</span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{disp.companyName || disp.clientName}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        Attn: {disp.contactPerson || 'Store Lead'}
                      </div>
                    </td>
                    <td>
                      <div>
                        <strong style={{ fontSize: '0.82rem' }}>{disp.courierCarrier}</strong>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <span>AWB: {disp.trackingNumber}</span>
                          <button
                            onClick={() => handleCopy(disp.trackingNumber, `awb-${disp.id}`)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: 'var(--text-muted)' }}
                            title="Copy AWB"
                          >
                            <Copy size={11} />
                          </button>
                        </div>
                      </div>
                    </td>
                    <td style={{ fontSize: '0.78rem' }}>{disp.ewayBillNumber || '—'}</td>
                    <td style={{ fontSize: '0.78rem' }}>{formatDate(disp.dispatchDate)}</td>
                    <td style={{ fontSize: '0.78rem', color: 'var(--primary-600)', fontWeight: 600 }}>
                      {formatDate(disp.estimatedDelivery)}
                    </td>
                    <td style={{ fontSize: '0.78rem' }}>
                      {disp.packageCount} ({disp.packageWeight})
                    </td>
                    <td>
                      <select
                        className="form-select"
                        style={{ fontSize: '0.74rem', padding: '2px 6px', height: '26px', fontWeight: 600 }}
                        value={disp.dispatchStatus}
                        onChange={(e) => updateDispatchStatus(disp.id, e.target.value)}
                      >
                        <option value="Dispatched">Dispatched</option>
                        <option value="In Transit">In Transit</option>
                        <option value="Out for Delivery">Out for Delivery</option>
                        <option value="Delivered">Delivered</option>
                      </select>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px' }}>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => {
                            setSelectedChallanDispatch(disp);
                            setIsChallanModalOpen(true);
                          }}
                          title="View Delivery Challan Slip"
                          style={{ padding: '4px 8px', fontSize: '0.76rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                        >
                          <FileText size={13} /> View
                        </button>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => {
                            generateDeliveryChallanPDF(disp);
                            addToast('PDF Downloaded', `Challan ${disp.challanNumber} saved.`, 'success');
                          }}
                          title="Download Delivery Challan PDF"
                          style={{ padding: '4px 8px', fontSize: '0.76rem' }}
                        >
                          <Download size={13} />
                        </button>
                        <button
                          className="btn btn-ghost btn-sm"
                          onClick={() => handleDeleteDispatch(disp)}
                          title="Delete Dispatch"
                          style={{ padding: '4px 8px', fontSize: '0.76rem', color: 'var(--danger-text)' }}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredDispatches.length === 0 && (
                  <tr>
                    <td colSpan="10" style={{ textAlign: 'center', padding: '48px 16px', color: 'var(--text-muted)' }}>
                      <Truck size={36} style={{ margin: '0 auto 10px', opacity: 0.4 }} />
                      <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>No shipment dispatches found</div>
                      <p style={{ fontSize: '0.8rem', marginTop: '4px' }}>Try adjusting your search query, status, or carrier filter.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Dispatches Card Feed */}
          <div className="mobile-only" style={{ flexDirection: 'column', gap: '12px' }}>
            {filteredDispatches.map((disp) => (
              <div key={disp.id} className="card" style={{ padding: '14px 16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                  <div>
                    <strong style={{ color: 'var(--primary-600)', fontSize: '0.9rem' }}>{disp.challanNumber || disp.id}</strong>
                    <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-primary)' }}>{disp.companyName || disp.clientName}</div>
                  </div>
                  <span className="badge badge-info" style={{ fontSize: '0.7rem' }}>
                    Order: {disp.orderId}
                  </span>
                </div>

                <div style={{ background: 'var(--bg-subtle)', padding: '8px 10px', borderRadius: 'var(--radius-sm)', fontSize: '0.78rem', marginBottom: '10px' }}>
                  <div>🚚 <strong>{disp.courierCarrier}</strong> • AWB: {disp.trackingNumber}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.72rem', marginTop: '2px' }}>
                    Dispatched: {formatDate(disp.dispatchDate)} • Est. Arrival: {formatDate(disp.estimatedDelivery)}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', paddingTop: '8px', borderTop: '1px solid var(--border-default)' }}>
                  <select
                    className="form-select"
                    style={{ fontSize: '0.76rem', padding: '4px 8px', height: '32px', fontWeight: 700, flex: 1 }}
                    value={disp.dispatchStatus}
                    onChange={(e) => updateDispatchStatus(disp.id, e.target.value)}
                  >
                    <option value="Dispatched">Dispatched</option>
                    <option value="In Transit">In Transit</option>
                    <option value="Out for Delivery">Out for Delivery</option>
                    <option value="Delivered">Delivered</option>
                  </select>

                  <button
                    className="btn btn-secondary btn-sm"
                    style={{ height: '32px', padding: '0 10px', display: 'flex', alignItems: 'center', gap: '4px' }}
                    onClick={() => { setSelectedChallanDispatch(disp); setIsChallanModalOpen(true); }}
                  >
                    <FileText size={13} />
                    <span>View Note</span>
                  </button>
                </div>
              </div>
            ))}
            {filteredDispatches.length === 0 && (
              <div className="card" style={{ padding: '36px 16px', textAlign: 'center', color: 'var(--text-muted)' }}>
                <Truck size={32} style={{ margin: '0 auto 8px', opacity: 0.4 }} />
                <div style={{ fontWeight: 700 }}>No dispatches found</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Dispatch Order Modal */}
      <DispatchOrderModal
        isOpen={isDispatchModalOpen}
        onClose={() => setIsDispatchModalOpen(false)}
        initialOrderId={selectedOrderForDispatch}
        onDispatchSuccess={handleDispatchSuccess}
      />

      {/* Delivery Challan Viewer & Print Modal */}
      <DeliveryChallanModal
        isOpen={isChallanModalOpen}
        onClose={() => setIsChallanModalOpen(false)}
        dispatch={selectedChallanDispatch}
      />
    </div>
  );
};
